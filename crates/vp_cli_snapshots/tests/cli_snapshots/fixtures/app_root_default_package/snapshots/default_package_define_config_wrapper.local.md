# default_package_define_config_wrapper

`defineConfig({ ... } satisfies UserConfig)` 内部的 `defaultPackage` 同样会生效：`defineConfig` 参数上的包装器也会被解包。

## `cd dc_wrapper && vp build`

```
提示：vp build：使用 ./frontend（vite.config.ts 中的 defaultPackage）
✓ 已转换 2 个模块。
正在计算 gzip 大小...
dist/index.html  <size> kB │ gzip：<size> kB

✓ 构建完成，耗时 <duration>
```
