# 显式 nvmrc 目标可创建 pin

## `vpt rm .nvmrc`


## `vp env pin 22.13.0 --target nvmrc --no-install`

```
VITE+ - The Unified Toolchain for the Web

✓ Pinned Node.js version to 22.13.0
  Updated .nvmrc in <workspace}
note: Version will be downloaded on first use.
```

## `vp env pin --unpin node --target nvmrc`

```
VITE+ - The Unified Toolchain for the Web

✓ Removed .nvmrc from <workspace}
```

## `vpt stat-file .nvmrc --assert missing`

```
.nvmrc: missing
```
