# 迁移不支持_vite6

## `vpt write-file node_modules/vite/package.json '{"name":"vite","version":"6.4.3"}'`

将已安装的 vite 模拟为存根，这样迁移工具就能离线读取不受支持的版本


## `vp migrate --no-interactive`

迁移应该失败，因为不支持当前的 vite 版本

**退出代码：** 1

```
VITE+ - 面向 Web 的统一工具链

✘ package.json 中的 vite@6.4.3 不受自动迁移支持

请先将 vite 升级到 >=7.0.0 版本
Vite+ 目前还无法自动迁移此项目。
```

## `vpt print-file package.json`

检查 package.json 是否已更新

```
{
  "devDependencies": {
    "vite": "^6.0.0"
  },
  "packageManager": "pnpm@10.33.2"
}
```
