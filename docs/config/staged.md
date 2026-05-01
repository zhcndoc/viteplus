# 分阶段配置

`vp staged` 和 `vp config` 从 `vite.config.ts` 中的 `staged` 块读取分阶段文件规则。请参阅 [提交钩子指南](/guide/commit-hooks)。

## 示例

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*.{js,ts,tsx,vue,svelte}': 'vp check --fix',
  },
});
```
