# pm_version_yarn_berry

## `vp pm version patch`

Yarn Berry 更新软件包版本

```
➤ YN0000: pm-version-yarn-berry@workspace:.: 已更新至 1.0.1

➤ YN0000: 在 <duration> <duration> 内完成
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ 解析步骤
➤ YN0000: └ 已完成
➤ YN0000: ┌ 获取步骤
➤ YN0000: └ 已完成
➤ YN0000: ┌ 链接步骤
➤ YN0000: └ 已完成
➤ YN0000: · 在 <duration> <duration> 内完成
```

## `vp pm version 2.0.0 --json`

Yarn Berry 拒绝不受支持的 JSON 输出

**退出代码：** 1

```
Invalid argument: `--json` is not supported by Yarn 2+ `version`.
```

## `vpt print-file package.json`

验证被拒绝的命令没有更新版本

```
{
  "name": "pm-version-yarn-berry",
  "version": "1.0.1",
  "private": true,
  "license": "MIT",
  "packageManager": "yarn@4.12.0"
}
```
