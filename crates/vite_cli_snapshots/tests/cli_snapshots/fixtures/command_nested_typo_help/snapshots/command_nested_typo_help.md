# 命令嵌套拼写错误帮助

## `vp pm apprev-build --help`

拼写错误不应打印 pm 父命令帮助信息

**退出代码：** 2

```
VITE+ - The Unified Toolchain for the Web

error: Command 'apprev-build' not found

Did you mean `vp pm approve-builds`?
```

## `vp help pm apprev-build`

帮助别名不应在拼写错误时打印 pm 父级帮助信息

**退出代码：** 2

```
VITE+ - Web 的统一工具链

错误：未找到命令“apprev-build”

您是否想输入 `vp pm approve-builds`？
```

## `vp pm --help apprev-build`

拼写错误前的 help 标志不应打印 pm 父命令帮助

**退出代码：** 2

```
VITE+ - Web 的统一工具链

错误：未找到命令“apprev-build”

您是否想输入 `vp pm approve-builds`？
```
