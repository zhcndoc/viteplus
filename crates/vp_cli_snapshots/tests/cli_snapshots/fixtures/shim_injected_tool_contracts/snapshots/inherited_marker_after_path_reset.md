# inherited_marker_after_path_reset

## `vp env exec --node 22.18.0 node assert-inherited-path.cjs reset`

子进程移除注入的 Node 目录后，保留的标记必须允许正常解析

```
Node selection survives reset PATH
```
