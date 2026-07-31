# 迁移现有的 lint-staged 配置

## `git init`


## `vp migrate --no-interactive`

迁移应添加 prepare 脚本，并从 devDeps 中移除 lint-staged

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 3 项配置更新
• 已配置 Git 钩子
```

## `vpt print-file package.json`

检查是否已添加 prepare 脚本，lint-staged 是否已从 devDeps 中移除

```
{
  "name": "migration-existing-lint-staged-config",
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

## `vpt stat-file .lintstagedrc.json --assert-not file`

检查 lintstagedrc.json（内联到 vite.config.ts 后应删除）

```
.lintstagedrc.json: missing
```

## `vpt print-file vite.config.ts`

检查暂存配置是否已迁移到 vite.config.ts

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {},
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
  staged: {
    "*.ts": "vp lint --fix"
  },
});
```

## `vpt print-file .vite-hooks/pre-commit`

检查 pre-commit hook 是否已创建

```
vp staged
```
