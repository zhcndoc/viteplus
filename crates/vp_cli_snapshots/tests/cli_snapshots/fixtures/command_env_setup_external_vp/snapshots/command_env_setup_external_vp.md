# command_env_setup_external_vp

## `vpt mkdir -p external home`

准备隔离的外部安装和 VP_HOME


## `vpt cp $VP_HOME/bin/vp external/vp`

在 VP_HOME 外部模拟 Homebrew 风格的 vp


## `vpt chmod +x external/vp`


## `vpt write-file .node-version '22.18.0
'`

项目 Node.js 版本


## `vpt write-file home/js_runtime/node/22.18.0/bin/node '#'\!'/bin/sh
echo vp-managed-node-22.18.0
'`

预安装受管理的 Node 运行时


## `vpt chmod +x home/js_runtime/node/22.18.0/bin/node`


## `VP_HOME=${workspace}/home ./external/vp env setup`

从 external vp 设置垫片


## `node assert-shims.mjs`

Shims 应指向外部 vp，而不是 VP_HOME/current/bin/vp

```
all shims point to external vp
```

## `VP_HOME=${workspace}/home PATH=${workspace}/home/bin:${PATH} node -v`

node shim 使用项目版本

```
vp-managed-node-22.18.0
```
