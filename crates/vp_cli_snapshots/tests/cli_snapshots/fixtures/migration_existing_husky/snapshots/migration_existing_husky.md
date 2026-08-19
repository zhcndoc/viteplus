# 迁移现有的 Husky

## `git init`


## `vp migrate --no-interactive`

迁移应保留 Husky 设置

```
VITE+ - 面向 Web 的统一工具链

⚠ Detected Husky — leaving its hooks, configuration, and dependencies unchanged. Migrate Husky manually before enabling Vite+ hooks.
◇ Migrated . to Vite+ <version>
• Node <version>  pnpm <version>
• 1 config update applied
```

## `vpt print-file package.json`

prepare 脚本和 Husky 依赖应保留

```
{
  "name": "migration-existing-husky",
  "scripts": {
    "prepare": "husky"
  },
  "devDependencies": {
    "husky": "^9.1.7",
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

## `vpt print-file .husky/pre-commit`

Husky 钩子应保持不变

```
pnpm lint-staged
```

## `vpt stat-file .vite-hooks --assert-not dir`

Vite+ hooks 不应与 Husky 一起安装

```
.vite-hooks: missing
```
