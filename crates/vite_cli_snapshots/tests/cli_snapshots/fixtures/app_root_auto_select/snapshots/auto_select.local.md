# auto_select

当只有一个可能运行的包时，交互式终端中的不带参数应用命令会自动选择该包，打印 Selected/Tip 教学提示行，并在其中运行（rfcs/cwd-flag.md）。这一仅限 TTY 的分支在旧版 snap 运行器中无法测试。

## `vp build`

```
Selected package: web (apps/web)
Tip: run this directly with `vp -C apps/web build`
✓ 2 modules transformed.
computing gzip size...
dist/index.html  <size> kB │ gzip: <size> kB

✓ built in <duration>
```
