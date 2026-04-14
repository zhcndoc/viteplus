# Pack

`vp pack` 使用 [tsdown](https://tsdown.dev/guide/) 构建生产环境库。

## 概述

`vp pack` 使用 tsdown 构建库和独立可执行文件。适用于可发布的包和二进制输出。如果你想构建一个网页应用，请使用 `vp build`。`vp pack` 开箱即用地涵盖了构建库所需的一切功能，包括声明文件生成、多种输出格式、源码映射和压缩。

如需了解 tsdown 的工作原理，请参阅官方 [tsdown 指南](https://tsdown.dev/guide/)。

## 用法

```bash
vp pack
vp pack src/index.ts --dts
vp pack --watch
```

## 配置

将打包配置直接放在 `vite.config.ts` 中的 `pack` 块内，这样所有配置都集中在一个地方。我们不推荐在 Vite+ 中使用 `tsdown.config.ts`。

请参考 [tsdown 指南](https://tsdown.dev/guide/) 和 [tsdown 配置文件文档](https://tsdown.dev/options/config-file) 了解如何配置和使用 `vp pack`。

适用于：

- [声明文件 (`dts`)](https://tsdown.dev/options/dts)
- [输出格式](https://tsdown.dev/options/output-format)
- [监听模式](https://tsdown.dev/options/watch-mode)
- [独立可执行文件](https://tsdown.dev/options/exe#executable)

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

## 独立可执行文件

`vp pack` 还可以通过 tsdown 的实验性 [`exe` 选项](https://tsdown.dev/options/exe#executable) 构建独立可执行文件。

当你希望将 CLI 或其他基于 Node 的工具作为无需单独安装 Node.js 的原生可执行文件分发时，请使用此功能。

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    entry: ['src/cli.ts'],
    exe: true,
  },
});
```

有关配置自定义文件名、嵌入式资产和跨平台目标的详细信息，请参阅官方 [tsdown 可执行文件文档](https://tsdown.dev/options/exe#executable)。
