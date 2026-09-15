# migration_oxlint_published_plugin

## `vp migrate --no-interactive`

此软件包将 `oxlint` 声明为对等依赖，这会将其标记为已发布的 Oxlint 插件

```
VITE+ - The Unified Toolchain for the Web

◇ Migrated . to Vite+ <version>
• Node <version>  pnpm <version>
• 2 config updates applied
```

## `vpt print-file lint/index.js`

编写时的导入仍然使用“oxlint”。已发布插件的使用者可能会直接运行 Oxlint，因此改写为 vite-plus 会导致其无法使用。这也涵盖了顺序陷阱：rewritePackageJson 会在导入重写器读取清单之前移除 `oxlint`，因此跳过信号会预先捕获

```
import { defineRule } from 'oxlint';

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

## `vpt print-file package.json`

`oxlint` 对等依赖项会保留。它是使用者契约，而不是此软件包运行的工具；移除它会使源代码导入一个清单中不再声明的软件包

```
{
  "name": "oxlint-plugin-example",
  "version": "1.0.0",
  "scripts": {
    "lint": "vp lint .",
    "prepare": "vp config"
  },
  "peerDependencies": {
    "oxlint": "^1.0.0"
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
