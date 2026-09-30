# Lint 配置

`vp lint` 会从工作目录开始使用 Oxlint 的[原生配置发现机制](/guide/lint#configuration)。使用 `vp lint -c <path>` 或 `vp lint --config <path>` 可选择其他配置。详情请参阅 [Oxlint 配置](https://oxc.rs/docs/guide/usage/linter/config.html)。

`vp check` 会使用工作区根目录中的 `lint` 块（如果存在），即使命令是在包目录中运行。包配置不会替换 `vp check` 的这些 lint 设置。

## 示例

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    ignorePatterns: ['dist/**'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      'no-console': ['error', { allow: ['error'] }],
    },
  },
});
```

我们建议同时启用 `options.typeAware` 和 `options.typeCheck`，这样 `vp lint` 和 `vp check` 就可以使用完整的类型感知路径。

对于文件或包特定的 lint 规则，请在根目录 `vite.config.ts` 中使用 [`lint.overrides`](/guide/monorepo#root-config-with-overrides)。

在 Vite+ 模式下，Oxlint 会禁用嵌套配置，因此嵌套 lint 配置不会覆盖单个文件的设置。详情请参阅[故障排除](/guide/troubleshooting#nested-lint-or-format-config-is-not-applied)。
