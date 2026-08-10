# migration_inline_config_shorthand

## `vp migrate --no-interactive --no-hooks`

不得重复已声明为简写属性的 fmt/lint（#1836）

```
VITE+ - The Unified Toolchain for the Web

◇ Migrated . to Vite+ <version>
• Node <version>  pnpm <version>
```

## `vpt print-file vite.config.ts`

fmt/lint 仅作为简写保留，不注入内联的 fmt:/lint: 代码块

```
import { defineConfig } from 'vite-plus';

// 映射一个自定义模板，该模板将工具配置保存在独立模块中，并通过简写属性
//（`fmt,` / `lint,`）将它们接入。参见 #1836。
const fmt = { ignorePatterns: [] };
const lint = { rules: {} };

export default defineConfig(({ mode }) => {
  return {
    server: { port: 3000 },
    fmt,
    lint,
  };
});
```

## `vpt stat-file .oxlintrc.json --assert-not file`

未生成独立的 lint 配置

```
.oxlintrc.json: missing
```

## `vpt stat-file .oxfmtrc.json --assert-not file`

未生成独立的 fmt 配置

```
.oxfmtrc.json: missing
```
