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

`vp create` 作为第一个参数接受的任何值都可以在这里使用：`@your-org` 用于组织选择器，`@your-org:web` 用于直接的清单条目，`vite:application` 用于内置模板，或者本地 `create.templates` 条目的 `name`（见下文）。

## `create.templates`

在 monorepo 中声明 `vp create` 可用的本地模板。每个条目都会显示在 `vp create` 选择器中，选择它（或将其 `name` 作为模板参数传入）会运行解析后的 `template`。

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  create: {
    templates: [
      {
        name: 'component',
        description: '内部 UI 组件',
        template: './tools/create-component',
      },
      { name: 'service', description: '后端服务', template: 'service-generator' },
    ],
  },
});
```

每个条目都有：

| 字段          | 必需 | 说明                                                                                                                                                                                                                                            |
| ------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | 是   | 在选择器中显示并可作为 `vp create <name>` 接受的标识符。在数组中必须唯一。`vite:` 前缀保留给内置模板。                                                                                                                                        |
| `description` | 是   | 在选择器中显示的一行描述。                                                                                                                                                                                                                      |
| `template`    | 是   | 工作区包名、本地包目录的相对 `./path`（相对于工作区根目录解析）、`vite:*` 内置模板、GitHub URL，或完整的 npm 包名（例如 `create-foo`）。它会按原样运行（不会展开为简写）。 |

`create.templates` 是本地模板的事实来源：只有这里列出的条目才会出现在选择器中。Vite+ 不会从 package.json 的关键词推断模板。若 `create.templates` 中某个条目的 `template` 不匹配任何工作区包，或者解析到一个没有 `bin` 的本地包，则会报错，而不是回退到无关的 npm 包。

[`vp create vite:generator`](/guide/create#code-generators) 会自动（幂等地，并保留 `defaultTemplate`）在此处添加一个条目；你也可以手动编辑该列表。

`create.defaultTemplate` 可以指定本地条目的名称，因此直接运行 `vp create` 会直接打开它。

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
