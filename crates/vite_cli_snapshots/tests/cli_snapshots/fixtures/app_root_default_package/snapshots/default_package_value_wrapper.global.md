# default_package_value_wrapper

回归问题：TypeScript 包装器位于 defaultPackage 值（`'./frontend' as const`）上，而不是配置对象上。静态提取也必须将其解包，这样 vp 才会构建 ./frontend，而不是报错指出 defaultPackage 不是静态字符串字面量。

## `cd value_wrapper && vp build`

```
VITE+ - Web 统一工具链

注意：vp build：使用 ./frontend（vite.config.ts 中的 defaultPackage）
✓ 已转换 2 个模块。
正在计算 gzip 大小...
dist/index.html  <大小> kB │ gzip：<大小> kB

✓ 构建完成，用时 <时长>
```
