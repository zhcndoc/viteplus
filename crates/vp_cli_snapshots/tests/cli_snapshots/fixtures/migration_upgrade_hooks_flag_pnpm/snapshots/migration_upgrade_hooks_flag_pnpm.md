# migration_upgrade_hooks_flag_pnpm

## `git init`


## `vp migrate --hooks --no-interactive`

现有 Vite+ 项目：升级并仅启用 git 钩子操作

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖：
    vite-plus  0.1.21 → <version>
    vite              → <version>
• 已应用 2 项配置更新
• Git 钩子已配置
• 包管理器设置已配置
```

## `git config --local core.hooksPath`

钩子配置为 .vite-hooks/_

```
.vite-hooks/_
```

## `vpt print-file .vite-hooks/pre-commit`

pre-commit 钩子运行 vp staged

```
vp staged
```

## `vpt stat-file .nvmrc --assert file`

未使用 `--full` 时，Node 版本文件不会被迁移

```
.nvmrc: file
```

## `vpt stat-file .node-version --assert-not file`

仅运行了 hooks 操作

```
.node-version: missing
```
