# 合成开发缓存已禁用

## `vp run dev`

即使启用了 cacheScripts，模拟 dev（vp dev）也应禁用缓存

**退出代码：** 130

**→ expect-milestone:** `dev-server:ready`

```
$ vp dev --host 127.0.0.1 --port 0 ⊘ cache disabled

  VITE+ <version>

  ➜  Local:   http://127.0.0.1:<port>/
  ➜  press h + enter to show help
```

**← write-key:** `ctrl-c`

```
$ vp dev --host 127.0.0.1 --port 0 ⊘ cache disabled

  VITE+ <version>

  ➜  Local:   http://127.0.0.1:<port>/
  ➜  press h + enter to show help

```
