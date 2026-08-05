# default_package_ts_wrapper

回归问题：通过 TypeScript 包装器（`satisfies UserConfig`、`as const`）声明的 defaultPackage 仍然是静态字符串字面量，必须予以遵循。vp 构建的是 ./frontend，而不是包装器根目录。

## `cd ts_wrapper && vp build`

```
提示：vp build：使用 ./frontend（vite.config.ts 中的 defaultPackage）
✓ 已转换 2 个模块。
正在计算 gzip 大小……
dist/index.html  <大小> kB │ gzip：<大小> kB

✓ 已在 <时长> 内构建完成
```
