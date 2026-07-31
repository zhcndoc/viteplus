# command_pm_approve_builds_pnpm10

## `vp pm approve-builds --help`

应显示帮助信息

```
批准依赖项生命周期脚本（install/postinstall）运行

用法：vp pm approve-builds [选项] [软件包]... [-- <透传参数>...]

参数：
  [软件包]...             要批准的软件包。使用 `!` 前缀表示拒绝（pnpm >= 11.0.0，npm >= 11.16.0）。省略此参数时，将启动交互模式（pnpm）或列出待处理的软件包（npm >= 11.16.0）
  [透传参数]...           要透传给软件包管理器的其他参数

选项：
      --all   批准当前所有待批准的软件包（pnpm >= 10.32.0，npm >= 11.16.0）。不能与位置参数中的软件包同时使用
  -h, --help  显示帮助信息
```

## `vp pm approve-builds --all`

转发至 pnpm approve-builds --all（没有需要批准的内容）

```
没有等待批准的软件包
```

## `vp pm approve-builds esbuild fsevents`

将位置参数中的包转发给 pnpm

```
没有等待批准的软件包
```
