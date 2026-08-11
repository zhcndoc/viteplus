# 命令_pm_批准_构建_npm12

## `vp pm approve-builds`

无参数 -> npm approve-scripts --allow-scripts-pending（列出待处理项）

```
没有包含未经审核安装脚本的软件包。
```

## `vp pm approve-builds esbuild`

-> npm approve-scripts esbuild（npm 12 强制执行 allowScripts，因此 vp 会指向 vp pm rebuild）

**退出代码：** 1

```
note: npm records the approval in the `allowScripts` field of package.json but does not run scripts a previous install skipped. Run `vp pm rebuild <package>` to execute them.
npm error code ENOMATCH
npm error No installed packages match: esbuild
npm error A complete log of this run can be found at <home>/.npm/_logs/<timestamp>-debug-0.log
```

## `vp pm approve-builds !core-js`

仅拒绝模式 -> npm deny-scripts core-js（拒绝操作保留强制默认设置，不添加备注）

**退出代码：** 1

```
npm error code ENOMATCH
npm error No installed packages match: core-js
npm error A complete log of this run can be found in: <home>/.npm/_logs/<timestamp>-debug-0.log
```

## `vp pm approve-builds esbuild !core-js`

混合批准+拒绝 -> 被拒绝，退出码非零

**退出码：** 1

```
npm manages approvals and denials separately. Run them as two invocations, e.g. `vp pm approve-builds <approve-pkg>...` then `vp pm approve-builds !<deny-pkg>...`.
```

## `vp pm approve-builds --all`

-> npm approve-scripts --all（重建提示）

```
提示：npm 会将批准记录在 package.json 的 `allowScripts` 字段中，但不会运行之前安装时跳过的脚本。运行 `vp pm rebuild <package>` 以执行这些脚本。
没有包含未经审核的安装脚本的软件包。
```
