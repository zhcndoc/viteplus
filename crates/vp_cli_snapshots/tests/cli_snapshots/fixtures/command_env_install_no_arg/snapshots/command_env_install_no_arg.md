# command_env_install_no_arg

## `vp env install`

安装 .node-version 中的版本（22.x）

```
VITE+ - 面向 Web 的统一工具链

正在安装 Node.js <version>...
已安装 Node.js <version>
```

## `vp env use 22 --no-install`


## `vp env install`

隐式安装会识别活动的会话覆盖

```
VITE+ - The Unified Toolchain for the Web

Installing Node.js <version>...
Installed Node.js <version>
Note: Installed from session override.
Run `vp env use --unset` to revert to project version resolution.
```

## `vp env uninstall 22`

Node.js 卸载支持与安装相同的主版本选择器

```
VITE+ - The Unified Toolchain for the Web

Uninstalled Node.js <version>
```
