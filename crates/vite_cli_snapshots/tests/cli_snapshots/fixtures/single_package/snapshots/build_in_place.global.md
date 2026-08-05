# build_in_place

回归保护：单包仓库（没有 workspaces 字段）永远不会进入目标获取流程。即使在交互式终端中，直接运行 vp build 也会在当前目录执行：没有选择器、没有 Selected 行、没有列表（rfcs/cwd-flag.md，解析顺序步骤“其他任何位置”）。

## `vp build`

```
VITE+ - The Unified Toolchain for the Web

✓ 2 modules transformed.
computing gzip size...
dist/index.html  <size> kB │ gzip: <size> kB

✓ built in <duration>
```
