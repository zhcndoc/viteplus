# 格式配置

`vp fmt` 和 `vp check` 从根目录 `vite.config.ts` 中的 `fmt` 块读取 Oxfmt 设置。详情请参阅 [Oxfmt 配置](https://oxc.rs/docs/guide/usage/formatter/config.html)。

## 示例

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    ignorePatterns: ['dist/**'],
    singleQuote: true,
    semi: true,
    sortPackageJson: true,
  },
});
```

对于特定文件或软件包的格式设置，请使用根目录 `vite.config.ts` 中的 [`fmt.overrides`](/guide/monorepo#format-overrides)。

Vite+ 目前不支持嵌套格式配置。详情以及如何反馈未来的支持需求，请参阅[故障排除](/guide/troubleshooting#nested-lint-or-format-config-is-not-applied)。
