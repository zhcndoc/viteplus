# env_clean_preserves_concrete_package_manager_fallback

系统优先更改调度偏好，而不是缓存所有权；clean 必须保留在没有可用系统管理器时使用的受管理回退

## `node prepare-pnpm-versions.cjs`


## `vp env off pnpm`


## `vp env clean pnpm`

清理会移除过时的安装，但即使在系统优先模式下，也会保留具体系列的受管理回退

```
VITE+ - The Unified Toolchain for the Web

✓ Removed 1 package manager install
```

## `node assert-one-pnpm-version.cjs`

缓存的注册表回退仍然可用

```
kept one concrete pnpm fallback
```
