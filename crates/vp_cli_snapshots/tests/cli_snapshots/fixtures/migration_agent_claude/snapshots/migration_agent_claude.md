# migration_agent_claude

## `vp migrate --agent claude --no-interactive`

使用 --agent claude 进行迁移时应写入 CLAUDE.md

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新，已重写 1 个文件中的导入
```

## `vpt grep-file CLAUDE.md '<'\!'--VITE PLUS START-->'`

CLAUDE.md 已通过 Vite+ 代理区块创建

```
CLAUDE.md: found "<!--VITE PLUS START-->"
```
