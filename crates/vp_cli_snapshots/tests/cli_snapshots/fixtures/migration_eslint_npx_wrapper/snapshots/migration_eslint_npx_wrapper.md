# 迁移 ESLint npx 包装器

## `vp migrate --no-interactive`

迁移应重写裸的 eslint 和 bunx eslint，但保留其他包装器不变

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 4 项配置更新
• 已将 ESLint 规则迁移到 Oxlint
```

## `vpt print-file package.json`

检查 eslint 已移除，裸调用和 bunx eslint 已重写，npx/pnpm exec 未更改

```
{
  "name": "migration-eslint-npx-wrapper",
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "lint": "npx eslint .",
    "lint:fix": "pnpm exec eslint --fix .",
    "lint:bunx": "bunx vp lint .",
    "lint:bare": "vp lint --fix .",
    "prepare": "vp config"
  },
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "<version>",
      "onFail": "download"
    }
  }
}
```

## `vpt print-file pnpm-workspace.yaml`

检查 pnpm-workspace.yaml 是否包含 overrides 和 catalog

```
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
overrides:
  vite: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```

## `vpt stat-file eslint.config.mjs --assert-not file`

检查 eslint 配置是否已删除

```
eslint.config.mjs: missing
```
