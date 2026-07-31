# check_fmt_fail

## `vp check`

**退出代码：** 1

```
错误：发现格式问题
src/index.js（<duration>）

在 1 个文件中发现格式问题（<duration>，<n> 个线程）。运行 `vp check --fix` 以修复这些问题。
```

## `vp check --fix`

```
通过：已完成对检查文件的格式化（<duration>）
通过：在 1 个文件中未发现警告或 lint 错误（<duration>，<n> 个线程）
```

## `vp check`

修复后应通过

```
通过：2 个文件均已正确格式化（<duration>，<n> 个线程）
通过：在 1 个文件中未发现警告或 lint 错误（<duration>，<n> 个线程）
```
