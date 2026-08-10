# command_dedupe_yarn4

## `vp dedupe`

应去重依赖项

```
➤ YN0000: ┌ 去重步骤
➤ YN0000: │ 使用最高策略时没有可去重的软件包
➤ YN0000: └ 已完成
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ 解析步骤
➤ YN0085: │ + test-vite-plus-package-optional@npm:1.0.0, test-vite-plus-package@npm:1.0.0, testnpm2@npm:1.0.1
➤ YN0000: └ 已完成
➤ YN0000: ┌ 获取步骤
➤ YN0013: │ 已向项目添加 3 个软件包（+ <size> KiB）。
➤ YN0000: └ 已完成
➤ YN0000: ┌ 链接步骤
➤ YN0000: └ 已完成
➤ YN0000: · 在 <duration> <duration> 内完成
```

## `vpt print-file package.json`

```
{
  "name": "command-dedupe-yarn4",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "1.0.0"
  },
  "packageManager": "yarn@4.10.3"
}
```

## `vp dedupe --check`

应检查去重是否会产生更改

```
➤ YN0000: ┌ 去重步骤
➤ YN0000: │ 使用最高策略无法对任何软件包进行去重
➤ YN0000: └ 已完成
```

## `vpt print-file package.json`

```
{
  "name": "command-dedupe-yarn4",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "1.0.0"
  },
  "packageManager": "yarn@4.10.3"
}
```

## `vp dedupe -- --json`

支持透传参数

```
```

## `vpt print-file package.json`

```
{
  "name": "command-dedupe-yarn4",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "1.0.0"
  },
  "packageManager": "yarn@4.10.3"
}
```
