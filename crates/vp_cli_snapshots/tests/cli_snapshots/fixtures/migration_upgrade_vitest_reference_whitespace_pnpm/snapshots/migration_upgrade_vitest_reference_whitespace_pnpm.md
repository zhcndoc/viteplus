# 迁移_升级_vitest_参考_空白_pnpm

## `vp migrate --no-interactive`

Vitest 类型指令中的 TypeScript 空白字符有效

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新，1 个文件的导入已重写
```

## `vpt print-file package.json`

重写后的指令不会保留冗余的 Vitest 依赖

```
{
  "name": "migration-upgrade-vitest-reference-whitespace-pnpm",
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "<version>",
      "onFail": "download"
    }
  },
  "scripts": {
    "prepare": "vp config"
  }
}
```

## `vpt print-file env.d.ts`

指令被重写为 Vite+ 公共类型接口

```
/// <reference types = "vite-plus/test" />
```

## `vpt print-file pnpm-workspace.yaml`

重写后的指令未保留共享的 Vitest 管理

```
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
overrides:
  vite: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```

## `vp migrate --no-interactive`

指令重写在重新运行时保持稳定

```
VITE+ - 面向 Web 的统一工具链

此项目已经在使用 Vite+！祝编码愉快！
```
