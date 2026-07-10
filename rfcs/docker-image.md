# RFC：官方 Vite+ Docker 镜像

- 问题：[#1490](https://github.com/voidzero-dev/vite-plus/issues/1490)
- 计划：[#1324](https://github.com/voidzero-dev/vite-plus/issues/1324)（“通过 Homebrew、Windows 安装程序、Docker 镜像、apt 等分发 `vp`。”）

## 摘要

将一个官方的 Vite+ Docker 镜像发布到 GHCR，其中包含 `vp` 全局 CLI，
用于 **构建、CI 和开发** 阶段。该镜像是一个工具链镜像，
不是生产运行时镜像。由于 `vp` 已经会读取 `.node-version` /
`engines.node` / `devEngines.runtime` 并下载那个精确的 Node.js 版本，
因此该镜像不需要按 Node.js 版本划分标签：一个镜像即可针对其固定的 Node.js 构建任何项目。

对于生产环境，本 RFC 不提供运行时镜像。相反，它记录了一种多阶段模式：其中 `vp` 构建器解析并下载精确的官方（glibc、经过签名验证的）Node.js，而一个精简的最终阶段只将那个 Node.js 二进制文件以及构建产物和生产依赖复制到一个小型的 glibc 基础镜像中（不包含 `vp`）。这样既保持了部署镜像的小体积，又遵循了项目固定的 Node.js 版本，这正是 [#1490](https://github.com/voidzero-dev/vite-plus/issues/1490) 所要求的。

## 动机

### 问题（#1490）

在容器化 Vite+ 项目时，用户需要 Node.js 版本与项目的 `.node-version` 完全一致。报告者的项目固定为 `24.15.0`：

```text
Environment:
  Package manager  pnpm v10.33.2
  Node.js          v24.15.0 (.node-version)
```

他们目前有两种选择，但都存在缺点：

- `node:24-alpine` 匹配主版本号，而且体积相当小，但它基于 musl，在他们的场景下镜像大小大约会翻倍，而且这个标签并不能固定到精确的补丁版本。
- `alpine:3.23` + `apk add nodejs` 体积要小得多，但 Alpine 目前提供的是 `24.14.1`，与固定的 `24.15.0` 不匹配。

目前没有 Vite+ 的 Docker 镜像，也没有文档化的 Docker 模式能够让容器中的 Node.js 与 `.node-version` 保持一致。这个 RFC 同时提供了这两者。

### 为什么 Vite+ 处于有利位置

每个可比工具都会把 Node.js 版本交给基础 `node:*` 镜像标签来决定，并且只管理 _包管理器_（通过 Corepack）。Vite+ 已经在管理 Node.js 运行时本身：它读取项目配置并下载精确的 Node.js，同时验证官方 `SHASUMS256.txt.asc` 的 PGP 签名（参见
[`js-runtime.md`](./js-runtime.md) 和
[`verify-node-shasums-signature.md`](./verify-node-shasums-signature.md)）。Docker 方案可以直接建立在这套机制之上，而不必重新发明基于镜像标签的版本固定。

## 先前工作

基于当前官方文档进行调研（2026-06-25）。以下是各类类似工具如何处理 Node.js 版本 + Docker 的总结：

| 工具              | 官方镜像                        | Node.js 版本如何设置                           | 默认基础镜像                | musl/Alpine 立场                           |
| ----------------- | ------------------------------- | ---------------------------------------------- | --------------------------- | ------------------------------------------ |
| Volta             | 无（仅社区提供）                 | `package.json` 中的 `volta` 字段，自动拉取       | 仅 glibc                   | 不支持（依赖 libc）                        |
| mise              | 存在，但“不建议使用”            | 从 `.tool-versions`/`mise.toml` 通过 `mise install` | debian-slim                 | 不推荐；需要 `MISE_LIBC=musl`              |
| proto / moon      | 无（仅 moon 文档）              | 叠加在 `node:*` 基础镜像之上                    | `node:latest`               | 需要 `MOON_TOOLCHAIN_FORCE_GLOBALS=true`   |
| asdf              | 无（仅社区提供）                 | 从 `.tool-versions` 通过 `asdf install`         | 社区提供                     | 取决于插件；默认是 glibc 版 Node.js         |
| pnpm              | 有（`ghcr.io/pnpm/pnpm`，不含 Node.js） | 基础 `node:*` 标签 + Corepack                 | debian-slim                 | 未涉及                                      |
| Yarn              | 无                              | 基础 `node:*` 标签 + Corepack（`packageManager`） | `node:*`                    | 不适用                                     |
| Turborepo         | 无                              | 基础 `node:*` 标签；`turbo prune --docker`      | `node:*-alpine`             | 添加 `libc6-compat`                       |
| Nx                | 无                              | 基础 `node:*` 标签；`prune-lockfile`            | `node:lts-alpine`           | 未涉及                                      |
| Bun               | 有（`oven/bun`）                | 自带运行时                                      | debian；也提供 distroless    | 未讨论                                      |
| Deno              | 有（Hub + GHCR）                | 自带运行时；提供一个 `:bin` 镜像用于拷贝        | debian；也提供 distroless    | 默认非 root                                |
| Node.js 官方       | 有                              | tag 即版本                                      | debian（`-slim`、`-alpine`） | 提醒 musl 会破坏 glibc 应用                  |
| distroless nodejs | 有（`gcr.io/distroless/nodejsNN`） | 拷贝构建产物进去                                | debian/glibc，约 45MB        | 仅支持 glibc                               |

推动本 RFC 的关键结论：

1. **没有其他方案能从配置文件中以可用且已发布的镜像方式管理 Node.js。**  
   版本管理器（Volta、mise、proto、asdf）要么没有官方镜像，要么官方镜像被标记为不可用，而且它们都会撞上 musl 这堵墙，因为受管理的 Node.js 意味着使用官方 glibc 构建。包管理器和单体仓库工具则只是通过基础 `node:*` 标签来固定 Node.js。Vite+ 将这两个维度（Node.js + 工具链）合并到一个确定性的、由项目驱动的构建步骤中，这是真正的差异化能力。

2. **最接近的类比（mise）和运行时（Deno）验证了所选模式。** mise 的文档最佳实践是把体积小的静态二进制复制到精简的 glibc 基础镜像中，并在构建时安装固定版本的工具，而不是发布一个臃肿的一体化镜像。Deno 之所以提供 `:bin` 镜像，正是为了让用户可以 `COPY --from=denoland/deno:bin /deno ...` 到任意基础镜像中，而它的 distroless 变体也只是把二进制复制到 `gcr.io/distroless/cc` 上。这与下面多阶段“把解析后的 Node.js 复制进来”的模式完全一致。

3. **glibc 是公认的默认选择。** 每个管理 Node.js 的工具都会警告 musl，或者在 musl 上出问题。默认使用 glibc 可以保留官方、带签名校验的 Node.js（非官方的 musl 构建没有发布 PGP 签名），并避免原生插件带来的意外。

4. **单体仓库裁剪是普通包管理器缺少的唯一能力。**  
   Turborepo 的 `turbo prune --docker` 和 Nx 的 `prune-lockfile` 之所以存在，是因为共享锁文件会导致一个包的变更触发每个容器重建。Vite+ 掌握工作区图，因此未来的 `vp prune --docker` 是一个很自然的后续能力（见未来工作）。

来源：pnpm <https://pnpm.io/docker>; Turborepo <https://turborepo.dev/docs/guides/tools/docker>;
Nx <https://nx.dev/docs/technologies/build-tools/docker/introduction>; mise
<https://mise.jdx.dev/mise-cookbook/docker.html>; moon <https://moonrepo.dev/docs/guides/docker>;
Volta <https://github.com/volta-cli/volta/issues/1162>; Bun <https://bun.com/docs/guides/ecosystem/docker>;
Deno <https://github.com/denoland/deno_docker>; Node.js <https://hub.docker.com/_/node/>;
distroless <https://github.com/GoogleContainerTools/distroless/blob/main/nodejs/README.md>.

## 用户场景

官方镜像是一个工具链镜像。它所服务的场景，按优先级顺序如下：

1. **应用部署的构建阶段（首要）**。在多阶段 Dockerfile 中作为 `FROM ... AS build` 使用。`vp install` + `vp build` 生成应用；来自 `.node-version` 的精确 Node.js 版本会被复制到一个精简的最终阶段中。这是 #1490 的锚点。
2. **容器原生 CI（首要）**。GitLab CI、Buildkite、CircleCI、Jenkins agents、Tekton 等设置 `image: ghcr.io/voidzero-dev/vite-plus:<tag>` 并运行 `vp install`、`vp check`、`vp test`、`vp build`。（GitHub Actions 用户已经由 `setup-vp` 服务，因此这里面向的是其余生态系统。）
3. **可复现的开发环境（次要）**。Devcontainers、Codespaces 和入职流程：单个镜像固定 Node.js + 包管理器 + vp，使工具链与仓库完全一致，无需宿主机配置。
4. **临时使用 / 评估（次要）**。`docker run --rm -v $PWD:/app -w /app
ghcr.io/voidzero-dev/vite-plus vp <cmd>` 用于试用 vp，或在干净的工具链上复现 bug 报告。
5. **平台 / monorepo 构建器（次要）**。内部 PaaS 和类似 buildpack 的系统，统一使用一个标准的 vp 构建器；monorepo 单应用构建（这促使了未来的 `vp prune --docker`）。

它明确**不是**生产运行时镜像。将完整工具链（vite、rolldown、vitest、oxlint、...）带入已部署容器会造成 #1490 所抱怨的臃肿。生产镜像通过文档化的多阶段模式从构建器生成。

## 目标

1. 在 GHCR 上发布一个受维护的、多架构（`linux/amd64`、`linux/arm64`）的 Vite+
   工具链镜像。
2. 在构建时通过 vp 现有的托管运行时自动遵守 `.node-version`，不使用任何与 Node.js 版本相关的镜像标签。
3. 记录一种推荐的多阶段模式，生成一个小型生产镜像，其中包含精确固定的 Node.js 版本且不包含 vp。
4. 端到端保持官方、经签名验证的 glibc Node.js（构建器下载它，运行时复制它）。
5. 为次要场景（CI、devcontainer、静态 SPA、临时使用）提供模式。

## 非目标

1. 生产运行时镜像（改为记录模式，请参见 Future Work 了解一种可能的轻量运行时基础镜像）。
2. 按 Node.js 版本键控的镜像标签（本设计要避免的标签泛滥）。
3. Alpine/musl 镜像变体。glibc 是默认选项（官方、签名验证过的 Node.js，无原生插件破坏），而 Alpine 被推迟处理（参见 Future Work），而不是在第一个版本中发布。
4. `vp prune --docker` 单仓库裁剪（Future Work）。
5. Docker Hub 发布（目前仅限 GHCR）。

## 设计

### 镜像角色与版本对齐机制

该镜像捆绑 `vp`，并在构建时提供 Node.js：

1. 在构建阶段，`vp install` / `vp build` 会让 vp 读取 `.node-version`
   （或 `engines.node` / `devEngines.runtime`），下载该精确版本的官方 Node.js，
   验证其 PGP 签名，并将其缓存到
   `$VP_HOME/js_runtime/node/<version>/`。
2. 文档中的多阶段构建模式会将解析出的 Node.js 二进制文件、构建后的应用
   以及生产依赖一起复制到一个精简的 glibc 最终阶段中，该阶段不包含 vp。

这使得同一个镜像可适用于每个项目所固定的 Node.js 版本，
消除了其他工具在 Docker 中遇到的 Corepack 类问题，并保持部署镜像更小。

### 基础镜像、内容与变体

- **基础镜像：** `debian:bookworm-slim`（glibc）。需要 Glibc，这样 vp 才能下载
  官方、经签名验证的 Node.js，并确保原生扩展正常工作；debian-slim 是公认的小型
  glibc 基础镜像（pnpm 的选择），并提供构建/CI/开发场景所需的 shell、`apt`
  和 `git`。
- **预装：** `vp`（在 `PATH` 中）、`ca-certificates`、`curl`、`git`，以及用于原生扩展
  编译的构建工具链（`build-essential`、`python3`、`pkg-config`，例如
  `better-sqlite3`）。包管理器由 vp 托管的 corepack/runtime 处理，因此它们会按项目
  提供，而不是固化为某个固定版本。
- **不内置默认 Node.js：** 安装器会预先提供一个默认 Node.js（约 190 MB）；镜像将其
  删除（`rm -rf $VP_HOME/js_runtime`），因为每个项目都会在构建时提供自己固定版本的
  Node.js，所以在构建器中默认版本只是累赘。`node`/`npm`/`npx` shim 会保留，并在首次
  使用时获取正确版本。这样可使工具链镜像小约 190 MB，节省超过切换到 Alpine/musl
  所能省下的空间（且无需承担 musl 的折衷）。
- **用户：** 创建一个非 root 的 `vp` 用户（类似 Bun 的 `USER bun` 和 Deno 的 `USER deno`）；
  对于需要 `apt` 的步骤，文档说明切换到 root。由于镜像以非 root 运行，文档中的多阶段
  示例会使用 `COPY --chown=vp:vp ...` 复制源代码；如果不这样做，`COPY` 会写入 root 所有的
  文件，而 `vp install` 无法更新这些文件（权限拒绝）。已针对公开的预览镜像完成端到端验证。
- **未来可能的变体：** 一个 Alpine/musl 工具链镜像（已延期，见 Future Work）以及一个
  不含原生构建工具链、适用于无原生依赖项目的 `-slim` 镜像。

### `vp` 如何进入镜像

镜像使用官方安装脚本安装 `vp`，并固定到发行版本：

```dockerfile
RUN curl -fsSL https://vite.plus | VP_VERSION="${VP_VERSION}" bash
```

发布任务在 npm 发布之后运行，因此该固定版本已经在注册表中。这里复用了安装脚本经过充分验证的平台检测能力（包括在 buildx 下对 gnu/musl 和 amd64/arm64 的正确选择），因此同一个 Dockerfile 可以生成所有架构，而无需按架构复制制品。镜像版本通过 `VP_VERSION` 构建参数与 `vp` 发行版一一映射，而同样的单行命令也是向自定义基础镜像添加 `vp` 的文档化方式。

完全密封的构建方式也可以作为后续加固方案：从发行制品中复制按架构划分的 `vp` 二进制文件（镜像构建时不访问网络）；但 v1 不需要这样做。

### 标签

标签跟踪的是 `vp` 版本，而不是 Node.js：

- `ghcr.io/voidzero-dev/vite-plus:latest`
- `ghcr.io/voidzero-dev/vite-plus:<major>`（例如 `:1`）
- `ghcr.io/voidzero-dev/vite-plus:<major>.<minor>`（例如 `:1.4`）
- `ghcr.io/voidzero-dev/vite-plus:<major>.<minor>.<patch>`（例如 `:1.4.2`）

用户可按精确标签或 digest 固定版本，以保证可复现性。不提供 `node-<version>` 标签。

### 安全性与可复现性

- 全程使用官方、经签名验证的 glibc Node.js（不使用非官方的 musl 构建）。
- 默认非 root 用户。
- 多架构 manifest（`linux/amd64`、`linux/arm64`）；vp 已提供
  `{x86_64,aarch64}-unknown-linux-gnu` 二进制文件。
- 可通过 digest 固定。

### 在运行时阶段定位解析后的 Node.js

不需要新增 CLI 接口：`vp env which node` 会将解析后的 Node.js
二进制路径打印为第一行（无颜色、适合管道使用），运行时位于
`$VP_HOME/js_runtime/node/<version>/bin/node`。运行时阶段会直接复制该文件。

### 发布流水线

在发布流程（`release.yml` / `reusable-release-build.yml`）中添加一个镜像构建/发布任务，
从发布二进制构建多架构镜像，并在发布成功后推送到 GHCR，标签使用上面列出的设置。
（具体如何接线属于 PR 的实现细节。）

### 发布前验证（预览镜像）

为在正式发布前验证镜像，预览发布工作流
（`publish-preview.yml`，由 `preview-build` 标签触发）也会构建
多架构镜像，但来源是该 PR 的 registry bridge build（`VP_PR_VERSION`），
并将其推送为 `ghcr.io/voidzero-dev/vite-plus:pr-<number>`
（绝不使用 `latest`）。这复用了与发布完全相同的 `docker/Dockerfile`，
因此给 PR 打上 `preview-build` 标签后，会生成一个可拉取的预览镜像，
并走真实的构建路径。

### 文档示例验证

下面文档中（以及 `docs/guide/docker.md` 中）记录的 Dockerfile 模式，会通过一个复现仓库来确保
内容准确无误；该仓库的 GitHub Actions 会对每个示例进行端到端构建和冒烟测试（构建镜像、
运行容器、断言 `HTTP 200`，并断言 SSR 运行时 Node.js 与固定的 `.node-version` 一致）：

- <https://github.com/why-reproductions-are-required/vite-plus-docker-example>

## 推荐的 Dockerfile 模式（面向用户的文档）

### 1. SSR / Node.js 服务器应用，精简运行时（#1490 场景）

```dockerfile
# syntax=docker/dockerfile:1

# --- 构建阶段：官方 Vite+ 工具链镜像 ---
FROM ghcr.io/voidzero-dev/vite-plus:1 AS build
WORKDIR /app

# 先放置依赖层以便缓存复用。需要 --chown：镜像以非 root 的 vp 用户运行，
# 否则 COPY 会写入 root 所有的文件，而 vp install 无法更新它们。
COPY --chown=vp:vp package.json pnpm-lock.yaml .node-version* ./
RUN vp install --frozen-lockfile

# 构建。vp 会读取 .node-version，并自动提供该精确版本的 Node.js。
COPY --chown=vp:vp . .
RUN vp build

# 为运行时阶段导出精确解析后的 Node.js 二进制文件。
RUN cp "$(vp env which node | head -1)" /tmp/node

# --- deps 阶段：仅生产依赖（全新 --prod，因此 devDeps 被排除；
# 在上面的完整安装基础上再运行 --prod 不会清除它们） ---
FROM ghcr.io/voidzero-dev/vite-plus:1 AS deps
WORKDIR /app
COPY --chown=vp:vp package.json pnpm-lock.yaml .node-version* ./
RUN vp install --frozen-lockfile --prod

# --- runtime 阶段：小体积，glibc，无 vp ---
FROM debian:bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# 来自 .node-version 的精确 Node.js（官方、经过签名验证的 glibc 构建）。
COPY --from=build /tmp/node /usr/local/bin/node

COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

USER nobody
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

部署后的镜像只包含 Node.js + 应用 + 生产依赖，且与
`.node-version` 完全一致，比默认的 `node:*` 镜像小得多。
生产依赖必须在单独的 `deps` 阶段中安装：如果在构建阶段的完整安装基础上
运行 `vp install --prod`，并不会裁剪掉已经安装的 devDependencies
（体积很大的 `vite-plus` 工具链），因此它们仍会被复制到运行时镜像中。
使用 distroless 最终基础镜像（`gcr.io/distroless/cc`）是面向不需要
运行时 shell 的用户的一项已文档化的体积/安全升级（见 Future Work）。

### 2. 静态 SPA / SSG

```dockerfile
FROM ghcr.io/voidzero-dev/vite-plus:1 AS build
WORKDIR /app
COPY --chown=vp:vp package.json pnpm-lock.yaml .node-version* ./
RUN vp install --frozen-lockfile
COPY --chown=vp:vp . .
RUN vp build

FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
```

运行时不需要 Node.js；vp 镜像只是构建器。

### 3. 容器原生 CI

```yaml
# 例如 GitLab CI
build:
  image: ghcr.io/voidzero-dev/vite-plus:1
  script:
    - vp install --frozen-lockfile
    - vp check
    - vp test
    - vp build
```

### 4. Devcontainer

```jsonc
// .devcontainer/devcontainer.json
{
  "image": "ghcr.io/voidzero-dev/vite-plus:1",
}
```

### 5. 临时使用 / 评估

```bash
docker run --rm -it -v "$PWD:/app" -w /app ghcr.io/voidzero-dev/vite-plus vp build
```

## 未决问题

1. **镜像中的默认应用 Node.js。** 工具链镜像不预置任何特定应用的
   Node.js（vp 在构建时下载锁定版本，需要联网）。我们是否应该
   提供一个预烘焙了 LTS 版 Node.js 的变体，以便更快/离线构建，还是依赖
   缓存和 `VP_NODE_DIST_MIRROR`？（倾向：默认不预烘焙 Node.js；如果
   之后有需求，再考虑预烘焙或离线变体。）
2. **默认包含原生构建工具链。** 是否在默认镜像中包含 `build-essential`/`python3`
   （体积更大，但原生扩展可直接工作），还是保持默认精简，并在
   `-full` 变体中添加它们？（倾向：默认包含，因为这是一个构建镜像；之后再提供 `-slim`。）
3. **`vp install --prod` 语义用于运行时拷贝。** 确认 vp 对于仅生产环境安装所暴露的确切标志
   集，以及在文档示例模式中，专用的 deps 阶段是否能改进层缓存。
4. **镜像命名。** `ghcr.io/voidzero-dev/vite-plus` 还是使用 `-toolchain` 后缀，以
   便为以后其他镜像留出空间。

## 未来工作

1. **用于 monorepo 的 `vp prune <target> --docker`**：输出一个目标作用域的子集
   （`package.json` 文件、裁剪后的锁文件、源码），这样依赖安装层
   就可以在无关的 workspace 修改之间复用缓存，效果与 Turborepo 的 `turbo prune`
   和 Nx 的 `prune-lockfile` 相同。这是普通包管理器无法提供的唯一能力，也是
   monorepo Docker 指南引用这些工具的主要原因。大概会有它自己的 RFC。
2. **Distroless 运行时指南/变体。** 记录（或提供）一个
   `gcr.io/distroless/cc` 最终阶段和 `tini` 作为 PID 1 的模式，以获得更小、
   更少 shell、CVE 风险更低的运行时。
3. **精简运行时基础镜像。** 只有在已记录的“复制 Node.js 进去”
   模式被证明不足时才重新考虑；这会重新引入 Node.js 版本耦合，因此
   目前不计划。
4. **Alpine/musl 变体。** 已延期，不属于第一版；只有在真实需求出现后再
   添加。它将服务于强制使用 Alpine 的团队，并提供最小的运行时
   （测得 Alpine SSR 运行时约 136 MB），但由于 musl 的权衡，这也是
   现在不发布它的原因：

   - 在 musl 上，vp 会从 `unofficial-builds.nodejs.org` 下载 Node.js，
     该站点不提供 PGP 签名（见 `crates/vite_js_runtime/src/providers/node.rs`），
     因此 Alpine 变体无法获得 Debian 镜像所具备的“官方、已签名验证的 Node.js”
     保证。
   - musl 是经典的原生 addon 关键风险点（预编译 addon 通常面向 glibc；在
     musl 上它们需要 musl 预构建包或源码编译，再加上 `gcompat`/`libc6-compat`），
     这是 Vite+ 项目经常遇到的问题（better-sqlite3、sharp）。更广泛的业界也
     因相同原因将 musl 视为风险点（Volta 不支持 musl，mise 需要
     `MISE_LIBC=musl`，moon 需要 `MOON_TOOLCHAIN_FORCE_GLOBALS=true`，
     Turborepo 需要 `apk add libc6-compat`）。
   - musl 版 Node.js 二进制只能运行在 musl 基础镜像上，因此 Alpine 构建器
     需要一个 Alpine 运行时阶段（而不是 debian-slim/distroless）。

   如果要添加，应作为可选的 `-alpine` 变体发布，并附带醒目的注意事项，
   以及文档化的 libc 自动检测/覆盖。

5. **Docker Hub 发布**，用于提升可发现性，作为 GHCR 的补充。
6. **离线 / airgapped 构建**：预烘焙 Node.js 变体以及 `VP_NODE_DIST_MIRROR`
   指南。

## 参考资料

- 问题：[#1490](https://github.com/voidzero-dev/vite-plus/issues/1490)
- Q2 计划：[#1324](https://github.com/voidzero-dev/vite-plus/issues/1324)
- JS 运行时管理：[`js-runtime.md`](./js-runtime.md)
- Node.js 签名验证：[`verify-node-shasums-signature.md`](./verify-node-shasums-signature.md)
- CI 指南：`docs/guide/ci.md`
- 分发先例：pnpm <https://pnpm.io/docker>, Deno <https://github.com/denoland/deno_docker>,
  mise <https://mise.jdx.dev/mise-cookbook/docker.html>, Turborepo
  <https://turborepo.dev/docs/guides/tools/docker>, distroless
  <https://github.com/GoogleContainerTools/distroless/blob/main/nodejs/README.md>.
