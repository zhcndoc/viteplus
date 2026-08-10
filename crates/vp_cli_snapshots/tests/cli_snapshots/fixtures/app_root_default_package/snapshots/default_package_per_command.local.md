# default_package_per_command

对象形式会在工作区根目录下分别映射各个命令：`vp build`
针对 ./apps/web，而 `vp pack` 针对 ./packages/ui，因此一个单体仓库
可以开发应用并打包库（rfcs/cwd-flag.md）。

## `cd per_command && vp build`

```
note: vp build: using ./apps/web (defaultPackage in vite.config.ts)
✓ 2 modules transformed.
computing gzip size...
dist/index.html  <size> kB │ gzip: <size> kB

✓ built in <duration>
```

## `cd per_command && vp pack`

```
note: vp pack: using ./packages/ui (defaultPackage in vite.config.ts)
ℹ entry: src/index.ts
ℹ Build start
ℹ dist/index.mjs  <size> kB │ gzip: <size> kB
ℹ 1 files, total: <size> kB
✔ Build complete in <duration>
```
