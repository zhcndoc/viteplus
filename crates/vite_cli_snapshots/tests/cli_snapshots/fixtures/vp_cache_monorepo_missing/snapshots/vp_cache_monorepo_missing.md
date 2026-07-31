# vp_cache_monorepo_missing

## `vp run --cache ready`

首次运行


## `vp run --cache ready`

第二次运行应该全部命中缓存

```
~/packages/lib$ vp pack ◉ cache hit, replaying
ℹ entry: src/index.ts
ℹ Build start
ℹ dist/index.mjs  <size> kB │ gzip: <size> kB
ℹ 1 files, total: <size> kB
✔ Build complete in <duration>

---
vp run: cache hit, <duration> saved.
```
