# 命令_install_auto_create_package_json

## `vpt stat-file package.json --assert-not file`

验证不存在 package.json

```
package.json：缺失
```

## `vp install --silent`

应自动创建 package.json 并安装

```
```

## `vpt print-file package.json`

```
{
  "type": "module",
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "<version>",
      "onFail": "download"
    }
  }
}
```

## `vp add testnpm2 -D`

应将软件包添加到自动创建的 package.json 中

```
✓ Lockfile passes supply-chain policies (verified <duration> ago)

devDependencies:
 testnpm2 1.0.1

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json`

```
{
  "type": "module",
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "<version>",
      "onFail": "download"
    }
  },
  "devDependencies": {
    "testnpm2": "^1.0.1"
  }
}
```
