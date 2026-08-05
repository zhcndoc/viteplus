# 从非工作区子目录创建

## `cd scripts && vp create --no-interactive --package-manager pnpm vite:application`

显式指定的包管理器会覆盖非工作区祖先配置


## `vpt stat-file scripts/vite-plus-application/package.json --assert 文件`

创建于 scripts/vite-plus-application

```
scripts/vite-plus-application/package.json: 文件
```

## `vpt grep-file scripts/vite-plus-application/package.json '"name": "pnpm"'`

在 devEngines 中固定 pnpm 版本

```
scripts/vite-plus-application/package.json: found "\"name\": \"pnpm\""
```

## `vpt stat-file vite-plus-application/package.json --assert-not file`

未在父级根目录创建

```
vite-plus-application/package.json: 缺失
```
