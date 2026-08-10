# picker_cancel

在包选择器中按 Ctrl+C 会以退出码 130 取消操作，并且不会运行任何内容。

## `vp build`

**退出代码：** 130

**→ expect-milestone:** `package-select::0`

```
VITE+ - 面向 Web 的统一工具链

注意：您正在将 `vp build` 作为 Vite+ 内置命令运行。如果您想运行 build npm 脚本，请改用 `vpr build`。
选择要构建的软件包（↑/↓，Enter 运行，输入内容进行搜索）：

  › admin apps/admin
    web   apps/web
    ui    packages/ui
```

**← write-key：** `ctrl-c`

```
VITE+ - 面向 Web 的统一工具链

注意：您正在将 `vp build` 作为 Vite+ 内置命令运行。如果您想运行 build npm 脚本，请改用 `vpr build`。
```
