# 迁移环境前缀暂存检查

## `git init`


## `vp migrate --no-interactive`

迁移应替换 pre-commit 中带环境变量前缀的 lint-staged

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
• 已配置 Git 钩子
```

## `vpt print-file package.json`

检查 husky/lint-staged 是否已移除，配置是否已暂存于 vite.config.ts

```
{
  "name": "migration-env-prefix-lint-staged",
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

检查 staged 配置是否已迁移到 vite.config.ts

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

检查使用 vp staged 时环境变量前缀是否保留

```
NODE_OPTIONS=--max-old-space-size=4096 vp staged
```
