# explicit_config_forwards

显式指定的 -c/--config 文件表示明确的构建意图：vp 会将其转发给
Vite，而不是要求选择一个包。在这里直接执行 vp build 会要求选择包（根目录不可运行，但存在一个成员），而 -c lib.config.ts 会构建 lib。

## `vp build -c lib.config.ts`

```
✓ 2 modules transformed.
computing gzip size...
dist/lib.js  <size> kB │ gzip: <size> kB

✓ built in <duration>
```
