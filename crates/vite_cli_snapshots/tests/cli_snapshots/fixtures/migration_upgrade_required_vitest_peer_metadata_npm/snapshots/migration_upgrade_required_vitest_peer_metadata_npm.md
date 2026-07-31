# 迁移_升级_必需_vitest_对等_元数据_npm

## `vp migrate --no-interactive`

干净检出会保守地保留现有的 Vitest

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  npm <version>
• 依赖：
    vite-plus  latest → <version>
    vite              → <version>
    vitest     4.1.8  → <version>
• 已配置包管理器设置
```

## `vpt print-file package.json`

包本地 Vitest 与其共享覆盖配置保持一致

```
{
  "name": "migration-upgrade-required-vitest-peer-metadata-npm",
  "devDependencies": {
    "vite-plugin-gherkin": "0.2.0",
    "vite-plus": "<version>",
    "vitest": "<version>"
  },
  "overrides": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>",
    "vitest": "<version>"
  },
  "devEngines": {
    "packageManager": {
      "name": "npm",
      "version": "<version>",
      "onFail": "download"
    }
  }
}
```

## `vpt mkdir node_modules`

模拟已安装的依赖元数据


## `vpt cp -r .fixture/vite-plugin-gherkin node_modules`


## `vp migrate --no-interactive`

元数据确认了未命名的必需 Vitest 对等依赖

```
VITE+ - Web 的统一工具链

此项目已在使用 Vite+！祝编码愉快！
```
