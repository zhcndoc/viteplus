# Docker

Vite+ 提供了一个官方 Docker 镜像，并预装了 `vp` CLI：

```bash
ghcr.io/voidzero-dev/vite-plus
```

可用于构建、CI 和 devcontainer。它不适合作为生产运行时镜像。

`vp` 会从你的项目中解析 Node.js 版本（`.node-version`、
`devEngines.runtime` 或 `engines.node`），并在安装/构建期间下载该确切版本。
这意味着该镜像不需要特定于 Node 版本的标签。

对于生产环境，请使用多阶段构建：用 Vite+ 镜像构建应用，然后仅将解析出的
Node.js 二进制文件、构建产物和生产依赖复制到更小的运行时镜像中。

## 镜像标签

标签跟踪 `vp` 版本：

| 标签                                                     | 含义         |
| -------------------------------------------------------- | ------------ |
| `ghcr.io/voidzero-dev/vite-plus:latest`                  | 最新发布版    |
| `ghcr.io/voidzero-dev/vite-plus:<major>`                 | 最新主版本    |
| `ghcr.io/voidzero-dev/vite-plus:<major>.<minor>`         | 最新次版本    |
| `ghcr.io/voidzero-dev/vite-plus:<major>.<minor>.<patch>` | 精确版本      |

示例使用 `:latest` 来跟踪最新发布；如果你需要可复现的构建，请固定为某个精确标签或
摘要。该镜像为 `linux/amd64`
和 `linux/arm64` 发布，默认以非 root 用户运行。

在 [GitHub 包页面](https://github.com/voidzero-dev/vite-plus/pkgs/container/vite-plus) 浏览所有已发布的版本和摘要。

## 生产环境：SSR / Node.js 服务端应用

对于在生产环境中运行 Node.js 的应用（SvelteKit、Nuxt、自定义的 Vite SSR
服务器等），请使用工具链镜像进行构建，并将解析后的 Node.js
以及构建产物复制到一个精简的运行时阶段中：

```dockerfile [Dockerfile]
# syntax=docker/dockerfile:1

# --- build stage: the official Vite+ toolchain image ---
FROM ghcr.io/voidzero-dev/vite-plus:latest AS build
WORKDIR /app

# 先安装依赖，这样当源码变更时，这一层可以被缓存。
COPY --chown=vp:vp package.json pnpm-lock.yaml .node-version* ./
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
COPY --chown=vp:vp package.json pnpm-lock.yaml .node-version* ./
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

部署后的镜像只包含 Node.js、你的应用以及生产依赖，并且会严格匹配 `.node-version`。
它比默认的 `node:*` 镜像小得多；关于最小体积的结果，请参见下面的 distroless 提示。

::: warning 在单独的阶段中裁剪生产依赖
如上所示，请在独立的 `deps` 阶段中安装生产依赖。在同一阶段中先执行完整的 `vp install`，
再执行 `vp install --prod`，不会移除已经安装的 devDependencies，因此 `vite-plus`
工具链也会被复制到运行时镜像中。如果你的服务端打包是完全自包含的（没有未打包的运行时依赖），
则可以完全跳过复制 `node_modules`。
:::

::: tip 更小一些
如果想要一个不带 shell、CVE 更少的最小运行时，可将运行时基础镜像替换为 distroless
（`gcr.io/distroless/cc`），并保持 `ENTRYPOINT` 使用向量形式。它基于 glibc，
因此复制过去的 Node.js 二进制文件仍然兼容。
:::

## 生产环境：静态 SPA / SSG

静态站点在运行时不需要 Node.js；使用任意静态
服务器提供构建输出即可：

```dockerfile [Dockerfile]
FROM ghcr.io/voidzero-dev/vite-plus:latest AS build
WORKDIR /app
COPY --chown=vp:vp package.json pnpm-lock.yaml .node-version* ./
RUN vp install --frozen-lockfile
COPY --chown=vp:vp . .
RUN vp build

FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
```

## 持续集成

在基于容器的 CI（GitLab CI、Buildkite、CircleCI、
Jenkins 等）中直接使用该镜像：

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

## Devcontainers

将该镜像作为即用型开发容器使用，工具链已预装：

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

- **Node.js 版本**：在构建时根据 `.node-version`、`engines.node` 或
  `devEngines.runtime` 提供，因此没有 Node.js 专用的镜像标签。依赖项的
  `COPY` 使用 `.node-version*` 通配符，所以该文件是可选的：通过
  `engines.node`/`devEngines.runtime` 锁定版本的项目不需要 `.node-version`，
  而使用该文件的项目则可以在每个阶段中访问它。
- **非 root 用户**：镜像以非 root 的 `vp` 用户运行，因此请如示例所示使用
  `COPY --chown=vp:vp ...` 来复制源文件。否则，`COPY` 会写入 root 所有的文件，
  而 `vp install` 无法更新这些文件（权限被拒绝）。
- **原生插件**：镜像包含 C/C++ 构建工具链（`build-essential`、`python3`），
  因此像 `better-sqlite3` 这样的原生依赖会在 `vp install` 期间编译。
- **glibc**：该镜像基于 glibc，因此使用官方、经过签名验证的 Node.js 构建版本。
- **自定义基础镜像**：如果要在自己的基础镜像中添加 `vp`，请运行安装器：
  `curl -fsSL https://vite.plus | bash`（设置 `VP_VERSION` 以固定版本）。
