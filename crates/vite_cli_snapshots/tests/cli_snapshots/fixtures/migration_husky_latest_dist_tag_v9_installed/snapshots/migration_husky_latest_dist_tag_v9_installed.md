# 迁移_husky_最新_dist_标签_v9_已安装。

## `git init`


## `vp migrate --no-interactive`

已安装的 Husky 版本仍应保留

```
VITE+ - 面向 Web 的统一工具链

⚠ 检测到 Husky — 保留其钩子、配置和依赖不变。在启用 Vite+ 钩子之前，请手动迁移 Husky。
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file package.json`

Husky 元数据应保持不变

```
{
  "name": "migration-husky-latest-dist-tag-v9-installed",
  "scripts": {
    "prepare": "husky"
  },
  "devDependencies": {
    "husky": "latest",
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
