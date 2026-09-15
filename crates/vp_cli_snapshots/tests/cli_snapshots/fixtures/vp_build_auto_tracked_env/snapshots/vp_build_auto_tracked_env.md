# vp_build_auto_tracked_env

## `VITE_GREETING=hello vp run build`

首次构建

```
$ vp build
transforming...
✓ 4 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                <size》 kB │ gzip: <size》 kB
dist/assets/index-<<hash>>.js  <size》 kB │ gzip: <size》 kB

✓ built in <duration》
```

## `VITE_GREETING=hello vp run build`

相同环境，缓存命中

```
$ vp build ◉ cache hit, replaying
transforming...
✓ 4 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                <size》 kB │ gzip: <size》 kB
dist/assets/index-<<hash>>.js  <size》 kB │ gzip: <size》 kB

✓ built in <duration》

---
vp run: cache hit, <duration》 saved.
```

## `VITE_GREETING=world vp run build`

VITE_ 环境变量已更改，缓存未命中（通过 vite-task-client 跟踪）

```
$ vp build ○ cache miss: env 'VITE_GREETING' changed, executing
transforming...
✓ 4 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                <size》 kB │ gzip: <size》 kB
dist/assets/index-<<hash>>.js  <size》 kB │ gzip: <size》 kB

✓ 构建完成，用时 <持续时间》
```
