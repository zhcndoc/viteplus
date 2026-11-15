# 移除 Vite+

使用 `vp implode` 从计算机中移除 Vite+ 管理的[全局 `vp` 安装](/guide/global-cli)及相关用户数据。它不会移除项目或由 Homebrew 管理的软件包中的 `vite-plus` 依赖。

## 概述

`vp implode` 是用于清理并移除 Vite+ 安装及其管理数据的命令。如果您不再希望 Vite+ 管理您的运行时、包管理器及相关本地工具状态，请使用此命令。

::: info
如果您觉得 Vite+ 不适合您，请 [与我们分享您的反馈](https://discord.gg/cAnsqHh5PX)。
:::

## 用法

```bash
vp implode
```

检查命令列出的目录和 shell 配置文件，然后输入 `boom` 确认移除。任何其他输入都会取消操作。

使用以下命令跳过确认提示：

```bash
vp implode --yes
```

## Homebrew

使用[官方 Homebrew tap](/guide/homebrew)时，请先运行 `vp implode`，移除 Vite+ 管理的运行时、全局包、配置、shims 和 shell 条目。然后移除 Homebrew 包：

```bash
vp implode
brew uninstall voidzero-dev/vite-plus/vp
```

确认提示会说明 Homebrew 包仍会保留。清理后，`vp implode` 会显示对应 formula 的卸载命令。

如果要在切换安装方式时保留数据，请按[迁移步骤](/guide/homebrew#switch-an-existing-installation)操作，而不是运行 `vp implode`。

Restart your terminal before you run `vp` again. In Bash, you can run `hash -r` instead to clear cached command paths. If the Homebrew package is still installed, the next `vp` command starts first-run setup again.
