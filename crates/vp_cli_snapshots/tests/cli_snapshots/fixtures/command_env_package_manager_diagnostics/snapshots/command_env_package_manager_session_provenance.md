# command_env_package_manager_session_provenance

## `vp env use npm@10.9.4 --no-install`


## `vpt write-file $VP_HOME/package_manager/npm/10.9.4/npm/bin/npm '#'\!'/bin/sh
'`


## `vpt chmod +x $VP_HOME/package_manager/npm/10.9.4/npm/bin/npm`


## `vp env current npm --json`

current 报告包管理器会话文件路径

```
{
  "package_manager": {
    "name": "npm",
    "version": "<version>",
    "source": ".session-npm-version",
    "source_path": "<home>/.vite-plus/.session-npm-version",
    "bin_paths": {
      "npm": "<home>/.vite-plus/package_manager/npm/<version>/npm/bin/npm",
      "npx": "<home>/.vite-plus/package_manager/npm/<version>/npm/bin/npx"
    },
    "installed": false,
    "mode": "managed"
  }
}
```

## `vp env which npm`

which 将包管理器会话文件报告为其来源

```
VITE+ - The Unified Toolchain for the Web

<home>/.vite-plus/package_manager/npm/<version>/npm/bin/npm
  Package:    npm@10.9.4
  Source:     <home>/.vite-plus/.session-npm-version
```
