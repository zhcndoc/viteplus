# shim_inherits_parent_engines_node

## `vp env exec node -v`

根目录：直接使用 engines.node

```
<版本>
```

## `cd packages/app && vp env exec node -v`

子包：继承父包的 engines.node

```
<version>
```

## `vpt stat-file packages/app/.node-version --assert-not file`

验证子包中未创建 .node-version 文件

```
packages/app/.node-version: missing
```
