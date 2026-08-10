# ignore_dist

## `vp run lint`

```
$ node -e "console.log('lint')"
lint
```

## `vpt mkdir dist`

```
```

## `vp run lint`

新的 dist 文件夹不应使缓存失效

```
$ node -e "console.log('lint')" ◉ cache hit, replaying
lint

---
vp run: cache hit, <duration> saved.
```
