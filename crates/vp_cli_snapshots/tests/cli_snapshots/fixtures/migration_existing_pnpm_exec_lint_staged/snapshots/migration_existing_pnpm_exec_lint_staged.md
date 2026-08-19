# 迁移现有的 pnpm exec lint-staged

## `git init`


## `vp migrate --no-interactive`

迁移应保留现有的 Husky 配置

```
VITE+ - Web 的统一工具链

⚠ 检测到 Husky — 保持其钩子、配置和依赖不变。请先手动迁移 Husky，然后再启用 Vite+ 钩子。
◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file package.json`

检查 Husky prepare、依赖项和 lint-staged 配置是否得到保留

```
{
  "name": "migration-existing-pnpm-exec-lint-staged",
  "scripts": {
    "prepare": "husky"
  },
  "devDependencies": {
    "husky": "^9.1.7",
    "lint-staged": "^16.2.6",
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "lint-staged": {
    "*.js": "oxlint --fix"
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
  vite@*: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```

## `vpt print-file vite.config.ts`

检查暂存的配置是否尚未迁移，同时 Husky 正在管理该钩子

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {},
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
});
```

## `vpt print-file .husky/pre-commit`

检查 pnpm exec Husky 钩子是否未发生更改

```
pnpm exec lint-staged --concurrent false
```
