# 迁移_升级_vitest_精确_对等依赖_yarn4

## `vp migrate --no-interactive`

Yarn PnP 在精确 peer 迁移之前转换为 node-modules

```
VITE+ - Web 统一工具链

⚠ Vite+ 当前不支持 Yarn Plug'n'Play (PnP)。

✔ 已将 Yarn 切换为 node-modules 模式
◇ 已将 . 更新为 Vite+ <version>
• Node <version>  yarn <version>
• 依赖项：
    vite-plus   latest → <version>
    vite               → <version>
    @vitest/ui  4.1.8  → <version>
• 已配置包管理器设置
```

## `vpt print-file package.json`

直接依赖和解析应使用受管理的目录/版本

```
{
  "name": "migration-upgrade-vitest-exact-peer-yarn4",
  "devDependencies": {
    "@vitest/ui": "catalog:",
    "vite-plus": "catalog:",
    "vitest": "catalog:"
  },
  "resolutions": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>",
    "vitest": "<version>"
  },
  "devEngines": {
    "packageManager": {
      "name": "yarn",
      "version": "<version>",
      "onFail": "download"
    }
  }
}
```

## `vpt print-file .yarnrc.yml`

链接器转换和对齐后的 Vitest catalog 已持久化

```
nodeLinker: node-modules
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
  vitest: <version>
  '@vitest/ui': <version>
npmPreapprovedPackages:
  - vitest
  - '@vitest/*'
```
