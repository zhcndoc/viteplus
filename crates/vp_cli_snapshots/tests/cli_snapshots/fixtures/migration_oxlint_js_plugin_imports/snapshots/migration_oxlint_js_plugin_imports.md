# migration_oxlint_js_plugin_imports

## `vp migrate --no-interactive`

独立的 oxlint 依赖将被移除，因此 JS plugin 的 authoring imports 必须迁移到 vite-plus

```
VITE+ - The Unified Toolchain for the Web

◇ Migrated . to Vite+ <version>
• Node <version>  pnpm <version>
• 3 config updates applied, 3 files had imports rewritten
```

## `vpt print-file package.json`

oxlint 和 @oxlint/plugins 都已从 devDependencies 中移除，且没有任何替代项。API 现在来自 vite-plus

```
{
  "name": "migration-oxlint-js-plugin-imports",
  "scripts": {
    "lint": "vp lint .",
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

## `vpt print-file lint/no-foo.js`

来自 'oxlint' 的旧版 `defineRule` -> 'vite-plus/lint/plugins'

```
import { defineRule } from 'vite-plus/lint/plugins';

export const noFoo = defineRule({
  meta: { messages: { noFoo: 'Do not name things "foo".' } },
  create(context) {
    return {
      Identifier(node) {
        if (node.name === 'foo') {
          context.report({ node, messageId: 'noFoo' });
        }
      },
    };
  },
});
```

## `vpt print-file lint/plugin.js`

'@oxlint/plugins' -> 'vite-plus/lint/plugins'

```
import { definePlugin } from 'vite-plus/lint/plugins';

import { noFoo } from './no-foo.js';

export default definePlugin({
  meta: { name: 'local' },
  rules: { 'no-foo': noFoo },
});
```

## `vpt print-file lint/no-foo.test.ts`

RuleTester 在上游的 'oxlint/plugins-dev' 中，且会以相同方式失效，因此它会映射到 'vite-plus/lint/plugins-dev'。plugin type import 遵循 runtime API

```
import type { Context } from 'vite-plus/lint/plugins';
import { RuleTester } from 'vite-plus/lint/plugins-dev';

import { noFoo } from './no-foo.js';

export type RuleContext = Context;

new RuleTester().run('no-foo', noFoo, {
  valid: ['const bar = 1;'],
  invalid: [{ code: 'const foo = 1;', errors: 1 }],
});
```

## `vpt print-file lint/shared-config.ts`

config surface 不会被重定向。vite-plus/lint/plugins 没有 defineConfig 或 OxlintOverride。已知的既有缺口，比此 PR 涉及的范围更广：`oxlint` 位于 REMOVE_PACKAGES 中，因此迁移会删除该依赖，而此 import 会保留。在 pnpm strict layout 下，该 import 随后将无法解析。这早于 plugin-API rewrite，因为 config-surface imports 从未被重写，而 `oxlint` 一直都会被移除。记录在此，以便修复会显示为 snapshot diff

```
import { defineConfig } from 'oxlint';
import type { OxlintOverride } from 'oxlint';

export const testOverride: OxlintOverride = {
  files: ['**/*.test.ts'],
  rules: { 'local/no-foo': 'off' },
};

export default defineConfig({ overrides: [testOverride] });
```

## `vpt print-file vite.config.ts`

jsPlugins entry 在 .oxlintrc.json merge 后仍然保留。它仍然指向 plugin file，而该文件现在已经被重写。已知的既有缺口，与 import rewrite 无关：merge 会丢弃 `local/no-foo`。sanitizeMigratedOxlintConfig 从 plugin 的 package name 推导其 rule namespace，而 relative-path plugin 没有 package name。它的 namespace 会在加载时改为来自 `meta.name`。记录在此，以便修复会显示为 snapshot diff

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    "*": "vp check --fix"
  },
  fmt: {},
  lint: {
    "jsPlugins": [
      "./lint/plugin.js",
      {
        "name": "vite-plus",
        "specifier": "vite-plus/oxlint-plugin"
      }
    ],
    "rules": {
      "vite-plus/prefer-vite-plus-imports": "error"
    },
    "options": {
      "typeAware": true,
      "typeCheck": true
    }
  },
});
```
