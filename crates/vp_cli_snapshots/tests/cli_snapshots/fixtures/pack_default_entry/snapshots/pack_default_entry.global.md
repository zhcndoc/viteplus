# pack_default_entry

根目录下直接执行 `vp pack` 会自动选择唯一可打包运行的包：其唯一信号是 tsdown 的默认 `src/index.ts` 入口。应用的
`vite.config.ts` 中没有 pack 配置块，因此不计为可打包运行
（rfcs/cwd-flag.md，“可能可运行的启发式判断”）；随后 tsdown 在完全没有 pack 配置的情况下，通过其默认入口进行打包。

## `vp pack`

```
VITE+ - Web 的统一工具链

已选择的包：lib (packages/lib)
提示：使用 `vp -C packages/lib pack` 直接运行
ℹ 入口：src/index.ts
ℹ 开始构建
ℹ dist/index.mjs  <size> kB │ gzip：<size> kB
ℹ 共 1 个文件，总计：<size> kB
✔ 构建在 <duration> 内完成
```

## `vpt list-dir packages/lib/dist`

输出会放入自动选择的库中

```
index.mjs
```
