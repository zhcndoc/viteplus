# 迁移现有的 pre-commit

## `git init`


## `vpt mkdir -p .husky`


## `vpt write-file .husky/pre-commit '#'\!'/usr/bin/env sh
npm test
secret-scan
'`


## `vpt chmod 755 .husky/pre-commit`


## `vpt print-file .husky/pre-commit`

迁移前检查现有的 pre-commit 钩子

```
#!/usr/bin/env sh
npm test
secret-scan
```

## `vp migrate --no-interactive`

迁移应保留现有的 pre-commit 内容

```
VITE+ - The Unified Toolchain for the Web

◇ Migrated . to Vite+ <version>
• Node <version>  pnpm <version>
• 2 config updates applied
• Git hooks configured
```

## `vpt print-file .vite-hooks/pre-commit`

检查 pre-commit 钩子是否保留现有命令

```
#!/usr/bin/env sh
npm test
secret-scan
vp staged
```
