# migration_from_tsup_config_collision

## `vpt write-file tsdown.config.ts 'export default { existing: true };
'`


## `vp migrate --no-interactive --no-hooks --no-agent --no-editor`

现有的 tsdown 配置应在覆盖文件之前阻止自动迁移

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

tsup configuration detected. Auto-migrating to tsdown...

Automatic tsup migration was skipped because these tsdown configs already exist:
  tsdown.config.ts

Resolve this configuration conflict manually:
  1. Merge the tsup and tsdown configurations into `pack` in `vite.config.*`.
  2. Do not run `tsdown-migrate`. It can overwrite the existing tsdown configuration.

Use the tsdown migration skill for guidance:
  https://github.com/rolldown/tsdown/blob/main/skills/tsdown-migrate/SKILL.md
Complete the tsup migration manually, then re-run `vp migrate`.
```

## `vpt print-file tsup.config.ts`

原始 tsup 配置未发生变化

```
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  format: ['esm', 'cjs'],
  splitting: false,
});
```

## `vpt print-file tsdown.config.ts`

现有的 tsdown 配置未发生变化

```
export default { existing: true };
```

## `vpt print-file package.json`

tsup 依赖和脚本未发生变化

```
{
  "name": "migration-from-tsup",
  "scripts": {
    "build": "tsup --config tsup.config.ts"
  },
  "devDependencies": {
    "tsup": "^8.5.0",
    "vite": "^7.0.0"
  }
}
```
