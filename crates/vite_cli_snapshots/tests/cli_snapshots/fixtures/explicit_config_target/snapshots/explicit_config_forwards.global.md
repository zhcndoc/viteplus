# 显式配置文件转发

显式指定 -c/--config 文件表示明确的构建意图：vp 会将其转发给
Vite，而不是请求选择一个包。在此处直接执行 vp build 会请求选择（没有
可运行的根目录，但存在一个成员），而 -c lib.config.ts 会构建该库。

## `vp build -c lib.config.ts`

```
VITE+ - The Unified Toolchain for the Web

✓ 2 modules transformed.
computing gzip size...
dist/lib.js  <size> kB │ gzip: <size> kB

✓ built in <duration>
```
