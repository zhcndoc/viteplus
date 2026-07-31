# migration_lintstagedrc_staged_exists

## `git init`


## `vp migrate --no-interactive`

当 `vite.config.ts` 中已存在 `staged` 时应发出警告

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• Git hooks 已配置
! 警告：
  - 已找到 .lintstagedrc.json，但 vite.config.ts 中已存在 "staged" — 请手动合并
```

## `vpt print-file package.json`

检查 package.json

```
{
  "name": "migration-lintstagedrc-staged-exists",
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
  },
  "scripts": {
    "prepare": "vp config"
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

## `vpt stat-file .lintstagedrc.json --assert file`

lintstagedrc.json 应该仍然存在

```
.lintstagedrc.json: file
```

## `vpt print-file vite.config.ts`

vite 配置应保持不变

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {},
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
  staged: {
    '*.js': 'vp check --fix',
  },
});
```
