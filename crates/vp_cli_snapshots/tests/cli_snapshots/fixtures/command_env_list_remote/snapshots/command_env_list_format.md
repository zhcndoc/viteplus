# command_env_list_format

## `vpt mkdir -p $VP_HOME/js_runtime/node/22.11.0`


## `vpt write-file $VP_HOME/package_manager/pnpm/10.18.0/pnpm/bin/pnpm '#'\!'/bin/sh
'`


## `vpt write-file $VP_HOME/package_manager/pnpm/10.18.0/pnpm/bin/pnpx '#'\!'/bin/sh
'`


## `vp env default 22.11.0 pnpm@10.18.0`


## `vp env list node`

已安装的 Node.js 版本保留其交互式格式

```
VITE+ - The Unified Toolchain for the Web

Node.js
  \x1b[94m* <version> \x1b[2mcurrent default

\x1b[2mnote: Run `vp env clean` to free disk space from unused managed runtimes and package manager caches.
```

## `vp env list pnpm`

已安装的 package-manager 版本使用相同的交互式格式

```
VITE+ - The Unified Toolchain for the Web

pnpm
  \x1b[94m* 10.18.0 \x1b[2mcurrent default

\x1b[2mnote: Run `vp env clean` to free disk space from unused managed runtimes and package manager caches.
```
