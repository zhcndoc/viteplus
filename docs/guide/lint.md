# 代码检查

`vp lint` 使用 Oxlint 对代码进行代码检查。

## 概述

`vp lint` 基于 [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) 构建，Oxlint 是 Oxc 的 linter。它被设计为大多数前端项目中 ESLint 的快速替代方案，内置支持核心 ESLint 规则和许多流行的社区规则。

使用 `vp lint` 对项目进行 lint 检查，使用 `vp check` 可以同时完成格式化、lint 检查和类型检查。

## 用法

```bash
vp lint
vp lint --fix
vp lint --type-aware
```

## 配置

直接在根目录的 `vite.config.ts` 中的 `lint` 块内配置 lint，这样所有配置都可以集中在一个位置。我们不建议在 Vite+ 中使用 `oxlint.config.ts` 或 `.oxlintrc.json`。

Vite+ 目前不支持嵌套的 lint 配置。现在，请在根目录的 `vite.config.ts` 中使用 [`lint.overrides`](/guide/monorepo#root-config-with-overrides) 来配置针对文件或包的规则。长期行为仍在讨论中；请[分享你的用例和预期](/guide/troubleshooting#nested-lint-or-format-config-is-not-applied)，帮助我们完善相关方案。

对于上游规则集、选项和兼容性详情，请参阅 [Oxlint 文档](https://oxc.rs/docs/guide/usage/linter.html)。

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    ignorePatterns: ['dist/**'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
});
```

## 类型感知型 Lint 检查

我们建议在 `lint` 块中同时启用 `typeAware` 和 `typeCheck`：

- `typeAware: true` 启用需要 TypeScript 类型信息的规则
- `typeCheck: true` 在 lint 检查期间启用完整的类型检查

此路径基于 TypeScript 7（即 TypeScript Go）工具链中的 [tsgolint](https://github.com/oxc-project/tsgolint) 提供支持。它使 Oxlint 能够访问类型信息，并允许通过 `vp lint` 和 `vp check` 直接进行类型检查。

## JavaScript 插件

如果你正在从 ESLint 迁移，并且仍然依赖一些关键的基于 JavaScript 的 ESLint 插件，Oxlint 提供了 [JS 插件支持](https://oxc.rs/docs/guide/usage/linter/js-plugins)，可以帮助你在完成迁移的同时继续运行这些插件。

JS Plugins 还支持为 Oxlint [编写你自己的自定义规则](https://oxc.rs/docs/guide/usage/linter/writing-js-plugins.html)。

### 编写你自己的规则

从 `vite-plus/lint/plugins` 导入插件编写 API：

```js [lint/my-plugin.js]
import { definePlugin, defineRule } from 'vite-plus/lint/plugins';

const noFoo = defineRule({
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

export default definePlugin({
  meta: { name: 'my' },
  rules: { 'no-foo': noFoo },
});
```

在 `lint.jsPlugins` 下注册插件并启用其规则：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    jsPlugins: ['./lint/my-plugin.js'],
    rules: {
      'my/no-foo': 'error',
    },
  },
});
```

对于规则测试，可以从 `vite-plus/lint/plugins-dev` 使用 `RuleTester`。

两个入口点都会重新导出 Vite+ 随附的副本。因此，API 始终与内置的 Oxlint 保持一致。

请使用它们，而不要将 `@oxlint/plugins` 或 `oxlint` 添加为直接依赖。单独锁定版本的副本可能会与加载插件的 linter 产生偏差。此外，在 pnpm 的严格布局下，如果每个包含插件的包都没有声明该依赖，它也无法从插件文件中解析出来。

`vp migrate` 会为你重写现有的 `oxlint` 和 `@oxlint/plugins` 导入。请参阅 [Oxlint JS 插件导入](/guide/migrate-rules#oxlint-js-plugin-imports)。`vite-plus/prefer-vite-plus-imports` 规则会报告任何重新出现的导入。
