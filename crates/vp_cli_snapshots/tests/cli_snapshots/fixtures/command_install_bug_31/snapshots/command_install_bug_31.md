# command_install_bug_31

## `vp install --no-frozen-lockfile --silent`

安装依赖项

```
```

## `vpt mkdir -p packages/sub-project`

创建子项目和 package.json

```
```

## `vpt write-file packages/sub-project/package.json '{"name": "sub-project", "dependencies": { "testnpm2": "1.0.0" }}
'`

```
```

## `vp install --no-frozen-lockfile --silent`

再次安装应正常工作且不使用缓存

```
```

## `vpt list-dir packages/sub-project/node_modules/testnpm2/package.json`

检查 testnpm2 是否已安装

```
packages/sub-project/node_modules/testnpm2/package.json
```

## `vpt mkdir -p others/other`

创建非工作区项目

``` 
```

## `vpt write-file others/other/package.json '{"name": "other", "dependencies": { "testnpm2": "1.0.0" }}
'`

```
```

## `vp install --no-frozen-lockfile --silent`

应该安装缓存命中项

```
```

## `vpt stat-file others/other/node_modules/testnpm2 --assert-not dir`

目录不得存在

```
others/other/node_modules/testnpm2: missing
```

## `vpt rm -rf packages/sub-project`

删除子项目

```
```

## `vp install --no-frozen-lockfile --silent`

应在不使用缓存的情况下重新安装

```
```
