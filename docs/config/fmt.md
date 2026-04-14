# 格式配置

`vp fmt` 和 `vp check` 会从 `vite.config.ts` 中的 `fmt` 块读取 Oxfmt 设置。详见 [Oxfmt 的配置](https://oxc.rs/docs/guide/usage/formatter/config.html)。

## 示例

```ts
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
