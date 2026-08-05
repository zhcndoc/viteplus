# default_package

根配置中的 defaultPackage 充当裸 app 命令的隐式 -C，
即使根目录不是 JS 工作区也同样如此；vp 会打印一行提示，
并在配置的目录中运行（rfcs/cwd-flag.md）。

## `vp pack`

```
VITE+ - 面向 Web 的统一工具链

注意：vp pack：使用 ./packages/ui（vite.config.ts 中的 defaultPackage）
ℹ 入口：src/index.ts
ℹ 开始构建
ℹ dist/index.mjs  <size> kB │ gzip：<size> kB
ℹ 共 1 个文件，总计：<size> kB
✔ 构建已在 <duration> 内完成
```

## `vpt list-dir packages/ui/dist`

输出会放入已配置的软件包中

```
index.mjs
```
