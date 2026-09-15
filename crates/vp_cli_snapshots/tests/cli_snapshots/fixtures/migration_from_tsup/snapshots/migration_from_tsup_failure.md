# migration_from_tsup_failure

## `vpt chmod +x tsdown-migrate-stub.mjs`

模拟 tsdown-migrate 失败

```
```

## `vp migrate --no-interactive --no-hooks --no-agent --no-editor`

自动迁移失败时应显示手动选项

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

tsup configuration detected. Auto-migrating to tsdown...

Automatic tsup migration failed.

Choose one of these manual migration methods:
  1. Run `vp dlx tsdown-migrate` in the project root.
  2. Use the tsdown migration skill:
     https://github.com/rolldown/tsdown/blob/main/skills/tsdown-migrate/SKILL.md

Complete the tsup migration manually, then re-run `vp migrate`.
```

## `vpt stat-file tsup.config.ts --assert file`

原始 tsup 配置会被保留

```
tsup.config.ts: file
```

## `vpt stat-file tsdown.config.ts --assert-not file`

不会遗留转换后的配置

```
tsdown.config.ts: missing
```

## `vpt print-file package.json`

tsup 依赖项和脚本会被保留

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
