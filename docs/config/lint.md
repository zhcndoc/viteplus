# Lint 配置

`vp lint` 和 `vp check` 会从根目录 `vite.config.ts` 中的 `lint` 块读取 Oxlint 设置。详情请参阅 [Oxlint 的配置](https://oxc.rs/docs/guide/usage/linter/config.html)。

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

Vite+ 目前不支持嵌套的 lint 配置。详情以及如何反馈未来的支持需求，请参阅[故障排除](/guide/troubleshooting#nested-lint-or-format-config-is-not-applied)。
