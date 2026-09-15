# command_env_package_manager_modes

## `vp env off pnpm`

仅将 pnpm 切换为系统优先模式

```
VITE+ - The Unified Toolchain for the Web

✓ pnpm management set to system-first.

Selected commands and shims will now prefer system tools, falling back to managed tools.

Run `vp env on` to always use Vite+ managed tools.
```

## `VP_PNPM_VERSION=10.18.0 VP_BYPASS=${PATH} vp env current pnpm --json`

pnpm 使用其独立模式

```
{
  "package_manager": {
    "name": "pnpm",
    "version": "<version>",
    "source": "VP_PNPM_VERSION",
    "bin_paths": {
      "pnpm": "<home>/.vite-plus/package_manager/pnpm/<version>/pnpm/bin/pnpm",
      "pnpx": "<home>/.vite-plus/package_manager/pnpm/<version>/pnpm/bin/pnpx"
    },
    "installed": false,
    "mode": "system_first"
  }
}
```

## `VP_BUN_VERSION=1.2.3 vp env current bun --json`

bun 保持共享的托管模式

```
{
  "package_manager": {
    "name": "bun",
    "version": "<version>",
    "source": "VP_BUN_VERSION",
    "bin_paths": {
      "bun": "<home>/.vite-plus/package_manager/bun/<version>/bun/bin/bun",
      "bunx": "<home>/.vite-plus/package_manager/bun/<version>/bun/bin/bunx"
    },
    "installed": false,
    "mode": "managed"
  }
}
```

## `vp env on pnpm`

仅将 pnpm 恢复为托管模式

```
VITE+ - The Unified Toolchain for the Web

✓ pnpm management set to managed.

Selected commands and shims will now use Vite+ managed tools.

Run `vp env off` to prefer system tools instead.
```

## `VP_PNPM_VERSION=10.18.0 vp env current pnpm --json`

pnpm 恢复为共享的托管模式

```
{
  "package_manager": {
    "name": "pnpm",
    "version": "<version>",
    "source": "VP_PNPM_VERSION",
    "bin_paths": {
      "pnpm": "<home>/.vite-plus/package_manager/pnpm/<version>/pnpm/bin/pnpm",
      "pnpx": "<home>/.vite-plus/package_manager/pnpm/<version>/pnpm/bin/pnpx"
    },
    "installed": false,
    "mode": "managed"
  }
}
```
