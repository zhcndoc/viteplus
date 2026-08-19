# 仅导入 Vitest 的迁移

## `vp migrate --no-interactive`

普通的 Vitest 导入应迁移，但不应保留对 Vitest 的直接依赖

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新，已重写 1 个文件中的导入
```

## `vpt print-file package.json`

应移除直接依赖和共享版本固定

```
{
  "name": "migration-vitest-import-only",
  "scripts": {
    "test": "vp test",
    "prepare": "vp config"
  },
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
  }
}
```

## `vpt print-file example.spec.ts`

源代码导入应使用 Vite+ 公共接口

```
import { expect, it } from 'vite-plus/test';

it('works', () => {
  expect(true).toBe(true);
});
```

## `vpt print-file pnpm-workspace.yaml`

```
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
overrides:
  vite@*: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```
