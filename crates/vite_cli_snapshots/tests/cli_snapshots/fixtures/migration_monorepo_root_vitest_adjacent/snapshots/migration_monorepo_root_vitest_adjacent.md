# 迁移_monorepo_根目录_vitest_相邻

## `vp migrate --no-interactive`

根目录中存在与 Vitest 相邻的依赖，但没有直接依赖 Vitest，仍会添加一个固定版本的直接 Vitest 依赖

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
```

## `vpt print-file package.json`

即使 vite-plus 被优先注入，vitest 仍固定在根目录

```
{
  "name": "migration-monorepo-root-vitest-adjacent",
  "scripts": {
    "test": "vp test",
    "prepare": "vp config"
  },
  "devDependencies": {
    "vite": "catalog:",
    "vitest-browser-svelte": "^2.1.0",
    "vite-plus": "catalog:",
    "vitest": "catalog:"
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
