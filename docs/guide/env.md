# 环境

`vp env` 管理完整的 JavaScript 环境：一个 Node.js 运行时和一个选定的包管理器。npm、pnpm、Yarn 和 Bun 是同级的包管理器系列。它属于[全局 CLI](/guide/global-cli)，不包含在项目本地的 `vite-plus` 包中。

## 概述

可以将项目环境视为两个独立选择的组件：

- **Node.js** 是用于执行 JavaScript 工具和脚本的运行时。每个项目都可以声明所需的 Node.js 版本。
- **包管理器** 用于安装和管理项目依赖。每个项目都可以选择 npm、pnpm、Yarn 或 Bun，并声明其版本。

例如，项目可以使用 Node.js 24 和 pnpm 10。更改 Node.js 版本不会改变其包管理器选择，从 pnpm 切换到 Yarn 也不会改变其 Node.js 版本。当你运行命令时，Vite+ 会解析这两个组件，因此你可以在项目之间切换，而无需手动切换工具。

Vite+ 通过 **shim** 将这些选择连接到你的 shell：这些 shim 是名为 `node`、`npm`、`pnpm`、`yarn` 和 `bun` 的小型启动器，以及它们的别名。在托管模式下，shim 会解析并启动当前项目所需的工具。`vp install` 等命令会使用项目选定的包管理器；直接调用 `pnpm` 始终会运行 pnpm，即使项目选择的是其他管理器。

托管模式默认开启，因此 Node.js 和已配置的包管理器 shim 会通过 Vite+ 进行解析，并为当前项目选择正确的版本。用户启用环境管理后，新安装程序会为 npm、pnpm、Yarn 和 Bun 记录托管模式。

