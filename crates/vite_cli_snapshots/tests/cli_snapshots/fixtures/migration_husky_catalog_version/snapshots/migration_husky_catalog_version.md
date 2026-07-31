# 迁移_husky_目录_版本

## `git init`


## `vp migrate --no-interactive`

应从目录中解析 husky 版本并配置钩子，且不显示警告

```
VITE+ - Web 的统一工具链

✔ 已在 vite.config.ts 中创建 vite.config.ts

✔ 已将暂存配置合并到 vite.config.ts
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• Git 钩子已配置
```

## `vpt print-file package.json`

应移除 husky 和 lint-staged，并将 prepare 重写为 vp config

```
{
  "name": "migration-husky-catalog-version",
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
packages:
  - .

catalog:
  husky: ^9.1.7
  lint-staged: ^16.2.6
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

检查 pre-commit 钩子已重写

```
vp staged
```
