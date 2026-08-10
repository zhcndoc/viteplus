# 迁移_无代理

## `vp migrate --no-agent --no-interactive`

使用 --no-agent 进行迁移时应跳过代理指令

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新，已重写 1 个文件中的导入
```

## `vpt stat-file AGENTS.md --assert-not file`

使用 --no-agent 时未创建 AGENTS.md

```
AGENTS.md：缺失
```

## `vpt stat-file CLAUDE.md --assert-not file`

使用 --no-agent 时未创建 CLAUDE.md

```
CLAUDE.md: missing
```
