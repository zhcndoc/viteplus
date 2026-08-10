# pack_default_entry

根目录下不带参数的 vp pack 会自动选择唯一可运行打包的包：其唯一信号是 tsdown 的默认 src/index.ts 入口。应用的 vite.config.ts 没有 pack 配置块，因此不被视为可运行打包（rfcs/cwd-flag.md，“The likely-runnable heuristic”）；随后 tsdown 在完全没有 pack 配置的情况下，通过其默认入口进行打包。

## `vp pack`

```
Selected package: lib (packages/lib)
Tip: run this directly with `vp -C packages/lib pack`
ℹ entry: src/index.ts
ℹ Build start
ℹ dist/index.mjs  <size> kB │ gzip: <size> kB
ℹ 1 files, total: <size> kB
✔ Build complete in <duration>
```

## `vpt list-dir packages/lib/dist`

输出会进入自动选择的库

```
index.mjs
```
