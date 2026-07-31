# 命令：初始化内联配置

## `vp lint --init`

```
已将“lint”添加到“vite.config.ts”。
```

## `vpt print-file vite.config.ts`

```
import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
```

## `vpt stat-file .oxlintrc.json --assert-not file`

检查 .oxlintrc.json 是否已删除

```
.oxlintrc.json: missing
```

## `vpt rm vite.config.ts`

```
```

## `vp fmt --init`

```
已将 'fmt' 添加到 'vite.config.ts'。
```

## `vpt print-file vite.config.ts`

```
import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: [],
  },
});
```

## `vpt stat-file .oxfmtrc.json --assert-not file`

检查 .oxfmtrc.json 是否已删除

```
.oxfmtrc.json: missing
```
