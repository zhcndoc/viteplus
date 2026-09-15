# build_and_preview_use_custom_vite_root

配置设置了静态 Vite `root`。`index.html` 文件位于该目录中。直接执行 `vp build` 会构建工作区应用。然后 `vp preview` 提供构建输出。

## `vp build`

```
VITE+ - The Unified Toolchain for the Web

✓ 2 modules transformed.
computing gzip size...
src/dist/index.html  <size> kB │ gzip: <size> kB

✓ built in <duration>
```

## `vp preview`

**→ expect-milestone:** `preview-server:ready`

```
VITE+ - The Unified Toolchain for the Web

  ➜  Local:   http://127.0.0.1:<port>/
  ➜  press h + enter to show help
```

**← write-line:** `q`

```
VITE+ - The Unified Toolchain for the Web

  ➜  Local:   http://127.0.0.1:<port>/
  ➜  press h + enter to show help
q
```
