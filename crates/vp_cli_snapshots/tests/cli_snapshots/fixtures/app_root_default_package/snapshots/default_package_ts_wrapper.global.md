# default_package_ts_wrapper

回归问题：通过 TypeScript 包装器（`satisfies UserConfig`、`as const`）声明的 defaultPackage 仍然是静态字符串字面量，必须予以遵循。vp 构建的是 ./frontend，而不是包装器根目录。

## `cd ts_wrapper && vp build`

```
VITE+ - Web 的统一工具链

注意：vp build：使用 ./frontend（vite.config.ts 中的 defaultPackage）
✓ 已转换 2 个模块。
正在计算 gzip 大小...
dist/index.html  <size> kB │ gzip：<size> kB

✓ 已在 <duration> 内完成构建
```
