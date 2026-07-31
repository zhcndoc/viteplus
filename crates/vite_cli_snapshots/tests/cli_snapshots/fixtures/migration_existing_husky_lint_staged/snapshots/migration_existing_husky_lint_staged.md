# 迁移现有的 Husky lint-staged

## `git init`


## `vp migrate --no-interactive`

迁移应重写 husky 和 lint-staged

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
• 已配置 Git hooks
```

## `vpt print-file package.json`

检查 prepare 已重写，lint-staged 已移除，两者均已从 devDeps 中移除

```
{
  "name": "migration-existing-husky-lint-staged",
  "scripts": {
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

## `vpt print-file vite.config.ts`

检查暂存配置已迁移至 vite.config.ts

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {},
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
  staged: {
    "*.js": "vp lint --fix"
  },
});
```

## `vpt print-file .vite-hooks/pre-commit`

检查 pre-commit 钩子是否已重写

```
vp staged
```
