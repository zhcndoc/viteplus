# default_package_per_command

对象形式会在工作区根目录下分别映射各个命令：`vp build`
针对 ./apps/web，而 `vp pack` 针对 ./packages/ui，因此一个单体仓库
可以开发应用并打包库（rfcs/cwd-flag.md）。

## `cd per_command && vp build`

```
VITE+ - Web 的统一工具链

注意：vp build：正在使用 ./apps/web（vite.config.ts 中的 defaultPackage）
✓ 已转换 2 个模块。
正在计算 gzip 大小...
dist/index.html  <size> kB │ gzip：<size> kB

✓ 构建完成，用时 <duration>
```

## `cd per_command && vp pack`

```
VITE+ - The Unified Toolchain for the Web

note: vp pack: using ./packages/ui (defaultPackage in vite.config.ts)
ℹ entry: src/index.ts
ℹ Build start
ℹ dist/index.mjs  <size> kB │ gzip: <size> kB
ℹ 1 files, total: <size> kB
✔ Build complete in <duration>
```
