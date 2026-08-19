# 迁移_prettier_lint_staged

## `vp migrate --no-interactive`

迁移应检测 Prettier 并自动迁移，包括 lint-staged

```
VITE+ - Web 的统一工具链

检测到 Prettier 配置。正在自动迁移到 Oxfmt...
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
• 已将 Prettier 迁移到 Oxfmt
```

## `vpt print-file package.json`

检查 prettier 已移除，scripts 已重写，lint-staged 已重写

```
{
  "name": "migration-prettier-lint-staged",
  "scripts": {
    "format": "vp fmt .",
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
  vite@*: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```

## `vpt print-file vite.config.ts`

检查 oxfmt 配置以及合并到 vite.config.ts 中的 staged 配置

```
import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
  staged: {
    "*.ts": "vp fmt"
  },
  fmt: {
    semi: true,
    printWidth: 80,
    sortPackageJson: false,
    ignorePatterns: [],
  },
});
```
