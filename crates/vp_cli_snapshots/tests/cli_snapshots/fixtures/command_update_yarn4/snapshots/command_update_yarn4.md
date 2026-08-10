# command_update_yarn4

## `vp update testnpm2`

应在 semver 范围内更新软件包

```
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0085: │ + test-vite-plus-package-optional@npm:1.0.0, test-vite-plus-package@npm:1.0.0, testnpm2@npm:1.0.1
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0013: │ 3 packages were added to the project (+ <size> KiB).
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in <duration> <duration>
```

## `vpt print-file package.json`

```
{
  "name": "command-update-yarn4",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "^1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "*"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "*"
  },
  "packageManager": "yarn@4.10.3"
}
```

## `vp rm testnpm2`

应更新到绝对最新版本

```
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0085: │ - testnpm2@npm:1.0.1
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in <duration> <duration>
```

## `vp add testnpm2@1.0.0 -D`

```
➤ YN0000: · Yarn <版本>
➤ YN0000: ┌ 解析步骤
➤ YN0085: │ + testnpm2@npm:1.0.0
➤ YN0000: └ 已完成
➤ YN0000: ┌ 获取步骤
➤ YN0013: │ 项目中添加了一个软件包（+ <大小> KiB）。
➤ YN0000: └ 已完成
➤ YN0000: ┌ 链接步骤
➤ YN0000: └ 已完成
➤ YN0000: · 在 <时长> <时长> 内完成
```

## `vp update testnpm2 --latest`

```
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0085: │ + testnpm2@npm:1.0.1
➤ YN0085: │ - testnpm2@npm:1.0.0
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
  "name": "command-update-yarn4",
  "version": "1.0.0",
  "devDependencies": {
    "test-vite-plus-package": "*",
    "testnpm2": "^1.0.1"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "*"
  },
  "packageManager": "yarn@4.10.3"
}
```

## `vp update -D`

应执行更新并忽略 -D 选项

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
  "name": "command-update-yarn4",
  "version": "1.0.0",
  "devDependencies": {
    "test-vite-plus-package": "*",
    "testnpm2": "^1.0.1"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "*"
  },
  "packageManager": "yarn@4.10.3"
}
```

## `vp update --recursive`

应更新所有软件包，但不会更改 package.json

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
  "name": "command-update-yarn4",
  "version": "1.0.0",
  "devDependencies": {
    "test-vite-plus-package": "*",
    "testnpm2": "^1.0.1"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "*"
  },
  "packageManager": "yarn@4.10.3"
}
```
