# vp_run_expansion

## `vp run hello`

```
$ node -p '40+2'
42
```

## `vp run hello`

应该命中缓存

```
$ node -p '40+2' ◉ cache hit, replaying
42

---
vp run: cache hit, <duration> saved.
```
