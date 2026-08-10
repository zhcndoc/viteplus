# shim_继承_父级_开发_引擎_运行时

## `vp env exec node -v`

根：直接使用 devEngines.runtime

```
<version>
```

## `cd packages/app && vp env exec node -v`

子包：继承父级 devEngines.runtime

```
<version>
```

## `vpt stat-file packages/app/.node-version --assert-not file`

验证子包中未创建 .node-version

```
packages/app/.node-version: missing
```
