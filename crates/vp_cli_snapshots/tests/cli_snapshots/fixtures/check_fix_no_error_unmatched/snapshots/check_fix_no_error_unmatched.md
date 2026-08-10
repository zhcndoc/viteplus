# check_fix_no_error_unmatched

## `vp check --fix src/ignored/index.js`

所有被 ignorePatterns 排除的文件，在 --fix 模式下都应通过

```
通过：已完成所检查文件的格式化（<duration>）
```

## `vp check --fix package.json`

不可进行 lint 检查的文件，在 `--fix` 模式下应该通过

```
pass: Formatting completed for checked files (<duration>)
```

## `vp check --no-error-on-unmatched-pattern src/ignored/index.js`

不带 `--fix` 的显式标志，也应该通过

```
```

## `vp check --fix --no-error-on-unmatched-pattern src/ignored/index.js`

同时设置两个标志，应当通过

```
pass: Formatting completed for checked files (<duration>)
```

## `vp check src/ignored/index.js`

不带 `--fix` 或显式标志时，应以非零状态退出

**退出代码：** 2

```
error: Formatting could not start
Checking formatting...

Expected at least one target file. All matched files may have been excluded by ignore rules.

Formatting failed before analysis started
```
