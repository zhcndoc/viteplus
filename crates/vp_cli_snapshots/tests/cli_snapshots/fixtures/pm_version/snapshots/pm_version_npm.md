# pm_version_npm

## `vp pm version patch -- --no-git-tag-version`

npm 提升软件包版本

```
<version>
```

## `vp pm version 2.0.0 --json -- --no-git-tag-version`

npm 接受带有 JSON 输出的显式版本

```
<version>
```

## `vp pm version prerelease -- --preid beta --no-git-tag-version`

npm 使用自定义标识符创建预发布版本

```
<version>
```

## `vpt print-file package.json`

验证版本是否已更新

```
{
  "name": "pm-version-npm",
  "version": "2.0.1-beta.0",
  "private": true,
  "license": "MIT",
  "packageManager": "npm@11.11.1"
}
```
