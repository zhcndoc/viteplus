# config_only_root_build

回归测试：通过 vite.config.ts（build.lib，没有
index.html）构建的工作区根目录是有效目标。直接运行 vp build 必须在
根目录中执行构建，而不是选择成员，即使存在成员也是如此。

## `vp build`

```
✓ 已转换 2 个模块。
正在计算 gzip 大小……
dist/index.js  <大小> kB │ gzip：<大小> kB

✓ 已在 <耗时> 内构建完成
```
