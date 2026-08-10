# pm_dedupe_yarn

## `vp dedupe -- --silent`

Yarn Classic 会回退到安装操作，因为安装过程已经会对依赖进行去重

```
warn: Yarn Classic dedupes during install, falling back to yarn install
```

## `vpt print-file package.json`

验证 Yarn Classic 已完成

```
{
  "name": "pm-dedupe-yarn",
  "version": "1.0.0",
  "private": true,
  "license": "MIT",
  "packageManager": "yarn@1.22.22"
}
```
