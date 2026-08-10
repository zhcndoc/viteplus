# vite_define_config_without_run_stays_static

没有 `run` 块的 Vite 配置必须保持在静态提取路径上。
运行时求值会解析一个刻意未构建的导入，并在包脚本运行之前失败。

## `vp 运行 build`

```
$ vpt print package-build-ran ⊘ 已禁用缓存
package-build-ran
```
