# 入门指南

Vite+ 是用于 Web 开发的统一工具链和入口。

它将 [Vite](https://vite.dev/)、[Vitest](https://vitest.dev/)、[Oxlint](https://oxc.rs/docs/guide/usage/linter.html)、[Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)、[Rolldown](https://rolldown.rs/)、[tsdown](https://tsdown.dev/) 和 [Vite Task](https://github.com/voidzero-dev/vite-task) 汇集到单个 [`vite-plus` package](/guide/local-cli) 中，构成极速的前端工具链。

Vite+ 还提供了一个[全局 `vp` CLI](/guide/global-cli)，用于管理 Node.js 和包管理器，让 Vite+ 在不同项目中的使用更加简单。你可以独立使用任一 CLI，但我们建议[将它们配合使用](/guide/global-cli#use-both-clis-together)。

如果你已经有一个 Vite 项目，请运行 [`vp migrate`](/guide/migrate) 将其迁移到 Vite+，或者将我们的[迁移提示](/guide/migrate#migration-prompt)提供给你的 coding agent。

正在使用 AI 助手进行开发？查看并复制现成的设置提示：

<CopyPrompt />

## 全局安装 `vp`

以下命令会安装全局 `vp` CLI，用于管理 Node.js 和包管理器，并让 `vp` 在各个项目中可用。如果你只需要在单个项目中使用前端工具链，也可以改为安装[项目本地 CLI](/guide/local-cli#install)。

### macOS / Linux

```bash
curl -fsSL https://vite.plus | bash
```

### Windows

```powershell
irm https://vite.plus/ps1 | iex
```

也可以下载并运行 [`vp-setup.exe`](https://setup.viteplus.dev)。

::: tip SmartScreen 警告
`vp-setup.exe` 尚未进行代码签名。下载时浏览器可能会显示警告。点击 **“…”** → **“保留”** → **“无论如何保留”** 继续。如果 Windows Defender SmartScreen 在你运行文件时阻止它，请点击 **“更多信息”** → **“仍要运行”**。
:::

安装脚本和 `vp-setup.exe` 会读取诸如 `VP_VERSION` 和 `VP_HOME` 等[环境变量](/guide/global-cli#installation-variables)。

安装完成后，打开一个新的 shell 并运行：

```bash
vp help
```

::: info
Vite+ 将管理你的全局 Node.js 运行时和包管理器。如果你希望选择退出此行为，请运行 `vp env off`。如果你发现 Vite+ 不适合你，输入 `vp implode`，但请 [与我们分享反馈](https://discord.gg/cAnsqHh5PX)。
:::

::: details 使用小型平台（CPU 架构、操作系统）？

预构建的二进制文件会分发到以下平台（按 [Node.js v24 平台支持层级](https://github.com/nodejs/node/blob/v24.x/BUILDING.md#platform-list) 分组）：

- 第 1 层级
  - Linux x64 glibc (`x86_64-unknown-linux-gnu`)
  - Linux arm64 glibc (`aarch64-unknown-linux-gnu`)
  - Windows x64 (`x86_64-pc-windows-msvc`)
  - macOS x64 (`x86_64-apple-darwin`)
  - macOS arm64 (`aarch64-apple-darwin`)
- 第 2 层级
  - Windows arm64 (`aarch64-pc-windows-msvc`)
- 实验性
  - Linux x64 musl (`x86_64-unknown-linux-musl`)
- 其他
  - Linux arm64 musl (`aarch64-unknown-linux-musl`)

如果你的平台没有预构建的二进制文件，安装将会失败并报错。

在 Alpine Linux (musl) 上，使用 Vite+ 前需要安装 `libstdc++`：

```sh
apk add libstdc++
```

这是因为所管理的 [非官方构建版本](https://unofficial-builds.nodejs.org/) Node.js 运行时依赖于 GNU C++ 标准库。

:::

## 快速开始

安装全局 CLI 后，创建项目、安装依赖并使用默认命令：

```bash
vp create # 创建一个新项目
vp install # 安装依赖项
vp dev # 启动开发服务器
vp check # 格式化、代码检查、类型检查
vp test # 运行 JavaScript 测试
vp build # 构建生产版本
```

你也可以单独运行 `vp`，打开交互式命令行。在仅使用本地 CLI 的设置中，通过包管理器运行相同的命令，例如 `pnpm exec vp check`。

## 核心命令

Vite+ 覆盖了完整的前端开发周期，从启动项目，到开发、检查、测试和生产构建。大多数命令在两个发行版本中都可用；机器级环境和自管理命令需要使用全局 CLI。

### 设置项目

- [`vp create`](/guide/create) 创建新的应用、包和 monorepo。
- [`vp migrate`](/guide/migrate) 将现有项目迁移到 Vite+。
- [`vp install`](/guide/install) 使用正确的包管理器安装依赖。
- [`vp add`](/guide/install)、[`vp remove`](/guide/install)、[`vp update`](/guide/install)、[`vp dedupe`](/guide/install)、[`vp outdated`](/guide/install)、[`vp list`](/guide/install)、[`vp why`](/guide/install) 和 [`vp info`](/guide/install) 覆盖其余的包管理工作流。
- [`vp link`](/guide/install)、[`vp unlink`](/guide/install)、[`vp rebuild`](/guide/install) 和 [`vp pm <command>`](/guide/install) 提供更底层的包管理器操作。

### 项目工具链

- [`vp check`](/guide/check) 同时运行格式化、代码检查和类型检查。
- [`vp lint`](/guide/lint) 和 [`vp fmt`](/guide/fmt) 直接运行单独的检查。
- [`vp test`](/guide/test) 使用 Vitest 运行测试。
- [`vp dev`](/guide/dev) 启动由 Vite 驱动的开发服务器。
- [`vp build`](/guide/build) 构建应用，而 [`vp preview`](/guide/build) 在本地预览生产构建。
- [`vp pack`](/guide/pack) 构建库或独立产物。
- [`vp toolchain`](/guide/upgrade#show-the-toolchain) 显示当前使用的项目工具链；使用 `--global` 可改为检查全局安装。
- [`vp run`](/guide/run) 在工作区中运行带缓存的任务。
- [`vp cache clean`](/guide/cache) 清除任务缓存条目。
- [`vp exec`](/guide/vpx) 运行本地项目二进制文件，而 [`vp dlx`](/guide/vpx) 和 [`vpx`](/guide/vpx) 下载并运行包二进制文件。
- [`vp config`](/guide/commit-hooks) 安装 Git hook 分发器并配置 agent 集成。
- [`vp hooks`](/guide/commit-hooks) 管理 Git hook 分发器，而 [`vp staged`](/guide/commit-hooks) 在暂存文件上运行检查。
- [Monorepo 指南](/guide/monorepo) 介绍多包项目的结构和命令。

### 全局 CLI

- [`vp env`](/guide/env) 管理 Node.js 和包管理器环境，而 [`vp node`](/guide/env) 使用解析后的环境运行脚本。
- [`vp upgrade`](/guide/upgrade) 更新全局 `vp` 安装本身。
- [`vp implode`](/guide/implode) 从你的机器中移除全局 `vp` 安装及相关的 Vite+ 数据。

### 工作流

- [IDE 集成](/guide/ide-integration)、[CI](/guide/ci) 和 [Docker](/guide/docker) 介绍常见的开发和部署环境。

### 参考

- [故障排除](/guide/troubleshooting) 介绍常见的命令、配置和集成问题。

::: info
Vite+ 提供了许多预设命令，例如 `vp build`、`vp test` 和 `vp dev`。这些命令是内置的，无法更改。如果你想要运行 `package.json` 脚本中的命令，请使用 `vp run <命令>` 或 `vpr <命令>`。

[了解更多关于 `vp run`。](/guide/run)
:::
