# 迁移_monorepo_bun

## `vp migrate --no-interactive`

迁移应支持 bun 对象形式的工作区

```
VITE+ - Web 的统一工具链

✔ 已将 .oxlintrc.json 合并到 vite.config.ts
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  bun <version>
• 已应用 2 项配置更新，已重写 1 个文件中的导入
• 已使用 lazyPlugins 包装内联 Vite 插件，以支持检查/代码检查/格式化
```

## `vpt print-file vite.config.ts`

检查 vite.config.ts

```
import react from '@vitejs/plugin-react';
import { defineConfig, lazyPlugins } from 'vite-plus';

export default defineConfig({
  staged: {
    "*": "vp check --fix"
  },
  fmt: {},
  lint: {
    "rules": {
      "no-unused-vars": "error",
      "vite-plus/prefer-vite-plus-imports": "error"
    },
    "options": {
      "typeAware": true,
      "typeCheck": true
    },
    "jsPlugins": [
      {
        "name": "vite-plus",
        "specifier": "vite-plus/oxlint-plugin"
      }
    ]
  },
  plugins: lazyPlugins(() => [react()]),
});
```

## `vpt stat-file .oxlintrc.json --assert-not file`

检查 .oxlintrc.json 是否已删除

```
.oxlintrc.json: missing
```

## `vpt print-file package.json`

检查 package.json 是否保留 workspaces 对象形式

```
{
  "name": "migration-monorepo-bun",
  "version": "1.0.0",
  "workspaces": {
    "packages": [
      "packages/*"
    ],
    "catalog": {
      "vite": "npm:@voidzero-dev/vite-plus-core@<version>",
      "vitest": "<version>",
      "vite-plus": "<version>"
    }
  },
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "test": "vp test",
    "lint": "vp lint",
    "fmt": "vp fmt",
    "prepare": "vp config"
  },
  "dependencies": {
    "testnpm2": "1.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "catalog:",
    "vite": "catalog:",
    "vitest": "catalog:",
    "vite-plus": "catalog:"
  },
  "packageManager": "bun@1.3.11",
  "overrides": {
    "vite": "catalog:",
    "vitest": "catalog:"
  }
}
```

## `vpt print-file packages/app/package.json`

检查 app package.json

```
{
  "name": "app",
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "test": "vp test"
  },
  "dependencies": {
    "@migration-bun-test/utils": "workspace:*",
    "test-vite-plus-install": "1.0.0",
    "testnpm2": "catalog:"
  },
  "devDependencies": {
    "test-vite-plus-package": "1.0.0",
    "vite": "catalog:",
    "vitest": "catalog:",
    "vite-plus": "catalog:"
  }
}
```

## `vpt print-file packages/utils/package.json`

检查 utils package.json

```
{
  "name": "@migration-bun-test/utils",
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "test": "vp test"
  },
  "dependencies": {
    "testnpm2": "1.0.0"
  },
  "devDependencies": {
    "vite": "catalog:",
    "vitest": "catalog:",
    "vite-plus": "catalog:"
  }
}
```
