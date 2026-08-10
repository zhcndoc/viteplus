# config_only_root_build

回归问题：通过 vite.config.ts（build.lib，没有
index.html）构建的工作区根目录是有效目标。即使存在成员，直接运行 vp build 也必须就地执行根目录构建，而不是列出成员。

## `vp build`

```
VITE+ - Web 的统一工具链

✓ 已转换 2 个模块。
正在计算 gzip 大小...
dist/index.js  <size> kB │ gzip: <size> kB

✓ 构建完成，用时 <duration>
```
