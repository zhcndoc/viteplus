# cache_scripts_default

## `vp run hello`

默认情况下应禁用 package.json 脚本的缓存

```
$ node hello.mjs ⊘ cache disabled
hello from script
```

## `vp run hello`

第二次运行也应显示缓存已禁用

```
$ node hello.mjs ⊘ cache disabled
hello from script
```
