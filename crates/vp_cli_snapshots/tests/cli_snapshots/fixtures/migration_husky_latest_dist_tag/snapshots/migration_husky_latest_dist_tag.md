# 迁移_husky_latest_dist_tag

## `git init`


## `vp migrate --no-interactive`

应针对无法强制转换的 husky 版本发出警告

```
VITE+ - 面向 Web 的统一工具链

⚠ 检测到 Husky — 保持其钩子、配置和依赖不变。在启用 Vite+ 钩子之前，请手动迁移 Husky。
◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file package.json`

husky 仍应位于 devDeps 中

```
{
  "name": "migration-husky-latest-dist-tag",
  "scripts": {
    "prepare": "husky"
  },
  "devDependencies": {
    "husky": "latest",
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
