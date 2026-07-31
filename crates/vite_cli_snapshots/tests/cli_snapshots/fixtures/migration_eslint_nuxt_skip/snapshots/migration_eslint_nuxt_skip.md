# 迁移_eslint_nuxt_跳过

## `vp migrate --no-interactive`

检测到 `@nuxt/eslint` — ESLint 迁移已跳过，并显示警告

```
VITE+ - 面向 Web 的统一工具链

检测到 @nuxt/eslint — 已跳过 ESLint 自动迁移。@nuxt/eslint 将 ESLint 接入特定于框架的流程，而 Vite+ 目前尚无法进行无缝迁移。你的 ESLint 配置已保留。若要手动迁移，请从 package.json 中移除 @nuxt/eslint，然后重新运行 `vp migrate`。
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
```

## `vpt print-file package.json`

eslint、@nuxt/eslint 和 eslint.config.mjs 已保留

```
{
  "name": "migration-eslint-nuxt-skip",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "lint": "eslint .",
    "prepare": "vp config"
  },
  "dependencies": {
    "nuxt": "^4.0.0"
  },
  "devDependencies": {
    "@nuxt/eslint": "^1.0.0",
    "eslint": "^9.0.0",
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

## `vpt stat-file eslint.config.mjs --assert file`

eslint 配置文件未被删除

```
eslint.config.mjs: file
```
