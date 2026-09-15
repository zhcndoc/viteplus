# command_install_invalid_package_json

## `vpt write-file .node-version 22.18.0`


## `vpt write-file package.json not-json`


## `vp install`

应指出解析失败的 package.json

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: Failed to download Node.js runtime: Failed to parse <workspace>/package.json: expected ident at line 1 column 2
```
