# Docker

Vite+ 提供了一个官方 Docker 镜像，并预装了 `vp` CLI：

```bash
ghcr.io/voidzero-dev/vite-plus
```

将其用于构建、CI 和 devcontainers。它不适合作为生产环境运行时镜像。

`vp` 会从你的项目（`.node-version`、`devEngines.runtime` 或 `engines.node`）解析 Node.js 版本，并在安装／构建期间下载该确切版本。这意味着该镜像不需要特定于 Node.js 版本的标签。

在生产环境中，请使用多阶段构建：使用 Vite+ 镜像构建应用，然后只将解析后的 Node.js 二进制文件、构建输出和生产依赖复制到更小的运行时镜像中。

## 镜像标签

标签跟踪 `vp` 版本：

| 标签                                                     | 含义         |
| -------------------------------------------------------- | ------------ |
| `ghcr.io/voidzero-dev/vite-plus:latest`                  | 最新发布版    |
| `ghcr.io/voidzero-dev/vite-plus:<major>`                 | 最新主版本    |
| `ghcr.io/voidzero-dev/vite-plus:<major>.<minor>`         | 最新次版本    |
| `ghcr.io/voidzero-dev/vite-plus:<major>.<minor>.<patch>` | 精确版本      |

示例使用 `:latest` 跟踪最新发布版；如果需要可复现构建，请固定精确标签或摘要。该镜像发布了 `linux/amd64` 和 `linux/arm64` 版本，并默认以非 root 用户 `vp` 运行。该用户拥有无需密码的 `sudo` 权限，因此需要 root 权限的构建／CI 步骤（额外的 apt 软件包、`playwright install --with-deps`）无需更改镜像用户即可运行。

