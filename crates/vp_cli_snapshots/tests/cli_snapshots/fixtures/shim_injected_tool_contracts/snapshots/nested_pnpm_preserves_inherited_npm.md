# nested_pnpm_preserves_inherited_npm

## `vpt write-file .node-version 22.18.0`


## `vpt json-edit package.json packageManager npm@10.5.0`


## `vp env on npm`


## `vp env on pnpm`


## `npx --version`


## `cd pnpm-child && pnpm --version`


## `npx --offline --call 'node assert-inherited-npm.cjs'`

子项目可以添加其固定版本的 pnpm，而不会替换父项目的 Node 或 npm/npx

```
Adding pnpm preserves inherited Node <version> and npm/npx 10.5.0
```
