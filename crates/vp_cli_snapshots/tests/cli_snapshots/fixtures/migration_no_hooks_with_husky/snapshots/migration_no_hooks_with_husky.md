# 使用 husky 进行无钩子迁移

## `git init`


## `vp migrate --no-hooks --no-interactive`

--no-hooks 应保留 husky/lint-staged 并保留配置

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file package.json`

prepare 脚本、lint-staged 配置、check-staged 脚本和依赖项都应予以保留

```
{
  "name": "migration-no-hooks-with-husky",
  "scripts": {
    "prepare": "husky",
    "check-staged": "lint-staged"
  },
  "devDependencies": {
    "husky": "^9.1.7",
    "lint-staged": "^16.2.6",
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "lint-staged": {
    "*.ts": "eslint --fix"
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

## `vpt stat-file .husky --assert-not dir`

不存在 `.husky` 目录

```
.husky: missing
```
