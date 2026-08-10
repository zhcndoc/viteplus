# command_pm_approve_builds_yarn

## `vp pm approve-builds --help`

应显示帮助

```
批准运行依赖项生命周期脚本（install/postinstall）

用法：vp pm approve-builds [选项] [软件包]... [-- <传递参数>...]

参数：
  [软件包]...              要批准的软件包。使用 `!` 前缀表示拒绝（pnpm >= 11.0.0，npm >= 11.16.0）。省略此项时，启动交互模式（pnpm）或列出待处理的软件包（npm >= 11.16.0）
  [传递参数]...            要传递给软件包管理器的其他参数

选项：
      --all   批准当前所有待批准的软件包（pnpm >= 10.32.0，npm >= 11.16.0）。不能与位置参数同时使用
  -h, --help  显示帮助
```

## `vp pm approve-builds`

警告并以 0 退出（在 yarn 上无操作）

```
警告：yarn（v1）默认运行生命周期脚本。若要限制这些脚本，请在 .npmrc 中设置 `ignore-scripts=true`，然后使用 `vp pm rebuild <package>` 重新构建已批准的软件包。
```

## `vp pm approve-builds esbuild`

警告并以 0 退出（在 yarn 上不执行任何操作）

```
警告：yarn（v1）默认运行生命周期脚本。要限制这些脚本，请在 .npmrc 中设置 `ignore-scripts=true`，然后使用 `vp pm rebuild <package>` 重新构建已批准的软件包。
```

## `vp pm approve-builds --all`

警告并以 0 退出（在 yarn 上不执行任何操作）

```
warn: yarn (v1) runs lifecycle scripts by default. To restrict them, set `ignore-scripts=true` in .npmrc and rebuild approved packages with `vp pm rebuild <package>`.
```
