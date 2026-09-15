# positional_is_vite_root

位置参数 Vite 根目录表示明确的命令意图。Vite+ 会转发该参数，并且不会启动目标选择。

## `vp build apps/web`

```
note: You are running `vp build` as a Vite+ built-in command. If you meant to run the build npm script, use `vpr build` instead.
✓ 2 modules transformed.
computing gzip size...
apps/web/dist/index.html  <size> kB │ gzip: <size> kB

✓ built in <duration>
```
