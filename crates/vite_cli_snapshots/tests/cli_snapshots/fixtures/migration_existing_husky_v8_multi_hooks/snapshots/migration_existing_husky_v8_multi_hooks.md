# 从现有 Husky v8 迁移多个钩子

## `git init`


## `vp migrate --no-interactive`

应警告 husky v8 并跳过 hooks 设置

```
VITE+ - 面向 Web 的统一工具链

⚠ 检测到 husky <9.0.0 — 请先升级到 husky v9+，然后重新运行迁移。
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file package.json`

husky/lint-staged 应保留在 devDeps 中，prepare 应保持为 husky

```
{
  "name": "migration-existing-husky-v8-multi-hooks",
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

npx lint-staged
```

## `vpt print-file .husky/commit-msg`

hook 文件应保持不变（仍然包含引导代码）

```
. "$(dirname -- "$0")/_/husky.sh"

npx commitlint --edit $1
```
