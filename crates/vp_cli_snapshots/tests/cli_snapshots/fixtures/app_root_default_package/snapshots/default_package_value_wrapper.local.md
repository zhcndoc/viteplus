# default_package_value_wrapper

回归问题：TypeScript 包装器位于 defaultPackage 的值
（`'./frontend' as const`）上，而不是配置对象上。静态提取也必须将其解包，这样 vp 才会构建 ./frontend，而不是报错称 defaultPackage 不是静态字符串字面量。

## `cd value_wrapper && vp build`

```
note: vp build: using ./frontend (defaultPackage in vite.config.ts)
✓ 2 modules transformed.
computing gzip size...
dist/index.html  <size> kB │ gzip: <size> kB

✓ built in <duration>
```
