# 将 ESLint monorepo 插件迁移到 packages 中

## `vp migrate --no-interactive`

工作区软件包将与根目录一样进行相同的激进清理（依赖项、配置、lint-staged）

```
VITE+ - 面向 Web 的统一工具链

✔ 已在 vite.config.ts 中创建 vite.config.ts

✔ 已将 .oxlintrc.json 合并到 vite.config.ts
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 3 项配置更新
• 已将 ESLint 规则迁移到 Oxlint
```

## `vpt print-file package.json`

根目录：已移除 eslint + eslint-config-airbnb

```
{
  "name": "migration-eslint-monorepo-plugins-in-packages",
  "scripts": {
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

工作区：已移除 eslint、eslint-plugin-vue、@typescript-eslint/parser；保留 @typescript-eslint/utils（可复用的 AST 库）

```
{
  "name": "@test/app",
  "scripts": {
    "dev": "vp dev",
    "lint": "vp lint ."
  },
  "devDependencies": {
    "@typescript-eslint/utils": "^8.0.0",
    "vite": "catalog:",
    "vite-plus": "catalog:"
  }
}
```

## `vpt print-file packages/lint-config/package.json`

工作区：已移除所有 eslint-plugin-*；已清理 peerDeps.eslint（为空时删除该字段）

```
{
  "name": "@test/lint-config",
  "scripts": {
    "lint": "vp lint ."
  }
}
```

## `vpt stat-file packages/app/eslint.config.mjs --assert-not file`

工作区 eslint 配置已删除

```
packages/app/eslint.config.mjs: missing
```

## `vpt print-file packages/app/.lintstagedrc.json`

工作区 lint-staged 已重写（eslint --fix → vp lint --fix）

```
{
  "*.ts": "vp lint --fix"
}
```
