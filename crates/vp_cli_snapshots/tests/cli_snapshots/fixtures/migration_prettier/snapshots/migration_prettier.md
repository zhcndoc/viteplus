# 迁移_prettier

## `vp migrate --no-interactive`

迁移应检测 Prettier 并自动迁移

```
VITE+ - Web 的统一工具链

检测到 Prettier 配置。正在自动迁移到 Oxfmt...
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
• 已将 Prettier 迁移到 Oxfmt
```

## `vpt print-file package.json`

检查 prettier 是否已移除以及脚本是否已重写

```
{
  "name": "migration-prettier",
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "format": "vp fmt .",
    "format:check": "vp fmt --check .",
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

## `vpt stat-file .prettierrc.json --assert-not file`

检查 prettier 配置已被移除

```
.prettierrc.json：缺失
```

## `vpt print-file vite.config.ts`

检查合并到 vite.config.ts 中的 oxfmt 配置

```
import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix"
  },
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
  fmt: {
    semi: true,
    singleQuote: true,
    printWidth: 80,
    sortPackageJson: false,
    ignorePatterns: [],
  },
});
```
