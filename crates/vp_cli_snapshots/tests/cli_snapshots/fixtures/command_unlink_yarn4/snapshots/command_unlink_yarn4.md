# command_unlink_yarn4

## `vpt mkdir -p ../unlink-test-lib-yarn`

创建测试库

```
```

## `vpt write-file ../unlink-test-lib-yarn/package.json '{"name": "unlink-test-lib-yarn", "version": "1.0.0"}
'`

```
```

## `vp link ../unlink-test-lib-yarn`

先链接库

```
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in <duration> <duration>
```

## `vpt print-file package.json`

```
{
  "name": "command-unlink-yarn4",
  "version": "1.0.0",
  "packageManager": "yarn@4.0.0",
  "resolutions": {
    "unlink-test-lib-yarn": "portal:<case>/unlink-test-lib-yarn"
  }
}
```

## `vp unlink unlink-test-lib-yarn`

应解除该软件包的链接

```
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in <duration> <duration>
```

## `vpt print-file package.json`

```
{
  "name": "command-unlink-yarn4",
  "version": "1.0.0",
  "packageManager": "yarn@4.0.0"
}
```

## `vp link ../unlink-test-lib-yarn`

再次链接

```
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in <duration> <duration>
```

## `vpt print-file package.json`

```
{
  "name": "command-unlink-yarn4",
  "version": "1.0.0",
  "packageManager": "yarn@4.0.0",
  "resolutions": {
    "unlink-test-lib-yarn": "portal:<case>/unlink-test-lib-yarn"
  }
}
```

## `vp unlink --recursive`

应使用 --all 标志取消链接所有内容

```
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in <duration> <duration>
```

## `vpt print-file package.json`

```
{
  "name": "command-unlink-yarn4",
  "version": "1.0.0",
  "packageManager": "yarn@4.0.0"
}
```

## `vp unlink -r`

应支持使用 -r 简写形式

```
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ 解析步骤
➤ YN0000: └ 已完成
➤ YN0000: ┌ 获取步骤
➤ YN0000: └ 已完成
➤ YN0000: ┌ 链接步骤
➤ YN0000: └ 已完成
➤ YN0000: · 完成于 <duration> <duration>
```

## `vpt print-file package.json`

```
{
  "name": "command-unlink-yarn4",
  "version": "1.0.0",
  "packageManager": "yarn@4.0.0"
}
```
