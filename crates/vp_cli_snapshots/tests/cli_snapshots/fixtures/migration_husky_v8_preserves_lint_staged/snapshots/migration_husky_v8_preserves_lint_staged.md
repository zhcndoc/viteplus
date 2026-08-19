# 迁移_husky_v8_保留_lint_staged

## `git init`


## `vp migrate --no-interactive`

应警告 husky v8，并保留 lint-staged 配置

```
VITE+ - Web 的统一工具链

⚠ 检测到 Husky — 保持其钩子、配置和依赖不变。在启用 Vite+ 钩子之前，请手动迁移 Husky。
◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file package.json`

lint-staged 配置仍应保留在 package.json 中

```
{
  "name": "migration-husky-v8-preserves-lint-staged",
  "scripts": {
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0",
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "lint-staged": {
    "*.{js,ts}": "eslint --fix"
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