在 [GitHub 包页面](https://github.com/voidzero-dev/vite-plus/pkgs/container/vite-plus) 浏览所有已发布的版本和摘要。

## 生产环境：SSR / Node.js 服务端应用

对于在生产环境中运行 Node.js 的应用（SvelteKit、Nuxt、自定义 Vite SSR 服务器等），请使用工具链镜像进行构建，并将解析后的 Node.js 和构建好的应用复制到精简的运行时阶段：

```dockerfile [Dockerfile]
# syntax=docker/dockerfile:1

# --- build stage: the official Vite+ toolchain image ---
FROM ghcr.io/voidzero-dev/vite-plus:latest AS build
WORKDIR /app

# 先安装依赖，这样当源代码变更时，这一层可以被缓存。
COPY --chown=vp:vp package.json pnpm-lock.yaml pnpm-workspace.yaml .node-version* ./
RUN vp install --frozen-lockfile

# 构建。vp 会读取 .node-version，并自动提供那个确切版本的 Node.js。
COPY --chown=vp:vp . .
RUN vp build

# 为运行时阶段导出确切解析后的 Node.js 二进制文件。
RUN cp "$(vp env which node | head -1)" /tmp/node

# --- deps stage: production-only dependencies ---
# 单独进行一次全新的 `--prod` 安装，这样 devDependencies（包括 vite-plus
# 工具链）就会被排除。若在上面的完整安装后同一阶段再运行 `--prod`，
# 已经安装好的 devDependencies 不会被清理掉。
FROM ghcr.io/voidzero-dev/vite-plus:latest AS deps
WORKDIR /app
COPY --chown=vp:vp package.json pnpm-lock.yaml pnpm-workspace.yaml .node-version* ./
RUN vp install --frozen-lockfile --prod

# --- runtime stage: small, glibc, no vp ---
FROM debian:bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# 来自 .node-version 的确切 Node.js（官方、经过签名验证的构建）。
COPY --from=build /tmp/node /usr/local/bin/node

COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

USER nobody
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

部署后的镜像只包含 Node.js、你的应用和生产依赖，并且与 `.node-version` 完全匹配。它比默认的 `node:*` 镜像小得多；如需最小化结果，请参阅下面的 distroless 提示。

::: warning 在单独的阶段中裁剪生产依赖
如上所示，在单独的 `deps` 阶段中安装生产依赖。在同一阶段中完成完整的 `vp install` 后再运行 `vp install --prod`，不会移除已经安装的 devDependencies，因此 `vite-plus` 工具链会被复制到运行时镜像中。如果你的服务器 bundle 完全自包含（没有未打包的运行时依赖），则可以完全跳过复制 `node_modules`
:::

::: tip 进一步缩小体积
对于无 shell、CVE 最少的运行时环境，请将运行时基础镜像替换为 distroless（`gcr.io/distroless/cc`），并保留一个向量形式的 `ENTRYPOINT`。它基于 glibc，因此复制的 Node.js 二进制文件仍然兼容
:::

## 生产环境：静态 SPA / SSG

静态网站在运行时不需要 Node.js；使用任意静态服务器提供构建输出：

```dockerfile [Dockerfile]
FROM ghcr.io/voidzero-dev/vite-plus:latest AS build
WORKDIR /app
COPY --chown=vp:vp package.json pnpm-lock.yaml pnpm-workspace.yaml .node-version* ./
RUN vp install --frozen-lockfile
COPY --chown=vp:vp . .
RUN vp build

FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
```

## 持续集成

在基于容器的 CI（GitLab CI、Buildkite、CircleCI、Jenkins 等）中直接使用该镜像：

```yaml [.gitlab-ci.yml]
build:
  image: ghcr.io/voidzero-dev/vite-plus:latest
  script:
    - vp install --frozen-lockfile
    - vp check
    - vp test
    - vp build
```

在 GitHub Actions 中，建议使用 [`setup-vp`](./ci) 而不是该镜像。

## 浏览器模式测试（Vitest / Playwright）

以非 root 用户 `vp` 运行正适合浏览器：Chromium 会保留其沙箱（以 root 用户运行浏览器会禁用沙箱）。在任务中安装浏览器及其系统库。`playwright install --with-deps` 需要 root 权限才能通过 `apt-get install` 安装这些库。`vp` 用户拥有无需密码的 `sudo` 权限，因此 Playwright 可以使用它来安装这些库，而无需更改镜像用户：

```yaml [.gitlab-ci.yml]
test:
  image: ghcr.io/voidzero-dev/vite-plus:latest
  script:
    - vp install --frozen-lockfile
    - vp exec playwright install --with-deps chromium
    - vp test
```

`vp exec` 运行项目自己的 Playwright（来自你的 lockfile），因此它会安装测试所需的浏览器版本。优先使用它，而不是 `vpx playwright install`，后者会下载最新版本的 Playwright，并可能获取不同的浏览器版本。

如果要将浏览器及其库预先构建到派生镜像中，而不是每次运行时都安装，请先安装项目依赖，使预先构建的浏览器与 lockfile 匹配，然后使用项目的 Playwright 进行安装（通过 `sudo` 可获得 root 权限）：

```dockerfile [Dockerfile]
FROM ghcr.io/voidzero-dev/vite-plus:latest
WORKDIR /app
COPY --chown=vp:vp package.json pnpm-lock.yaml pnpm-workspace.yaml .node-version* ./
RUN vp install --frozen-lockfile
RUN vp exec playwright install --with-deps chromium
```

如果 Chromium 在 CI 负载下崩溃，请通过 `--ipc=host` 为容器提供更多共享内存；请参阅 [Playwright Docker 文档](https://playwright.dev/docs/docker)。

## Devcontainers

将该镜像作为开箱即用的开发容器，其中已预装工具链：

```jsonc [.devcontainer/devcontainer.json]
{
  "image": "ghcr.io/voidzero-dev/vite-plus:latest",
}
```

## 临时使用

在不将 vp 安装到本机的情况下，对项目运行任意 `vp` 命令：

```bash
docker run --rm -it -v "$PWD:/app" -w /app ghcr.io/voidzero-dev/vite-plus vp build
```

## 备注

- **Node.js 版本**：在构建时从 `.node-version`、`engines.node` 或 `devEngines.runtime` 提供，因此不存在特定于 Node.js 的镜像标签。依赖项的 `COPY` 使用 `.node-version*` glob，因此该文件是可选的：通过 `engines.node`／`devEngines.runtime` 固定版本的项目无需 `.node-version`，而使用该文件的项目会在每个阶段都提供该文件。
- **非 root 用户**：该镜像以非 root 用户 `vp` 运行，因此应如示例所示使用 `COPY --chown=vp:vp ...` 复制源文件。否则，`COPY` 会写入 root 所有的文件，`vp install` 无法更新这些文件（权限被拒绝）。`vp` 用户拥有无需密码的 `sudo` 权限，可执行偶尔需要的 root 步骤（安装额外的 apt 软件包或运行 `playwright install --with-deps`），因此你很少需要切换镜像用户。生产运行时阶段使用独立的、不含 vp 的基础镜像，因此这一便利不会进入已部署的镜像。
- **原生插件**：该镜像包含 C／C++ 构建工具链（`build-essential`、`python3`），因此 `better-sqlite3` 等原生依赖会在 `vp install` 期间编译。
- **glibc**：该镜像基于 glibc，因此使用官方、经过签名验证的 Node.js 构建版本。
- **自定义基础镜像**：如果要将 `vp` 添加到你自己的基础镜像中，请运行安装程序：`curl -fsSL https://vite.plus | bash`（设置 `VP_VERSION` 以固定版本）。
