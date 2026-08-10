# 不支持迁移_npm8_2

## `vp migrate --no-interactive`

迁移应失败，因为不支持该 npm 版本

**退出代码：** 1

```
VITE+ - 面向 Web 的统一工具链

✘ npm@8.2.0 不受自动迁移支持，请先将 npm 升级到 >=8.3.0
Vite+ 目前还无法自动迁移此项目。
```

## `vpt print-file package.json`

检查 package.json 是否未更新

```
{
  "devDependencies": {
    "vite": "^7.0.0"
  },
  "packageManager": "npm@8.2.0"
}
```
