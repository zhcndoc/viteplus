# env_use_warns_when_package_manager_differs

## `vp env use yarn@4.12.0 --no-install`

显式指定的项目管理器在使用不同的会话管理器之前发出警告

```
warn: Current environment resolves to pnpm from packageManager, but yarn was requested.
export VP_YARN_VERSION=4.12.0
Using yarn <version> (resolved from 4.12.0)
```
