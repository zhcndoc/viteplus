# Homebrew Tap

官方 tap 支持 macOS，以及 ARM64 和 x64 架构的 glibc Linux。Homebrew 管理原生 `vp` 可执行文件；`vp` 则在用户目录中管理 JavaScript 依赖、下载的 Node.js 版本、包管理器和设置。
稳定版安装会从 GitHub Releases 下载可执行文件及其依赖 lockfile。此步骤不需要预先安装 Node.js 或包管理器，也不需要访问 npm registry。

## 安装

安装 tap：

```bash
brew tap voidzero-dev/vite-plus https://github.com/voidzero-dev/vite-plus
brew install voidzero-dev/vite-plus/vp
vp
```

由于 formula 位于 Vite+ 仓库中，因此必须显式指定仓库 URL。
如果你已在使用 Vite+，请按照[迁移步骤](#switch-an-existing-installation)操作。

## 首次使用

首次运行时，`vp` 会安装匹配的 CLI 依赖，并配置 shell 和工具管理偏好。此步骤需要访问 Node.js 下载源和你的 npm registry。
即使你选择优先使用系统工具，设置过程仍使用该发行版固定的 Node.js 和 pnpm 版本。兼容的 [`VP_SETUP_NODE_VERSION`](/guide/global-cli#vp-setup-node-version) 可以覆盖安装时使用的运行时，但不会改变项目的 Node.js 版本选择。
`vp` 会将依赖存储在 `<DATA>/cli-packages/<version>/<platform>`。
`<DATA>` 来自 [Vite+ 目录配置](/guide/global-cli#installation-variables)。

设置完成后，请打开新的终端，使 shim 能通过 `PATH` 使用。之后的调用会复用已完成的设置。
使用 [`vp env on` 和 `vp env off`](/guide/env) 更改由 `vp` 管理的工具。

## 自定义 npm Registry

首次设置时会读取 `~/.npmrc`，包括兼容 npm 的身份验证配置：

```ini
registry=https://registry.example.com/repository/npm/
//registry.example.com/repository/npm/:_authToken=${NPM_TOKEN}
```

运行 `vp` 前请导出 `NPM_TOKEN`。原生 pnpm 下载器和 pnpm 依赖安装都会使用此配置。
你可以通过 `NPM_CONFIG_USERCONFIG` 指定其他配置文件，或通过 `NPM_CONFIG_REGISTRY` 覆盖 registry。
相对用户配置路径按当前目录解析。无需设置 Homebrew 专用的 npm 变量。

身份验证失败时，设置过程会停止。修正配置后再次运行 `vp`；设置过程会保留你的管理选项。

## 从失败的设置中恢复

运行 `vp env doctor` 检查可执行文件、依赖目录和 shim。CLI 依赖检查只读取本地文件，不会安装或修复依赖。其他检查可能会获取 Node.js 版本元数据。

修复报告中的配置、访问权限或磁盘空间问题，然后运行 `vp --help` 重试设置。
如果遇到 lockfile 错误，也可以通过 Homebrew 使用[安装器恢复选项](/guide/global-cli#vp-setup-skip-install-lockfile)：

```bash
VP_SETUP_SKIP_INSTALL_LOCKFILE=1 vp --help
```

此操作会在不使用已发布 lockfile 的情况下解析依赖。之后不带覆盖变量再次运行时，会恢复正常的 lockfile 检查，并可重新安装这些依赖。
如果 pnpm 失败，报告日志会包含退出码和可识别的错误码，不会包含原始包管理器输出。
已配置的工具 shim 可以独立于 CLI 依赖修复，运行缓存中的 Node.js、包管理器和全局软件包。

## 切换现有安装方式 {#switch-an-existing-installation}

保留现有目录设置。迁移会保留你的偏好、运行时和全局软件包，并将其 shim 更新为 Homebrew 对外提供的 `vp` 命令。
不要运行 `vp implode`，因为它会移除这些用户数据。切换后请打开新的终端。

### 从脚本安装器切换 {#switch-from-the-script-installer}

运行上文中的 `brew tap` 和 `brew install` 命令。随后直接调用 Homebrew 的可执行文件，避免已有的脚本安装 shim 优先执行：

```bash
"$(brew --prefix)/bin/vp" env setup --refresh
```

### 从 Homebrew Core 切换

`vite-plus` formula 提供相同的命令；安装 tap 前必须先移除它：

```bash
brew tap voidzero-dev/vite-plus https://github.com/voidzero-dev/vite-plus
brew uninstall vite-plus
brew install voidzero-dev/vite-plus/vp
"$(brew --prefix)/bin/vp" env setup --refresh
```

## 升级或移除

```bash
brew upgrade voidzero-dev/vite-plus/vp
```

升级后运行 `vp`，以准备匹配的依赖。设置过程会保留你的偏好。
`vp upgrade` 会识别官方 tap，并提示运行 `brew upgrade voidzero-dev/vite-plus/vp`。

要彻底移除，请先删除用户数据，再卸载可执行文件：

```bash
vp implode
brew uninstall voidzero-dev/vite-plus/vp
```

单独运行 `brew uninstall` 会保留用户数据。在共享机器上，可由每个操作系统账户在卸载可执行文件前运行 `vp implode`，移除自己的数据。

## 测试预览构建 {#test-a-preview-build}

将 `HOMEBREW_VP_PR_VERSION` 设为 PR 编号或完整提交 SHA。该 PR 必须已发布包含 Homebrew tap 支持的 `preview-build`。请使用完整 SHA，确保安装和验证使用同一个提交：

```bash
brew tap voidzero-dev/vite-plus https://github.com/voidzero-dev/vite-plus
HOMEBREW_VP_PR_VERSION="<full-commit-sha>" brew install voidzero-dev/vite-plus/vp
HOMEBREW_VP_PR_VERSION="<full-commit-sha>" brew test voidzero-dev/vite-plus/vp
```

要替换已安装的 tap 构建，请使用 `brew reinstall` 而不是 `brew install`。如果已安装 `vite-plus` formula，请先运行 `brew uninstall vite-plus`；这会保留你的用户数据。
`brew test` 使用临时用户数据，不会更改 shell 配置。之后运行 `vp`，为你的账户设置预览版本。如果从脚本安装器切换，请[刷新 shim](#switch-from-the-script-installer)，让它们使用 Homebrew 可执行文件。

Homebrew 只会从 registry bridge 下载原生预览包并验证校验和。PR 编号会解析到最新已发布的提交，这可能与 PR 当前的 head 不同。
首次启动时会从 bridge 安装匹配的依赖。显式设置的 `NPM_CONFIG_REGISTRY` 必须指向同样提供这些预览包的 registry。

此选择器仅适用于该 tap，不会影响其他 Homebrew formula；`brew install` 期间也不需要 npm 客户端。
要测试 formula 本身的更改，请先在 tap 仓库中检出对应 PR。为以下命令设置 `HOMEBREW_NO_AUTO_UPDATE=1`，以保留该检出状态。

要切回稳定版，请清除覆盖变量；如果更改过 tap 的检出状态，请恢复其 `main` 分支，并在重新安装前更新：

```bash
unset HOMEBREW_VP_PR_VERSION HOMEBREW_NO_AUTO_UPDATE
git -C "$(brew --repository voidzero-dev/vite-plus)" switch main
brew update
brew reinstall voidzero-dev/vite-plus/vp
```
