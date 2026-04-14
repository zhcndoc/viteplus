# 环境

`vp env` 用于全局和每个项目地管理 Node.js 版本。

## 概述

默认情况下托管模式处于开启状态，因此 `node`、`npm` 和相关的 shim 会通过 Vite+ 解析，并为当前项目选择正确的 Node.js 版本。

默认情况下，Vite+ 将托管运行时及相关文件存储在 `~/.vite-plus` 中。如需覆盖该位置，可以使用 `VP_HOME`。

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

- `vp env setup` 在 `VP_HOME/bin` 中创建或更新 shim
- `vp env on` 启用托管模式，使 shim 始终使用 Vite+ 管理的 Node.js
- `vp env off` 启用系统优先模式，使 shim 优先使用系统 Node.js
- `vp env print` 打印当前会话的 shell 片段

### 管理

- `vp env default` 设置或显示全局默认 Node.js 版本
- `vp env pin` 在当前目录中固定 Node.js 版本
- `vp env unpin` 从当前目录中移除 `.node-version`
- `vp env use` 为当前 shell 会话设置 Node.js 版本
- `vp env install` 安装 Node.js 版本
- `vp env uninstall` 卸载已安装的 Node.js 版本
- `vp env exec` 使用特定的 Node.js 版本运行命令
- `vp node` 运行 Node.js 脚本 — 等效于 `vp env exec node`

### 检查

- `vp env current` 显示当前已解析的环境
- `vp env doctor` 运行环境诊断
- `vp env which` 显示将使用的工具路径
- `vp env list` 显示本地安装的 Node.js 版本
- `vp env list-remote` 显示注册表中可用的 Node.js 版本

## 项目设置

- 使用 `.node-version` 固定项目版本
- 正常使用 `vp install`、`vp dev` 和 `vp build`
- 让 Vite+ 为项目选择正确的运行时

## 示例

```bash
# 设置
vp env setup                  # 为 node、npm、npx 创建 shim
vp env on                     # 使用 Vite+ 管理的 Node.js
vp env print                  # 打印当前会话的 shell 片段

# 管理
vp env pin lts                # 将项目固定到最新的 LTS 版本
vp env install                # 从 .node-version 或 package.json 安装版本
vp env default lts            # 设置全局默认版本
vp env use 20                 # 为当前 shell 会话使用 Node.js 20
vp env use --unset            # 移除会话覆盖

# 检查
vp env current                # 显示当前已解析的环境
vp env current --json         # 用于自动化的 JSON 输出
vp env which node             # 显示将使用的 node 二进制路径
vp env list-remote --lts      # 仅列出 LTS 版本

# 执行
vp env exec --node lts npm i  # 使用最新 LTS 执行 npm
vp env exec node -v           # 使用 shim 模式并自动解析版本
vp node script.js             # 等效：运行已解析版本的 Node.js 脚本
vp node -e "console.log(1+1)" # 等效：传递任意 node 标志或参数
```

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
