# 测试配置

`vp test` 从 `vite.config.ts` 中的 `test` 块读取 Vitest 设置。详见 [Vitest 的配置](https://vitest.dev/config/)。

## 示例

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
```
