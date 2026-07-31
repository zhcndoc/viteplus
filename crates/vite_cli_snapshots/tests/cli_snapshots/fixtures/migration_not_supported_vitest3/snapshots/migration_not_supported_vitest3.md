# 不支持迁移_vitest3

## `vpt write-file node_modules/vitest/package.json '{"name":"vitest","version":"3.2.4"}'`

将已安装的 vitest 设为存根，以便 migrate 离线读取不受支持的版本


## `vp migrate --no-interactive`

迁移应该失败，因为不支持当前的 vitest 版本

**退出代码：** 1

```
VITE+ - 面向 Web 的统一工具链

✘ package.json 中的 vitest@3.2.4 不受自动迁移支持

请先将 vitest 升级到 >=4.0.0 版本

Vite+ 目前还无法自动迁移此项目。
```

## `vpt print-file package.json`

检查 package.json 是否已更新

```
{
  "devDependencies": {
    "vitest": "<version>"
  },
  "packageManager": "pnpm@10.33.2"
}
```
