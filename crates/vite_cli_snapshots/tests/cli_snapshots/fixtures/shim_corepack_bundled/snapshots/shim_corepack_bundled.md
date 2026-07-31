# shim_corepack_内置版

## `vp remove -g corepack`

从残留的受管理 corepack 中隔离出来，以免其优先于捆绑的版本

**退出代码：** 1

```
Failed to uninstall corepack: Package corepack is not installed
```

## `vpt write-file .node-version '20.18.0
'`

固定项目的 Node.js 版本


## `vp env exec node --version`

请先确保已安装 Node.js

```
<version>
```

## `corepack --version`

corepack shim 运行 Node 捆绑的 corepack

```
0.29.3
```
