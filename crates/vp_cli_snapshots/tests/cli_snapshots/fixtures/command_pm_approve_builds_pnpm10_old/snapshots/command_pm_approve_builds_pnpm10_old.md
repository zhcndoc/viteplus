# command_pm_approve_builds_pnpm10_old

## `vp pm approve-builds --all`

pnpm 10.31.0 < 10.32.0 → 被友好的 UserMessage 拒绝（无 `error:` 前缀）

**退出代码：** 1

```
`--all` requires pnpm >= 10.32.0. Upgrade pnpm or pass package names explicitly.
```

## `vp pm approve-builds esbuild !core-js`

pnpm 10.31.0 < 11.0.0 → 不支持 `!pkg` 拒绝语法

**退出代码：** 1

```
`!<pkg>` deny syntax requires pnpm >= 11.0.0. Upgrade pnpm or omit the `!` entries.
```

## `vp pm approve-builds esbuild`

在旧版 pnpm 上，普通位置参数仍然有效

```
没有等待批准的软件包
```
