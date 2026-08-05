# pack_in_place

vp pack 使用相同的保护机制：独立库通过 tsdown 的默认入口就地打包。

## `vp pack`

```
VITE+ - Web 的统一工具链

ℹ 入口：src/index.ts
ℹ 开始构建
ℹ dist/index.mjs  <size> kB │ gzip：<size> kB
ℹ 共 1 个文件，总计：<size> kB
✔ 构建在 <duration> 内完成
```

## `vpt list-dir dist`

输出会直接写入仓库本身

```
index.mjs
```
