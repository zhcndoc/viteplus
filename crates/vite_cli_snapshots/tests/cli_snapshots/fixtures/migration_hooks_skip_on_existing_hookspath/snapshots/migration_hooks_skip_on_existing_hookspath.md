# 迁移钩子在现有钩子路径上被跳过

## `git init`


## `git config core.hooksPath .custom-hooks`


## `vp migrate --no-interactive`

应跳过 hooks，因为 core.hooksPath 已设置

```
VITE+ - 面向 Web 的统一工具链

⚠ core.hooksPath 已设置为 ".custom-hooks" — 保持现有的 hook 设置不变。
◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file package.json`

该软件包不应获得钩子策略或生命周期变更

```
{
  "name": "migration-hooks-skip-on-existing-hookspath",
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

## `git config --local core.hooksPath`

仍应为 .custom-hooks

```
.custom-hooks
```
