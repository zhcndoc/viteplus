# 迁移_其他_钩子_工具

## `vp migrate --no-interactive`

由于 simple-git-hooks，应跳过钩子

```
VITE+ - Web 的统一工具链

⚠ 检测到 simple-git-hooks — 跳过 Git 钩子设置。请手动配置 Git 钩子，参见 https://viteplus.dev/guide/migrate#git-hook-tools
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file package.json`

应保留 lint-staged 配置、脚本和 simple-git-hooks 配置

```
{
  "name": "migration-other-hook-tool-with-lint-staged",
  "scripts": {
    "check-staged": "lint-staged"
  },
  "devDependencies": {
    "lint-staged": "^16.2.6",
    "simple-git-hooks": "^2.11.1",
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "simple-git-hooks": {
    "pre-commit": "npx lint-staged"
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
