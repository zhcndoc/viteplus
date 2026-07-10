# 从非工作区子目录创建

## `cd scripts && vp create --no-interactive vite:application`

来自非 monorepo 的子目录


## `vpt stat-file scripts/vite-plus-application/package.json --assert 文件`

创建于 scripts/vite-plus-application

```
scripts/vite-plus-application/package.json: 文件
```

## `vpt stat-file vite-plus-application/package.json --assert-not file`

未在父级根目录创建

```
vite-plus-application/package.json: 缺失
```
