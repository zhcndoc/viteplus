# 迁移单仓库 Yarn 4

## `vp migrate --no-interactive`

迁移应合并 vite.config.ts 并移除 oxlintrc

```
VITE+ - Web 的统一工具链

⚠ Vite+ 当前不支持 Yarn Plug'n'Play (PnP)。

✔ 已将 Yarn 切换至 node-modules 模式

✔ 已将 .oxlintrc.json 合并到 vite.config.ts
◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  yarn <version>
• 已应用 2 项配置更新，1 个文件的导入已重写
• 已使用 lazyPlugins 包装内联 Vite 插件，以支持 check/lint/fmt
• 已配置包管理器设置
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

检查 package.json

```
{
  "name": "migration-monorepo-yarn4",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "test:run": "vp test run",
    "test:ui": "vp test --ui",
    "test:coverage": "vp test run --coverage",
    "test:watch": "vp test --watch",
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
  "packageManager": "yarn@4.12.0",
  "resolutions": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>",
    "vitest": "<version>"
  }
}
```

## `vpt print-file .yarnrc.yml`

检查 .yarnrc.yml

```
nodeLinker: node-modules
npmPreapprovedPackages:
  - vitest
  - '@vitest/*'
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vitest: <version>
  vite-plus: <version>
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
    "@vite-plus-test/utils": "workspace:*",
    "test-vite-plus-install": "1.0.0",
    "testnpm2": "catalog:"
  },
  "devDependencies": {
    "test-vite-plus-package": "1.0.0",
    "vite": "catalog:",
    "vitest": "catalog:",
    "vite-plus": "catalog:"
  },
  "optionalDependencies": {
    "test-vite-plus-other-optional": "1.0.0"
  }
}
```

## `vpt print-file packages/utils/package.json`

检查 utils package.json

```
{
  "name": "@vite-plus-test/utils",
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
