# command_pack_no_config

## `vp pack --no-config src/index.ts`

应在不加载 vite.config.ts 的情况下完成构建

```
ℹ entry: src/index.ts
ℹ Build start
ℹ dist/index.mjs  <size> kB │ gzip: <size> kB
ℹ 1 files, total: <size> kB
✔ Build complete in <duration>
```

## `vpt stat-file dist/index.mjs --assert file`

应写入打包文件

```
dist/index.mjs: file
```
