# 缓存清理

## `vp run hello`

为“echo hello”创建缓存

```
$ node -e "process.stdout.write('hello')"
hello
```

## `vp run hello`

命中缓存

```
$ node -e "process.stdout.write('hello')" ◉ cache hit, replaying
hello
---
vp run: cache hit, <duration> saved.
```

## `vp cache clean`

清理缓存

``` 
```

## `vp run hello`

清理后缓存未命中

```
$ node -e "process.stdout.write('hello')"
hello
```

## `cd subfolder && vp cache clean`

可从子文件夹中定位并清理缓存

```
```

## `vp run hello`

清理后缓存未命中

```
$ node -e "process.stdout.write('hello')"
hello
```
