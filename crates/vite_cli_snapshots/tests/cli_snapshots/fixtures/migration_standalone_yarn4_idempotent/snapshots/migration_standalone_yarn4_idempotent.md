# 迁移_独立_yarn4_幂等

## `vp migrate --no-interactive`

首次运行前会自动转换 Yarn Berry PnP

```
VITE+ - Web 的统一工具链

⚠ Vite+ 当前不支持 Yarn Plug'n'Play (PnP)。

✔ 已将 Yarn 切换为 node-modules 模式
◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  yarn <version>
• 已应用 2 项配置更新，已重写 1 个文件中的导入
• 已配置包管理器设置
```

## `vpt print-file package.json`

迁移后的依赖项规范会立即使用 Yarn catalog

```
{
  "name": "migration-standalone-yarn4-idempotent",
  "scripts": {
    "test": "vp test run",
    "prepare": "vp config"
  },
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "packageManager": "yarn@4.12.0",
  "resolutions": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>"
  }
}
```

## `vpt print-file .yarnrc.yml`

托管的目录条目可用于这些依赖规范

```
nodeLinker: node-modules
npmPreapprovedPackages:
  - vitest
  - '@vitest/*'
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
```

## `vpt print-file example.spec.ts`

普通的 Vitest 导入使用 Vite+ 的公共接口

```
import { expect, it } from 'vite-plus/test';

it('works', () => expect(true).toBe(true));
```

## `vp migrate --no-interactive`

一个刚完成迁移的独立 Yarn 项目

```
VITE+ - Web 的统一工具链

此项目已经在使用 Vite+！祝编码愉快！
```