使用 `vp env off` 可禁用 Node.js 和包管理器的托管模式。详情以及如何切换到系统工具，请参阅下文的[环境模式](#environment-modes)。

未指定选择器时，大多数命令会同时操作两个组件。添加 `node`、`pm`、`npm`、`pnpm`、`yarn` 或 `bun` 可缩小命令范围。对于列出和清理操作，`pm` 表示全部四个系列；对于项目操作，则表示单个选定的包管理器。

未限定的版本仍表示 Node.js 版本，以保持兼容性：

```bash
vp env pin 22.0.0               # Node.js only
vp env pin pnpm@10.18.0         # pnpm only
vp env pin node@24 pnpm@12      # Both components
vp env pin 22.0.0 pnpm@10.18.0  # Also both components
```

使用 `vp env pin` 保存项目版本，使用 `vp env default` 设置回退版本，使用 `vp env use` 为当前 shell 覆盖版本。运行 `vp env current` 查看解析后的环境。

## Node.js 选择

为了选择项目的 Node.js 版本，Vite+ 会先检查当前目录，然后沿父目录向上遍历。距离最近的包含受支持声明的目录优先。在每个目录中，来源按以下顺序检查：

1. `.node-version` 文件
2. `package.json` 中的 `devEngines.runtime`（[devEngines 标准](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devengines)）
3. `package.json` 中的 `engines.node`
4. `.nvmrc` 文件

如果没有任何目录声明版本，Vite+ 会使用全局默认版本（`vp env default`），然后使用最新的 LTS 版本。

`devEngines.runtime` 的优先级高于 `engines.node`，因为它声明的是开发环境需求，而 `engines.node` 是面向使用者的支持范围。`vp env doctor` 会在声明来源冲突时发出警告。

::: tip 在 Vite+ 运行时管理中使用 pnpm
pnpm 也可以管理 `devEngines.runtime` 中声明的运行时。当 pnpm 和 Vite+ 同时管理 Node.js 时，它们可能分别下载相同版本或选择不同版本，导致不同命令之间的行为不一致。

如果你希望由 Vite+ 管理 Node.js，pnpm 11+ 支持通过 [`runtimeOnFail`](https://pnpm.io/settings/cli#runtimeonfail) 全局禁用 pnpm 的自动运行时管理：

```bash
pnpm config set --global runtimeOnFail ignore
```

此设置还会禁用 pnpm 对其他已声明运行时的自动管理，包括 Bun 和 Deno。在全局设置之前，请考虑你的项目是否依赖此行为。
:::

## 包管理器选择

包管理器选择使用以下优先级：

1. 显式命令覆盖
2. `VP_PACKAGE_MANAGER`
3. 顶层 `packageManager`
4. `devEngines.packageManager`
5. 锁文件或管理器专属配置
6. 指定包管理器的全局默认版本
7. 指定 shim 的最新版本

`VP_PACKAGE_MANAGER` 为 `vp install` 等命令选择管理器和版本。直接调用的包管理器 shim 会忽略此变量，并使用独立的版本覆盖：

| 变量              | Shim              |
| ----------------- | ----------------- |
| `VP_NPM_VERSION`  | `npm`、`npx`      |
| `VP_PNPM_VERSION` | `pnpm`、`pnpx`    |
| `VP_YARN_VERSION` | `yarn`、`yarnpkg` |
| `VP_BUN_VERSION`  | `bun`、`bunx`     |

这些变量接受版本或范围，例如 `10.18.0`、`10` 或 `latest`，并覆盖对应 shim 的项目版本和默认版本。它们不会改变 `vp install` 所选择的管理器或版本。

`vp env use pnpm@10.20.0` 会为当前 shell 设置 `VP_PNPM_VERSION`，就像 `vp env use node@22` 会设置 `VP_NODE_VERSION` 一样。每个包管理器都有自己的覆盖，因此切换 Yarn 不会清除 pnpm 的覆盖。`vp env use` 不会设置或清除 `VP_PACKAGE_MANAGER`。

直接调用的 shim 会先从匹配的环境变量解析版本；如果没有 shell 包装器，则从匹配的会话文件解析；随后依次使用项目配置和系列默认值。`vp env current pnpm` 和 `vp env which pnpm` 会检查此 shim 选择；`vp env current pm` 会报告为 vp 命令选择的管理器。

```bash
VP_PACKAGE_MANAGER=pnpm@10.18.0 vp install
VP_PNPM_VERSION=10.20.0 pnpm --version
```

这些覆盖在托管模式下生效。包管理器也可以在 Vite+ 启动它之后自行执行版本切换；例如，pnpm 的 `managePackageManagerVersions` 设置可能会切换回 `package.json` 中的版本。

项目选择仅适用于对应的 shim。例如，pnpm 控制 `pnpm` 和 `pnpx`；调用 `npm` 仍会独立解析 npm。如果没有匹配的项目选择，指定的 shim 会使用其配置的默认版本；如果没有配置，则使用最新版本且不会提示。直接调用的 npm shim 会保留其 Node.js 内置的回退版本，而显式使用 `vp env ... npm` 系列范围时，则使用独立 npm 的最新版本。

::: details 最新版本缓存
当指定的 shim 回退到最新版本时，解析出的版本会缓存一小时。当无法连接注册表时，过期的缓存仍可用。
:::

## 环境模式

托管模式默认开启，因此 Node.js 和已配置的包管理器 shim 会通过 Vite+ 进行解析，并为当前项目选择正确的版本。用户启用环境管理后，新安装程序会为 npm、pnpm、Yarn 和 Bun 记录托管模式。

要启用托管模式，请运行：

```bash
vp env on
```

这会为两个组件启用托管模式。也可以独立更改它们的模式，包括单个包管理器系列：

```bash
vp env on node
vp env off pm
vp env off pnpm
vp env on bun
```

如果不希望 Vite+ 首先管理 Node.js，请运行：

```bash
vp env off
```

这会将两个组件切换为系统优先模式。Vite+ 会优先使用系统工具，并回退到托管安装。混合配置可以组合使用：系统包管理器启动器会接收由 Node.js 模式选择的 Node.js。

使用 `pm` 会为当前支持的所有包管理器记录选定的模式，并替换它们各自的选择。未指定范围的 `on` 或 `off` 会执行相同操作，同时也会更改 Node.js。尚未记录模式的系列会保持未决定状态，直到首次使用其 shim，或通过 `on` / `off` 命令进行配置。

## 命令

### 设置

- `vp env setup` 在解析后的 bin 目录中创建或更新 `node`、`npm`、`npx`、`pnpm`、`pnpx`、`yarn`、`yarnpkg`、`bun`、`bunx`、`vpx` 和 `vpr` shim。它会在配置目录中写入 shell 设置脚本
- `vp env on` / `vp env off` 更改两种模式；追加 `node`、`pm`、`npm`、`pnpm`、`yarn` 或 `bun` 可缩小更改范围
- `vp env print` 打印两个组件的 PATH 设置；追加选择器可只打印一个组件的设置

PowerShell 需要在 `vp env use` 之前，在当前 shell 中 dot-source 生成的设置脚本，才能只影响该 shell 会话：

```powershell
. "$env:APPDATA\vite-plus\env.ps1"
```

如果较旧的 Vite+ 安装使用 `%USERPROFILE%\.vite-plus`，请改为 source 该目录中的 `env.ps1` 文件。

将该行添加到 PowerShell `$PROFILE` 的末尾，可在新 shell 中自动应用。此操作不需要提升权限。

如果配置文件不存在，请创建它：

```powershell
if (-not (Test-Path $PROFILE)) { New-Item $PROFILE -Force }
```

打开配置文件进行编辑：

```powershell
Invoke-Item $PROFILE
```

Windows 命令提示符（`cmd.exe`）无法定义 `vp env use` 更新当前 shell 会话所需的包装函数。请改用生成的 `vp-use.cmd` 命令：

```batch
vp-use 20
node --version
vp-use --unset
```

只有 `vp env use` 需要使用此替代命令。其他 `vp env` 命令在命令提示符中均可正常工作。在 Windows 上，`vp env setup` 会在 bin 目录中创建 `vp-use.cmd`。

在 CI 中，`vp env use` 无需 shell 初始化即可运行。它会在解析后的状态目录中，为每个运行时或包管理器写入一个临时会话文件，例如 `.session-node-version` 或 `.session-pnpm-version`。同一任务中后续的 shim 调用会使用这些文件解析相同的环境。

### 管理

- `vp env default` 显示全局 Node.js 默认版本和每个已配置的包管理器版本。裸版本设置 Node.js；`pnpm@10.18.0` 等限定规格设置该包管理器 shim 的默认版本，而不会替换 Bun、Yarn 或 npm 的默认版本。除非指定范围，否则 `--unset` 会清除所有默认值
- `vp env pin` 显示或写入项目固定版本。现有的 `.node-version` 和顶层 `packageManager` 字段会继续更新，以保持兼容性。如果当前目录中现有的 `.nvmrc` 是有效的 Node.js 来源，则会更新它；其中的注释和其他非版本内容会被保留。否则，Vite+ 会写入匹配的 `devEngines` 条目。使用 `--target node-version`、`--target nvmrc`、`--target dev-engines` 或 `--target package-manager` 可显式选择目标。在子目录中固定版本不会修改继承的 `.nvmrc`
- `vp env unpin` 默认移除两个有效的固定版本；追加选择器可移除其中一个。较低优先级的声明不会被删除
- `vp env use` 激活完整的项目环境。显式规格会覆盖选定的组件；除非指定范围，否则 `--unset` 会清除两者
- `vp env install` 安装完整的解析环境、选定的组件或显式规格
- `vp env uninstall` 移除显式指定的精确 Node.js 版本或限定的包管理器版本
- `vp env clean` 移除未使用的安装。使用 `clean node`、`clean pm` 或具体的管理器。当前版本和已配置的默认版本会被保留
- `vp env exec` 在解析后的环境中运行命令。使用 `--node` 和 `--package-manager`；`--npm` 是 `--package-manager npm@…` 的别名
- `vp node` 使用解析后的 Node.js 运行时，并将选定的包管理器路径暴露给子进程

### 检查

- `vp env current` 显示当前解析后的环境
- `vp env doctor` 运行环境诊断
- `vp env which` 显示将使用的工具路径
- `vp env list` 分别显示 Node.js、npm、pnpm、Yarn 和 Bun 部分；选择器可缩小输出范围
- `vp env list-remote` 并发获取 Node.js 和全部四个包管理器注册表；选择器可缩小网络请求范围。`--lts` 会隐式选择 Node.js

## 项目设置

- 使用 `vp env pin` 固定项目版本
- 正常使用 `vp install`、`vp dev` 和 `vp build`
- 让 Vite+ 为项目选择正确的运行时。

## 示例

```bash
# Setup
vp env setup                  # Create Node.js and package-manager shims
vp env on                     # Manage Node.js and package managers
vp env off pm                 # Prefer system package managers only
vp env off pnpm               # Prefer system pnpm only
vp env print                  # Print PATH setup for both components

# Manage
vp env pin lts pnpm@10        # Pin both project components to exact versions
vp env install                # Install the complete resolved environment
vp env default node@24        # Set the global Node.js default
vp env default pnpm@10        # Set pnpm's global default version
vp env use 20 pnpm@10         # Override both components for this shell
vp env use --unset pnpm       # Remove only the pnpm session version
vp env use --unset pm         # Remove all package-manager session versions
vp env clean                  # Remove unused managed Node.js and package manager versions

# Inspect
vp env current                # Show current resolved environment
vp env current --json         # JSON output for automation
vp env which node             # Show which node binary will be used
vp env which npx              # Show pinned package-manager alias when packageManager matches
vp env list                   # Show every locally installed component
vp env list node              # Show only Node.js installations
vp env list-remote --lts      # List only Node.js LTS versions

# Execute
vp env exec --node lts --package-manager pnpm@10 pnpm install
vp env exec node -v           # Use shim mode with automatic version resolution
vp node script.js             # Shorthand: run a Node.js script with the resolved version
vp node -e "console.log(1+1)" # Shorthand: forward any node flag or argument
```

## JSON 输出

`current`、`list` 和 `list-remote` 的 JSON 输出按组件组织。`current --json` 返回同级的 `node` 和 `package_manager` 对象：

```json
{
  "node": {
    "version": "22.0.0",
    "source": "devEngines.runtime",
    "source_path": "/project/package.json",
    "project_root": "/project",
    "bin_path": "/home/.vite-plus/js_runtime/node/22.0.0/bin/node",
    "installed": true,
    "mode": "managed"
  },
  "package_manager": {
    "name": "pnpm",
    "version": "10.18.0",
    "source": "packageManager",
    "source_path": "/project/package.json",
    "project_root": "/project",
    "bin_paths": {
      "pnpm": "/home/.vite-plus/package_manager/pnpm/10.18.0/pnpm/bin/pnpm",
      "pnpx": "/home/.vite-plus/package_manager/pnpm/10.18.0/pnpm/bin/pnpx"
    },
    "installed": true,
    "mode": "managed"
  }
}
```

`list --json` 和 `list-remote --json` 会将组件数组分组：

```json
{
  "node": [],
  "package_managers": {
    "npm": [],
    "pnpm": [],
    "yarn": [],
    "bun": []
  }
}
```

选择器会省略未选择的顶层字段或包管理器系列。注册表列表采用全有或全无模式：当任意选定的注册表请求失败时，Vite+ 不会输出部分的人类可读结果或 JSON 结果。

## 自定义 Node.js 镜像

默认情况下，Vite+ 从 `https://nodejs.org/dist` 下载 Node.js。如果你在公司代理后或需要使用内部镜像（例如 Artifactory），请设置 `VP_NODE_DIST_MIRROR` 环境变量：

```bash
# 从自定义镜像安装特定版本
VP_NODE_DIST_MIRROR=https://my-mirror.example.com/nodejs/dist vp env install 22

# 使用自定义镜像设置全局默认版本
VP_NODE_DIST_MIRROR=https://my-mirror.example.com/nodejs/dist vp env default lts

# 永久设置到你的 shell 配置文件（.bashrc、.zshrc 等）
echo 'export VP_NODE_DIST_MIRROR=https://my-mirror.example.com/nodejs/dist' >> ~/.zshrc
```

## Node.js 签名验证

从官方 `nodejs.org` 发行版安装 Node.js 时，Vite+ 会下载带 PGP 签名的 `SHASUMS256.txt.asc`，并在信任任何校验和之前，使用随附的 Node.js 发布密钥对其进行验证。这可以防止 `SHASUMS256.txt` 被篡改并配套恶意压缩包的情况。下载的压缩包的 SHA-256 校验和随后始终会被验证。

仅发布纯 `SHASUMS256.txt` 的自定义镜像（`VP_NODE_DIST_MIRROR`）会回退为仅校验和验证。如果镜像也发布 `.asc`，其签名仍会被验证，且无效签名会直接报错。

如果未来的密钥环或证书问题阻止下载，请设置 `VP_NODE_SKIP_SIGNATURE_VERIFY` 以临时绕过 PGP 验证。SHA-256 校验和仍会被验证，并且当跳过签名检查时，Vite+ 会打印警告：

```bash
VP_NODE_SKIP_SIGNATURE_VERIFY=1 vp env install 22
```
