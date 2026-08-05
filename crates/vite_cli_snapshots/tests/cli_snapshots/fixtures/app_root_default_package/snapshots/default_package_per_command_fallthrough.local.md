# default_package_per_command_fallthrough

defaultPackage 对象中未声明的命令会回退到
正常解析流程：该映射仅声明了 `pack`，因此在此工作区根目录下直接运行 `vp build` 时，
会在（可运行的）根目录中原地执行且不显示提示，而 `vp pack` 仍会路由到已声明的 ./packages/ui。

## `cd per_command_fallthrough && vp build`

```
✓ 已转换 2 个模块。
正在计算 gzip 大小...
dist/index.html  <size> kB │ gzip：<size> kB

✓ 已在 <duration> 内构建完成
```

## `cd per_command_fallthrough && vp pack`

```
提示：vp pack：正在使用 ./packages/ui（vite.config.ts 中的 defaultPackage）
ℹ 入口：src/index.ts
ℹ 开始构建
ℹ dist/index.mjs  <size> kB │ gzip：<size> kB
ℹ 共 1 个文件：<size> kB
✔ 构建在 <duration> 内完成
```
