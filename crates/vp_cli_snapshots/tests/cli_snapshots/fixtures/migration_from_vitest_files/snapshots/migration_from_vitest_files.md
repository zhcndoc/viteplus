# 从 Vitest 文件迁移

## `vp migrate --no-interactive`

迁移应将导入重写为 vite-plus

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <版本>
• Node <版本>  pnpm <版本>
• 已应用 2 项配置更新，已重写 1 个文件中的导入
```

## `vpt print-file package.json`

检查 package.json

```
{
  "name": "migration-from-vitest-files",
  "scripts": {
    "test:run": "vp test run",
    "test:ui": "vp test --ui",
    "test:coverage": "vp test run --coverage",
    "test:watch": "vp test --watch",
    "test": "vp test",
    "prepare": "vp config"
  },
  "devDependencies": {
    "@vitest/browser-playwright": "catalog:",
    "vite": "catalog:",
    "vitest": "catalog:",
    "playwright": "*",
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

## `vpt print-file pnpm-workspace.yaml`

检查 pnpm-workspace.yaml 是否包含 overrides 和 catalog

```
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vitest: <version>
  vite-plus: <version>
  '@vitest/browser-playwright': <version>
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

## `vpt print-file test/hello.ts`

检查 test/hello.ts

```
import { server } from 'vite-plus/test/browser/context';
import { test, describe, expect, it } from 'vite-plus/test';

const { readFile } = server.commands;

describe('Hello', () => {
  it('should return the correct result', () => {
    expect(true).toBe(true);
  });
});
```
