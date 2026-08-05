# pack_in_place

针对 vp-config 端到端形态的回归保护：一个仅包含设置（catalogs、minimumReleaseAge）的
pnpm-workspace.yaml 的单一软件包，是一个唯一可运行候选项为自身的工作区根目录。
直接执行 vp pack 必须在当前目录中运行，无论是否为 TTY，都绝不能打印目标列表。

## `vp pack`

```
ℹ 入口：src/index.ts
ℹ 开始构建
ℹ dist/index.mjs  <大小> kB │ gzip：<大小> kB
ℹ 1 个文件，总计：<大小> kB
✔ 构建完成，用时 <时长>
```
