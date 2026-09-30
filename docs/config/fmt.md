# 格式配置

`vp fmt` 会从工作目录开始使用 Oxfmt 的[原生配置发现机制](/guide/fmt#configuration)。使用 `vp fmt -c <path>` 或 `vp fmt --config <path>` 可选择其他配置。详情请参阅 [Oxfmt 配置](https://oxc.rs/docs/guide/usage/formatter/config.html)。

`vp check` 会使用工作区根目录中的 `fmt` 块（如果存在），即使命令是在包目录中运行。包配置不会替换 `vp check` 的这些格式设置。

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

在 Vite+ 模式下，Oxfmt 会禁用嵌套配置，因此嵌套格式配置不会覆盖单个文件的设置。详情请参阅[故障排除](/guide/troubleshooting#nested-lint-or-format-config-is-not-applied)。
