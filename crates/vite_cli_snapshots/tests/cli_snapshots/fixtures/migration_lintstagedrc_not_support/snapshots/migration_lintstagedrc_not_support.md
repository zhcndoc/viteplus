# 迁移不支持 lintstagedrc

## `git init`


## `vp migrate --no-interactive`

迁移不应支持非 JSON 格式的 lintstagedrc

```
VITE+ - Web 的统一工具链

⚠ 不支持的 lint-staged 配置格式 — 跳过 Git hooks 设置。请手动配置 Git hooks。
◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file .lintstagedrc`

检查 .lintstagedrc 是否已更新

```
'*.js':
  - oxlint
  - oxfmt
```

## `vpt print-file .lintstagedrc.yaml`

检查 .lintstagedrc.yaml 是否已更新

```
'*.js':
  - oxlint
  - oxfmt
```

## `vpt print-file lint-staged.config.mjs`

检查 lint-staged.config.mjs 是否已更新

```
export default {
  '*.js': ['oxlint', 'oxfmt'],
};
```

## `vpt print-file package.json`

检查到 hooks 设置被跳过，但 husky/lint-staged 已从 devDependencies 中移除

```
{
  "name": "migration-lintstagedrc-not-support",
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
