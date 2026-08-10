# picker_select

在包含多个候选项的工作区根目录中运行不带参数的 app 命令，会打开
模糊包选择器（vp run 选择器组件）；输入内容可进行筛选，按 Enter
会将所选项作为隐式的 -C 运行（rfcs/cwd-flag.md）。

## `vp build`

**→ expect-milestone:** `package-select::0`

```
提示：您正在运行 Vite+ 内置命令 `vp build`。如果您想运行 build npm 脚本，请改用 `vpr build`。
选择要构建的软件包（↑/↓，回车运行，输入以搜索）：

  › admin apps/admin
    web   apps/web
    ui    packages/ui
```

**← write:** `web`

**→ expect-milestone:** `package-select:web:0`

```
提示：您正在运行 Vite+ 内置命令 `vp build`。如果您想运行 build npm 脚本，请改用 `vpr build`。
选择要构建的软件包（↑/↓，回车运行，输入以搜索）：web

  › web apps/web
```

**← write-key:** `enter`

```
提示：您正在运行 Vite+ 内置命令 `vp build`。如果您想运行 build npm 脚本，请改用 `vpr build`。
已选择软件包：web (apps/web)
提示：运行 `vp -C apps/web build` 可直接执行此操作
✓ 已转换 2 个模块。
正在计算 gzip 大小...
dist/index.html  <size> kB │ gzip：<size> kB

✓ 已在 <duration> 内构建完成
```
