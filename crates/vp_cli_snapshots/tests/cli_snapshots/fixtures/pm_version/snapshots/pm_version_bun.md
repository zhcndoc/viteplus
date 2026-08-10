# pm_version_bun

## `vp pm version patch -- --no-git-tag-version`

Bun 更新软件包版本

```
<version>
```

## `vp pm version prerelease -- --preid beta --no-git-tag-version`

Bun 使用自定义标识符创建预发布版本

```
<version>
```

## `vp pm version 2.0.0 --json`

Bun 拒绝不受支持的 JSON 输出

**退出代码：** 1

```
Invalid argument: `--json` is not supported by Bun `version`.
```

## `vpt print-file package.json`

验证被拒绝的命令没有更新版本

```
{
  "name": "pm-version-bun",
  "version": "1.0.2-beta.0",
  "private": true,
  "license": "MIT",
  "packageManager": "bun@1.3.14"
}
```
