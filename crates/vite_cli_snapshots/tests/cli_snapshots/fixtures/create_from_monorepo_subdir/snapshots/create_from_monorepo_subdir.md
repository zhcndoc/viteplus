# 从 monorepo 子目录创建

## `cd apps/website && vp create --no-interactive vite:generator`

来自工作区子目录


## `vpt stat-file tools/vite-plus-generator/package.json --assert file`

创建于 tools/vite-plus-generator，而不是 apps/website/

```
tools/vite-plus-generator/package.json: file
```

## `cd apps/website && vp create --no-interactive --git vite:generator`

--git 在 monorepo 包创建中不可用

**退出代码：** 1

```
在向现有 monorepo 添加包时，--git/--no-git 选项不可用
```

## `cd apps/website && vp create --no-interactive --no-git vite:generator`

在 monorepo 包创建中，`--no-git` 不可用

**退出代码：** 1

```
在向现有 monorepo 添加包时，--git/--no-git 选项不可用
```

## `cd apps/website && vp create --no-interactive --git vite:application`

--git 对于 monorepo 包创建不可用

**退出代码：** 1

```
在向现有 monorepo 添加包时，--git/--no-git 选项不可用
```

## `cd apps/website && vp create --no-interactive --no-git vite:library`

--no-git 在 monorepo 包创建中不可用

**退出代码：** 1

```
在向现有 monorepo 添加包时，--git/--no-git 选项不可用
```

## `vpt stat-file apps/website/tools/vite-plus-generator/package.json --assert-not file`

未在 apps/website/ 内创建

```
apps/website/tools/vite-plus-generator/package.json: 缺失
```

## `cd apps && vp create --no-interactive vite:application`

从工作区父目录


## `vpt stat-file apps/vite-plus-application/package.json --assert file`

创建于 apps/vite-plus-application

```
apps/vite-plus-application/package.json: file
```

## `cd scripts/helper && vp create --no-interactive vite:library`

来自非工作区目录


## `vpt stat-file packages/vite-plus-library/package.json --assert file`

创建于 packages/vite-plus-library

```
packages/vite-plus-library/package.json: file
```

## `vpt stat-file scripts/helper/packages/vite-plus-library/package.json --assert-not file`

未在 scripts/helper/ 内创建

```
scripts/helper/packages/vite-plus-library/package.json: 缺失
```

## `cd scripts/helper && vp create --no-interactive vite:application --directory apps/custom-app`

来自非工作区目录的 `--directory`


## `vpt stat-file apps/custom-app/package.json --assert file`

在 apps/custom-app 中使用 --directory 创建

```
apps/custom-app/package.json: file
```

## `vpt mkdir -p apps/dot-test`

--来自 monorepo 子目录的目录 .


## `cd apps/dot-test && vp create --no-interactive vite:application --directory .`


## `vpt stat-file apps/dot-test/package.json --assert file`

在 apps/dot-test 中使用 --directory . 创建

```
apps/dot-test/package.json: 文件
```

## `vp create --no-interactive vite:application --directory .`

从 monorepo 根目录使用 `--directory .` 应当失败

**退出代码：** 1

```
Cannot scaffold into the monorepo root directory. Use --directory to specify a target directory
```

## `vpt mkdir -p apps/website/src`

-- 在现有包内使用 `--directory .` 应该失败


## `cd apps/website/src && vp create --no-interactive vite:application --directory .`

**退出代码：** 1

```
无法在现有包“website”(apps/website)内搭建脚手架。请使用 --directory 指定其他位置
```

## `cd apps/website && vp create --no-interactive vite:application --directory .`

--directory . 在已存在的包根目录下应当失败

**退出代码：** 1

```
Cannot scaffold inside existing package "website" (apps/website). Use --directory to specify a different location
```
