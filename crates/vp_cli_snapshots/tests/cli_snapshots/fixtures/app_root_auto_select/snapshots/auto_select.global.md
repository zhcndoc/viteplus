# auto_select

当恰好只有一个可能运行的包时，交互式终端中的裸应用命令会自动选择该包，打印 Selected/Tip 教学提示行，并在该包中运行（rfcs/cwd-flag.md）。这一仅限 TTY 的分支在旧版 snap 运行器中无法测试。

## `vp build`

```
VITE+ - Web 的统一工具链

已选择软件包：web（apps/web）
提示：运行 `vp -C apps/web build` 可直接执行此操作
✓ 已转换 2 个模块。
正在计算 gzip 大小...
dist/index.html  <size> kB │ gzip：<size> kB

✓ 构建完成，用时 <duration>
```
