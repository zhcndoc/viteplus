# default_package

根配置中的 defaultPackage 对裸 app 命令起到隐式 -C 的作用，包括根目录不是 JS 工作区的情况；vp 会打印一行提示，并在配置的目录中运行（rfcs/cwd-flag.md）。

## `vp pack`

```
注意：vp pack：正在使用 ./packages/ui（vite.config.ts 中的 defaultPackage）
ℹ 入口：src/index.ts
ℹ 开始构建
ℹ dist/index.mjs  <size> kB │ gzip：<size> kB
ℹ 1 个文件，总计：<size> kB
✔ 构建完成，用时 <duration>
```

## `vpt list-dir packages/ui/dist`

输出会放入配置的软件包中

```
index.mjs
```
