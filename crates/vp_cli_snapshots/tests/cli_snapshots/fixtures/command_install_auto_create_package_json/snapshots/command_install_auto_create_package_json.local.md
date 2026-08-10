# 安装命令自动创建 package.json

## `vpt stat-file package.json --assert-not file`

验证不存在 package.json

```
package.json: missing
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
✓ Lockfile 已通过供应链策略检查（<duration> 前已验证）

devDependencies:
 testnpm2 1.0.1

已完成，耗时 <duration>，使用 pnpm <version>
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
