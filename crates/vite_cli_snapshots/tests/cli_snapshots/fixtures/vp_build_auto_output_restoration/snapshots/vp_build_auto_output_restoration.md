# vp_build_auto_output_restoration

## `vp run build`

首次构建会填充缓存


## `vpt list-dir dist`

构建输出存在

```
assets
index.html
```

## `vpt rm -rf dist`

删除构建输出

```

## `vp run build`

重新构建命中缓存

```
$ vp build ◉ 命中缓存，正在重放
正在转换...✓ 已转换 4 个模块。
正在渲染代码块...
正在计算 gzip 大小...
dist/index.html                <size> kB │ gzip: <size> kB
dist/assets/index-<hash>.js  <size> kB │ gzip: <size> kB

✓ 构建耗时 <duration>

---
vp run：命中缓存，节省 <duration>。
```

## `vpt list-dir dist`

缓存命中时自动恢复 dist（无合成输出配置）

```
assets
index.html
```
