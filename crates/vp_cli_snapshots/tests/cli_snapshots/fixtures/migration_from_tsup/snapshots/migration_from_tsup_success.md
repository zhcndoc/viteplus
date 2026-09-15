# migration_from_tsup_success

## `vpt chmod +x tsdown-migrate-stub.mjs`

将 tsdown-migrate stub 化，使迁移保持离线

```
```

## `vp migrate --no-interactive --no-hooks --no-agent --no-editor`

tsup 配置应自动迁移

```
VITE+ - The Unified Toolchain for the Web

tsup configuration detected. Auto-migrating to tsdown...
◇ Migrated . to Vite+ <version>
• Node <version>  pnpm <version>
• 2 config updates applied, 1 file had imports rewritten
• tsup config migrated to tsdown (`vp pack`)
! Warnings:
  - tsdown-migrate: The splitting option is currently unsupported in tsdown. Code splitting is always enabled and cannot be disabled.
→ Manual follow-up:
  - Please manually merge tsdown.config.ts into vite.config.ts, see https://viteplus.dev/guide/migrate#tsdown
```

## `vpt stat-file tsup.config.ts --assert-not file`

原始 tsup 配置已移除

```
tsup.config.ts: missing
```

## `vpt print-file tsdown.config.ts`

转换后的配置使用 vite-plus pack

```
import { defineConfig } from 'vite-plus/pack';

export default defineConfig({ deps: { resolveDepSubpath: true },
  entry: ['src/index.ts'],
  dts: true,
  format: ['esm', 'cjs'],
  splitting: false,
  target: false,
});
```

## `vpt print-file vite.config.ts`

转换后的配置已连接到 vite.config.ts

```
import tsdownConfig from './tsdown.config.js';

import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: tsdownConfig,
  fmt: {},
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
});
```

## `vpt print-file package.json`

tsup 已移除，其脚本使用 vp pack

```
{
  "name": "migration-from-tsup",
  "scripts": {
    "build": "vp pack"
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
