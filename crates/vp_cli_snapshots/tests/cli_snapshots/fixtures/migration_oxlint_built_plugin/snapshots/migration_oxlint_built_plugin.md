# migration_oxlint_built_plugin

## `git init`


## `vpt mkdir dist`


## `vpt cp plugin.cjs dist/plugin.cjs`


## `vpt rm plugin.cjs`


## `vp migrate --no-interactive --no-hooks --no-agent --no-editor`


## `vpt print-file package.json`

被忽略的构建产物仍然需要直接依赖 @oxlint/plugins。

```
{
  "name": "migration-oxlint-built-plugin",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.24.0",
  "scripts": {
    "lint": "vp lint ."
  },
  "devDependencies": {
    "@oxlint/plugins": "1.79.0",
    "vite": "catalog:",
    "vite-plus": "catalog:"
  }
}
```

## `vpt print-file dist/plugin.cjs`

Migration 不会重写或重新构建被忽略的 CommonJS 插件。

```
const { definePlugin, defineRule } = require('@oxlint/plugins');

module.exports = definePlugin({
  meta: { name: 'built' },
  rules: {
    'no-foo': defineRule({
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
    }),
  },
});
```

## `vpt rm -rf node_modules`


## `vp install --ignore-scripts`


## `vp lint src/input.js`

严格执行 pnpm 重新安装后，被构建的插件成功加载并报告其规则。

```
VITE+ - The Unified Toolchain for the Web

note: You are running `vp lint` as a Vite+ built-in command. If you meant to run the lint npm script, use `vpr lint` instead.

  ⚠ built(no-foo): Do not name things "foo".
   ╭─[src/input.js:1:14]
 1 │ export const foo = 1;
   ·              ───
   ╰────

Found 1 warning and 0 errors.
Finished in <duration> on 1 file with <n> rules using <n> threads.
```
