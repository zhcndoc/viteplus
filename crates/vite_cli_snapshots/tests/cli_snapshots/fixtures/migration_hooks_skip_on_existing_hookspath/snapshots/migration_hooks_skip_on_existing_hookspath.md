# 迁移钩子在现有钩子路径上跳过

## `git init`


## `git config core.hooksPath .custom-hooks`


## `vp migrate --no-interactive`

应跳过 hooks，因为 core.hooksPath 已设置

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
! 警告：
  - 未配置 Git hooks —— core.hooksPath 已设置为 ".custom-hooks"，跳过
```

## `vpt print-file package.json`

prepare 应保持为 'husky'，并且 husky 必须保留在 devDependencies 中

```
{
  "name": "migration-hooks-skip-on-existing-hookspath",
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
  vite: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```

## `git config --local core.hooksPath`

仍应为 .custom-hooks

```
.custom-hooks
```
