# picker_cancel

在包选择器中按 Ctrl+C 会以退出码 130 取消操作，并且不执行任何内容。

## `vp build`

**退出代码：** 130

**→ expect-milestone:** `package-select::0`

```
note: You are running `vp build` as a Vite+ built-in command. If you meant to run the build npm script, use `vpr build` instead.
Select a package to build (↑/↓, Enter to run, type to search):

  › admin apps/admin
    web   apps/web
    ui    packages/ui
```

**← write-key：** `ctrl-c`

```
note: You are running `vp build` as a Vite+ built-in command. If you meant to run the build npm script, use `vpr build` instead.
```
