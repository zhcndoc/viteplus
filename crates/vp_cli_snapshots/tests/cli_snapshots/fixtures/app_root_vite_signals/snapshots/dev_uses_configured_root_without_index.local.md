# dev_uses_configured_root_without_index

声明的 Vite `root` 字段是在没有 `index.html` 时的根目录意图信号。

## `vpt cp configs/root-no-index.ts vite.config.ts`


## `vp dev`

**→ expect-milestone:** `dev-server:ready`

```

  VITE+ <version>

  ➜  Local:   http://127.0.0.1:<port>/
  ➜  press h + enter to show help
```

**← write-line:** `q`

```

  VITE+ <version>

  ➜  Local:   http://127.0.0.1:<port>/
  ➜  press h + enter to show help
q
```
