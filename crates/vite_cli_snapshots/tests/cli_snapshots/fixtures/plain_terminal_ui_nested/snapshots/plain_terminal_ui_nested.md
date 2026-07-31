# plain_terminal_ui_nested

## `vp run hello`

```
$ vp lint ./src
发现 0 个警告和 0 个错误。
使用 <n> 条规则和 <n> 个线程在 <duration> 内完成了 1 个文件的检查。

$ vp lint
发现 0 个警告和 0 个错误。
使用 <n> 条规则和 <n> 个线程在 <duration> 内完成了 3 个文件的检查。

---
vp run：缓存命中 0/2（0%）。（运行 `vp run --last-details` 查看完整详情）
```

## `vpt write-file a.ts 'console.log(123)
'`

```
```

## `vp run hello`

报告内部运行器的缓存状态

```
$ vp lint ./src ◉ cache hit, replaying
Found 0 warnings and 0 errors.
Finished in <duration> on 1 file with <n> rules using <n> threads.

$ vp lint ○ cache miss: 'a.ts' modified, executing
Found 0 warnings and 0 errors.
Finished in <duration> on 3 files with <n> rules using <n> threads.

---
vp run: 1/2 cache hit (50%), <duration> saved. (Run `vp run --last-details` for full details)
```
