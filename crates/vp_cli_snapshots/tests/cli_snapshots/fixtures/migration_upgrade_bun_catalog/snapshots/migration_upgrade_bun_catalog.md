# 迁移_升级_bun_目录

## `vp migrate --no-interactive`

现有的 bun Vite+ catalog 工作区针对 bun#8406 增加了直接的 vite 依赖边（bun 仅在工作区内解析 catalog:）

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  bun <version>
• 依赖项：
    vite-plus  0.1.20 → <version>
    vite              → <version>
• 已配置包管理器设置
```

## `vpt print-file package.json`

直接的 vite 条目是 catalog：（通过 bun catalog 解析），而不是具体的别名

```
{
  "name": "migration-upgrade-bun-catalog",
  "workspaces": [
    "packages/*"
  ],
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "overrides": {
    "vite": "catalog:"
  },
  "devEngines": {
    "packageManager": {
      "name": "bun",
      "version": "<version>",
      "onFail": "download"
    }
  },
  "catalog": {
    "vite-plus": "<version>",
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>"
  }
}
```
