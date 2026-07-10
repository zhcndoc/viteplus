# 构建 vite 环境

## `VITE_MY_VAR=1 vp run build`

```
$ vp build
vite <version> 正在为生产环境构建客户端环境...
transforming...✓ 4 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                <size> kB │ gzip: <size> kB
dist/assets/index-<hash>.js  <size> kB │ gzip: <size> kB

✓ built in <duration>
```

## `VITE_MY_VAR=1 vp run build`

应命中缓存

```
$ vp build ◉ 缓存命中，正在回放
vite <version> building client environment for production...
transforming...✓ 4 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                <size> kB │ gzip: <size> kB
dist/assets/index-<hash>.js  <size> kB │ gzip: <size> kB

✓ built in <duration>

---
vp run: 缓存命中，节省了 <duration>。
```

## `VITE_MY_VAR=2 vp run build`

环境已更改，应当未命中缓存

```
$ vp build ○ cache miss: env 'VITE_MY_VAR' changed, executing
vite <version> building client environment for production...
transforming...✓ 4 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                <size> kB │ gzip: <size> kB
dist/assets/index-<hash>.js  <size> kB │ gzip: <size> kB

✓ built in <duration>
```
