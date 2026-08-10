# positional_is_vite_root

位置路径会以 [根目录]（上游语义）的形式传递给 Vite，而不会被视为需要询问的包：在工作区根目录执行 vp build <dir> 会跳过选择器/列表，并将该目录作为 Vite 根目录进行构建，不会输出任何 Selected/Tip 询问行（rfcs/cwd-flag.md）。

## `vp build apps/web`

```
note: You are running `vp build` as a Vite+ built-in command. If you meant to run the build npm script, use `vpr build` instead.
note: `vp build apps/web` sets Vite's root without changing the working directory. To run as if started there, use `vp -C apps/web build`.
✓ 2 modules transformed.
computing gzip size...
apps/web/dist/index.html  <size> kB │ gzip: <size> kB

✓ built in <duration>
```
