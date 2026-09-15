# command_env_install_standalone_npm_fallback

显式 npm 作用域使用独立 registry npm；只有直接调用的 npm shim 保留 Node.js 内置的 npm fallback。

## `vp env use npm --no-install`

显式 npm 作用域导出独立 npm fallback

```
export VP_NPM_VERSION=12.0.2
Using npm <version> (resolved from registry fallback)
```

## `vp env install npm`

显式 npm 作用域安装独立 registry fallback

```
VITE+ - The Unified Toolchain for the Web

Installing npm <version>...
Installed npm <version>
```

## `vp env current npm --json`

已安装独立 npm fallback

```
{
  "package_manager": {
    "name": "npm",
    "version": "<version>",
    "source": "registry fallback",
    "bin_paths": {
      "npm": "<home>/.vite-plus/package_manager/npm/<version>/npm/bin/npm",
      "npx": "<home>/.vite-plus/package_manager/npm/<version>/npm/bin/npx"
    },
    "installed": true,
    "mode": "managed"
  }
}
```

## `vpt stat-file $VP_HOME/js_runtime/node --assert missing`

安装独立 npm 不会安装 Node.js

```
<home>/.vite-plus/js_runtime/node: missing
```
