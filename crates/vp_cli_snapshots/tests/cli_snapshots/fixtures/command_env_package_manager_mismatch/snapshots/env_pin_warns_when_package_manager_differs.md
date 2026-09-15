# env_pin_warns_when_package_manager_differs

## `vp env pin yarn@4.12.0 --no-install --force`

指定的项目管理器与当前固定的管理器不同时会发出警告

```
VITE+ - The Unified Toolchain for the Web

warn: Current environment resolves to pnpm from packageManager, but yarn was requested.
✓ Pinned package manager to yarn@4.12.0
note: Package manager will be downloaded on first use.
```
