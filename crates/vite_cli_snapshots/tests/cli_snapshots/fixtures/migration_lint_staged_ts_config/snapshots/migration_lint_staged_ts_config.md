# migration_lint_staged_ts_config

## `git init`


## `vp migrate --no-interactive`

迁移应对不受支持的 TS lint-staged 配置发出警告

```
VITE+ - 面向 Web 的统一工具链

⚠ 不支持的 lint-staged 配置格式 — 跳过 Git hooks 设置。请手动配置 Git hooks。
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file package.json`

检查 lint-staged 未添加到 package.json，husky/lint-staged 已从 devDependencies 中移除

```
{
  "name": "migration-lint-staged-ts-config",
  "type": "module",
  "scripts": {
    "prepare": "husky"
  },
  "devDependencies": {
    "husky": "^9.1.7",
    "lint-staged": "^16.2.6",
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

## `vpt print-file lint-staged.config.ts`

检查 TS 配置未被修改

```
export default {
  "*.{js,ts}": ["oxlint --fix", "oxfmt"],
};
```
