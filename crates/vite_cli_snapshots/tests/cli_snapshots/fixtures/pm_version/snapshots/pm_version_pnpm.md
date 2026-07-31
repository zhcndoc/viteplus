# pm_version_pnpm

## `vp pm version patch -- --no-git-tag-version`

pnpm 提升软件包版本

```
版本提升成功：
pm-version-pnpm：1.0.0 → 1.0.1
```

## `vp pm version 2.0.0 --json -- --no-git-tag-version`

pnpm 接受带有 JSON 输出的显式版本号

```
[
  {
    "name": "pm-version-pnpm",
    "currentVersion": "1.0.1",
    "newVersion": "2.0.0",
    "path": "<workspace>/pnpm"
  }
]
```

## `vp pm version prerelease -- --preid beta --no-git-tag-version`

pnpm 使用自定义标识符创建预发布版本

```
版本号提升成功：
pm-version-pnpm: 2.0.0 → 2.0.1-beta.0
```

## `vpt print-file package.json`

验证版本已更新

```
{
  "name": "pm-version-pnpm",
  "version": "2.0.1-beta.0",
  "private": true,
  "license": "MIT",
  "packageManager": "pnpm@11.0.6"
}
```
