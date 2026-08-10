# 迁移不支持 lintstagedrc。

## `git init`


## `vp migrate --no-interactive`

迁移应在检查 lint-staged 配置格式之前保留 Husky

```
VITE+ - Web 的统一工具链

⚠ 检测到 Husky — 保持其钩子、配置和依赖不变。请在启用 Vite+ 钩子之前手动迁移 Husky。
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

检查 Husky prepare 和依赖项是否得以保留

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
