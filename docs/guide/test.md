# 测试

`vp test` 使用 [Vitest](https://vitest.dev) 运行测试。

## 概述

`vp test` 基于 [Vitest](https://vitest.dev/) 构建，因此你获得了一个 Vite 原生的测试运行器，可以复用你的 Vite 配置和插件，支持 Jest 风格的断言、快照和覆盖率，并且能干净地处理现代 ESM、TypeScript 和 JSX 项目。

::: info
`vp test` 始终运行内置的 Vitest 命令。如果你的项目在 `package.json` 中也有一个 `test` 脚本，而你想运行该脚本，请运行 `vp run test`。请参阅[内置命令与脚本](/guide/run#built-in-commands-vs-scripts)。
:::

## 用法

```bash
vp test
vp test watch
vp test run --coverage
```

::: info
与单独使用 Vitest 不同，`vp test` 默认不会保持在监视模式。当你想要进行一次正常的测试运行时，使用 `vp test`；想要进入监视模式时，使用 `vp test watch`。
:::

## 配置

将测试配置直接放在 `vite.config.ts` 中的 `test` 块内，这样所有配置都集中在一处。我们不建议在 Vite+ 中使用 `vitest.config.ts`。

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
```

如需完整的 Vitest 配置参考，请参阅 [Vitest 配置文档](https://vitest.dev/config/)。
