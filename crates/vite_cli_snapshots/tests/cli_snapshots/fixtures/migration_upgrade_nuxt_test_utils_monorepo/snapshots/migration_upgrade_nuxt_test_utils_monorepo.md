# 迁移_升级_nuxt_测试_工具_单仓库

## `vp migrate --no-interactive`

保留上游 Vitest 的包级导入，并将其局部化到受影响的工作区

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖项：
    vite-plus  latest → <version>
    vite              → <version>
• 已重写 1 个文件中的导入
• 为兼容 @nuxt/test-utils，在 2 个文件中保留了上游 `vitest` 导入
• 已配置包管理器设置
```

## `vpt print-file packages/nuxt/package.json`

受影响的工作区保留了直接依赖的 Vitest

```
{
  "name": "nuxt-tests",
  "private": true,
  "devDependencies": {
    "@nuxt/test-utils": "file:../../.fixture/nuxt-test-utils",
    "vitest": "catalog:"
  }
}
```

## `vpt print-file packages/unit/package.json`

无关工作区移除直接依赖的 Vitest

```
{
  "name": "unit-tests",
  "private": true,
  "devDependencies": {}
}
```

## `vpt print-file pnpm-workspace.yaml`

由于某个工作区需要使用 Vitest，因此仍保留共享的 Vitest 版本固定配置

```
packages:
  - packages/*

catalog:
  vite-plus: <version>
  vitest: <version>
  vite: npm:@voidzero-dev/vite-plus-core@<version>

overrides:
  vite: 'catalog:'
  vitest: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
    - vitest
  allowedVersions:
    vite: '*'
    vitest: '*'
```

## `vpt print-file packages/nuxt/nuxt.spec.ts`

上游 Vitest 及其子路径保持不变

```
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { expect, vi } from 'vitest';
import { startVitest } from 'vitest/node';

mockNuxtImport('useExample', () => vi.fn());
void expect;
void startVitest;
```

## `vpt print-file packages/nuxt/unit.spec.ts`

不包含 Nuxt 导入的文件仍会在受影响的软件包中保留 Vitest

```
import { expect } from 'vitest';
import { startVitest } from 'vitest/node';

void expect;
void startVitest;
```

## `vpt print-file packages/unit/unit.spec.ts`

一个无关的工作区仍在迁移 Vitest

```
import { expect } from 'vite-plus/test';

void expect;
```

## `vp migrate --no-interactive`

工作区结果是幂等的

```
VITE+ - The Unified Toolchain for the Web

This project is already using Vite+! Happy coding!
```
