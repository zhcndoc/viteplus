# vite_plus_import_resolves

锁定 fixture 模块契约：配置中导入裸 `vite-plus`
会通过运行器提供的 run-root node_modules 进行解析，而 fixture 本身不需要
内置任何依赖。

## `vp run hello`

```
$ vpt print config-loaded
config-loaded
```
