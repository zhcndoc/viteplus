# 迁移现有的 Husky

## `git init`


## `vp migrate --no-interactive`

迁移应将 husky 重写为 vp 配置

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
• 已配置 Git hooks
```

## `vpt print-file package.json`

检查 prepare 脚本已重写，并且 husky 已从 devDeps 中移除

```
{
  "name": "migration-existing-husky",
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

## `vpt print-file .vite-hooks/pre-commit`

检查 pre-commit hook 已重写为 vp staged

```
vp staged
```
