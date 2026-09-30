# system_package_manager_uses_system_first_node

Node 和包管理器模式彼此独立：系统包管理器必须接收 Node 模式选定的 Node.js，而不强制进行 registry 解析。

## `vpt write-file package.json '{"name":"system-package-manager","private":true,"devEngines":{"packageManager":{"name":"pnpm","version":"^10.0.0"}}}`
`


## `vpt chmod +x system-dispatch-bin/node`


## `vpt chmod +x system-dispatch-bin/pnpm`


## `vpt chmod +x bin/pnpm`


## `vp env off node`


## `vp env off pnpm`


## `PATH=${VP_HOME}/bin${PATH_SEPARATOR}${workspace}/system-dispatch-bin${PATH_SEPARATOR}${PATH} NPM_CONFIG_REGISTRY=http://127.0.0.1:9 vp install`

系统优先包管理器可在离线状态下解析，并接收系统优先 Node 模式选定的 Node.js

```
VITE+ - The Unified Toolchain for the Web

system-node
```

## `PATH=${VP_HOME}/bin${PATH_SEPARATOR}${workspace}/system-dispatch-bin${PATH_SEPARATOR}${PATH} NPM_CONFIG_REGISTRY=http://127.0.0.1:9 vp env exec --node 20.18.0 pnpm --version`

显式 Node 执行会在解析其声明的版本范围之前检查系统管理器

```
10.18.0
```
