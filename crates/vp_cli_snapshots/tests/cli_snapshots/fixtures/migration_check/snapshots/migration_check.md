# 迁移检查

## `vp migrate --help`

显示帮助信息

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
  如果希望编码代理驱动迁移，请将以下内容提供给它：

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
