# env_use_clears_stale_package_manager_override

## `VP_SHELL=bash vp env use --no-install`

激活未选择包管理器的项目会清除之前的覆盖设置

```
export VP_NODE_VERSION=20.18.0
unset VP_NPM_VERSION
unset VP_PNPM_VERSION
unset VP_YARN_VERSION
unset VP_BUN_VERSION
Using Node.js <version> (resolved from .node-version)
```
