# dev_uses_configured_root_without_index

已声明的 Vite `root` 字段在没有 `index.html` 时仍是根目录意图信号。

## `vpt cp configs/root-no-index.ts vite.config.ts`


## `vp dev`

**→ expect-milestone:** `dev-server:ready`

```
VITE+ - The Unified Toolchain for the Web

  VITE+ <version>

  ➜  Local:   http://127.0.0.1:<port>/
  ➜  press h + enter to show help
```

**← write-line:** `q`

```
VITE+ - The Unified Toolchain for the Web

  VITE+ <version>

  ➜  Local:   http://127.0.0.1:<port>/
  ➜  press h + enter to show help
q
```
