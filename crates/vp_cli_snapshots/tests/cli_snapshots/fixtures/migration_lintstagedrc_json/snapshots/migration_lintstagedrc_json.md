# migration_lintstagedrc_json

## `vp migrate -h`

迁移帮助信息

```
VITE+ - Web 的统一工具链

用法：vp migrate [PATH] [OPTIONS]

将独立的 Vite、Vitest、Oxlint、Oxfmt 和 Prettier 项目迁移到统一的 Vite+。

Arguments:
  [PATH]  Target directory to migrate (default: current directory)

Options:
  --agent <NAME>    Write coding agent instructions to AGENTS.md, CLAUDE.md, etc.
  --no-agent        Skip writing coding agent instructions
  --editor <NAME>   Write editor config files into the project
  --no-editor       Skip writing editor config files
  --hooks           Set up pre-commit hooks (default in non-interactive mode)
  --no-hooks        Skip pre-commit hooks setup
  --interactive     Enable interactive prompts
  --no-interactive  Run in non-interactive mode (skip prompts and use defaults)
  --full            Also run the full setup for an existing Vite+ project
  -h, --help        Show this help message

Examples:
  vp migrate                    # Migrate the current package
  vp migrate my-app             # Migrate a directory
  vp migrate --no-interactive   # Use defaults without prompts

迁移提示：
  当你希望编码代理驱动迁移时，将以下内容提供给它：

  Migrate this project to Vite+.
  Vite+ replaces the split tools for runtime management, package management,
  development, builds, tests, linting, formatting, and packaging.
  Run `vp help` and `vp help migrate` before you make changes.
  Run `vp migrate --no-interactive` in the workspace root.
  Make sure that the project uses Vite 8+ and Vitest 4.1+.

  After the migration, check imports, configuration, and package aliases.
  Then run `vp install`, `vp check`, `vp test`, and `vp build`.
  Report all required manual work in the migration summary.

文档：https://viteplus.dev/guide/migrate
```

## `vp migrate --no-interactive`

迁移处理 lintstagedrc.json

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
! 警告：
  - 找到 .lintstagedrc.json，但 "staged" 已存在于 vite.config.ts 中 — 请手动合并
```

## `vpt print-file .lintstagedrc.json`

检查 lintstagedrc.json（内联后应删除）

```
{
  "*.js": "oxlint --fix"
}
```

## `vpt print-file package.json`

检查 package.json

```
{
  "name": "migration-lintstagedrc",
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
  vite@*: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```

## `vpt print-file vite.config.ts`

检查暂存配置是否已迁移到 vite.config.ts

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {},
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
  staged: {
    "*.@(js|ts|tsx|yml|yaml|md|json|html|toml)": [
      "vp fmt --staged",
      "eslint --fix"
    ],
    "*.@(js|ts|tsx)": [
      "vp lint --fix"
    ]
  },
});
```
