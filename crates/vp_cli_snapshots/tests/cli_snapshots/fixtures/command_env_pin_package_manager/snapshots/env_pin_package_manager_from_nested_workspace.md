# env_pin_package_manager_from_nested_workspace

## `vp env pin yarn@4.12.0 --no-install --force`

嵌套工作区固定会更新解析器所拥有的根清单

```
VITE+ - The Unified Toolchain for the Web

warn: Current environment resolves to npm from devEngines.packageManager, but yarn was requested.
✓ Pinned package manager to yarn@4.12.0
note: Package manager will be downloaded on first use.
```

## `vp env current pm --json`

嵌套项目解析到新的根固定版本

```
{
  "package_manager": {
    "name": "yarn",
    "version": "<version>",
    "source": "devEngines.packageManager",
    "source_path": "<workspace>/package.json",
    "project_root": "<workspace>",
    "bin_paths": {
      "yarn": "<home>/.vite-plus/package_manager/yarn/<version>/yarn/bin/yarn",
      "yarnpkg": "<home>/.vite-plus/package_manager/yarn/<version>/yarn/bin/yarnpkg"
    },
    "installed": false,
    "mode": "managed"
  }
}
```

## `vpt print-file ../../package.json package.json`

只有工作区清单拥有包管理器固定

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
        "name": "yarn",
        "version": "<version>",
        "onFail": "download"
      },
      {
        "name": "npm",
        "version": "<version>",
        "onFail": "error"
      },
      {
        "name": "pnpm",
        "version": "<version>",
        "onFail": "download"
      }
    ]
  }
}
{
  "name": "app",
  "private": true
}
```
