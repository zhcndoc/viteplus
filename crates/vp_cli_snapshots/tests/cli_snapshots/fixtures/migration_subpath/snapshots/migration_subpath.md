# 迁移子路径

## `git init`


## `vp migrate foo --no-interactive`

带子路径的迁移工作

```
VITE+ - 面向 Web 的统一工具链

⚠ 检测到子目录项目 — 跳过 Git hooks 设置。请在仓库根目录配置 hooks。
◇ 已将 foo 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file foo/package.json`

检查 package.json

```
{
  "name": "migration-subpath",
  "lint-staged": {
    "*.@(js|ts|tsx|yml|yaml|md|json|html|toml)": [
      "oxfmt --staged",
      "eslint --fix"
    ],
    "*.@(js|ts|tsx)": [
      "oxlint --fix"
    ]
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

## `vpt print-file foo/vite.config.ts`

检查 vite.config.ts

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {},
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
});
```

## `vpt stat-file .vite-hooks --assert-not dir`

根 git hooks 未为子目录迁移设置

```
.vite-hooks: missing
```

## `vpt print-file foo/pnpm-workspace.yaml`

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
