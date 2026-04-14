# Pack 配置

`vp pack` 从 `vite.config.ts` 中的 `pack` 块读取 tsdown 设置。详情请参考 [tsdown 的配置](https://tsdown.dev/options/config-file)。

## 示例

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    dts: true,
    format: ['esm', 'cjs'],
    sourcemap: true,
  },
});
```
