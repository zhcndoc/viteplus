# 合成构建缓存已禁用

## `vp run build`

合成构建（vp build）在没有 cacheScripts 时应禁用缓存

```
$ vp build ⊘ cache disabled
✓ 4 modules transformed.
computing gzip size...
dist/index.html                <size> kB │ gzip: <size> kB
dist/assets/index-<hash>.js  <size> kB │ gzip: <size> kB

✓ built in <duration>
```
