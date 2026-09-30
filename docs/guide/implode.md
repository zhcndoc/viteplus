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

使用以下命令跳过确认提示：

```bash
vp implode --yes
```

## Homebrew

Run `vp implode` first to remove Vite+-managed runtimes, global packages, configuration, shims, and shell entries. Then remove the Homebrew package:

```bash
vp implode
brew uninstall vite-plus
```

The confirmation prompt explains that the Homebrew package will remain installed. After cleanup, `vp implode` directs you to `brew uninstall vite-plus`.

Restart your terminal before you run `vp` again. In Bash, you can run `hash -r` instead to clear cached command paths. If the Homebrew package is still installed, the next `vp` command starts first-run setup again.
