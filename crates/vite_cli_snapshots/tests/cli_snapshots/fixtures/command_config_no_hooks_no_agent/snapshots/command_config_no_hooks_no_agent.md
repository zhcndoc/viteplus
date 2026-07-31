# command_config_no_hooks_no_agent

## `git init`


## `vp config --no-hooks --no-agent`

应跳过钩子安装和代理指令更新

```
```

## `vpt stat-file .vite-hooks/_/pre-commit --assert missing`

不应安装钩子

```
.vite-hooks/_/pre-commit: missing
```

## `vpt grep-file AGENTS.md 'OUTDATED CONTENT'`

代理必须保持不变（过时标记仍然存在）

```
AGENTS.md: found "OUTDATED CONTENT"
```
