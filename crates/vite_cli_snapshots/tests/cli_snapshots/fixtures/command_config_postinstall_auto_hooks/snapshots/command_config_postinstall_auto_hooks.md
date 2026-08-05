# 命令配置安装后自动钩子

## `git init`


## `vp config`

应在不提示的情况下自动安装调度器

```
```

## `git config --local core.hooksPath`

应为 .vite-hooks/_

```
.vite-hooks/_
```

## `vpt stat-file .vite-hooks/_/pre-commit --assert file`

生成的分发器垫片应存在

```
.vite-hooks/_/pre-commit: file
```

## `vpt stat-file .vite-hooks/pre-commit --assert missing`

不应创建项目钩子

```
.vite-hooks/pre-commit: missing
```

## `vpt stat-file vite.config.ts --assert missing`

不应创建 vite 配置文件

```
vite.config.ts: missing
```
