# 迁移前提交环境设置

## `git init`


## `vpt mkdir -p .husky`


## `vpt write-file .husky/pre-commit '#'\!'/usr/bin/env sh
export NODE_OPTIONS="--max-old-space-size=4096"
npx lint-staged
npm test
'`


## `vpt chmod 755 .husky/pre-commit`


## `vpt print-file .husky/pre-commit`

迁移前检查 pre-commit 钩子

```
#!/usr/bin/env sh
export NODE_OPTIONS="--max-old-space-size=4096"
npx lint-staged
npm test
```

## `vp migrate --no-interactive`

迁移应原地替换 lint-staged

```
VITE+ - The Unified Toolchain for the Web

◇ Migrated . to Vite+ <version>
• Node <version>  pnpm <version>
• 2 config updates applied
• Git hooks configured
```

## `vpt print-file .vite-hooks/pre-commit`

检查 `vp staged` 是否已原地替代 `npx lint-staged`

```
#!/usr/bin/env sh
export NODE_OPTIONS="--max-old-space-size=4096"
vp staged
npm test
```
