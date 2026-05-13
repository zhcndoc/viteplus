# Monorepo

Vite+ 支持在根目录使用 `vite.config.ts` 的 monorepo。你可以在根目录定义 `lint`、`fmt` 等的默认值，并使用 `overrides` 来应用针对特定包的 lint 和格式化设置。

由于 `vite.config.ts` 本质上就是 JavaScript，你可以选择把整个配置都放在这个文件中，或者使用常规的 JavaScript 导入来组合配置。你仍然可以在每个包中保留独立的 `vite.config.ts` 文件，用于 Vite、Vitest、框架或运行时配置。

## Root Config With Overrides

使用 `lint.overrides` 来配置仅适用于某些包的 Oxlint 规则：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    plugins: ['typescript'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
    overrides: [
      {
        files: ['apps/web/**', 'packages/ui/**'],
        plugins: ['typescript', 'react'],
        rules: {
          'react/self-closing-comp': 'error',
        },
      },
      {
        files: ['apps/api/**'],
        env: {
          node: true,
        },
        rules: {
          'no-console': 'off',
        },
      },
      {
        files: ['**/*.test.ts', '**/*.spec.ts'],
        plugins: ['typescript', 'vitest'],
        rules: {
          '@typescript-eslint/no-explicit-any': 'off',
          'vitest/no-disabled-tests': 'error',
        },
      },
    ],
  },
});
```

glob 会从根目录的 `vite.config.ts` 进行解析，因此请使用工作区路径，例如 `apps/web/**`、`apps/api/**` 和 `packages/ui/**`。

::: tip
当 `lint.overrides` 中的某一项设置了 `plugins` 时，该列表会替换匹配文件的基础 `lint.plugins` 列表。请包含该文件组所需的所有插件，例如 `['typescript', 'react']`。只有在覆盖项应当原样继承基础列表时，才省略 `plugins`。
:::

## Format Overrides

对文件或包特定的 Oxfmt 选项使用 `fmt.overrides`。格式化器的覆盖设置会放在 `options` 下：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    singleQuote: true,
    semi: true,
    overrides: [
      {
        files: ['apps/api/**'],
        options: {
          printWidth: 120,
        },
      },
      {
        files: ['**/*.md'],
        options: {
          proseWrap: 'always',
        },
      },
    ],
  },
});
```

## Composing Configuration Files

你可以在仓库中拆分配置，并使用 JavaScript 导入来组合它们。从附近的文件或包中导出 JavaScript 对象，在根配置中导入它们，并将它们合并到对应的覆盖项中。

```ts [tooling/lint/react.ts]
import type { OxlintOverride } from 'vite-plus/lint';

export const reactLint = {
  plugins: ['typescript', 'react'],
  rules: {
    'react/self-closing-comp': 'error',
  },
} satisfies Omit<OxlintOverride, 'files'>;
```

```ts [tooling/lint/node.ts]
import type { OxlintOverride } from 'vite-plus/lint';

export const nodeLint = {
  env: {
    node: true,
  },
  rules: {
    'no-console': 'off',
  },
} satisfies Omit<OxlintOverride, 'files'>;
```

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

import { nodeLint } from './tooling/lint/node';
import { reactLint } from './tooling/lint/react';

export default defineConfig({
  lint: {
    plugins: ['typescript'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    overrides: [
      {
        files: ['apps/web/**', 'packages/ui/**'],
        ...reactLint,
      },
      {
        files: ['apps/api/**'],
        ...nodeLint,
      },
    ],
  },
});
```

这样可以将行为集中管理，同时让每个团队或包拥有其所需的配置部分。

## App Commands

根目录的 `vite.config.ts` 最适合用于共享的 lint、格式化、阶段性检查和任务定义。对于项目特定的开发、构建和测试行为，请使用最符合每个应用的方案：

- 当你想针对某个应用时，将文件夹传递给内置的 Vite 命令：

```bash
vp dev apps/web
vp build apps/web
```

- 当不同应用的命令不同，把包特定的脚本保留在各自的包中：

```json [apps/api/package.json]
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json"
  }
}
```

- 使用 `vp run` 在整个工作区中运行脚本：

```bash
vp run -r build
vp run -r --parallel dev
vp run --filter ./apps/web build
```

关于递归、并行、过滤以及缓存的工作区任务，请参见 [Run guide](/guide/run)。
