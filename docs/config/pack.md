# Pack Configuration

`vp pack` reads tsdown settings from the `pack` block in `vite.config.ts`. For details, please refer to [tsdown's configuration](https://tsdown.dev/options/config-file).

## Example

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    dts: true,
    format: ['esm', 'cjs'],
    sourcemap: true,
  },
});
```
