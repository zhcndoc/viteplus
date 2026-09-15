# migration_from_tsup_monorepo_failure

## `vpt chmod +x tsdown-migrate-failure-stub.mjs`

在软件包 a 成功后模拟失败

```
```

## `vp migrate --no-interactive --no-hooks --no-agent --no-editor`

后续软件包失败应回滚所有软件包

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

tsup configuration detected. Auto-migrating to tsdown...

Automatic tsup migration failed.

Choose one of these manual migration methods:
  1. Run `vp dlx tsdown-migrate` in packages/b.
  2. Use the tsdown migration skill:
     https://github.com/rolldown/tsdown/blob/main/skills/tsdown-migrate/SKILL.md

Complete the tsup migration manually, then re-run `vp migrate`.
```

## `vpt stat-file packages/a/tsup.config.ts --assert file`

软件包 a 的原始配置已恢复

```
packages/a/tsup.config.ts: file
```

## `vpt stat-file packages/a/tsdown.config.ts --assert-not file`

软件包 a 的转换后配置已移除

```
packages/a/tsdown.config.ts: missing
```

## `vpt print-file packages/a/package.json`

软件包 a 的清单已恢复

```
{
  "name": "a",
  "type": "module",
  "scripts": {
    "build": "tsup --config tsup.config.ts"
  },
  "devDependencies": {
    "tsup": "^8.5.0",
    "vite": "^7.0.0"
  }
}
```

## `vpt stat-file packages/b/tsup.config.ts --assert file`

软件包 b 的原始配置已恢复

```
packages/b/tsup.config.ts: file
```

## `vpt stat-file packages/b/tsdown.config.ts --assert-not file`

软件包 b 的部分配置已移除

```
packages/b/tsdown.config.ts: missing
```

## `vpt print-file packages/b/package.json`

软件包 b 的清单已恢复

```
{
  "name": "b",
  "type": "module",
  "scripts": {
    "build": "tsup"
  },
  "devDependencies": {
    "tsup": "^8.5.0",
    "vite": "^7.0.0"
  }
}
```
