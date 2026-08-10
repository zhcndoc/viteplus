# shim_inherits_parent_node_version

## `vp env exec node -v`

根目录：直接使用 `.node-version`

```
<version>
```

## `cd packages/app && vp env exec node -v`

子包：继承父级 `.node-version`

```
<version>
```

## `vpt stat-file packages/app/.node-version --assert-not file`

验证子包中未创建 `.node-version`

```
packages/app/.node-version: missing
```
