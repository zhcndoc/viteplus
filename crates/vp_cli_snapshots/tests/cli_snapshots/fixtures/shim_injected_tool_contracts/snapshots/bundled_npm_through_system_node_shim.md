# bundled_npm_through_system_node_shim

## `vpt write-file .node-version 20.18.0`


## `vp env exec --node 22.18.0 node assert-system-node-shim.cjs setup`


## `vp env off node`


## `vp env on npm`


## `PATH=${VP_HOME}/bin${PATH_SEPARATOR}${workspace}/system-shims${PATH_SEPARATOR}/usr/bin${PATH_SEPARATOR}/bin ./system-shims/node assert-system-node-shim.cjs`

直接启动外部 Node shim，使 npm/npx 通过 vp 解析，而不会继承 VP_BYPASS

```
Bundled npm/npx use the runtime behind the system Node shim
```

## `PATH=${VP_HOME}/bin${PATH_SEPARATOR}${workspace}/system-shims${PATH_SEPARATOR}/usr/bin${PATH_SEPARATOR}/bin ./system-shims/node assert-system-node-shim.cjs preload`

Preload 输出不会破坏 runtime probe，并且 npm/npx 及其 Node 子进程仍会执行 preload

```
Bundled npm/npx use the runtime behind the system Node shim
```
