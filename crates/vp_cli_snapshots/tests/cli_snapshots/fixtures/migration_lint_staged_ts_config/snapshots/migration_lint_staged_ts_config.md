# 迁移_lint_staged_ts_配置

## `git init`


## `vp migrate --no-interactive`

迁移应在检查 lint-staged 配置格式之前保留 Husky

```
VITE+ - 面向 Web 的统一工具链

⚠ 检测到 Husky — 保持其钩子、配置和依赖不变。在启用 Vite+ 钩子之前，请手动迁移 Husky。
◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file package.json`

检查 Husky prepare 和依赖项是否得到保留

```
{
  "name": "migration-lint-staged-ts-config",
  "type": "module",
  "scripts": {
    "prepare": "husky"
  },
  "devDependencies": {
    "husky": "^9.1.7",
    "lint-staged": "^16.2.6",
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

## `vpt print-file lint-staged.config.ts`

检查 TS 配置未被修改

```
export default {
  "*.{js,ts}": ["oxlint --fix", "oxfmt"],
};
```
