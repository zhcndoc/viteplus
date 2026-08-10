# command_pm_approve_builds_npm11

## `vp pm approve-builds --help`

应显示包含 pnpm/npm deny + --all 注意事项的帮助信息

```
VITE+ - 面向 Web 的统一工具链

用法：vp pm approve-builds [选项] [软件包]... [-- <传递参数>...]

批准依赖项生命周期脚本（install/postinstall）运行

参数：
  [软件包]...            要批准的软件包。使用 `!` 前缀表示拒绝（pnpm >= 11.0.0，npm >= 11.16.0）。省略则启动交互模式（pnpm），或列出待处理的软件包（npm >= 11.16.0）
  [传递参数]...          要传递给包管理器的其他参数

选项：
  --all                  批准当前所有待批准的软件包（pnpm >= 10.32.0，npm >= 11.16.0）。不能与位置参数同时使用
  -h, --help             显示帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp pm approve-builds`

无参数 -> npm approve-scripts --allow-scripts-pending（列出待处理项）

```
没有包含未经审核安装脚本的软件包。
```

## `vp pm approve-builds esbuild`

-> npm approve-scripts esbuild（提示说明）

**退出代码：** 1

```
note: npm's allowScripts policy is advisory in npm 11.x: install scripts still run; npm only warns about unreviewed packages at install time. Enforcement is planned for a future npm release.
npm error code ENOMATCH
npm error No installed packages match: esbuild
npm error A complete log of this run can be found in: <home>/.npm/_logs/<timestamp>-debug-0.log
```

## `vp pm approve-builds !core-js`

仅拒绝 -> npm 拒绝 core-js 的脚本（提示说明）

**退出代码：** 1

```
note: npm's allowScripts policy is advisory in npm 11.x: install scripts still run; npm only warns about unreviewed packages at install time. Enforcement is planned for a future npm release.
npm error code ENOMATCH
npm error No installed packages match: core-js
npm error A complete log of this run can be found in: <home>/.npm/_logs/<timestamp>-debug-0.log
```

## `vp pm approve-builds esbuild !core-js`

混合批准+拒绝 -> 已拒绝，退出码非零

**退出码：** 1

```
npm manages approvals and denials separately. Run them as two invocations, e.g. `vp pm approve-builds <approve-pkg>...` then `vp pm approve-builds !<deny-pkg>...`.
```

## `vp pm approve-builds -- esbuild`

在待处理路径中通过 `--` 传入位置参数 -> 被拒绝，退出码非零

**退出代码：** 1

```
Pass package names as positionals (`vp pm approve-builds <pkg>...`), not after `--`.
```

## `vp pm approve-builds --all`

-> npm approve-scripts --all（建议说明）

```
注意：npm 的 allowScripts 策略在 npm 11.x 中仅具有建议性：安装脚本仍会运行；npm 只会在安装时警告尚未审核的软件包。强制执行计划在未来的 npm 版本中推出。
没有包含尚未审核安装脚本的软件包。
```
