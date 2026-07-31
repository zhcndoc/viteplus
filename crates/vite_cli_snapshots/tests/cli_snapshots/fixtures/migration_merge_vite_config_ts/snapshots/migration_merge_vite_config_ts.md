# 迁移_合并_vite_配置_ts

## `vp migrate --no-interactive`

迁移应合并 vite.config.ts，并移除 oxlintrc 和 oxfmtrc

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 4 项配置更新，已重写 1 个文件中的导入
• 内联 Vite 插件已使用 lazyPlugins 包装，以支持 check/lint/fmt
```

## `vpt print-file vite.config.ts`

检查 vite.config.ts

```
import { join } from 'node:path';

import react from '@vitejs/plugin-react';
import { playwright } from 'vite-plus/test/browser-playwright';
import { defineConfig, lazyPlugins } from 'vite-plus';

export default defineConfig({
  staged: {
    "*": "vp check --fix"
  },
  fmt: {
    "printWidth": 100,
    "tabWidth": 2,
    "semi": true,
    "singleQuote": true,
    "trailingComma": "es5"
  },
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
  test: {
    dir: join(import.meta.dirname, 'test'),
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      screenshotFailures: false,
      instances: [{ browser: 'chromium' }],
    },
  },
});
```

## `vpt stat-file .oxlintrc.json --assert-not file`

检查 .oxlintrc.json 是否已删除

```
.oxlintrc.json: missing
```

## `vpt stat-file .oxfmtrc.json --assert-not file`

检查 .oxfmtrc.json 是否已被删除

```
.oxfmtrc.json: missing
```

## `vpt print-file package.json`

检查 package.json

```
{
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "test:run": "vp test run",
    "test:ui": "vp test --ui",
    "test:coverage": "vp test run --coverage",
    "test:watch": "vp test --watch",
    "test": "vp test",
    "lint": "vp lint",
    "lint:fix": "vp lint --fix",
    "lint:type-aware": "vp lint --type-aware",
    "fmt": "vp fmt",
    "fmt:fix": "vp fmt --fix",
    "fmt:staged": "vp fmt --staged",
    "fmt:staged:fix": "vp fmt --staged --fix",
    "prepare": "vp config"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "@vitest/browser-playwright": "catalog:",
    "vite": "catalog:",
    "vitest": "catalog:",
    "playwright": "*",
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
  vitest: <version>
  vite-plus: <version>
  '@vitest/browser-playwright': <version>
overrides:
  vite: 'catalog:'
  vitest: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
    - vitest
  allowedVersions:
    vite: '*'
    vitest: '*'
```
