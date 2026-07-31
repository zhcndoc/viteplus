# pm_version_yarn_berry

## `vp pm version patch`

Yarn Berry 更新软件包版本

```
➤ YN0000: pm-version-yarn-berry@workspace:.: Bumped to 1.0.1

➤ YN0000: Done in <duration> <duration>
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in <duration> <duration>
```

## `vp pm version 2.0.0 --json`

Yarn Berry 拒绝不受支持的 JSON 输出

**退出代码：** 1

```
error: Invalid argument: `--json` is not supported by Yarn 2+ `version`.
* Invalid argument: `--json` is not supported by Yarn 2+ `version`.
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
