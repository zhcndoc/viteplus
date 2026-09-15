# env_unpin_package_manager_target_preserves_dev_engines

## `vpt write-file package.json '{"name":"command-env-pin-package-manager","private":true,"devEngines":{"packageManager":{"name":"pnpm","version":"10.18.0","onFail":"download"}}}
'`


## `vp env unpin pm --target package-manager`

显式的顶层目标不会移除仅存在于 devEngines 中的包管理器固定版本

```
VITE+ - The Unified Toolchain for the Web

No package manager pin found in current directory.
```

## `vpt print-file package.json`

devEngines 中的包管理器固定版本保持不变

```
{"name":"command-env-pin-package-manager","private":true,"devEngines":{"packageManager":{"name":"pnpm","version":"<version>","onFail":"download"}}}
```
