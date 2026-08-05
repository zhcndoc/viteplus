# cwd_flag

全局 -C 标志会像在以下目录中启动 vp 一样运行任何命令：
pack 和 run 的行为与 cd 形式完全一致，目录不存在时会报错，并且位置参数保留上游 tsdown 的入口语义
（rfcs/cwd-flag.md）。

## `vp -C packages/hello pack`

-C 从工作区根目录打包该软件包

```
VITE+ - 面向 Web 的统一工具链

ℹ 入口：src/index.ts
ℹ 开始构建
ℹ dist/index.mjs  <size> kB │ gzip：<size> kB
ℹ 1 个文件，总计：<size> kB
✔ 构建完成，用时 <duration>
```

## `vpt list-dir packages/hello/dist`

输出位于目标包中

```
index.mjs
```

## `vpt rm -rf packages/hello/dist`

重置，使两种形式产生相同的输出

```

## `cd packages/hello && vp pack`

cd 形式是等价的

```
VITE+ - The Unified Toolchain for the Web

ℹ entry: src/index.ts
ℹ Build start
ℹ dist/index.mjs  <size> kB │ gzip: <size> kB
ℹ 1 files, total: <size> kB
✔ Build complete in <duration>
```

## `vp -C packages/hello run where`

`-C` 同样适用于 `vp run`

```
VITE+ - The Unified Toolchain for the Web

~/packages/hello$ node -e "console.log('cwd base: ' + require('node:path').basename(process.cwd()))" ⊘ cache disabled
cwd base: hello
```

## `cd packages/hello && vp run where`

用于运行的等效 cd 形式

```
VITE+ - The Unified Toolchain for the Web

~/packages/hello$ node -e "console.log('cwd base: ' + require('node:path').basename(process.cwd()))" ⊘ cache disabled
cwd base: hello
```

## `vpr -C packages/hello where`

vpr -C <dir> <task> 消耗该标志并在 <dir> 中运行任务（全局 vpr shim 和本地 bin/vpr）

```
~/packages/hello$ node -e "console.log('cwd base: ' + require('node:path').basename(process.cwd()))" ⊘ cache disabled
cwd base: hello
```

## `cd packages/hello && vpr where`

vpr 的等价 cd 形式

```
~/packages/hello$ node -e "console.log('cwd base: ' + require('node:path').basename(process.cwd()))" ⊘ cache disabled
cwd base: hello
```

## `vpr -C`

直接运行 `vpr -C` 会报告缺少目录参数，而不是运行名为 `-C` 的任务

**退出代码：** 1

```
-C requires a directory argument
```

## `vp -C packages/missing build`

缺少目录错误

**退出代码：** 1

```
directory not found: packages/missing
```

## `vp pack packages/hello`

位置参数会作为从调用目录解析的 tsdown 入口

```
VITE+ - 面向 Web 的统一工具链

ℹ 入口：packages/hello
ℹ 开始构建
ℹ dist/hello.mjs  <大小> kB │ gzip：<大小> kB
ℹ 1 个文件，总计：<大小> kB
✔ 构建完成，用时 <时长>
```

## `vpt list-dir dist`

上游语义：输出位于调用目录

```
hello.mjs
```

## `vp run where:hello`

命令以 vp -C 开头的脚本会原样运行，并遵循该目录

```
VITE+ - The Unified Toolchain for the Web

$ vp -C packages/hello run where ⊘ cache disabled
VITE+ - The Unified Toolchain for the Web

~/packages/hello$ node -e "console.log('cwd base: ' + require('node:path').basename(process.cwd()))" ⊘ cache disabled
cwd base: hello
```
