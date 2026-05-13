# Lint 配置

`vp lint` 和 `vp check` 从 `vite.config.ts` 中的 `lint` 块读取 Oxlint 设置。详细信息请参考 [Oxlint 的配置文档](https://oxc.rs/docs/guide/usage/linter/config.html)。

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

对于工作区中面向特定包的 lint 规则，请从根目录的 `vite.config.ts` 使用 [`lint.overrides`](/guide/monorepo#root-config-with-overrides)。
