# create_default_hooks

## `vp create vite:application --no-interactive`

create 应生成默认的钩子策略


## `vpt print-file vite-plus-application/.vite-hooks/pre-commit`

项目自有的 pre-commit 钩子应运行 vp staged

```
vp staged
```

## `vpt print-file vite-plus-application/vite.config.ts`

vite 配置应包含匹配的暂存策略

```
import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
```
