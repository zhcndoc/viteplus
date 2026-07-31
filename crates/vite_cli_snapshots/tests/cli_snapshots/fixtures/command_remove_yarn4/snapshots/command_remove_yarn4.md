# command_remove_yarn4

## `vp remove testnpm2 -D`

删除不存在的软件包时应报错

**退出代码：** 1

```
Usage Error: Pattern testnpm2 doesn't match any packages referenced by this workspace

$ yarn remove [-A,--all] [--mode #0] ...
```

*（跳过 1 个步骤到下一个行边界：步骤失败）*

## `vp add testnpm2`

应将软件包添加到依赖项中

```
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ 解析步骤
➤ YN0085: │ + testnpm2@npm:1.0.1
➤ YN0000: └ 已完成
➤ YN0000: ┌ 获取步骤
➤ YN0013: │ 已向项目添加一个软件包（+ <size> KiB）。
➤ YN0000: └ 已完成
➤ YN0000: ┌ 链接步骤
➤ YN0000: └ 已完成
➤ YN0000: · 用时 <duration> <duration>
```

## `vp add -D test-vite-plus-install`

```
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ 解析步骤
➤ YN0085: │ + test-vite-plus-install@npm:1.0.0
➤ YN0000: └ 已完成
➤ YN0000: ┌ 获取步骤
➤ YN0013: │ 已向项目添加一个包（+ <size> KiB）。
➤ YN0000: └ 已完成
➤ YN0000: ┌ 链接步骤
➤ YN0000: └ 已完成
➤ YN0000: · 在 <duration> <duration> 内完成
```

## `vp add -O test-vite-plus-package-optional`

```
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0085: │ + test-vite-plus-package-optional@npm:1.0.0
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0013: │ A package was added to the project (+ <size> KiB).
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in <duration> <duration>
```

## `vpt print-file package.json`

```
{
  "name": "command-remove-yarn4",
  "version": "1.0.0",
  "packageManager": "yarn@4.10.3",
  "dependencies": {
    "testnpm2": "^1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-install": "^1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0"
  }
}
```

## `vp remove testnpm2 test-vite-plus-install`

应从依赖项中移除软件包

```
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0085: │ - test-vite-plus-install@npm:1.0.0, testnpm2@npm:1.0.1
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
  "name": "command-remove-yarn4",
  "version": "1.0.0",
  "packageManager": "yarn@4.10.3",
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0"
  }
}
```

## `vp remove -D test-vite-plus-package-optional`

支持忽略 -O 标志并从可选依赖中移除软件包

```
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0085: │ - test-vite-plus-package-optional@npm:1.0.0
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
  "name": "command-remove-yarn4",
  "version": "1.0.0",
  "packageManager": "yarn@4.10.3"
}
```

## `vp remove -g --dry-run testnpm2`

支持以 dry-run 模式移除全局软件包

**退出代码：** 1

```
卸载 testnpm2 失败：未安装软件包 testnpm2
```

*（跳过 1 个步骤到下一个行边界：步骤失败）*
