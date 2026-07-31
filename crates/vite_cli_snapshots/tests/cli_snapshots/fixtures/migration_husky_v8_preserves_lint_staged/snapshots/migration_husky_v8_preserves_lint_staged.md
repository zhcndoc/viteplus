# 迁移_husky_v8_保留_lint_staged

## `git init`


## `vp migrate --no-interactive`

应警告 husky v8，并保留 lint-staged 配置

```
VITE+ - Web 的统一工具链

⚠ 检测到 husky <9.0.0 — 请先升级到 husky v9+，然后重新运行迁移。
◇ 已将 . 迁移到 Vite+ <version>
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
  vite: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```
