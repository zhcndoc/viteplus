# 构建 vite 环境

## `VITE_MY_VAR=1 vp run build`

```
$ vp build
transforming...
✓ 4 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                <size> kB │ gzip: <size> kB
dist/assets/index-<hash>.js  <size> kB │ gzip: <size> kB

✓ built in <duration>
```

## `VITE_MY_VAR=1 vp run build`

应命中缓存

```
$ vp build ◉ cache hit, replaying
transforming...
✓ 4 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                <size> kB │ gzip: <size> kB
dist/assets/index-<hash>.js  <size> kB │ gzip: <size> kB

✓ 构建完成，用时 <时长>

---
vp run：缓存命中，节省了 <时长>。
```

## `VITE_MY_VAR=2 vp run build`

环境已更改，应当未命中缓存

```
$ vp build ○ cache miss: env 'VITE_MY_VAR' changed, executing
transforming...
✓ 4 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                <size> kB │ gzip: <size> kB
dist/assets/index-<hash>.js  <size> kB │ gzip: <size> kB

✓ built in <duration>
```
