# 入门指南

Vite+ 是统一的网络开发工具链和入口点。它通过结合 [Vite](https://vite.dev/)、[Vitest](https://vitest.dev/)、[Oxlint](https://oxc.rs/docs/guide/usage/linter.html)、[Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)、[Rolldown](https://rolldown.rs/)、[tsdown](https://tsdown.dev/) 和 [Vite Task](https://github.com/voidzero-dev/vite-task)，在一个地方管理你的运行时、包管理器和前端工具链。

Vite+ 分为两部分：`vp`（全局命令行工具）和 `vite-plus`（安装在每个项目中的本地包）。如果你已经有一个 Vite 项目，请使用 [`vp migrate`](/guide/migrate) 将其迁移到 Vite+，或者将我们的 [迁移提示](/guide/migrate#migration-prompt) 粘贴到你的编码工具中。

## 安装 `vp`

### macOS / Linux

```bash
curl -fsSL https://vite.plus | bash
```

### Windows

```powershell
irm https://vite.plus/ps1 | iex
```

或者，下载并运行 [`vp-setup.exe`](https://viteplus.zhcndoc.com/vp-setup)。

::: tip SmartScreen 警告
`vp-setup.exe` 尚未进行代码签名。下载时浏览器可能会显示警告。点击 **“…”** → **“保留”** → **“无论如何保留”** 继续。如果 Windows Defender SmartScreen 在你运行文件时阻止它，请点击 **“更多信息”** → **“仍要运行”**。
:::

安装完成后，打开一个新的终端并运行：

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

创建一个项目，安装依赖项，并使用默认命令：

```bash
vp create # 创建一个新项目
vp install # 安装依赖项
vp dev # 启动开发服务器
vp check # 格式化、Lint、类型检查
vp test # 运行 JavaScript 测试
vp build # 构建生产版本
```

你也可以直接运行 `vp` 并使用交互式命令行。

## 核心命令

Vite+ 可以从启动项目、开发、检查与测试，一直到构建生产版本，处理整个本地前端开发周期。

### 启动

- [`vp create`](/guide/create) 创建新的应用程序、包和单体仓库。
- [`vp migrate`](/guide/migrate) 将现有项目迁移到 Vite+。
- [`vp config`](/guide/commit-hooks) 配置提交钩子和代理集成。
- [`vp staged`](/guide/commit-hooks) 对已暂存的文件运行检查。
- [`vp install`](/guide/install) 使用正确的包管理器安装依赖项。
- [`vp env`](/guide/env) 管理 Node.js 版本。

### 开发

- [`vp dev`](/guide/dev) 启动由 Vite 提供支持的开发服务器。
- [`vp check`](/guide/check) 一起运行格式化、Lint 和类型检查。
- [`vp lint`](/guide/lint)、[`vp fmt`](/guide/fmt) 和 [`vp test`](/guide/test) 允许你直接运行这些工具。

### 执行

- [`vp run`](/guide/run) 在工作区中运行带有缓存的任务。
- [`vp cache clean`](/guide/cache) 清除任务缓存条目。
- [`vpx`](/guide/vpx) 全局下载并运行二进制文件。
- [`vp exec`](/guide/vpx) 运行本地项目二进制文件。
- [`vp dlx`](/guide/vpx) 下载并运行包二进制文件而不将其添加为依赖项。

### 构建

- [`vp build`](/guide/build) 构建应用程序。
- [`vp pack`](/guide/pack) 构建库或独立工件。
- [`vp preview`](/guide/build) 本地预览生产构建。

### 管理依赖项

- [`vp add`](/guide/install)、[`vp remove`](/guide/install)、[`vp update`](/guide/install)、[`vp dedupe`](/guide/install)、[`vp outdated`](/guide/install)、[`vp why`](/guide/install) 和 [`vp info`](/guide/install) 封装包管理器工作流程。
- [`vp pm <command>`](/guide/install) 直接调用其他包管理器命令。

### 维护

- [`vp upgrade`](/guide/upgrade) 更新 `vp` 安装本身。
- [`vp implode`](/guide/implode) 从你的机器中移除 `vp` 和相关的 Vite+ 数据。

::: info
Vite+ 提供了许多预设命令，例如 `vp build`、`vp test` 和 `vp dev`。这些命令是内置的，无法更改。如果你想要运行 `package.json` 脚本中的命令，请使用 `vp run <命令>` 或 `vpr <命令>`。

[了解更多关于 `vp run`。](/guide/run)
:::
