# 命令包单体仓库

## `vp run hello#build`

应从根目录构建该库


## `vpt list-dir packages/hello/dist`

应包含该库

```
index.cjs
```

## `vp run hello#build`

应从根目录命中缓存

```
~/packages/hello$ vp pack ◉ 命中缓存，正在重放
ℹ 入口：src/index.ts
ℹ 开始构建
ℹ dist/index.cjs  <size> kB │ gzip：<size> kB
ℹ 1 个文件，总计：<size> kB
✔ 构建在 <duration> 内完成

---
vp run：命中缓存，节省 <duration>。
```

## `cd packages/hello && vp run build`

应从子目录命中缓存

```
~/packages/hello$ vp pack ◉ cache hit, replaying
ℹ entry: src/index.ts
ℹ Build start
ℹ dist/index.cjs  <size> kB │ gzip: <size> kB
ℹ 1 files, total: <size> kB
✔ Build complete in <duration>

---
vp run: cache hit, <duration> saved.
```

## `cd packages/hello && vp pack`

直接执行 vp pack 不应被缓存


## `cd packages/hello && vp pack`

直接执行 vp pack 不使用缓存

```
ℹ 入口：src/index.ts
ℹ 开始构建
ℹ 清理 <n> 个文件
ℹ dist/index.cjs  <size> kB │ gzip：<size> kB
ℹ 共 1 个文件，总计：<size> kB
✔ 构建在 <duration> 内完成
```

## `vpt write-file packages/hello/src/hello.ts 'export function hello() { console.log("changed"); }
'`

```
```

## `vp run hello#build`

源代码更改后应未命中缓存

```
~/packages/hello$ vp pack ○ 缓存未命中：已修改 'packages/hello/src/hello.ts'，正在执行
ℹ 入口：src/index.ts
ℹ 开始构建
ℹ 清理 <n> 个文件
ℹ dist/index.cjs  <size> kB │ gzip：<size> kB
ℹ 1 个文件，总计：<size> kB
✔ 构建在 <duration> 内完成
```

## `cd packages/array-config && vp run build`

应该从子目录构建该库


## `vpt list-dir packages/array-config/dist`

应包含该库

```
index.d.mts
index.mjs
```

## `cd packages/array-config && vp run build`

应从子目录命中缓存

```
~/packages/array-config$ vp pack ◉ cache hit, replaying
ℹ entry: ./src/sub/index.ts
ℹ Build start
ℹ dist/index.mjs    <size> kB │ gzip: <size> kB
ℹ dist/index.d.mts  <size> kB │ gzip: <size> kB
ℹ 2 files, total: <size> kB
✔ Build complete in <duration>

---
vp run: cache hit, <duration> saved.
```

## `vp run array-config#build`

在子目录构建后，从根目录运行应命中缓存

```
~/packages/array-config$ vp pack ◉ cache hit, replaying
ℹ entry: ./src/sub/index.ts
ℹ Build start
ℹ dist/index.mjs    <size> kB │ gzip: <size> kB
ℹ dist/index.d.mts  <size> kB │ gzip: <size> kB
ℹ 2 files, total: <size> kB
✔ Build complete in <duration>

---
vp run: cache hit, <duration> saved.
```

## `vp run default-config#build`

应从根目录构建该库


## `vpt list-dir packages/default-config/dist`

应包含该库

```
index.mjs
```

## `cd packages/default-config && vp run build`

应从子目录命中缓存

```
~/packages/default-config$ vp pack ◉ cache hit, replaying
ℹ entry: src/index.ts
ℹ Build start
ℹ dist/index.mjs  <size> kB │ gzip: <size> kB
ℹ 1 files, total: <size> kB
✔ Build complete in <duration>

---
vp run: cache hit, <duration> saved.
```
