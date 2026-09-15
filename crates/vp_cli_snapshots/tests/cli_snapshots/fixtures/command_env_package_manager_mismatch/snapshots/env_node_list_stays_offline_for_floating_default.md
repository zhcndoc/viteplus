# env_node_list_stays_offline_for_floating_default

本地 Node.js 清单不得仅为了标记浮动默认版本而要求访问镜像。

## `vpt write-file $VP_HOME/js_runtime/node/20.18.0/bin/node '#'\!'/bin/sh
'`


## `vpt write-file $VP_HOME/config.json '{"defaultNodeVersion":"latest"}
'`


## `VP_NODE_DIST_MIRROR=http://127.0.0.1:9 vp env list node --json`

当浮动默认版本无法访问其镜像时，本地 Node.js 列表仍然可用

```
{
  "node": [
    {
      "version": "20.18.0",
      "current": false,
      "default": false
    }
  ]
}
```
