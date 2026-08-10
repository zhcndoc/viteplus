# pm_version_yarn

## `vp pm version patch --json -- --no-git-tag-version`

Yarn Classic 使用 JSON 输出提升软件包版本

```
{"type":"info","data":"Current version: 1.0.0"}
{"type":"info","data":"New version: 1.0.1"}
```

## `vp pm version 2.0.0 --json -- --no-git-tag-version`

Yarn Classic 接受带有 JSON 输出的显式版本号

```
{"type":"info","data":"Current version: 1.0.1"}
{"type":"info","data":"New version: 2.0.0"}
```

## `vp pm version prerelease --json -- --preid beta --no-git-tag-version`

Yarn Classic 使用自定义标识符创建预发布版本

```
{"type":"info","data":"Current version: 2.0.0"}
{"type":"info","data":"New version: 2.0.1-beta.0"}
```

## `vpt print-file package.json`

验证版本是否已更新

```
{
  "name": "pm-version-yarn",
  "version": "2.0.1-beta.0",
  "private": true,
  "license": "MIT",
  "packageManager": "yarn@1.22.22"
}
```
