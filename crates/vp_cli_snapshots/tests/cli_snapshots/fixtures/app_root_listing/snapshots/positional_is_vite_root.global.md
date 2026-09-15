# positional_is_vite_root

显式的 Vite root 是明确的命令意图。Vite+ 会转发它，并且不会启动目标选择

## `vp build apps/web`

```
VITE+ - 统一的 Web 工具链

note: You are running `vp build` as a Vite+ built-in command. If you meant to run the build npm script, use `vpr build` instead.
✓ 2 modules transformed.
computing gzip size...
apps/web/dist/index.html  <size> kB │ gzip: <size> kB

✓ 已在 <duration> 内构建完成
```
