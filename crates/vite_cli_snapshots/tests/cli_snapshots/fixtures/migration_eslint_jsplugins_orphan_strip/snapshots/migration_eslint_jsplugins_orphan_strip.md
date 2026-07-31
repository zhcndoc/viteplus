# 迁移_eslint_JavaScript插件_孤立项移除

## `vp migrate --no-interactive`

应剥离孤立的 jsPlugin / 未知插件 / 悬空规则，并显示警告

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 4 项配置更新
• 已将 ESLint 规则迁移到 Oxlint
! 警告：
  - 已从生成的 lint 配置中剥离 JS 插件引用：eslint-plugin-fictional、eslint-plugin-override-only。当前工作区中不存在匹配的软件包，因此在 lint 时加载这些插件会失败。如果希望恢复它们在 Oxlint 中的覆盖范围，请安装每个软件包（例如 `vp install <name>`），并将其名称添加回 vite.config.ts 中的 `lint.jsPlugins`。
```

## `vpt print-file vite.config.ts`

lint 块不应在 plugins / jsPlugins / rules 中包含 `fictional`

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    "*": "vp check --fix"
  },
  fmt: {},
  lint: {
    "plugins": [
      "oxc",
      "typescript",
      "unicorn",
      "react"
    ],
    "jsPlugins": [
      {
        "name": "vite-plus",
        "specifier": "vite-plus/oxlint-plugin"
      }
    ],
    "categories": {
      "correctness": "warn"
    },
    "env": {
      "builtin": true
    },
    "rules": {
      "vite-plus/prefer-vite-plus-imports": "error"
    },
    "overrides": [
      {
        "files": [
          "**/*.test.js"
        ],
        "rules": {},
        "jsPlugins": []
      }
    ],
    "options": {
      "typeAware": true,
      "typeCheck": true
    }
  },
});
```
