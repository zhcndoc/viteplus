# vp_fmt_cache

## `vp run fmt`

首次运行会填充缓存

```
$ vp fmt
Finished in <duration> on 3 files using <n> threads.
```

## `vp run fmt`

第二次运行应该命中缓存

```
$ vp fmt ◉ cache hit, replaying
Finished in <duration> on 3 files using <n> threads.

---
vp run: cache hit, <duration> saved.
```
