# command_pack_css

## `vp pack src/index.ts --minify`

通过内置的 @tsdown/css + lightningcss 打包 CSS（问题 #1586）

```
ℹ entry: src/index.ts
ℹ Build start
ℹ dist/index.mjs  <size> kB │ gzip: <size> kB
ℹ dist/style.css  <size> kB │ gzip: <size> kB
ℹ 2 files, total: <size> kB
✔ Build complete in <duration>
```

## `vpt print-file dist/style.css`

lightningcss 优化后的输出证明 @tsdown/css 已运行

```
.foo {
  color: red;
}

.bar {
  margin: 0;
}
```
