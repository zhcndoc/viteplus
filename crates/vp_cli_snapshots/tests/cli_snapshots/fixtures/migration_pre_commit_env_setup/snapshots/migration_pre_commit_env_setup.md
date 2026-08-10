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

迁移应保留现有的 Husky 钩子

```
VITE+ - Web 的统一工具链

⚠ 检测到 Husky — 保持其钩子、配置和依赖不变。在启用 Vite+ 钩子之前，请手动迁移 Husky。
◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file .husky/pre-commit`

检查 Husky 钩子是否未被更改

```
#!/usr/bin/env sh
export NODE_OPTIONS="--max-old-space-size=4096"
npx lint-staged
npm test
```
