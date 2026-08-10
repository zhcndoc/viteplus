# positional_is_vite_root

位置路径会以 [root]（上游语义）的形式转发给 Vite，而不会被视为需要询问的包：在工作区根目录执行 `vp build <dir>` 会跳过选择器/列表，并将该目录作为 Vite 根目录进行构建，不显示任何 Selected/Tip 询问行（rfcs/cwd-flag.md）。

## `vp build apps/web`

```
VITE+ - 统一的 Web 工具链

注意：您正在将 `vp build` 作为 Vite+ 内置命令运行。如果您想运行 build npm 脚本，请改用 `vpr build`。
注意：`vp build apps/web` 会设置 Vite 的根目录，但不会更改工作目录。若要像在该目录中启动一样运行，请使用 `vp -C apps/web build`。
✓ 已转换 2 个模块。
正在计算 gzip 大小...
apps/web/dist/index.html  <size> kB │ gzip：<size> kB

✓ 已在 <duration> 内构建完成
```
