# default_package_per_command_fallthrough

`defaultPackage` 对象中未指定的命令会回退到正常解析流程：该映射仅声明了 `pack`，因此在此工作区根目录下直接执行 `vp build` 时，会在可运行的根目录中就地运行且不显示提示，而 `vp pack` 仍会路由到已声明的 `./packages/ui`。

## `cd per_command_fallthrough && vp build`

```
VITE+ - Web 的统一工具链

✓ 已转换 2 个模块。
正在计算 gzip 大小...
dist/index.html  <大小> kB │ gzip: <大小> kB

✓ 构建完成，用时 <时长>
```

## `cd per_command_fallthrough && vp pack`

```
VITE+ - Web 统一工具链

注意：vp pack：正在使用 ./packages/ui（vite.config.ts 中的 defaultPackage）
ℹ 入口：src/index.ts
ℹ 开始构建
ℹ dist/index.mjs  <size> kB │ gzip：<size> kB
ℹ 共 1 个文件，总计：<size> kB
✔ 构建在 <duration> 内完成
```
