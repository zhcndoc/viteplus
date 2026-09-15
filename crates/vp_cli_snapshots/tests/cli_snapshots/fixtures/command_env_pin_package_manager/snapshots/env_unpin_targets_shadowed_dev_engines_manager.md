# env_unpin_targets_shadowed_dev_engines_manager

## `vpt write-file package.json '{"name":"command-env-pin-package-manager","private":true,"packageManager":"pnpm@10.18.0","devEngines":{"packageManager":{"name":"yarn","version":"4.12.0","onFail":"download"}}}
'`


## `vp env unpin pm --target dev-engines`

显式目标会移除 devEngines 管理器，即使 packageManager 覆盖了它

```
VITE+ - The Unified Toolchain for the Web

✓ Removed package-manager pin
```

## `vpt print-file package.json`

生效的顶层 packageManager 保持不变

```
{
  "name": "command-env-pin-package-manager",
  "private": true,
  "packageManager": "pnpm@10.18.0",
  "devEngines": {}
}
```
