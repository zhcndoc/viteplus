# 将 monorepo 迁移至 husky v8 并保留 lint-staged

## `vp migrate --no-interactive`

应警告 husky v8，并保留所有 lint-staged 配置

```
VITE+ - Web 统一工具链

⚠ 检测到 husky <9.0.0 — 请先升级到 husky v9+，然后重新运行迁移。
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file package.json`

根目录的 lint-staged 配置仍应位于 package.json 中

```
{
  "name": "migration-monorepo-husky-v8-preserves-lint-staged",
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
  "packageManager": "pnpm@10.18.0"
}
```

## `vpt print-file packages/app/package.json`

app 的 lint-staged 配置仍应位于 package.json 中

```
{
  "name": "app",
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "lint-staged": {
    "*.css": "stylelint --fix"
  }
}
```
