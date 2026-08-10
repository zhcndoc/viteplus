# 迁移_独立_yarn_低于_catalog

## `vp migrate --no-interactive`

Yarn < 4.10.0 无法解析 `catalog:`，因此托管的规范仍保持为具体版本

```
VITE+ - 面向 Web 的统一工具链

⚠ Vite+ 当前不支持 Yarn Plug'n'Play (PnP)。

✔ 已将 Yarn 切换至 node-modules 模式
◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  yarn <version>
• 已应用 2 项配置更新
• 已配置包管理器设置
```

## `vpt print-file package.json`

具体规范：通过 @voidzero-dev/vite-plus-core 别名使用 `vite`，不使用 `catalog:` 引用

```
{
  "name": "migration-standalone-yarn-below-catalog",
  "scripts": {
    "test": "vp test run",
    "prepare": "vp config"
  },
  "devDependencies": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>",
    "vite-plus": "<version>"
  },
  "packageManager": "yarn@3.6.0",
  "resolutions": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>"
  }
}
```

## `vpt print-file .yarnrc.yml`

已配置 node-modules 链接器，但未写入 catalog 字段

```
nodeLinker: node-modules
npmPreapprovedPackages:
  - vitest
  - '@vitest/*'
```
