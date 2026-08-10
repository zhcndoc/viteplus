# 检查缓存是否启用

## `vp run check`

首次运行应为缓存未命中

```
$ vp check
通过：全部 3 个文件的格式均正确（<duration>，<n> 个线程）
通过：在 2 个文件中未发现警告或 lint 错误（<duration>，<n> 个线程）
```

## `vp run check`

第二次运行应命中缓存

```
$ vp check ◉ 命中缓存，正在重放
通过：全部 3 个文件的格式均正确（<duration>，<n> 个线程）
通过：在 2 个文件中未发现警告或 lint 错误（<duration>，<n> 个线程）

---
vp run：命中缓存，节省 <duration>。
```

## `vpt write-file src/foo.js 'export const foo = 1;
'`

```
```

## `vp run check`

添加新文件后，第三次运行应为缓存未命中

```
$ vp check ○ 缓存未命中：在 'src' 中添加了 'foo.js'，正在执行
通过：4 个文件的格式均正确（<duration>，<n> 个线程）
通过：在 3 个文件中未发现警告或 lint 错误（<duration>，<n> 个线程）
```
