# 在脚本中迁移 lint-staged

## `git init`


## `vp migrate --no-interactive`

迁移应在检测到 Husky 时保留 lint-staged 命令

```
VITE+ - Web 的统一工具链

⚠ 检测到 Husky — 保留其钩子、配置和依赖不变。在启用 Vite+ 钩子之前，请手动迁移 Husky。
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file package.json`

检查 Husky prepare、lint-staged 脚本、依赖项和配置是否保留

```
{
  "name": "migration-lint-staged-in-scripts",
  "scripts": {
    "prepare": "husky",
    "check-staged": "lint-staged --diff HEAD~1"
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
  vite: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```

## `vpt print-file vite.config.ts`

检查暂存的配置是否尚未迁移，同时 Husky 管理着该钩子

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {},
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
});
```
