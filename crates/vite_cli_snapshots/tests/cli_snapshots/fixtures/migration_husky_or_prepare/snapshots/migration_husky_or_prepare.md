# 迁移 husky 或 prepare

## `git init`


## `vp migrate --no-interactive`

迁移应保留 `||` 回退语义

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
• 已配置 Git hooks
```

## `vpt print-file package.json`

检查 prepare 脚本是否保留 `|| true` 回退逻辑

```
{
  "name": "migration-husky-or-prepare",
  "scripts": {
    "prepare": "vp config || true"
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
