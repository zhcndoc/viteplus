# 命令_配置_更新_代理

## `git init`


## `vp config`

应自动更新代理指令

```
```

## `vpt grep-file AGENTS.md 'Custom instructions here.'`

user content above the managed block preserved

```
AGENTS.md: found "Custom instructions here."
```

## `vpt grep-file AGENTS.md 'More custom content below.'`

管理区块以下的用户内容已保留

```
AGENTS.md: found "More custom content below."
```

## `vpt grep-file AGENTS.md 'OUTDATED CONTENT'`

outdated content replaced (grep-file prints missing)

**Exit code:** 1

```
AGENTS.md: 缺少 "OUTDATED CONTENT"
未找到匹配模式
```
