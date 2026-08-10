# pm_dedupe_bun

## `vp dedupe -- --silent`

由于 Bun 不支持去重，因此回退到安装

```
warn: bun does not support dedupe, falling back to bun install
```

## `vpt print-file package.json`

验证 Bun 已完成

```
{
  "name": "pm-dedupe-bun",
  "version": "1.0.0",
  "private": true,
  "license": "MIT",
  "packageManager": "bun@1.3.11"
}
```
