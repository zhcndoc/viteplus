# nested_explicit_versions_replace_injected_tools

## `vp env on pnpm`


## `npx --offline --call 'pnpm exec vp env exec --node 22.18.0 --package-manager pnpm@10.18.0 node assert-injected-tools.cjs pnpm 10.18.0 22.18.0'`

显式版本会替换继承的运行时和包管理器


## `npx --offline --call 'pnpm exec vp env exec --node 22.18.0 --package-manager pnpm@10.18.0 node assert-injected-tools.cjs pnpm 10.18.0 22.18.0'`

重新进入 shim 会保留显式选择的版本

```
Injected pnpm resolves to 10.18.0 on Node <version>
```
