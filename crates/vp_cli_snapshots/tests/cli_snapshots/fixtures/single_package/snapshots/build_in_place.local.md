# 原地构建

回归保护：单包仓库（没有 workspaces 字段）永远不会进入目标选择流程。即使在交互式终端中，直接运行 vp build 也会原地执行：不会显示选择器、不会显示 Selected 行，也不会列出内容
（rfcs/cwd-flag.md，解析顺序中的“其他任何位置”步骤）。

## `vp build`

```
✓ 2 modules transformed.
computing gzip size...
dist/index.html  <size> kB │ gzip: <size> kB

✓ built in <duration>
```
