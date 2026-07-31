# 命令环境安装冲突

## `vp install -g ./conflict-pkg`

安装具有冲突二进制名称的软件包（使用当前工作目录中的版本）

```
VITE+ - Web 的统一工具链

info: 正在使用 Node.js <version> 安装 1 个全局软件包
warn: 软件包 'conflict-pkg' 提供了 'node' 二进制文件，但它与内置 shim 冲突。正在跳过。
✓ 已安装 conflict-pkg 1.0.0
  二进制文件：conflict-cli
```

## `vp remove -g conflict-pkg`

清理

```
已卸载 conflict-pkg
```

## `vp install -g --node 20 ./conflict-pkg`

使用指定的 Node.js 版本安装

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

info: Installing 1 global package with Node.js <version>
error: Failed to install conflict-pkg: Package was not installed correctly, package.json not found at <home>/.vite-plus/packages/conflict-pkg#<uuid>/lib/node_modules/conflict-pkg/package.json
```

## `vp remove -g conflict-pkg`

清理

**退出代码：** 1

```
Failed to uninstall conflict-pkg: Package conflict-pkg is not installed
```
