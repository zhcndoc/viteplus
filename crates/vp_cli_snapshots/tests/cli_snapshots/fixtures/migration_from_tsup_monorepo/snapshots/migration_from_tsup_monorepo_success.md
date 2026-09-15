# migration_from_tsup_monorepo_success

## `vp migrate --no-interactive --no-hooks --no-agent --no-editor`

真实的 tsdown-migrate 包应迁移所有仅限 workspace 的 tsup 配置

```
VITE+ - The Unified Toolchain for the Web

tsup configuration detected. Auto-migrating to tsdown...
◇ Migrated . to Vite+ <version>
• Node <version>  pnpm <version>
• 5 config updates applied, 2 files had imports rewritten
• tsup config migrated to tsdown (`vp pack`)
→ Manual follow-up:
  - Please manually merge packages/b/tsdown.config.ts into packages/b/vite.config.ts, see https://viteplus.dev/guide/migrate#tsdown
  - Please manually merge packages/a/tsdown.config.ts into packages/a/vite.config.ts, see https://viteplus.dev/guide/migrate#tsdown
```

## `vpt stat-file packages/a/tsup.config.ts --assert-not file`

package a 的原始配置已被移除

```
packages/a/tsup.config.ts: missing
```

## `vpt print-file packages/a/tsdown.config.ts`

package a 获取了转换后的配置

```
import { defineConfig } from 'vite-plus/pack';

export default defineConfig({ deps: { resolveDepSubpath: true },
  entry: ['src/index.ts'],
  dts: true,
  format: 'cjs',
  clean: false,
  target: false,
});
```

## `vpt print-file packages/a/package.json`

package a 使用 vp pack

```
{
  "name": "a",
  "type": "module",
  "scripts": {
    "build": "vp pack"
  },
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  }
}
```

## `vpt stat-file packages/b/tsup.config.ts --assert-not file`

package b 的原始配置已被移除

```
packages/b/tsup.config.ts: missing
```

## `vpt print-file packages/b/tsdown.config.ts`

package b 获取了转换后的配置

```
import { defineConfig } from 'vite-plus/pack';

export default defineConfig({ deps: { resolveDepSubpath: true },
  entry: ['src/index.ts'],
  dts: true,
  format: 'cjs',
  clean: false,
  target: false,
});
```

## `vpt print-file packages/b/package.json`

package b 使用 vp pack

```
{
  "name": "b",
  "type": "module",
  "scripts": {
    "build": "vp pack"
  },
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  }
}
```

## `cd packages/a && vp run build`

package a 迁移后的 vp pack 脚本构建成功


## `vpt list-dir packages/a/dist`

package a 的构建产物已创建

```
index.cjs
index.d.cts
```

## `cd packages/b && vp run build`

package b 迁移后的 vp pack 脚本构建成功


## `vpt list-dir packages/b/dist`

package b 的构建产物已创建

```
index.cjs
index.d.cts
```
