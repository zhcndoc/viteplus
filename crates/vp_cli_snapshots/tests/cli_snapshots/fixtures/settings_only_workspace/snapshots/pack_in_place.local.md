# pack_in_place

针对 vp-config 端到端形态的回归保护：一个仅包含设置项（catalogs、minimumReleaseAge）的
pnpm-workspace.yaml 的单个软件包，是一个唯一可运行候选项为其自身的工作区根目录。
无论是否在 TTY 中，直接运行 vp pack 都必须在原地执行，且绝不能打印目标列表。

## `vp pack`

```
ℹ 入口：src/index.ts
ℹ 开始构建
ℹ dist/index.mjs  <大小> kB │ gzip：<大小> kB
ℹ 1 个文件，总计：<大小> kB
✔ 构建完成，用时 <时长>
```
