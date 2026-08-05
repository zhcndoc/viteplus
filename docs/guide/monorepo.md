# 多仓库

Vite+ 支持在根目录使用 `vite.config.ts` 的多仓库。你可以在根目录定义 `lint`、`fmt` 等的默认值，并使用 `overrides` 来应用针对特定包的 lint 和格式化设置。

由于 `vite.config.ts` 本质上就是 JavaScript，你可以选择把整个配置都放在这个文件中，或者使用常规的 JavaScript 导入来组合配置。你仍然可以在每个包中保留独立的 `vite.config.ts` 文件，用于 Vite、Vitest、框架或运行时配置。

## 带覆盖配置的根配置

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

## 格式覆盖

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

## 组合配置文件

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

## 应用命令

根目录下的 `vite.config.ts` 对共享 lint、格式化、暂存检查和任务定义最有价值。开发、构建、预览和打包仍然针对单个应用执行，因此 Vite+ 让内置命令具备 monorepo 感知能力，而不再强制你在各个包之间使用 `cd` 切换。

### 在工作区根目录运行

`vp dev`、`vp build`、`vp preview` 和 `vp pack` 永远不会静默地作用于工作区根目录，因为那里通常没有独立的应用。在 monorepo 顶层运行这些命令时，Vite+ 会判断你要操作的是哪个应用。

当恰好只有一个包看起来像应用时，vp 会运行它，并显示下次可直接使用的命令：

```
$ vp dev
Selected package: web (apps/web)
Tip: run this directly with `vp -C apps/web dev`

  VITE+ v0.2.2

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

当多个包都可能是目标时，vp 会打开模糊包选择器（与 `vp run` 使用相同的选择器）；输入内容可进行过滤，按 Enter 运行所选包：

```
$ vp build
Select a package to build (↑/↓, Enter to run, type to search):

  › admin apps/admin
    web   apps/web
    ui    packages/ui
```

```
Selected package: web (apps/web)
Tip: run this directly with `vp -C apps/web build`

  ✓ built in 187ms
```

在非交互式 shell 中（CI、管道、重定向），vp 会将相同的包以普通列表形式输出，并附带可直接复制的命令，然后以状态码 1 退出：

```
$ vp build | cat
error: `vp build` at the workspace root needs a target package.

  Packages in this workspace:
    admin     apps/admin
    web       apps/web
    @shop/ui  packages/ui

  Pass a directory:  vp -C apps/admin build
  Or run every package's build script:  vp run -r build
```

无论是在选择器中还是在列表中，vp 都会优先排列对于当前命令看起来可运行的包：对于 `dev` / `build` / `preview`，包需要包含 `vite.config.*` 或根目录下的 `index.html`；对于 `pack`，包需要包含 `pack` 配置块或 tsdown 默认的 `src/index.ts` 入口。

### 使用 `-C` 指定包

全局 `-C` 标志会像先进入包目录一样运行任意 vp 命令，其效果与 `cd <dir> && vp <command>` 完全相同：

```bash
vp -C apps/web dev
vp -C apps/web build
vp -C packages/ui pack
```

将文件夹作为位置参数传入（`vp dev apps/web`）仍然有效，但会保留上游 Vite 的语义：它会设置 Vite 的 `root` 选项，而不会改变工作目录，因此配置和插件中的 `process.cwd()` 读取结果仍然是你运行 vp 时所在的目录。需要让包表现得如同你已经使用 `cd` 进入其中时，优先使用 `-C`。使用目录位置参数时，vp 会输出一行提示，指向 `-C` 形式。

### 使用 `defaultPackage` 设置固定默认值

要始终以某个目录为目标并跳过上述解析过程，请在根配置中设置 [`defaultPackage`](/config/#defaultpackage)：

```ts [vite.config.ts]
export default {
  defaultPackage: './apps/web',
};
```

```
$ vp dev
note: vp dev: using ./apps/web (defaultPackage in vite.config.ts)

  VITE+ v0.2.2

  ➜  Local:   http://localhost:5173/
```

对于不是 JavaScript 工作区的框架 monorepo，这是正确的选择，例如包含 `frontend/` 目录的 Laravel 或 Rails 应用：由于没有包列表可供解析，`defaultPackage` 会将 vp 直接指向应用。由于 vp 无需执行配置即可读取该设置，即使 `vite-plus` 仅安装在该子目录中，也能正常工作。

对象形式可以分别映射各个命令，因此 `vp pack` 可以将目标设为一个库，而 `vp dev` 将目标设为一个应用；对象中未出现的命令会继续执行上述解析：

```ts [vite.config.ts]
export default {
  defaultPackage: { dev: './apps/web', pack: './packages/ui' },
};
```

### 包脚本和工作区范围的任务

当每个应用的命令不同时，请将包专属脚本保留在各自的包中：

```json [apps/api/package.json]
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json"
  }
}
```

使用 `vp run` 在整个工作区中运行脚本：

```bash
vp run -r build
vp run -r --parallel dev
vp run --filter ./apps/web build
```

关于递归、并行、过滤以及缓存的工作区任务，请参见 [运行指南](/guide/run)。
