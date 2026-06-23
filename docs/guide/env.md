# 环境

`vp env` 用于全局和每个项目地管理 Node.js 版本。

## 概述

默认情况下托管模式处于开启状态，因此 `node`、`npm` 和相关的 shim 会通过 Vite+ 解析，并为当前项目选择正确的 Node.js 版本。

项目的 Node.js 版本按以下来源解析，优先级依次如下：

1. `.node-version` 文件（当前目录或父目录）
2. `package.json` 中的 `devEngines.runtime`（[devEngines 标准](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devengines)）
3. `package.json` 中的 `engines.node`
4. 全局默认值（`vp env default`），然后是最新的 LTS

`devEngines.runtime` 的优先级高于 `engines.node`，因为它声明的是开发环境需求，而 `engines.node` 是面向使用者的支持范围。`vp env doctor` 会在声明来源冲突时发出警告。

当项目在 `package.json` 中声明 `packageManager`（或 `devEngines.packageManager`）时，匹配的包管理器 shim 也会使用该包管理器版本。例如，`packageManager: "npm@10.9.4"` 会让 `npm` 和 `npx` 都通过 npm 10.9.4 运行。别名对遵循已安装的包管理器 shim：`npm`/`npx`、`pnpm`/`pnpx`、`yarn`/`yarnpkg` 和 `bun`/`bunx`。Vite+ 不会转换不匹配的命令，因此固定到 `pnpm` 的项目仍会让 `npm` 回退到解析出的 Node.js 运行时自带的 npm。

默认情况下，Vite+ 会将其受管理的运行时和相关文件存储在 `~/.vite-plus` 中。如有需要，你可以使用 `VP_HOME` 覆盖该位置。

如果希望保持这种行为，请运行：

```bash
vp env on
```

这将启用托管模式，shim 将始终使用 Vite+ 管理的 Node.js 安装。

如果不希望 Vite+ 首先管理 Node.js，请运行：

```bash
vp env off
```

这将切换到系统优先模式，shim 会优先使用系统 Node.js，仅在需要时回退到 Vite+ 托管的运行时。

## 命令

### 设置

- `vp env setup` 会在 `VP_HOME/bin` 中创建或更新 shim，并将每个 shell 的设置脚本写入 `~/.vite-plus/`
- `vp env on` 启用托管模式，使 shim 始终使用 Vite+ 管理的 Node.js
- `vp env off` 启用系统优先模式，使 shim 优先使用系统 Node.js
- `vp env print` 打印当前会话的 shell 片段

PowerShell 需要在 `vp env use` 之前，在当前 shell 中 dot-source 生成的设置脚本，才能只影响该 shell 会话：

```powershell
. "$env:USERPROFILE\.vite-plus\env.ps1"
```

将该行添加到你的 PowerShell `$PROFILE` 末尾，以便在新 shell 中自动应用。它不需要提升权限。

如果配置文件不存在，请创建它：

```powershell
if (-not (Test-Path $PROFILE)) { New-Item $PROFILE -Force }
```

打开配置文件进行编辑：

```powershell
Invoke-Item $PROFILE
```

在 CI 中，`vp env use` 仍然可以在没有 shell 初始化的情况下运行。它会在 `VP_HOME` 下写入一个临时会话文件，以便同一作业中后续的 shim 调用可以解析所选的 Node.js 版本。

### 管理

- `vp env default` 设置或显示全局默认 Node.js 版本
- `vp env pin` 将 Node.js 版本固定到当前目录：现有的 `.node-version` 会继续保持更新；否则会将固定内容写入 `package.json#devEngines.runtime`；只有在目录中没有 `package.json` 时才会创建 `.node-version`。使用 `--target node-version` 或 `--target dev-engines` 可显式选择。现有的 `engines.node` 永远不会被修改。
- `vp env unpin` 从 `vp env pin` 会写入的同一来源中移除固定设置
- `vp env use` 为当前 shell 会话设置一个 Node.js 版本
- `vp env install` 安装一个 Node.js 版本
- `vp env uninstall` 移除已安装的 Node.js 版本
- `vp env exec` 使用特定的 Node.js 版本运行命令
- `vp node` 运行一个 Node.js 脚本——相当于 `vp env exec node`

### 检查

- `vp env current` 显示当前已解析的环境
- `vp env doctor` 运行环境诊断
- `vp env which` 显示将使用的工具路径
- `vp env list` 显示本地安装的 Node.js 版本
- `vp env list-remote` 显示注册表中可用的 Node.js 版本

## 项目设置

- 使用 `vp env pin` 固定项目版本
- 正常使用 `vp install`、`vp dev` 和 `vp build`
- 让 Vite+ 为项目选择正确的运行时

## 示例

```bash
# 设置
vp env setup                  # 为 node、npm、npx、corepack 创建 shim
vp env on                     # 使用 Vite+ 管理的 Node.js
vp env print                  # 打印此会话的 shell 片段

# 管理
vp env pin lts                # 将项目固定到最新的 LTS 版本
vp env install                # 从 .node-version 或 package.json 安装版本
vp env default lts            # 设置全局默认版本
vp env use 20                 # 为当前 shell 会话使用 Node.js 20
vp env use --unset            # 移除会话覆盖

# 检查
vp env current                # 显示当前已解析的环境
vp env current --json         # 为自动化输出 JSON
vp env which node             # 显示将使用哪个 node 二进制文件
vp env which npx              # 当 packageManager 匹配时显示固定的包管理器别名
vp env list-remote --lts      # 仅列出 LTS 版本

# 执行
vp env exec --node lts npm i  # 使用最新 LTS 执行 npm
vp env exec node -v           # 使用 shim 模式并自动解析版本
vp node script.js             # 等效：运行已解析版本的 Node.js 脚本
vp node -e "console.log(1+1)" # 等效：传递任意 node 标志或参数
```

## Corepack

Vite+ 默认会创建一个 `corepack` shim，因此 corepack 即使没有系统安装的 Node.js 也能工作：

- 在 Node.js 24 及更早版本中，shim 运行的是与已解析 Node.js 版本捆绑的 corepack。
- 在 Node.js 25 及更高版本中，由于 corepack 不再随附，Vite+ 会在首次使用时将 corepack 作为受管理的全局包安装。只会链接 `corepack` 二进制文件；如果你还想直接暴露该包的 pnpm/yarn 启动器，请自行运行 `vp install -g corepack`。
- 如果你通过 `vp install -g corepack` 显式安装了 corepack，则始终优先使用该安装。

`corepack enable` 通常会在 corepack 二进制文件旁创建 `pnpm`/`yarn` 启动器，但在 Vite+ 下这些不会位于 `PATH` 中。shim 通过将 `--install-directory` 默认设置为 `VP_HOME/bin` 来修复这一点，因此在执行 `corepack enable` 后，这些启动器可在任何地方使用，并且仍然会解析项目的 Node.js 和包管理器版本：

```bash
corepack enable               # 现在 pnpm 和 yarn 通过 corepack 解析
corepack disable              # 再次移除 pnpm/yarn 启动器
```

这些启动器引用的是创建它们的 corepack 副本。如果该副本之后被移除（例如卸载了其所附带的 Node.js 版本），请重新运行 `corepack enable` 以重新创建它们。

Vite+ 所拥有的 shim（`npm`、`npx` 以及通过 `vp install -g` 安装的二进制文件）受保护：如果 corepack 删除或替换了它们，Vite+ 会恢复它们并打印警告。

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
