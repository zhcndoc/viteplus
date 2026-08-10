# vp_build_cache_disabled

## `vp run app#build`

首次构建


## `vpt list-dir packages/app/dist`

应包含构建输出

```
assets
index.html
```

## `vp run app#build`

缓存已禁用，未命中缓存

```
~/packages/app$ vp build ⊘ 缓存已禁用
✓ 已转换 4 个模块。
正在计算 gzip 大小...
dist/index.html                <size> kB │ gzip: <size> kB
dist/assets/index-<hash>.js  <size> kB │ gzip: <size> kB

✓ 已在 <duration> 内构建完成
```

## `vp run app#build`

应显示缓存已禁用

```
~/packages/app$ vp build ⊘ 缓存已禁用
✓ 已转换 4 个模块。
正在计算 gzip 大小...
dist/index.html                <size> kB │ gzip: <size> kB
dist/assets/index-<hash>.js  <size> kB │ gzip: <size> kB

✓ 已构建，耗时 <duration>
```
