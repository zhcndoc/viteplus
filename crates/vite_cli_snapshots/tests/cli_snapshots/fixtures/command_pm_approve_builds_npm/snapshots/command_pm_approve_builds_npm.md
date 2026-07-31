# command_pm_approve_builds_npm

## `vp pm approve-builds --help`

应显示帮助信息

```
批准依赖项生命周期脚本（install/postinstall）运行

用法：vp pm approve-builds [选项] [软件包]... [-- <传递参数>...]

参数：
  [软件包]...             要批准的软件包。前缀加上 `!` 表示拒绝（pnpm >= 11.0.0，npm >= 11.16.0）。省略则启动交互模式（pnpm），或列出待处理的软件包（npm >= 11.16.0）
  [传递参数]...           要传递给包管理器的其他参数

选项：
      --all               批准当前所有待审批的软件包（pnpm >= 10.32.0，npm >= 11.16.0）。不能与位置参数同时使用
  -h, --help              显示帮助信息
```

## `vp pm approve-builds`

警告并以 0 退出（在 npm 中为空操作）

```
警告：npm 默认运行生命周期脚本。升级到 npm >= 11.16.0 以使用 `npm approve-scripts`/`deny-scripts`，或在 .npmrc 中设置 `ignore-scripts=true`，并使用 `vp pm rebuild <package>` 重新构建已批准的软件包。
```

## `vp pm approve-builds esbuild`

警告并以 0 退出（在 npm 中为空操作）

```
警告：npm 默认运行生命周期脚本。升级到 npm >= 11.16.0 以使用 `npm approve-scripts`/`deny-scripts`，或在 .npmrc 中设置 `ignore-scripts=true`，并使用 `vp pm rebuild <package>` 重新构建已批准的软件包。
```

## `vp pm approve-builds --all`

警告并以 0 退出（在 npm 上不执行任何操作）

```
警告：npm 默认运行生命周期脚本。请升级到 npm >= 11.16.0 以使用 `npm approve-scripts`/`deny-scripts`，或在 .npmrc 中设置 `ignore-scripts=true`，然后使用 `vp pm rebuild <package>` 重新构建已批准的软件包。
```
