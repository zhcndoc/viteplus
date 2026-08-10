# vite_alias_resolves

导入裸 `vite` 的配置也会被解析：运行器会将其别名到核心包，这与迁移项目中的 vite -> core 覆盖一致。

## `vp run hello`

```
$ vpt print vite-config-loaded
vite-config-loaded
```
