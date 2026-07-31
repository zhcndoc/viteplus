# 迁移保留现有格式化和代码检查

## `vp migrate --no-interactive`

不应重复 vite.config.ts 中已有的 fmt/lint 代码块（vp create fate 的回归问题）

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file vite.config.ts`

恰好一个 fmt: 和一个 lint: 块，保留模板值

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    "*": "vp check --fix"
  },
  fmt: {
    experimentalSortImports: {
      newlinesBetween: false,
    },
    experimentalSortPackageJson: {
      sortScripts: true,
    },
    experimentalTailwindcss: {
      stylesheet: 'client/src/App.css',
    },
    ignorePatterns: [
      'coverage/',
      'dist/',
      '.fate/',
      'client/dist/',
      'client/src/translations/',
      'server/dist/',
      'pnpm-lock.yaml',
    ],
    singleQuote: true,
  },
  lint: {
    extends: ['@nkzw/oxlint-config'],
    ignorePatterns: [
      'coverage',
      'dist',
      '.fate',
      'client/dist',
      'server/dist',
      'server/src/drizzle/migrations/**',
    ],
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        files: ['server/src/index.tsx', 'server/src/drizzle/seed.tsx', '**/__tests__/**'],
        rules: {
          'no-console': 'off',
        },
      },
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
});
```

## `vpt stat-file .oxfmtrc.jsonc --assert-not file`

多余的独立文件已移除

```
.oxfmtrc.jsonc: missing
```

## `vpt stat-file .oxlintrc.json --assert-not file`

已移除冗余的独立文件

```
.oxlintrc.json: missing
```
