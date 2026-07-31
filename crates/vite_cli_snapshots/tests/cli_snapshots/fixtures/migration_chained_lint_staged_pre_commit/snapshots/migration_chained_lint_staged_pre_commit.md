# 迁移_链式_lint_暂存_预提交

## `git init`


## `vp migrate --no-interactive`

迁移应保留 lint-staged 之后的链式命令

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <版本>
• Node <版本>  pnpm <版本>
• 已应用 2 项配置更新
• 已配置 Git 钩子
```

## `vpt print-file package.json`

检查 prepare 已重写，并且 husky/lint-staged 已移除

```
{
  "name": "migration-chained-lint-staged-pre-commit",
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

检查暂存配置是否已迁移到 vite.config.ts

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

检查 npx lint-staged 已被替换，但保留了 --diff HEAD~1 && npm test

```
vp staged --diff HEAD~1 && npm test
```
