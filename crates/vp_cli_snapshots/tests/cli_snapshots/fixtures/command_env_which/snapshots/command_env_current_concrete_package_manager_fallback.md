# command_env_current_concrete_package_manager_fallback

即使不存在项目、会话或默认选择，命名系列也具有有效的注册表回退

## `vp env current pnpm --json`

具体系列报告与其 shim 相同的注册表回退

```
{
  "package_manager": {
    "name": "pnpm",
    "version": "<version>",
    "source": "registry fallback",
    "bin_paths": {
      "pnpm": "<home>/.vite-plus/package_manager/pnpm/<version>/pnpm/bin/pnpm",
      "pnpx": "<home>/.vite-plus/package_manager/pnpm/<version>/pnpm/bin/pnpx"
    },
    "installed": false,
    "mode": "managed"
  }
}
```
