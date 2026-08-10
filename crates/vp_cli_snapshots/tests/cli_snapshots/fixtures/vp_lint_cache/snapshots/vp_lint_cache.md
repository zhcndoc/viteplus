# vp_lint_cache

## `vp run lint`

首次运行会填充缓存

```
$ vp lint
Found 0 warnings and 0 errors.
Finished in <duration> on 2 files with <n> rules using <n> threads.
```

## `vp run lint`

第二次运行应命中缓存

```
$ vp lint ◉ 缓存命中，正在重放
发现 0 个警告和 0 个错误。
在 <duration> 内，使用 <n> 个线程和 <n> 条规则完成了对 2 个文件的处理。

---
vp run：缓存命中，节省了 <duration>。
```
