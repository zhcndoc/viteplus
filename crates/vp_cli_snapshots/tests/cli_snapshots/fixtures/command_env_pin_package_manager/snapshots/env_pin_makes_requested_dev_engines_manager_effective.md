# env_pin_makes_requested_dev_engines_manager_effective

## `vp env pin pnpm@10.18.0 --no-install --force`

固定一个已存在的较晚选项，使其成为第一个受支持的有效条目

```
VITE+ - The Unified Toolchain for the Web

warn: Current environment resolves to npm from devEngines.packageManager, but pnpm was requested.
✓ Pinned package manager to pnpm@10.18.0
note: Package manager will be downloaded on first use.
```

## `vp env current pm --json`

current 解析到新固定的管理器

```
{
  "package_manager": {
    "name": "pnpm",
    "version": "<version>",
    "source": "devEngines.packageManager",
    "source_path": "<workspace>/package.json",
    "project_root": "<workspace>",
    "bin_paths": {
      "pnpm": "<home>/.vite-plus/package_manager/pnpm/<version>/pnpm/bin/pnpm",
      "pnpx": "<home>/.vite-plus/package_manager/pnpm/<version>/pnpm/bin/pnpx"
    },
    "installed": false,
    "mode": "managed"
  }
}
```

## `vpt print-file package.json`

固定操作会保留同级选项及其策略

```
{
  "name": "command-env-pin-package-manager",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "devEngines": {
    "packageManager": [
      {
        "name": "pnpm",
        "version": "<version>",
        "onFail": "download"
      },
      {
        "name": "npm",
        "version": "<version>",
        "onFail": "error"
      }
    ]
  }
}
```
