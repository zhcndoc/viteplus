# 迁移_husky_latest_dist_tag

## `git init`


## `vp migrate --no-interactive`

应针对无法强制转换的 husky 版本发出警告

```
VITE+ - 面向 Web 的统一工具链

⚠ 无法从 "latest" 确定 husky 版本 — 请指定一个兼容 semver 的版本（例如 "^9.0.0"），然后重新运行迁移。
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
  vite: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```
