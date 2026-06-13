# 创建项目

`vp create` 可以在现有的工作区中交互式地搭建新的 Vite+ 项目、单体仓库和应用。

## 概述

`create` 命令是开始使用 Vite+ 的最快方式。它可以通过以下几种方式使用：

- 启动一个新的 Vite+ 单体仓库
- 创建一个新的独立应用程序或库
- 在现有项目中添加新的应用程序或库

此命令可以使用内置模板、社区模板或远程 GitHub 模板。

## 用法

```bash
vp create
vp create <template>
vp create <template> -- <template-options>
```

## 内置模板

Vite+ 提供以下内置模板：

- `vite:monorepo` 创建一个新的单体仓库
- `vite:application` 创建一个新的应用程序
- `vite:library` 创建一个新的库
- `vite:generator` 创建一个新的代码生成器（仅限单体仓库，参见 [Code Generators](#code-generators)）

## 模板来源

`vp create` 不仅限于内置模板。

- 使用简写模板，如 `vite`、`@tanstack/start`、`svelte`、`next-app`、`nuxt`、`react-router` 和 `vue`
- 使用完整包名，如 `create-vite` 或 `create-next-app`
- 使用在 [`create.templates`](#code-generators) 中声明的本地单体仓库模板（例如内部组件或服务生成器）
- 使用远程模板，例如 `github:user/repo` 或 `https://github.com/user/template-repo`

运行 `vp create --list` 可查看 Vite+ 识别的内置模板和常用简写模板。

## 选项

- `--directory <dir>` 将生成的项目写入指定的目标目录
- `--agent <name>` 在脚手架创建过程中生成 agent 指令文件
- `--no-agent` 跳过 agent 指令设置
- `--editor <name>` 生成编辑器配置文件
- `--no-editor` 跳过编辑器配置设置
- `--git` 初始化 git 仓库
- `--no-git` 跳过 git 仓库初始化
- `--hooks` 启用 pre-commit hook 设置
- `--no-hooks` 跳过 hook 设置
- `--package-manager <name>` 使用指定的包管理器（`pnpm`、`npm`、`yarn` 或 `bun`）
- `--no-interactive` 无提示运行
- `--verbose` 显示详细的脚手架输出
- `--list` 打印可用的内置模板和热门模板

## 模板选项

`--` 后的参数会直接传递给选定的模板。

当模板本身接受标志时，这一点很重要。例如，可以像这样转发 Vite 模板选择：

```bash
vp create vite -- --template react-ts
```

## 示例

```bash
# 交互模式
vp create

# 创建 Vite+ 单体仓库、应用程序、库或生成器
vp create vite:monorepo
vp create vite:application
vp create vite:library
vp create vite:generator

# 使用简写社区模板
vp create vite
vp create @tanstack/start
vp create svelte

# 使用完整的包名
vp create create-vite
vp create create-next-app

# 使用远程模板
vp create github:user/repo
vp create https://github.com/user/template-repo
```

## 代码生成器

单体仓库通常需要搭建它们自己的构建模块：UI 组件、服务，或遵循团队约定的内部包。Vite+ 通过由 [Bingo](https://www.create.bingo/) 模板驱动的生成器包来支持这一点。

### 搭建生成器

在 Vite+ 单体仓库中运行：

```bash
vp create vite:generator
```

这需要一个单体仓库工作区。如果你还没有，请先使用 `vp create vite:monorepo` 创建一个。

脚手架生成器包包含：

- `src/template.ts` 使用 `bingo` 中的 `createTemplate` 定义模板：一个由 [Zod](https://zod.dev/) 构建的选项 schema，以及一个返回要生成文件的 `produce()` 函数
- `bin/index.ts` 是 CLI 入口，由 Bingo 的 `runTemplateCLI` 驱动

如果单体仓库中存在名为 `generators` 或 `tools` 的父目录，新包默认会放在其中。

### 注册

本地生成器在单体仓库的 `vite.config.ts` 中的 [`create.templates`](/config/create#create-templates) 里声明。这是唯一的事实来源：只有已注册的模板才会出现在 `vp create` 选择器中。

`vp create vite:generator` 会为你注册生成器，在根目录 `vite.config.ts` 的 `create.templates` 中添加一项：

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  create: {
    templates: [
      { name: 'my-generator', description: '生成新组件', template: 'my-generator' },
    ],
  },
});
```

重复运行是幂等的（不会出现重复条目），现有的 `create.defaultTemplate` 会被保留。你也可以手动添加条目，例如注册一个不是这样脚手架生成出来的模板。`template` 值可以是生成器工作区的包名，也可以是指向它的相对 `./path`。

### 运行生成器

在单体仓库中运行 `vp create` 并从模板列表中选择生成器，或者直接传入它的 `name` 条目：

```bash
# 交互模式会在内置模板旁列出已注册的本地模板
vp create

# 通过名称运行已注册模板
vp create component

# 在 -- 后向生成器传递选项
vp create component -- --name @your-org/button
```

当生成器依赖 `bingo` 时，Vite+ 会自动附加 `--skip-requests`，以跳过 Bingo 的外向网络请求（例如 GitHub API 调用）。

生成器运行后，创建的包会经过常规的单体仓库集成流程：工作区注册、依赖安装和格式化。

### 自定义生成器

编辑 `src/template.ts` 以定义选项和要生成的文件：

```ts
import { createTemplate } from 'bingo';
import { z } from 'zod';

export default createTemplate({
  options: {
    name: z.string().describe('包名'),
  },
  async produce({ options }) {
    return {
      files: {
        'package.json': JSON.stringify({ name: options.name, version: '0.0.0' }, null, 2),
        src: {
          'index.ts': `export const name = '${options.name}';\n`,
        },
      },
    };
  },
});
```

- `options` 使用 Zod schema 定义生成器的提示和标志
- `produce()` 返回要创建的 [files](https://www.create.bingo/build/concepts/creations#files)，以及可选的生成后要运行的 [scripts](https://www.create.bingo/build/concepts/creations#scripts) 和要向用户打印的 [suggestions](https://www.create.bingo/build/concepts/creations#suggestions)

完整模板 API 请参见 [Bingo 文档](https://www.create.bingo/)。

## 组织模板

组织可以通过发布一个 `@org/create` 包，在单个 npm scope 下提供一组精选模板；该包的 `package.json` 中包含 `createConfig.templates` 清单。发布后，`vp create @org` 会打开一个交互式选择器，让你从这些模板中挑选。

### 从组织中选择

```bash
# 打开一个针对 @your-org/create 清单的交互式选择器
vp create @your-org

# 直接运行某个清单条目
vp create @your-org:web

# 锁定到确切版本或 dist-tag
vp create @your-org@1.2.3
vp create @your-org:web@next

# 将该组织设为仓库默认值（见 create.defaultTemplate 配置）
vp create
```

在内部，`vp create @org` 会映射到 `@org/create`（现有的 npm `create-*` 约定）。如果该包没有 `createConfig.templates` 字段，Vite+ 会回退为按常规方式运行该包——因此对于已经发布 `@org/create` 的组织来说，采用清单机制是零风险的。

私有注册表可自动工作：Vite+ 会读取项目根目录和 `~/` 下的 `.npmrc` 文件，遵循 `@your-org:registry=...` 的 scope 映射以及 `//host/:_authToken=...` 凭据。

### 编写 `@org/create`

常见有两种布局。请选择最符合该组织模板数量和发布节奏的一种。

**打包式（推荐大多数组织使用）。** 所有模板都作为 `@org/create` 本身的子目录存在。清单条目使用相对 `./path` 值。一个仓库、一次发布、一套版本管理方式——这与 `create-vite` 和 `create-next-app` 使用的是同一种模式。

```
@your-org/create/
├── package.json              # "createConfig": { "templates": [{ "template": "./templates/web" }, ...] }
├── templates/
│   ├── web/
│   │   ├── package.json
│   │   └── src/...
│   └── library/...
└── README.md
```

**仅清单。** 当该组织已经发布了独立的 `@org/template-*` 包（或托管在 GitHub 上）时，`@org/create` 就保持为一个轻量索引。

```
@your-org/create/
├── package.json              # "createConfig": { "templates": [{ "template": "@your-org/template-web" }, ...] }
└── README.md
```

这两种布局可以混用——清单可以把大多数条目指向外部包，同时保留少数作为打包在内的子目录。

可选地，你也可以提供一个 `bin` 脚本，这样 `npm create @org`（旧路径）对非 Vite+ 用户仍然可用。`vp create @org` 会直接读取清单，而不会运行 `bin`。

### 清单 schema

清单位于 `@org/create` 的 `package.json` 中的 `createConfig.templates`：

```json
{
  "name": "@your-org/create",
  "version": "1.0.0",
  "createConfig": {
    "templates": [
      {
        "name": "monorepo",
        "description": "单体仓库",
        "template": "@your-org/template-monorepo",
        "monorepo": true
      },
      {
        "name": "web",
        "description": "Web 应用模板（Vite + React）",
        "template": "@your-org/template-web"
      },
      {
        "name": "demo",
        "description": "内置演示模板",
        "template": "./templates/demo"
      }
    ]
  }
}
```

每个条目都支持：

| 字段          | 必需 | 说明                                                                                                                                                                                                                                      |
| ------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | 是   | kebab-case 标识符。由 `vp create @org:<name>` 用于直接选择。数组内必须唯一。                                                                                                                              |
| `description` | 是   | 在选择器中显示的一行描述。                                                                                                                                                                                                  |
| `template`    | 是   | 一个 npm 指定符（`@org/template-foo`，可选 `@version`）、一个 GitHub URL（`github:user/repo`）、一个 `vite:*` 内置项、一个本地工作区包名，或一个相对于 `@org/create` 根目录解析的相对路径（`./templates/foo`）。 |
| `monorepo`    | 否   | 若为 `true`，表示此条目是一个创建单体仓库的模板。在现有单体仓库中运行 `vp create` 时会从选择器中隐藏，行为与内置的 `vite:monorepo` 过滤器一致。                                                      |

无效的清单会直接报错，而不会静默回退——已发布清单的维护者应该能看到出错的字段，例如：`@your-org/create: createConfig.templates[2].template must be a non-empty string`。

### 打包式子目录模板

相对 `./...` 路径会相对于外层 `@org/create` 包根目录解析——**不是**用户的 cwd。引用的目录会按原样复制到目标项目中（不进行模板引擎处理）；唯一的例外是少量以下划线开头的脚手架文件（`_gitignore`、`_npmrc`、`_yarnrc.yml`）会重命名为对应的点文件。超出包根目录的路径会被拒绝。

### 将该组织设为仓库默认值

将以下内容提交到项目根目录的 `vite.config.ts` 中：

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  create: { defaultTemplate: '@your-org' },
});
```

现在，`vp create`（不带参数）会直接进入 `@your-org` 选择器。详情请参见 [`create.defaultTemplate`](/config/create)。

选择器始终会在末尾附加一个 **Vite+ 内置模板** 条目，因此 `vite:monorepo` / `vite:application` / `vite:library` / `vite:generator` 仍然可以从选择器中访问——选中它会进入标准的内置流程。对于脚本和 CI，显式指定符（`vp create vite:library`）会绕过已配置的默认值。

### 非交互式检查

`vp create @org --no-interactive` 会打印清单表并以 1 退出：

```
运行 `vp create @your-org` 的非交互模式时，需要提供模板名称。

@your-org/create 中可用的模板：

  NAME     DESCRIPTION                          TEMPLATE
  web      Web 应用模板（Vite + React）           @your-org/template-web
  library  TypeScript 库模板                      @your-org/template-library
  demo     内置演示模板                          ./templates/demo

示例：
  # 从该组织中搭建一个指定模板
  vp create @your-org:web --no-interactive

  # 或使用 Vite+ 内置模板
  vp create vite:application --no-interactive
```

### 发布清单

1. 如果还没有，就创建 `@org/create`（带 scope 的 npm 包）。
2. 在 `package.json` 中添加一个 `createConfig.templates` 数组。（将模板打包到 `./templates/...` 下，或指向外部包。）
3. （可选）提供一个 `bin` 启动器，以兼容 `npm create @org`。
4. 发布。
5. 验证：`vp create @org --no-interactive` 会打印清单表；`vp create @org` 会打开选择器。
6. （可选）在你的内部模板仓库中提交 `create: { defaultTemplate: '@org' }`。
