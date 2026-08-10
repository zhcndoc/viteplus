# lint_vite_plus_imports

## `vp lint src/index.ts`

修复前应失败（index.ts）

**退出代码：** 1

```

  × vite-plus(prefer-vite-plus-imports): Use 'vite-plus' instead of 'vitest/config' in Vite+ projects.
   ╭─[src/index.ts:3:30]
 2 │
 3 │ const configPromise = import('vitest/config');
   ·                              ───────────────
 4 │
   ╰────

  × vite-plus(prefer-vite-plus-imports): Use 'vite-plus/test' instead of 'vitest' in Vite+ projects.
   ╭─[src/index.ts:5:24]
 4 │
 5 │ export { expect } from 'vitest';
   ·                        ────────
 6 │
   ╰────

Found 0 warnings and 2 errors.
Finished in <duration> on 1 file with <n> rules using <n> threads.
```

## `vp lint src/types.ts`

修复前应失败（types.ts）

**退出代码：** 1

```

  × vite-plus(prefer-vite-plus-imports)：在 Vite+ 项目中，请使用 'vite-plus/test'，而不是 'vitest'。
   ╭─[src/types.ts:1:30]
 1 │ type TestFn = (typeof import('vitest'))['test'];
   ·                              ────────
 2 │ type BrowserContext = typeof import('@vitest/browser/context');
   ╰────

  × vite-plus(prefer-vite-plus-imports)：在 Vite+ 项目中，请使用 'vite-plus/test/browser/context'，而不是 '@vitest/browser/context'。
   ╭─[src/types.ts:2:37]
 1 │ type TestFn = (typeof import('vitest'))['test'];
 2 │ type BrowserContext = typeof import('@vitest/browser/context');
   ·                                     ─────────────────────────
 3 │ type BrowserClient = typeof import('@vitest/browser/client');
   ╰────

  × vite-plus(prefer-vite-plus-imports)：在 Vite+ 项目中，请使用 'vite-plus/test/client'，而不是 '@vitest/browser/client'。
   ╭─[src/types.ts:3:36]
 2 │ type BrowserContext = typeof import('@vitest/browser/context');
 3 │ type BrowserClient = typeof import('@vitest/browser/client');
   ·                                    ────────────────────────
 4 │ type PlaywrightProvider = typeof import('@vitest/browser-playwright/provider');
   ╰────

  × vite-plus(prefer-vite-plus-imports)：在 Vite+ 项目中，请使用 'vite-plus/test/browser/providers/playwright'，而不是 '@vitest/browser-playwright/provider'。
   ╭─[src/types.ts:4:41]
 3 │ type BrowserClient = typeof import('@vitest/browser/client');
 4 │ type PlaywrightProvider = typeof import('@vitest/browser-playwright/provider');
   ·                                         ─────────────────────────────────────
 5 │
   ╰────

发现 0 个警告和 4 个错误。
在 1 个文件上使用 <n> 个规则和 <n> 个线程，在 <duration> 内完成。
```

## `vp lint --fix src/index.ts src/types.ts`

重写 vitest/@vitest 导入；在配置文件之外保留 vite 导入（问题 #2004）

```
Found 0 warnings and 0 errors.
Finished in <duration> on 2 files with <n> rules using <n> threads.
```

## `vpt print-file src/index.ts`

```
import { defineConfig } from 'vite';

const configPromise = import('vite-plus');

export { expect } from 'vite-plus/test';

void defineConfig;
void configPromise;
```

## `vpt print-file src/types.ts`

```
type TestFn = (typeof import('vite-plus/test'))['test'];
type BrowserContext = typeof import('vite-plus/test/browser/context');
type BrowserClient = typeof import('vite-plus/test/client');
type PlaywrightProvider = typeof import('vite-plus/test/browser/providers/playwright');

declare module '@vitest/browser-playwright' {}
declare module '@vitest/browser-playwright/context' {}

import client = require('vite/client');

export type { BrowserClient, BrowserContext, PlaywrightProvider, TestFn };

void client;
```

## `vp lint src/index.ts src/types.ts`

确认重写后的文件没有问题

```
Found 0 warnings and 0 errors.
Finished in <duration> on 2 files with <n> rules using <n> threads.
```
