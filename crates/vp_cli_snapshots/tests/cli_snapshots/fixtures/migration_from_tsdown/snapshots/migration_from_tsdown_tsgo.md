# migration_from_tsdown_tsgo

将 dts.tsgo 转换为 dts.generator，并在第二次迁移时保留结果。

## `vpt replace-file-content tsdown.config.ts 'dts: true' 'dts: { tsgo: true }'`


## `vp migrate --no-interactive`

```
VITE+ - The Unified Toolchain for the Web

◇ Migrated . to Vite+ <version>
• Node <version>  pnpm <version>
• 3 config updates applied, 1 file had imports rewritten
→ Manual follow-up:
  - Please manually merge tsdown.config.ts into vite.config.ts, see https://viteplus.dev/guide/migrate#tsdown
```

## `vpt print-file tsdown.config.ts`

检查 dts.generator 是否替换了 dts.tsgo

```
import { defineConfig } from 'vite-plus/pack';

export default defineConfig({
  entry: 'src/index.ts',
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: { generator: 'tsgo' },
  unbundle: true,
  copy: 'public',
  deps: { resolveDepSubpath: true, onlyBundle: false },
});
```

## `vp migrate --no-interactive`

```
VITE+ - The Unified Toolchain for the Web

This project is already using Vite+! Happy coding!
```

## `vpt print-file tsdown.config.ts`

检查迁移后的配置未发生变化

```
import { defineConfig } from 'vite-plus/pack';

export default defineConfig({
  entry: 'src/index.ts',
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: { generator: 'tsgo' },
  unbundle: true,
  copy: 'public',
  deps: { resolveDepSubpath: true, onlyBundle: false },
});
```
