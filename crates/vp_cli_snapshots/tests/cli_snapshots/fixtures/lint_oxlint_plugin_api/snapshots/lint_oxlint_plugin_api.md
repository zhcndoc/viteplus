# lint_oxlint_plugin_api

## `vp lint src/uses-foo.ts`

本地 JS 插件从 vite-plus/lint/plugins 导入其 API。它未声明 @oxlint/plugins 依赖。因此，报告的诊断证明该导出已成功解析并加载

**退出代码：** 1

```

  × local(no-foo): Do not name things "foo".
   ╭─[src/uses-foo.ts:1:14]
 1 │ export const foo = 1;
   ·              ───
 2 │ export const bar = 2;
   ╰────

Found 0 warnings and 1 error.
Finished in <duration> on 1 file with <n> rules using <n> threads.
```

## `vp lint src/legacy-imports.ts`

prefer-vite-plus-imports 报告了三个旧版 authoring specifier

**退出代码：** 1

```

  × vite-plus(prefer-vite-plus-imports): Use 'vite-plus/lint/plugins' instead of 'oxlint' in Vite+ projects.
   ╭─[src/legacy-imports.ts:1:28]
 1 │ import { defineRule } from 'oxlint';
   ·                            ────────
 2 │ import { definePlugin } from '@oxlint/plugins';
   ╰────

  × vite-plus(prefer-vite-plus-imports): Use 'vite-plus/lint/plugins' instead of '@oxlint/plugins' in Vite+ projects.
   ╭─[src/legacy-imports.ts:2:30]
 1 │ import { defineRule } from 'oxlint';
 2 │ import { definePlugin } from '@oxlint/plugins';
   ·                              ─────────────────
 3 │ import { RuleTester } from 'oxlint/plugins-dev';
   ╰────

  × vite-plus(prefer-vite-plus-imports): Use 'vite-plus/lint/plugins-dev' instead of 'oxlint/plugins-dev' in Vite+ projects.
   ╭─[src/legacy-imports.ts:3:28]
 2 │ import { definePlugin } from '@oxlint/plugins';
 3 │ import { RuleTester } from 'oxlint/plugins-dev';
   ·                            ────────────────────
 4 │
   ╰────

  × vite-plus(prefer-vite-plus-imports): Use 'vite-plus/lint/plugins' instead of 'oxlint' in Vite+ projects.
   ╭─[src/legacy-imports.ts:6:38]
 5 │ export { defineRule, definePlugin, RuleTester };
 6 │ export { 'defineRule' as rule } from 'oxlint';
   ·                                      ────────
 7 │ export type { 'Context' as RuleContext } from 'oxlint';
   ╰────

  × vite-plus(prefer-vite-plus-imports): Use 'vite-plus/lint/plugins' instead of 'oxlint' in Vite+ projects.
   ╭─[src/legacy-imports.ts:7:47]
 6 │ export { 'defineRule' as rule } from 'oxlint';
 7 │ export type { 'Context' as RuleContext } from 'oxlint';
   ·                                               ────────
   ╰────

Found 0 warnings and 5 errors.
Finished in <duration> on 1 file with <n> rules using <n> threads.
```

## `vp lint src/config-surface.ts`

oxlint 仍然负责 defineConfig 和 OxlintOverride，因此这些内容没有问题

```
Found 0 warnings and 0 errors.
Finished in <duration> on 1 file with <n> rules using <n> threads.
```

## `vp lint --fix src/legacy-imports.ts`

自动修复结果与 vp migrate 重写的结果一致

```
Found 0 warnings and 0 errors.
Finished in <duration> on 1 file with <n> rules using <n> threads.
```

## `vpt print-file src/legacy-imports.ts`

```
import { defineRule } from 'vite-plus/lint/plugins';
import { definePlugin } from 'vite-plus/lint/plugins';
import { RuleTester } from 'vite-plus/lint/plugins-dev';

export { defineRule, definePlugin, RuleTester };
export { 'defineRule' as rule } from 'vite-plus/lint/plugins';
export type { 'Context' as RuleContext } from 'vite-plus/lint/plugins';
```

## `vp lint src/legacy-imports.ts`

确认重写后的文件没有问题

```
Found 0 warnings and 0 errors.
Finished in <duration> on 1 file with <n> rules using <n> threads.
```
