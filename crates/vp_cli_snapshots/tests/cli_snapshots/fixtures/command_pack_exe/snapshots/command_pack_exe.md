# command_pack_exe

## `vp pack src/index.ts --exe`

```
VITE+ - Web 统一工具链

ℹ 入口：src/index.ts
ℹ 目标：node25.7.0
ℹ `exe` 选项处于实验阶段，未来版本中可能会发生变化。
ℹ 开始构建
ℹ dist/index.mjs  <size> kB │ gzip：<size> kB
ℹ 1 个文件，总计：<size> kB
✔ 构建完成，用时 <duration>
ℹ build/index  <size> MB
✔ 可执行文件已构建：build/index（用时 <duration>）
```

## `vpt list-dir dist`

```
index.mjs
```

## `vpt list-dir build`

```
index
```

## `./build/index`

打包后的可执行文件运行

```
来自可执行文件的问候
```
