# 迁移现有的 Husky v8 钩子

## `git init`


## `vp migrate --no-interactive`

应警告 husky v8，并跳过钩子设置

```
VITE+ - 面向 Web 的统一工具链

⚠ 检测到 Husky — 保持其钩子、配置和依赖不变。在启用 Vite+ 钩子之前，请手动迁移 Husky。
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file package.json`

husky/lint-staged 应保留在 devDeps 中，prepare 应保持为 husky

```
{
  "name": "migration-existing-husky-v8-hooks",
  "scripts": {
    "prepare": "husky"
  },
  "devDependencies": {
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0",
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

## `vpt print-file .husky/pre-commit`

hook 文件应保持不变（仍然包含引导代码）

```
. "$(dirname -- "$0")/_/husky.sh"

npm test
echo "custom hook"
```
