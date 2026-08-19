# 将 monorepo 迁移到 pnpm

## `vp migrate --no-interactive`

迁移应合并 vite.config.ts，并移除 oxlintrc 和 oxfmtrc

```
VITE+ - Web 的统一工具链

✔ 已将 .oxlintrc.json 合并到 vite.config.ts

✔ 已将 .oxfmtrc.json 合并到 vite.config.ts
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 4 项配置更新，已重写 1 个文件中的导入
• 已将内联 Vite 插件用 lazyPlugins 包装，以用于检查/代码检查/格式化
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
});
```

## `vpt stat-file .oxlintrc.json --assert-not file`

检查是否已删除 .oxlintrc.json

```
.oxlintrc.json: missing
```

## `vpt stat-file .oxfmtrc.json --assert-not file`

检查 .oxfmtrc.json 已被移除

```
.oxfmtrc.json：缺失
```

## `vpt print-file package.json`

检查 package.json

```
{
  "name": "migration-monorepo-pnpm",
  "version": "1.0.0",
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
  "resolutions": {
    "vue": "3.5.25"
  },
  "packageManager": "pnpm@10.18.0"
}
```

## `vpt print-file pnpm-workspace.yaml`

检查 pnpm-workspace.yaml

```
packages:
  - packages/*

catalog:
  testnpm2: ^1.0.0
  # 此处的测试注释用于检查注释是否被保留
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vitest: <version>
  vite-plus: <version>

minimumReleaseAge: 1440
overrides:
  vite@*: 'catalog:'
  vitest@*: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
    - vitest
  allowedVersions:
    vite: '*'
    vitest: '*'
minimumReleaseAgeExclude:
  - vite-plus
  - '@voidzero-dev/*'
  - oxlint
  - '@oxlint/*'
  - oxlint-tsgolint
  - '@oxlint-tsgolint/*'
  - oxfmt
  - '@oxfmt/*'
  - vitest
  - '@vitest/*'
```

## `vpt print-file packages/app/package.json`

检查应用 package.json

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

## `vpt print-file packages/only-oxlint/package.json`

检查 only-oxlint package.json

```
{
  "name": "@vite-plus-test/only-oxlint",
  "scripts": {
    "lint": "vp lint --fix"
  },
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  }
}
```

## `vpt print-file packages/only-oxlint/vite.config.ts`

仅检查 only-oxlint vite.config.ts

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    "rules": {
      "no-unused-vars": "warn",
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

});
```

## `vpt stat-file packages/only-oxlint/.oxlintrc.json --assert-not file`

检查 only-oxlint .oxlintrc.json 是否已删除

```
packages/only-oxlintrc.json: missing
```
