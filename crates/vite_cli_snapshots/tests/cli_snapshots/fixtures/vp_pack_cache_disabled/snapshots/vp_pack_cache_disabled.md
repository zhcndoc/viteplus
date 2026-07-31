# vp_pack_cache_disabled

## `vp run hello#build`

首次构建


## `vpt list-dir packages/hello/dist`

应包含该库

```
index.cjs
```

## `vp run hello#build`

缓存已禁用，未命中缓存

```
~/packages/hello$ vp pack ⊘ cache disabled
ℹ entry: src/index.ts
ℹ Build start
ℹ Cleaning <n> files
ℹ dist/index.cjs  <size> kB │ gzip: <size> kB
ℹ 1 files, total: <size> kB
✔ Build complete in <duration>
```

## `vp run hello#build`

应显示缓存已禁用

```
~/packages/hello$ vp pack ⊘ 缓存已禁用
ℹ 入口：src/index.ts
ℹ 开始构建
ℹ 清理 <n> 个文件
ℹ dist/index.cjs  <size> kB │ gzip：<size> kB
ℹ 共 1 个文件，总计：<size> kB
✔ 构建在 <duration> 内完成
```
