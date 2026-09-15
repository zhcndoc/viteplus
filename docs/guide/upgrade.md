# 升级 Vite+

Use `vp upgrade` to update the global `vp` binary. To update the local `vite-plus` package in a project, see [Update Vite+](/guide/upgrade-project).

## 概述

升级 Vite+ 包含两个部分：

- 你机器上安装的全局 `vp` 命令
- 单个项目使用的[本地 `vite-plus` 包](/guide/upgrade-project)

你可以独立升级这两者。

## 查看工具链

运行 `vp toolchain` 以显示当前目录的组件：

```bash
vp toolchain
vp toolchain vite
vp toolchain vite rolldown oxc
vp toolchain --json
```

如果项目中存在本地 `vite-plus` 包，该命令会使用它。使用 `--global` 可显示全局 `vp` 命令对应的版本：

```bash
vp toolchain --global
```

`vp why <package>` 会显示包管理器中的依赖关系图。它无法显示打包进 `@voidzero-dev/vite-plus-core` 的代码，也无法显示编译进 Vite+ 的引擎。使用 `vp toolchain` 可显示这些版本及其关系。

## 全局 `vp`

```bash
vp upgrade                        # 升级到最新版本
vp upgrade --check                # 检查更新但不安装
vp upgrade <version>              # 安装特定版本
vp upgrade --registry <registry>  # 使用自定义 npm registry
```

### 将现有安装迁移到拆分目录布局

Vite+ 0.3.0 是首个支持拆分目录布局的版本。Vite+ 0.2.x 及更早版本对全新安装和升级使用单根目录布局。

在 Unix 上，`vp upgrade` 会将现有默认安装保留在 `~/.vite-plus` 中；在 Windows 上则保留在 `%USERPROFILE%\.vite-plus` 中。该命令会升级该目录中的 CLI，但不会将安装迁移到拆分的平台目录。你可以继续使用现有布局。

如需立即使用拆分布局，请移除现有安装，然后重新安装 Vite+。在使用当前安装的 shell 中运行 `vp implode`。该命令会移除生成的环境文件和 shell 配置文件条目，但不会取消设置当前 shell 中的目录变量。在运行安装器之前，取消设置所有 Vite+ 目录变量。这可能包括早期预览环境文件中的值。或者，在运行 `vp implode` 后启动新的 shell，然后在新 shell 中运行安装器。

::: warning
`vp implode` 会移除所有由 Vite+ 管理的 Node.js 运行时、全局包、配置和缓存。如果不想重新创建这些数据，请保留现有布局。
:::

```bash
vp implode
unset VP_HOME VP_DATA_DIR VP_BIN_DIR VP_CACHE_DIR
curl -fsSL https://vite.plus | bash
```

在 Windows 上：

```powershell
vp implode
Remove-Item Env:\VP_HOME, Env:\VP_DATA_DIR, Env:\VP_BIN_DIR, Env:\VP_CACHE_DIR -ErrorAction SilentlyContinue
irm https://vite.plus/ps1 | iex
```

同时从 shell 配置文件或系统环境中移除 `VP_HOME`、`VP_DATA_DIR`、`VP_BIN_DIR` 和 `VP_CACHE_DIR` 的持久化定义。全新安装会使用仍然设置的 `VP_HOME`，或使用一组完整的 `VP_*_DIR` 变量。`VP_HOME` 会选择单根目录布局。如果安装 Vite+ 0.2.x 或更早版本，安装器也会使用此布局。安装器会打印提示。

### 回退

Vite+ 会保留最近的 **3 个**已安装版本，因此你可以快速回退：

```bash
vp upgrade --rollback
```

每次升级后，较旧的版本会自动清理。当前使用的版本和上一个版本始终会被保留，因此回滚目标不会被删除。

## 预览构建

一些 Vite+ 拉取请求会在 npm 发布之前发布临时包用于测试。可将其视为夜间构建或前沿构建：当你需要验证某个特定修复、测试新的上游依赖升级，或在下一个版本发布前确认某项更改时，它们很有用。日常工作中，建议优先使用已发布的 `latest` 版本。

每个符合条件的拉取请求中的每次提交都会发布到 [registry bridge](https://registry-bridge.viteplus.dev/)。该桥接服务将这些构建作为普通的 npm 版本提供，格式为 `0.0.0-commit.<sha>`，并将其他所有包代理到 npm 注册表。这意味着你可以使用常规的版本规格而不是可变 URL 来安装预览版，并且相同版本在 CI 中也会解析为一致结果。

`vite-plus` 和 `@voidzero-dev/vite-plus-core` 都以相同的 `0.0.0-commit.<sha>` 版本发布。每个拉取请求都会附带一条评论，列出其最新提交对应的确切版本，并提供可直接复制的安装步骤。

你可以在自动更新上游依赖的拉取请求中找到预览构建。示例可在已合并的拉取请求中搜索 [上游依赖更新](https://github.com/voidzero-dev/vite-plus/pulls?q=is%3Apr+is%3Amerged+upgrade+upstream+dependencies)。

预览构建通过拉取请求编号或提交 SHA 来指定。它们不是稳定的版本范围，除非维护者要求，否则你应避免将其保留在长期存在的分支中。

### 全局 `vp` 预览版

通过向安装器传递 `VP_PR_VERSION` 来安装全局 CLI 的预览构建。传入拉取请求编号或提交 SHA：

```bash
curl -fsSL https://vite.plus | VP_PR_VERSION=<pr-or-sha> bash
```

在 Windows 上：

```powershell
$env:VP_PR_VERSION = "<pr-or-sha>"
irm https://vite.plus/ps1 | iex
Remove-Item Env:\VP_PR_VERSION
```

安装器使用 registry bridge 将 ref 解析为 `0.0.0-commit.<sha>` 构建。它会像安装其他版本一样安装此构建。运行 `vp toolchain --global` 以显示当前使用的构建和工具版本。测试完成后，运行 `vp upgrade --force` 以恢复已发布的版本。你也可以在不传入 `VP_PR_VERSION` 的情况下运行安装器。

### 本地 `vite-plus` 预览版

如需在项目中使用相同的预览版，请参阅[更新 Vite+](/guide/upgrade-project#preview-builds)。
