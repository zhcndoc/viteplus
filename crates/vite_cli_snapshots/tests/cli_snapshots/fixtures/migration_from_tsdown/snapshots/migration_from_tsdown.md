# 从 tsdown 迁移

## `vp migrate --no-interactive`

迁移应将导入重写为 vite-plus

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 3 项配置更新，已重写 1 个文件中的导入
→ 手动后续操作：
  - 请手动将 tsdown.config.ts 合并到 vite.config.ts 中，详见 https://viteplus.dev/guide/migrate#tsdown
```

## `vpt print-file tsdown.config.ts`

检查 tsdown.config.ts

```
import { defineConfig } from 'vite-plus/pack';

export default defineConfig({
  entry: 'src/index.ts',
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
});
```

## `vpt print-file vite.config.ts`

检查 vite.config.ts

```
import tsdownConfig from './tsdown.config.js';

import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    "*": "vp check --fix"
  },
  pack: tsdownConfig,
  fmt: {},
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
});
```

## `vpt print-file package.json`

检查 package.json

```
{
  "name": "migration-from-tsdown",
  "scripts": {
    "build": "vp pack",
    "build:watch": "vp pack --watch",
    "build:dts": "vp pack --dts",
    "prepare": "vp config"
  },
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

## `vp migrate --no-interactive`

再次运行迁移，以检查其是否具有幂等性

```
VITE+ - The Unified Toolchain for the Web

This project is already using Vite+! Happy coding!
```

## `vpt print-file tsdown.config.ts`

检查 tsdown.config.ts

```
import { defineConfig } from 'vite-plus/pack';

export default defineConfig({
  entry: 'src/index.ts',
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
});
```

## `vpt print-file vite.config.ts`

检查 vite.config.ts

```
import tsdownConfig from './tsdown.config.js';

import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    "*": "vp check --fix"
  },
  pack: tsdownConfig,
  fmt: {},
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
});
```

## `vpt print-file package.json`

检查 package.json

```
{
  "name": "migration-from-tsdown",
  "scripts": {
    "build": "vp pack",
    "build:watch": "vp pack --watch",
    "build:dts": "vp pack --dts",
    "prepare": "vp config"
  },
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
  }
}
```
