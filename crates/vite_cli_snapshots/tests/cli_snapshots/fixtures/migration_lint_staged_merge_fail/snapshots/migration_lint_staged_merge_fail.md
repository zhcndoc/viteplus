# 迁移_lint_staged_合并失败。

## `git init`


## `vp migrate --no-interactive`

应优雅地处理合并失败

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <版本>
• Node <版本>  pnpm <版本>
• Git hooks 已配置
! 警告：
  - 将暂存的配置合并到 vite.config.ts 失败
→ 手动后续操作：
  - 请手动将暂存的配置添加到 vite.config.ts，参见 https://viteplus.dev/guide/migrate#lint-staged
```

## `vpt print-file package.json`

合并失败时应保留 lint-staged 配置

```
{
  "name": "migration-lint-staged-merge-fail",
  "devDependencies": {
    "lint-staged": "^16.2.6",
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "lint-staged": {
    "*.css": "stylelint --fix"
  },
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "<version>",
      "onFail": "download"
    }
  },
  "scripts": {
    "prepare": "vp config"
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

## `vpt print-file vite.config.ts`

vite 配置应保持不变（合并失败）

```
const config = { plugins: [] };
module.exports = config;
```

## `vpt stat-file .vite-hooks/pre-commit --assert-not file`

合并失败时没有 pre-commit 钩子

```
.vite-hooks/pre-commit: missing
```
