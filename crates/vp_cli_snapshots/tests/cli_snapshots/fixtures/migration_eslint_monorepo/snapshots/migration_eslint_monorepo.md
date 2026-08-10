# 迁移 ESLint Monorepo

## `vp migrate --no-interactive`

迁移应检测 monorepo 中的 eslint，并迁移所有包

```
VITE+ - Web 的统一工具链

✔ 已在 vite.config.ts 中创建 vite.config.ts

✔ 已将 .oxlintrc.json 合并到 vite.config.ts
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
• 已将 ESLint 规则迁移到 Oxlint
```

## `vpt print-file package.json`

检查根目录 eslint 已移除且脚本已重写

```
{
  "name": "migration-eslint-monorepo",
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "lint": "vp lint .",
    "prepare": "vp config"
  },
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "packageManager": "pnpm@10.18.0"
}
```

## `vpt print-file packages/app/package.json`

检查 app 的 eslint 已移除，脚本已重写

```
{
  "name": "app",
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "lint": "vp lint .",
    "lint:fix": "vp lint --fix ."
  },
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  }
}
```

## `vpt print-file packages/utils/package.json`

检查 utils 的 eslint 是否已移除，以及 scripts 是否已重写

```
{
  "name": "@test/utils",
  "scripts": {
    "lint": "vp lint ."
  }
}
```

## `vpt stat-file eslint.config.mjs --assert-not file`

检查根目录 eslint 配置已被移除

```
eslint.config.mjs: missing
```
