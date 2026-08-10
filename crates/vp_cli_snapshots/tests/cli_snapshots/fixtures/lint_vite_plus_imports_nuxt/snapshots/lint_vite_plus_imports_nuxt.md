# lint_vite_plus_imports_nuxt

## `vp lint --threads=1 src/nuxt.spec.ts src/unit.spec.ts`

在此 Nuxt 软件包中，裸 Vitest 导入不受检查；非配置文件中的 Vite 导入会被保留（问题 #2004）；@vitest/browser（而非上游 Vitest）仍然会失败

**退出代码:** 1

```

  × vite-plus(prefer-vite-plus-imports): Use 'vite-plus/test/browser' instead of '@vitest/browser' in Vite+ projects.
   ╭─[src/unit.spec.ts:1:22]
 1 │ import { page } from '@vitest/browser';
   ·                      ─────────────────
 2 │ import { defineConfig } from 'vite';
   ╰────

Found 0 warnings and 1 error.
Finished in <duration> on 2 files with <n> rules using <n> threads.
```

## `vp lint --threads=1 --fix src/nuxt.spec.ts src/unit.spec.ts`

修复 @vitest/browser，同时不修改上游 Vitest 或保留的 Vite 导入

```
Found 0 warnings and 0 errors.
Finished in <duration> on 2 files with <n> rules using <n> threads.
```

## `vpt print-file src/nuxt.spec.ts`

```
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { expect, vi } from 'vitest';
import { startVitest } from 'vitest/node';

mockNuxtImport('useExample', () => vi.fn());
void expect;
void startVitest;
```

## `vpt print-file src/unit.spec.ts`

```
import { page } from 'vite-plus/test/browser';
import { defineConfig } from 'vite';
import { expect } from 'vitest';

void page;
void defineConfig;
void expect;
```

## `vp lint --threads=1 src/nuxt.spec.ts src/unit.spec.ts`

确认包级别的兼容性检查结果无误

```
发现 0 条警告和 0 个错误。
使用 <n> 个线程依据 <n> 条规则对 2 个文件完成检查，耗时 <duration>。
```
