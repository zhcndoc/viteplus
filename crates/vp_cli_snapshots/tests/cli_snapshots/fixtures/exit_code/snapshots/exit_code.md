# 退出代码

## `vp run script1`

script1 运行，创建缓存并应成功

```
$ echo 'success' ⊘ cache disabled
success
```

## `vp run script1`

script1 应该命中更新后的缓存

```
$ echo 'success' ⊘ 缓存已禁用
success
```

## `vp run script2`

script2 应失败且不进行缓存

**退出代码：** 1

```
$ node failure.js
failure
```

## `vp run script2`

script2 应失败且不应缓存

**退出代码：** 1

```
$ node failure.js
failure
```
