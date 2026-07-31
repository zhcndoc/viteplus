# cache_scripts_enabled

## `vp run hello`

首次运行应为缓存未命中

```
$ node hello.mjs
hello from script
```

## `vp run hello`

第二次运行应命中缓存

```
$ node hello.mjs ◉ 已命中缓存，正在重放
来自脚本的问候

---
vp run：已命中缓存，节省了 <duration>。
```
