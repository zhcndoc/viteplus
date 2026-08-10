# 不支持从 pnpm 9.4 迁移

## `vp migrate --no-interactive`

迁移应失败，因为不支持当前的 pnpm 版本

**退出代码：** 1

```
VITE+ - 面向 Web 的统一工具链

✘ auto migration 不支持 pnpm@9.4.0，请先将 pnpm 升级到 >=9.5.0
Vite+ 目前还无法自动迁移此项目。
```

## `vpt print-file package.json`

检查 package.json 未更新

```
{
  "devDependencies": {
    "vite": "^7.0.0"
  },
  "packageManager": "pnpm@9.4.0"
}
```
