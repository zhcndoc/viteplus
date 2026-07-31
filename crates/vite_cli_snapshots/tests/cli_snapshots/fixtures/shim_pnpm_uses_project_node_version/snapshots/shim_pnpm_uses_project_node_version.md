# shim_pnpm_使用项目的 Node 版本

## `vp install -g pnpm`

确保全局安装 pnpm


## `vp env exec node -v`

从 .node-version 解析的 Node 版本

```
<version>
```

## `vp env exec pnpm exec node -v`

pnpm 应使用项目相同的 Node 版本

```
<version>
```
