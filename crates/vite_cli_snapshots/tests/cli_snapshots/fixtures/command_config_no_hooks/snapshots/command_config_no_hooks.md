# 命令配置无钩子

## `git init`


## `vp config --no-hooks`

应跳过钩子安装，但更新代理说明

```

## `vpt stat-file .vite-hooks/_/pre-commit --assert missing`

不应安装钩子

```
.vite-hooks/_/pre-commit: missing
```

## `vpt grep-file AGENTS.md 'OUTDATED CONTENT'`

代理已更新：过时标记必须消失（grep-file 输出 missing）

**退出代码：** 1

```
AGENTS.md: missing "OUTDATED CONTENT"
pattern not found
```
