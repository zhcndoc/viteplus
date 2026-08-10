# vp_build_cache_monorepo

## `vp run app#build`

应从根目录构建应用


## `vpt list-dir packages/app/dist`

应包含构建输出

```
assets
index.html
```

## `vp run app#build`

应从根目录命中缓存

```
~/packages/app$ vp build ◉ cache hit, replaying
transforming...✓ 4 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                <size> kB │ gzip: <size> kB
dist/assets/index-<hash>.js  <size> kB │ gzip: <size> kB

✓ built in <duration>

---
vp run: cache hit, <duration> saved.
```

## `cd packages/app && vp run build`

应从子目录命中缓存

```
~/packages/app$ vp build ◉ 缓存命中，正在重放
正在转换...✓ 已转换 4 个模块。
正在渲染代码块...
正在计算 gzip 大小...
dist/index.html                <size> kB │ gzip: <size> kB
dist/assets/index-<hash>.js  <size> kB │ gzip: <size> kB

✓ 构建完成，用时 <duration>

---
vp run：缓存命中，节省 <duration>。
```

## `cd packages/app && vp build`

直接执行 `vp build` 不应被缓存


## `cd packages/app && vp build`

直接运行 `vp build` 不会使用缓存

```
注意：您正在将 `vp build` 作为 Vite+ 内置命令运行。如果您想运行 build npm 脚本，请改用 `vpr build`。
✓ 已转换 4 个模块。
正在计算 gzip 大小...
dist/index.html                <size> kB │ gzip：<size> kB
dist/assets/index-<hash>.js  <size> kB │ gzip：<size> kB

✓ 已在 <duration> 内构建完成
```

## `vpt write-file packages/app/index.html '<html><body><script type="module">console.log("changed");</script></body></html>
'`

```
```

## `vp run app#build`

源代码更改后应未命中缓存

```
~/packages/app$ vp build ○ cache miss: 'packages/app/index.html' modified, executing
transforming...✓ 4 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                <size> kB │ gzip: <size> kB
dist/assets/index-<hash>.js  <size> kB │ gzip: <size> kB

✓ built in <duration>
```

## `cd packages/web && vp run build`

应首先从子目录构建


## `vpt list-dir packages/web/dist`

应包含构建输出

```
assets
index.html
```

## `cd packages/web && vp run build`

应从子目录命中缓存

```
~/packages/web$ vp build ◉ 缓存命中，正在重放
正在转换...✓ 已转换 4 个模块。
正在渲染代码块...
正在计算 gzip 大小...
dist/index.html                <size> kB │ gzip: <size> kB
dist/assets/index-<hash>.js  <size> kB │ gzip: <size> kB

✓ 构建完成，用时 <duration>

---
vp run：缓存命中，节省 <duration>。
```

## `vp run web#build`

在子目录构建后，应从根目录命中缓存

```
~/packages/web$ vp build ◉ cache hit, replaying
transforming...✓ 4 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                <size> kB │ gzip: <size> kB
dist/assets/index-<hash>.js  <size> kB │ gzip: <size> kB

✓ built in <duration>

---
vp run: cache hit, <duration> saved.
```
