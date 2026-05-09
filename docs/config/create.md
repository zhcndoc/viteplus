# 创建配置

`vp create` 会读取 `vite.config.ts` 中的 `create` 配置块，以设置每个仓库的默认值。有关完整的 `@org` 模板工作流，请参阅[创建项目指南](/guide/create#organization-templates)。

## `create.defaultTemplate`

当 `vp create` 在没有 `TEMPLATE` 参数的情况下被调用时，Vite+ 会将此值视为用户输入了它。通常将其设置为某个 npm scope，使其 `@scope/create` 包发布一个 `createConfig.templates` 清单——这样，直接执行 `vp create` 就会进入组织选择器。

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  create: {
    defaultTemplate: '@your-org',
  },
});
```

这里可以使用 `vp create` 作为第一个参数所接受的任何值——`@your-org` 表示组织选择器，`@your-org:web` 表示直接的清单条目，`vite:application` 表示内置项，等等。

## 优先级

CLI 参数 > `create.defaultTemplate` > 标准内置选择器。

显式指定的标识符始终优先，因此脚本和 CI 可以绕过已配置的默认值：

```bash
# 使用 create.defaultTemplate
vp create

# 显式忽略默认值
vp create vite:library
```

组织选择器还会在末尾追加一个“Vite+ 内置模板”条目——选择它会进入 `vite:monorepo` / `vite:application` / `vite:library` / `vite:generator` 流程，因此即使配置了默认值，内置模板在交互式操作中也仍然可达。
