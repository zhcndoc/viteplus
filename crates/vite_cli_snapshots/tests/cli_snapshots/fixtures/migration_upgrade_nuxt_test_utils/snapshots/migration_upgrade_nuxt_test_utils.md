# 迁移升级 Nuxt 测试工具

## `vp migrate --no-interactive`

在声明了 @nuxt/test-utils 的各个包中保留上游 Vitest

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  npm <version>
• 依赖项：
    vite-plus  latest → <version>
    vite              → <version>
    vitest     4.0.2  → <version>
• 已重写 1 个文件中的导入
• 为兼容 @nuxt/test-utils，已在 2 个文件中保留上游 `vitest` 导入
• 已配置包管理器设置
```

## `vpt print-file package.json`

直接使用 Vitest，其共享固定版本仍保留，以处理包级别例外

```
{
  "name": "migration-upgrade-nuxt-test-utils",
  "devDependencies": {
    "@nuxt/test-utils": "file:.fixture/nuxt-test-utils",
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

## `vpt print-file nuxt.spec.ts`

未加作用域的 Vitest 保持不变，同时带作用域的浏览器包进行迁移

```
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { page } from 'vite-plus/test/browser/context';
import { vi } from 'vitest';
import { defineConfig } from 'vitest/config';

mockNuxtImport('useExample', () => vi.fn());
void page;
void defineConfig;
```

## `vpt print-file unit.spec.ts`

同一软件包中一个无关的测试文件也继续使用上游 Vitest

```
import { expect } from 'vitest';

expect(true).toBe(true);
```

## `vp migrate --no-interactive`

包级别的兼容性结果是幂等的

```
VITE+ - 面向 Web 的统一工具链

此项目已经在使用 Vite+！祝编码愉快！
```
