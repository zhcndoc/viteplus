# 迁移_ESLint_单仓库_仅限包

## `vp migrate --no-interactive`

迁移应针对仅存在于包中的 eslint 发出警告

```
VITE+ - Web 的统一工具链

在工作区包中检测到 ESLint，但未找到根配置。包级 ESLint 必须手动迁移。
◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
```

## `vpt print-file package.json`

检查根目录 package.json

```
{
  "name": "migration-eslint-monorepo-package-only",
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
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

检查 app 的 eslint 配置已保留（未迁移）

```
{
  "name": "app",
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "lint": "eslint .",
    "lint:fix": "eslint --fix ."
  },
  "devDependencies": {
    "eslint": "^9.0.0",
    "vite": "catalog:",
    "vite-plus": "catalog:"
  }
}
```

## `vpt print-file packages/app/eslint.config.mjs`

检查 package eslint 配置已保留

```
export default [
  {
    rules: {
      'no-unused-vars': 'error',
    },
  },
];
```
