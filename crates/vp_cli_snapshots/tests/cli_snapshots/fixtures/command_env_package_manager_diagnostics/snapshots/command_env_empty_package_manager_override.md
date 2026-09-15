# command_env_empty_package_manager_override

## `VP_PACKAGE_MANAGER=    vp env current pm --json`

空的软件包管理器环境覆盖会回退到项目解析

```
{
  "package_manager": {
    "name": "npm",
    "version": "<version>",
    "source": "packageManager",
    "source_path": "<workspace>/package.json",
    "project_root": "<workspace>",
    "bin_paths": {
      "npm": "<home>/.vite-plus/package_manager/npm/<version>/npm/bin/npm",
      "npx": "<home>/.vite-plus/package_manager/npm/<version>/npm/bin/npx"
    },
    "installed": false,
    "mode": "managed"
  }
}
```
