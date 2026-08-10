# command_pack_external

## `vp pack --deps.never-bundle node:path src/index.ts`

应使用 deps.never-bundle 标志进行打包

```
ℹ entry: src/index.ts
ℹ Build start
ℹ dist/index.mjs  <size> kB │ gzip: <size> kB
ℹ 1 files, total: <size> kB
✔ Build complete in <duration>
```

## `vp pack --external node:path src/index.ts`

应使用旧版 external 标志进行打包

```
ℹ 入口：src/index.ts
警告：`external` 已弃用。请改用 `deps.neverBundle`。
ℹ 开始构建
ℹ 清理 <n> 个文件
ℹ dist/index.mjs  <size> kB │ gzip：<size> kB
ℹ 共 1 个文件，总计：<size> kB
✔ 在 <duration> 内完成构建
```
