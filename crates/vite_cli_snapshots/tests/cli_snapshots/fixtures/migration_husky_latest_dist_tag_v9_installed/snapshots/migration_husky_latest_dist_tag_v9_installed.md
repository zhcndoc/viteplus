# 迁移_husky_最新_dist_标签_v9_已安装

## `git init`


## `vp migrate --no-interactive`

应从 node_modules 中解析 husky v9，不显示警告

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
• 已配置 Git hooks
```

## `vpt print-file package.json`

应移除 husky 和 lint-staged

```
{
  "name": "migration-husky-latest-dist-tag-v9-installed",
  "scripts": {
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
