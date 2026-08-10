# command_env_which

## `vp remove -g corepack`

**退出代码：** 1

```
卸载 corepack 失败：未安装 corepack 软件包
```

## `vp env exec node --version`

请先确保已安装 Node.js

```
<version>
```

## `vp env which node`

核心工具 - 显示解析后的 Node.js 二进制文件路径

```
VITE+ - The Unified Toolchain for the Web

<home>/.vite-plus/js_runtime/node/<version>/bin/node
  Version:    20.18.0
  Source:     <workspace>/.node-version
```

## `vp env which npm`

核心工具 - 显示解析后的 npm 二进制路径

```
VITE+ - Web 的统一工具链

<home>/.vite-plus/js_runtime/node/<version>/bin/npm
  版本:    20.18.0
  来源:     <workspace>/.node-version
```

## `vp env which npx`

核心工具 - 显示已解析的 npx 二进制文件路径

```
VITE+ - Web 的统一工具链

<home>/.vite-plus/js_runtime/node/<version>/bin/npx
  版本：      20.18.0
  来源：      <workspace>/.node-version
```

## `vp env which corepack`

核心工具 - 与解析后的 Node.js 捆绑的 corepack

```
VITE+ - Web 的统一工具链

<home>/.vite-plus/js_runtime/node/<version>/bin/corepack
  Version:    20.18.0
  Source:     <workspace>/.node-version
```

## `vp install -g cowsay@1.6.0`

通过 vp 安装全局软件包

```
VITE+ - Web 的统一工具链

信息：正在使用 Node.js <version> 安装 1 个全局软件包
✓ 已安装 cowsay 1.6.0
  可执行文件：cowsay、cowthink
```

## `vp env which cowsay`

全局软件包 - 显示带元数据的二进制文件路径

```
VITE+ - Web 统一工具链

<home>/.vite-plus/packages/cowsay/<uuid>/lib/node_modules/cowsay/./cli.js
  Package:    cowsay@1.6.0
  Binaries:   cowsay, cowthink
  Node:       <version>
  Installed:  <date>
```

## `vp remove -g cowsay`

清理

```
已卸载 cowsay
```

## `vp env which unknown-tool`

未知工具 - 错误消息

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: tool 'unknown-tool' not found
Not a core tool (node, npm, npx, corepack) or installed global package.
Run 'vp list -g' to see installed packages.
```
