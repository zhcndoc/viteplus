# RFC：`vp create` 的组织默认模板

> 状态：在分支 `vp-create-support-org` 上已 **实现**（PR #1398）。
> 下文各节描述的是已随实现一并交付的设计；末尾的 “Resolved
> Decisions” 列表反映了实现过程中最终落地的每一项决定，
> 包括在评审中出现的那些（`.npmrc`
> registry/auth、`__vp_` 保留前缀、已净化的缓存 host 段，
> 以及其他）。底部附近的 “Implementation State” 章节
> 指向具体文件。

## 摘要

让组织通过 `vp create @org` 为其精选项目模板集提供一个单一、带品牌标识的入口。当 `@org/create` 在其 `package.json` 中发布 `createConfig.templates` 清单时，Vite+ 会在所列模板之上渲染一个交互式选择器；如果没有发布，则命令会把 `@org/create` 作为普通模板执行（保持当前行为不变）。`vite.config.ts` 中的 `create.defaultTemplate` 选项允许某个仓库将组织的选择器提升为裸 `vp create` 的默认入口。

## 背景

组织通常会维护一组内部项目模板（Web 应用、移动应用、服务端、库等），并且需要一种一等公民式的方式把它们暴露为一个单一、带品牌的入口 —— 这样工程师就可以从一个交互式列表中选择 “web / mobile / server / library” 之类的选项，而不必记住每个模板各自的包名。

参考：

- [RFC：Vite+ 代码生成器](./code-generator.md) —— 作为上游 RFC，它将 `vp create` 定义为一个双模式（bingo + 通用 `create-*`）工具。本 RFC 是建立在现有通用 `create-*` 模式之上的面向消费者的扩展。
- [npm `create-*` 约定](https://docs.npmjs.com/cli/v10/commands/npm-init)
  —— 生态系统中的约定，`vp create` 通过 `expandCreateShorthand` 已经遵循它（`packages/cli/src/create/discovery.ts:148-216`）。

## 动机

### 问题所在

拥有一系列内部模板（Web 应用、库、服务脚手架、CLI 工具）的公司，没有一种简洁的方式把这些模板作为一个单一产品界面提供给工程师。如今，如果要从组织的四个模板里选一个，工程师必须：

1. 知道自己想要的模板的准确包名。
2. 输入完整命令：`vp create @your-org/create-web`、`vp create @your-org/create-mobile` 等。
3. 在 README、wiki 或 Slack 中查找这些名称。

这虽然能用，但并不容易被发现，而且迫使组织把包名文档放在一种很快就会过时的媒介里。框架领域（Vite、Next、Nuxt）的行业惯例之所以是“一个框架一个命令”，正是因为一个容易记住的入口比一长串名称更高效。

### 工程师应该能够输入的内容

```bash
# 交互式地从 @your-org 组织中选择一个模板
vp create @your-org

# 直接选择某个清单条目
vp create @your-org:web

# 在设置了 @your-org 作为默认值的仓库内：
vp create
```

目标是把“公司的脚手架工具链”写成 `@org`，而不是一份十二行的 README。

### 为什么不直接写更好的 README？

README 可以列出模板，但：

- 它们不能驱动交互式选择器。
- 它们比代码更容易腐坏。
- 它们不能作为每个仓库克隆都能继承的项目级默认值。

把清单放进 `@org/create` 自己的 `package.json` 里，可以让组织拥有一个单一事实来源，并且能通过 `npm view` 发现，同时和包一起版本化。

## 现有行为（已经可用的部分）

这个 RFC 是增量式的。该功能中相当一部分其实已经上线。

`packages/cli/src/create/discovery.ts:148-216` 定义了
`expandCreateShorthand`，它会映射：

- `@org` → `@org/create`
- `@org/name` → `@org/create-name`
- `name` → `create-name`（对 `nitro`、`svelte`、
  `@tanstack/start` 有特殊处理）

因此下面这些今天已经可以工作：

```bash
# 已经可用：运行 @your-org/create
vp create @your-org

# 已经可用：运行 @your-org/create-web
vp create @your-org/web
```

目前还不存在的部分是 **发现并在同一组织拥有的多个模板之间进行选择**。这正是本 RFC 所规定的内容。

## 拟议方案

### 高层流程

1. 用户运行 `vp create @org`。
2. `expandCreateShorthand` 将其映射为 `@org/create`（保持不变）。
3. 在分发给模板运行器之前，`vp create` 会从 npm registry 读取 `@org/create` 的 `package.json`。
4. 如果 `package.json` 包含 `createConfig.templates` 字段，Vite+ 会在这些条目之上渲染一个交互式选择器。
5. 用户选择之后（或者直接传入 `@org:<name>` —— 冒号分隔符沿用了现有的 `vite:monorepo` / `vite:library` 内置语法，并且让清单条目在语法上与真实的 `@org/package` npm specifier 保持区分），Vite+ 会通过现有的 `discoverTemplate` 流水线解析所选条目的 `template` 字段 —— 该流水线支持 npm、GitHub、内置 `vite:*`，以及本地工作区包。
6. 如果 `createConfig.templates` **缺失**，Vite+ 会退回到今天的行为，把 `@org/create` 作为普通模板执行。这让尚未选择启用该功能的组织所有者几乎零风险。

### 命令矩阵

| 命令                          | 清单存在？ | 行为                                                                       |
| ----------------------------- | ---------- | -------------------------------------------------------------------------- |
| `vp create @org`              | 是         | 获取清单 → 选择器 → 运行所选模板                                           |
| `vp create @org`              | 否         | 按当前方式运行 `@org/create`（不变）                                       |
| `vp create @org:name`         | 是，且有 `name` | 运行清单条目 `name`                                                   |
| `vp create @org:name`         | 是，但没有 `name` | 硬错误，列出可用的清单条目名称                                        |
| `vp create @org:name`         | 否         | 同样是硬错误 —— `:` 形式是显式的清单查找，不会静默回退                  |
| `vp create @org/name`         | 不适用     | 与功能前一致：现有的 `@org/create-name` 简写                               |
| `vp create`（在已配置仓库中） | 是         | 与 `vp create @org` 相同，其中 `@org` 是配置好的默认值                    |
| `vp create <anything-else>`   | 不适用     | 不变                                                                        |

## 清单模式

清单位于 `@org/create` 的 `package.json` 中的 `createConfig.templates`。

```json
{
  "name": "@your-org/create",
  "version": "1.0.0",
  "description": "来自 @your-org 组织的项目模板",
  "createConfig": {
    "templates": [
      {
        "name": "monorepo",
        "description": "Monorepo 脚手架",
        "template": "@your-org/template-monorepo",
        "monorepo": true
      },
      {
        "name": "web",
        "description": "Web 应用模板（Vite + React）",
        "template": "@your-org/template-web"
      },
      {
        "name": "mobile",
        "description": "移动应用（React Native）模板",
        "template": "@your-org/template-mobile"
      },
      {
        "name": "server",
        "description": "服务端模板（Node + Fastify）",
        "template": "github:your-org/template-server"
      },
      {
        "name": "library",
        "description": "TypeScript 库模板",
        "template": "@your-org/template-library"
      },
      {
        "name": "demo",
        "description": "打包在内的 demo 模板（位于 @your-org/create 内部）",
        "template": "./templates/demo"
      }
    ]
  }
}
```

### 字段参考

| 字段                                  | 类型              | 必需 | 说明                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------- | ----------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createConfig.templates`              | `TemplateEntry[]` | 是   | 非空数组。空数组会被视为“没有清单”（回退为执行 `@org/create`）。                                                                                                                                                                                                                                                                                                                   |
| `createConfig.templates[].name`       | `string`          | 是   | kebab-case。用于 `vp create @org:<name>` 的直接选择。在数组内必须唯一。以 `__vp_` 开头的名称保留给内部哨兵值，并会在模式校验时被拒绝。                                                                                                                                                                                                                                              |
| `createConfig.templates[].description`| `string`          | 是   | 在选择器中显示的一行描述。                                                                                                                                                                                                                                                                                                                                                            |
| `createConfig.templates[].template`   | `string`          | 是   | 以下之一：(a) npm 包 specifier（`@your-org/template-web`，可选 `@version`），(b) GitHub URL（`github:user/repo`，`https://github.com/...`），(c) `vite:*` 内置项，(d) 本地工作区包名，或 (e) 相对路径（`./templates/demo`、`../foo`），它会相对于包根目录中的 `@org/create` 进行解析。见下文“捆绑的子目录模板”。 |
| `createConfig.templates[].monorepo`   | `boolean`         | 否   | 若为 `true`，表示该条目是一个 _创建 monorepo 的_ 模板。在 `vp create` 在现有 monorepo 内部调用时，会从选择器中隐藏它。它与 `getInitialTemplateOptions` 中过滤掉 `vite:monorepo` 的内置行为一致（`packages/cli/src/create/initial-template-options.ts:9-31`）。默认值为 `false`。                                               |

### 无效清单

如果 `createConfig.templates` 字段存在但无效，不应静默回退到简写形式。它应该产生一个带有出错字段路径的模式错误（例如 `@your-org/create: createConfig.templates[2].template is required`），因为维护者显然是打算提供一个清单的，也应该被明确告知哪里有问题。

### 在 `vp` 下命名空间化

使用 `vp` 对象 —— 而不是顶层的 `vpTemplates` —— 可以为未来的 Vite+ 包元数据保留空间，而不会污染 `package.json` 根部。像 `engines`、`bin` 和 `files` 这样的约定已经存在于顶层槽位中；工具专用元数据通常是嵌套的（例如 `jest`、`eslint`、`prettier`）。

### 捆绑的子目录模板

一个非常常见的真实世界模式 —— 被 `create-vite`、`create-next-app` 以及许多企业脚手架套件使用 —— 是单个包包含其 _全部_ 模板，并把它们放在子目录中。对于这种模式，清单条目可以把相对路径作为 `template` 值：

```json
{
  "name": "demo",
  "description": "打包在内的 demo 模板",
  "template": "./templates/demo"
}
```

语义如下：

- 以 `./` 或 `../` 开头的路径，会相对于包根目录（即包含已发布 `package.json` 的目录 —— **不是** 用户当前工作目录）进行解析。
- 该路径必须保持在包内部。通过 `../../..` 之类逃逸到已解压 tarball 之外的路径会在模式校验阶段被拒绝。
- 引用的目录会原样生成脚手架：文件内容会被复制到目标目录，不经过任何模板引擎处理。（变量替换、Bingo 风格变换等，仍属于 `@org/template-*` 或 `bingo-template` 分支的职责。）
- 模板子目录中的 `package.json` 等文件会按原样使用。组织维护者可以在脚手架生成时，通过现有的 `vp create` 后处理（名称提示、包管理器检测等）预先重写包名，与今天的内置行为保持一致。

**为什么打包路径对采用率很重要**：如果没有这个能力，只有三四个模板的组织就必须发布三四个包，维护各自独立的发布节奏，并记录映射关系。有了打包路径，一个 `@org/create` 包 —— 包含清单和模板本身 —— 就是它们需要交付的全部磁盘表面。

**tarball 拉取与解压**：当 `vp create` 解析一个打包路径时，它会从已经为清单拉取到的 registry JSON 中获取 tarball URL（`dist.tarball`），通过 HTTPS 直接下载它（遵守 `.npmrc` 的作用域 registry 以及 `NPM_CONFIG_REGISTRY`），并将其解压到
`$VP_HOME/tmp/create-org/<host>/<scope>/create/<version>/` 下的按版本缓存中。前导的
`<host>` 段（会被清洗掉 Windows 不允许的字符）确保两个通过不同 registry 解析出相同 `<scope>@<version>` 的仓库不会共享同一个缓存槽位。后续对同一 host 的调用会复用已缓存的解压结果。一个轻量级 tar 读取器实现（不依赖外部安装步骤，也不会启动 `npm pack`）让解析保持快速，并且独立于用户的包管理器。

## 解析流程（实现形状）

挂钩点：`discoverTemplate` 内部（`packages/cli/src/create/discovery.ts:44-128`），紧接在第 119 行最终的 `expandCreateShorthand` 分支之前。

伪代码：

```ts
// 在内置 / GitHub / 本地检查之后，在 expandCreateShorthand 之前。
if (templateName.startsWith('@')) {
  const { scope, name } = parseScoped(templateName);
  const manifest = await readOrgManifest(scope); // 获取 @scope/create package.json

  if (manifest) {
    const entry =
      name === undefined
        ? await pickTemplate(manifest.templates, { interactive })
        : manifest.templates.find((t) => t.name === name);

    if (entry) {
      // 打包的子目录：相对于解压后的 tarball 进行解析。
      if (entry.template.startsWith('./') || entry.template.startsWith('../')) {
        const extractedRoot = await ensureOrgPackageExtracted(
          manifest.packageName,
          manifest.version,
          manifest.tarballUrl,
        );
        const absPath = resolveBundledPath(extractedRoot, entry.template);
        return { command: 'copy-dir', args: [absPath, ...templateArgs], type: TemplateType.local, /* ... */ };
      }

      // 其余所有情况：通过现有的 discoverTemplate 递归处理。
      return discoverTemplate(entry.template, templateArgs, workspaceInfo, interactive);
    }
    // 没有匹配条目的 `vp create @org:name` → 直接报错（不回退）。
  }
}

// 现有的 expandCreateShorthand 路径。
const expandedName = expandCreateShorthand(templateName);
...
```

`readOrgManifest` 位于 `packages/cli/src/create/org-manifest.ts`。它会：

- 从该 scope 的注册表获取 packument（通过 `packages/cli/src/utils/npm-config.ts` 中的 `getNpmRegistry(scope)` 解析），该解析会按 `~/.npmrc` → 项目 `.npmrc` → `npm_config_*` 环境变量分层，并遵守 `@scope:registry=...` 覆盖。
- 首次请求使用匿名方式；仅当服务器返回 401/403 时，才会使用 `.npmrc` 中匹配的 `_authToken` / `_auth` / `username:_password` 重试，因此公共 registry 永远看不到 token。
- 解析 manifest 版本：当 `parseOrgScopedSpec` 提取到了版本（`@scope@1.2.3`、`@scope:web@next`）时，优先在 `dist-tags[...]` 中查找，然后直接查找 `versions[...]`；否则使用 `dist-tags.latest`。未知版本会直接报错。
- 在 404 时返回 `null`（包不存在 → 仅 scope 输入会回退到现有的 shorthand 路径；`@org:name` 则是硬错误）。
- 对非 404 的 HTTP 错误以及 schema 违规 **抛出异常**。
- 在返回的 manifest 上携带 `tarballUrl` 和 `integrity`，这样打包路径条目就可以在不进行第二次 registry 往返的情况下解压。

`ensureOrgPackageExtracted`（`packages/cli/src/create/org-tarball.ts`）：

- 计算缓存路径  
  `$VP_HOME/tmp/create-org/<host>/<scope>/create/<version>/`。`<host>` 段来自 `manifest.tarballUrl`（通过 `sanitizeHostForPath` 做清理，把 `localhost:4873` 这类 Windows 不合法字符如 `:` 替换掉）；两个仓库即使通过不同 registry 解析到相同的 `<scope>@<version>`，也不会在同一个缓存槽上冲突。
- 如果解压结果已经存在，立即返回缓存根目录。
- 否则通过 HTTPS 流式拉取 tarball（认证重试逻辑与 manifest 获取一致），强制 50 MB 上限，验证 `dist.integrity`，并使用 `nanotar` 解压到一个 staging 目录，再原子性重命名到位。每次新的解压开始时，会清理同级的、超过 24 小时的 `.tmp-*` staging 目录。
- 跳过 `package/` 之外的 tar 条目；保留其存储的 mode 位（因此 `gradlew` 之类的文件仍然保持可执行）。
- `resolveBundledPath(extractedRoot, entry.template)` 会规范化相对路径，并拒绝任何会逃出 `extractedRoot` 的结果（例如会离开包根目录的 `../` 序列）。

## 默认 Org 配置

在 `packages/cli/src/define-config.ts:14-35` 的 `UserConfig` 中新增一个 `create` 字段：

```ts
declare module '@voidzero-dev/vite-plus-core' {
  interface UserConfig {
    // ... 现有字段 ...

    create?: {
      /**
       * 当 `vp create` 在没有模板参数的情况下被调用时，
       * 将此 org 作为默认值（等同于 `vp create <defaultTemplate>`）。
       *
       * 接受任何能作为 `vp create` 第一个参数使用的值——通常是类似
       * `@your-org` 这样的 scope。
       */
      defaultTemplate?: string;
    };
  }
}
```

`vite.config.ts` 示例：

```ts
import { defineConfig } from '@voidzero-dev/vite-plus';

export default defineConfig({
  create: {
    defaultTemplate: '@your-org',
  },
});
```

### 本地模板（`create.templates`）

一个 monorepo 可以在同一份 `create` 配置中声明自己的本地模板（例如内部组件或服务生成器）：

```ts
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

每个条目都会复用 manifest 条目的 schema（精简版的 `CreateTemplateEntry` = `{ name, description, template }`，由同一套用于校验 org manifest 的 `createConfig.templates` 的代码进行验证）。仅适用于 org 的 `monorepo` 标志不属于本地 schema。`template` 字段可以是 workspace 包名、指向本地包目录的相对 `./path`（相对于 workspace 根目录解析）、`vite:*` 内置项、GitHub URL，或者完整的 npm 包名（`create-foo`）。它会按原样运行（不会展开为短写）。

`create.templates` 是本地模板的**唯一事实来源**：

- 当在 monorepo 内运行时，`vp create` 选择器只会列出这些条目（按 `name` / `description`）。Vite+ 不会从 package.json keywords 推断模板包；声明模板必须是显式的。
- 选择某个条目，或输入 `vp create <name>`，都会通过现有的 `discoverTemplate` 路径解析该条目的 `template`。workspace 包名或相对 `./path` 会运行该包的 `bin`；如果它带有 `bingo` 依赖，则会附加 `--skip-requests`（仅作为执行提示）。
- 如果某个条目的 `template` 解析到一个没有 `bin` 的本地包，则会明确报错，而不会错误地回退去使用一个无关的 `create-<name>` npm 包。

`vp create vite:generator` 会自动注册该脚手架生成器：它会读取现有的 `create` 配置，向 `create.templates` 追加一个 `{ name, description, template }` 条目（按 `name` 幂等），并通过与 `injectCreateDefaultTemplate`（`packages/cli/src/migration/migrator.ts`）相同的配置合并机制把合并后的 `create` 对象写回 `vite.config.ts`，同时保留已有的 `defaultTemplate`。这些条目也可以手动添加。

`create.defaultTemplate` 也可以命名一个本地条目，因此直接运行 `vp create` 也可以直接打开本地模板。

为什么使用配置而不是 package.json keywords（`bingo-template` /
`vite-plus-template`）？关键词检测是隐式的，回答“这是模板吗？”这个问题时也比较含糊。将单个 `create.templates` 列表与现有的 `create.defaultTemplate` 放在一起，可以把 create 配置集中到一个地方（`vite.config.ts`），并让本地模板集合保持显式且可审查。

### 优先级

`CLI argument` > `vite.config.ts create.defaultTemplate` > 用于模板名称的交互式提示（也就是今天在直接输入 `vp create` 且没有默认值时的行为）。

### 保留访问 Vite+ 内置模板的能力

设置 `create.defaultTemplate` 绝不应对需要它的工程师“隐藏” Vite+ 的内置默认项（`vite:monorepo`、`vite:application`、`vite:library`、`vite:generator`）。如果没有逃生出口，任何包含该配置的仓库都会迫使每个贡献者记住精确的 `vite:*` 规格名，这就违背了交互式发现的初衷。

因此，org 选择器总是会额外追加一个尾随的 “Vite+ built-in templates” 条目。选择它会让用户进入现有的 `getInitialTemplateOptions` 选择器（`packages/cli/src/create/initial-template-options.ts:9-31`），保持原样不变：

```
? Pick a template from @your-org
❯ monorepo   Monorepo scaffold
  web        Web app template (Vite + React)
  mobile     Mobile app (React Native) template
  server     Server template (Node + Fastify)
  library    TypeScript library template
  ──────────────────
  › Vite+ built-in templates   Use defaults (monorepo / application / library)
```

尾随的 “Vite+ built-in templates” 提示与 `getInitialTemplateOptions` 在当前工作区上下文中实际提供的内容一致——在已有 monorepo 内部时，这个提示显示为 “Use defaults (application / library)”，因为 `vite:monorepo` 会被过滤掉，而 `vite:generator` 不属于该选择器的一部分。

规则：

- 这个逃生入口由 Vite+ 追加，而不是由 org manifest 提供。它不能被 org 禁用——这是一个刻意的“用户主权高于配置”的决定，类似于大多数现代包管理器无论项目配置如何都会始终暴露 `--help`。
- 选择它会重新进入标准流程：所展示的选择器与在未设置 `defaultTemplate` 的仓库里 `vp create` 渲染出的内容完全相同，而且本身已经具备上下文感知能力（例如在 monorepo 内部会省略 `vite:monorepo`，对 `vite:generator` 则要求必须是 monorepo，等等）。
- 该条目放在最后，并位于分隔线下方，因此 org 自身模板仍然是视觉上最主要的选择。

对于脚本化 / 非交互式使用，工程师可以通过直接传入任意模板参数来绕过已配置的默认值——例如 `vp create vite:library`、`vp create vite:application` 等。这里不新增新的 CLI flag；现有的“显式传入 specifier”逃生方式对 CI 和脚本已经足够。

`vp create @org` 在 `--no-interactive` 下的错误输出会在提示行中说明这一点，因此读取表格的代理可以据此切换：

```
hint: rerun with an explicit selection, e.g. `vp create @your-org:web`,
      or use a Vite+ built-in template like `vp create vite:application`.
```

### 有意不在范围内的内容

- **用户级默认值**，位于 `~/.vite-plus/config.json`。为保持本次方案足够紧凑，推迟到未来的 RFC。想要个人默认值的调用方可以提交项目配置。
- **多个默认值**（例如一个跨 `['@your-org', '@vercel']` 的选择器）。如果未来真的有这个需求，应该单独引入一个字段（`defaultTemplates: string[]`），而不是复用单数形式。

## 交互式 UX

### 选择器

当找到 `@org/create` 的 manifest 时，`vp create @org` 会在 **按上下文过滤后的** 条目上显示一个列表提示（见下文“上下文感知过滤”），然后再附带一个尾随的 **Vite+ built-in templates** 条目（见上文“保留访问 Vite+ 内置模板的能力”）。示意：

```
? Pick a template from @your-org
❯ web       Web app template (Vite + React)
  mobile    Mobile app (React Native) template
  server    Server template (Node + Fastify)
  library   TypeScript library template
  ──────────────────
  › Vite+ built-in templates   Use defaults (monorepo / application / library)
```

### 上下文感知过滤

选择器会隐藏那些对当前工作区没有意义的条目，这与 `packages/cli/src/create/initial-template-options.ts:9-31` 中已有逻辑保持一致：当 Vite+ 已经检测到 monorepo 根目录时，会省略 `vite:monorepo`。

规则：

- 如果某个条目有 `monorepo: true`，并且 `vp create` 是在已有 monorepo 内部调用的（`workspaceInfoOptional.isMonorepo === true`），那么在选择器渲染前会先将该条目过滤掉。
- 其他所有条目都会显示。

如果过滤后列表完全为空，`vp create @org` 会打印一条 `info:` 注释（“No templates from `@org/create` are applicable inside a monorepo — showing Vite+ built-in templates instead.”），并跳转到内置选择器，这样用户永远不会看到一个空的选择器，也不会被卡在死胡同里。

### 直接选择行为

`vp create @org:<name>` 会绕过选择器，因此过滤不适用——但在 monorepo 内部显式选择一个 `monorepo: true` 的条目，几乎肯定是个错误。Vite+ 已经在 `packages/cli/src/create/bin.ts:468-472` 的这种情况下拒绝 `vite:monorepo`。同样的错误（“Cannot create a monorepo inside an existing monorepo”）也扩展到 `monorepo: true` 的 manifest 条目。

关键词搜索：输入会按 `name`、`description` 和 `keywords` 进行过滤。方向键 + Enter 进行选择；Ctrl-C 取消。

**决策**：复用已经接入 `vp create` 的 `@voidzero-dev/vite-plus-prompts` `select` 原语（`packages/cli/src/create/bin.ts:5`，它封装了 `@clack/core`），并对 `name` / `description` / `keywords` 做前缀过滤。如果真实使用中暴露出摩擦点（例如一个 org 有很多模板），可在后续版本中改为模糊搜索选择器（例如基于 `@voidzero-dev/vite-plus-prompts` 的 `autocomplete`）。

### `--no-interactive`

当传入 `@org` 但不带名称，并且交互模式被禁用时，命令会报错并打印完整的 manifest 表格——这与专门的 `--list` 标志会生成的表格相同。这样可以保持接口简洁（不增加额外 flag），而且关键的是，能为读取输出的 AI 代理提供足够的上下文（名称、描述、底层模板），让其选择合适的选项并用 `vp create @org:<name>` 重试：

```
A template name is required when running `vp create @your-org` in non-interactive mode.

Available templates in @your-org/create:

  NAME     DESCRIPTION                          TEMPLATE
  web      Web app template (Vite + React)      @your-org/template-web
  mobile   Mobile app (React Native) template   @your-org/template-mobile
  server   Server template (Node + Fastify)     github:your-org/template-server
  library  TypeScript library template          @your-org/template-library
  demo     Bundled demo template                ./templates/demo

Examples:
  # Scaffold a specific template from the org
  vp create @your-org:web --no-interactive

  # Or use a Vite+ built-in template
  vp create vite:application --no-interactive
```

其形状与现有 `vp create` 缺少参数时的消息（`packages/cli/src/create/bin.ts:387-399`）一致——同样的开头句式，同样的 `Examples:` 块——因此对于该命令中的任何缺少模板错误，用户都会看到一致的结构。

注意：

- 输出是稳定且机器可解析的（固定列顺序、以空白分隔）。代理可以在没有 `--json` flag 的情况下解析它；如果事实证明这还不够，那么再补一个 `--json` 输出模式就是一个成本很低的后续方案。
- 表格包含 `TEMPLATE`（已解析的 specifier），以便读者理解每个选项到底会 scaffold 什么——例如它指向 npm、GitHub，还是内置模板。
- 该表格是**上下文过滤**的：当命令在已有 monorepo 内运行时，会省略 `monorepo: true` 的条目，这与交互式选择器的行为一致。页脚行  
  (`omitted 1 monorepo-only entry because this workspace is already a monorepo`)  
  会让过滤结果对人类和代理都可见。
- 错误写入 stderr；表格本身可以输出到 stdout，这样在重定向时仍然可用。

## 组织维护者编写指南

manifest 约定被有意设计得足够轻量，方便各个组织采用。常见有两种布局；请选择最符合组织模板数量和发布节奏的那一种。

**布局 1：将模板打包在单个包中（推荐给大多数组织）。** 所有模板都作为 `@org/create` 本身的子目录存在；manifest 条目使用 `./relative/path` 来引用它们。这与 `create-vite`、`create-next-app` 以及大多数企业脚手架工具采用的模式相同——一个仓库、一次发布、一套版本方案。

```
@your-org/create/
├── package.json              # "createConfig": { "templates": [{ "template": "./templates/demo" }, ...] }
├── templates/
│   ├── demo/
│   │   ├── package.json
│   │   └── src/...
│   ├── web/...
│   └── library/...
└── README.md
```

**布局 2：仅包含 manifest，指向外部包。** 当组织已经发布了独立的 `@org/template-*` 包（或将模板托管在 GitHub 上），并希望让 `@org/create` 只是一个轻量索引时，这种方式很有用。manifest 条目使用 npm specifier 或 `github:` URL。

```
@your-org/create/
├── package.json              # "createConfig": { "templates": [{ "template": "@org/template-web" }, ...] }
└── README.md
```

这两种布局也可以混用——上面的示例 manifest 对大多数条目使用外部包，而对其中一个条目使用 `./templates/demo`。

如果 manifest 就是你唯一的对外入口，那么并不需要代码。不过，强烈建议 `@org/create` 也保持为一个可运行的经典 `create-*` 包，作为使用普通 `npm create` / `yarn create` 的用户的兜底方案。典型布局会添加一个 bin 脚本：

```
@your-org/create/
├── package.json         # "bin": { "create": "./bin.js" }, and "createConfig.templates"
├── bin.js               # 小型启动器，为 npm 用户运行选择器
├── templates/...        # （如果使用布局 1）
└── README.md
```

这会带来以下效果：

- `npm create @your-org` / `yarn create @your-org` → 运行你的 `bin.js`（旧路径）。
- `vp create @your-org` → 直接读取 manifest，不执行 `bin.js`。

### 选择 manifest 条目指向哪里

每个 `template` 字段都是传递给 Vite+ 的 `discoverTemplate` 的 specifier。常见选择如下：

| 选择                              | 适用场景                                                                                                   |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `./templates/foo`（打包路径）     | 模板作为 `@org/create` 本身的子目录存在。作者端开销最低；推荐给大多数组织。                                 |
| `@org/template-foo`（npm 包）     | 模板是独立发布和版本化的。                                                                                 |
| `github:org/template-foo`         | 模板位于 GitHub 仓库，而不是 npm。使用 `degit`。                                                          |
| `vite:monorepo` / 其他内置项      | 通过你自己的包装入口，转交给 Vite+ 内置项。                                                                 |
| 本地 workspace 包名               | 模板位于与 `@org/create` 相同的 monorepo 中。参见 `discoverTemplate` 中的 bingo/local path。             |

### 标记仅适用于 monorepo 的模板

如果某个 manifest 条目用于脚手架生成一个 **monorepo**（即它创建的是 workspace 根，而不是单个包），请将其标记为 `monorepo: true`。这样当用户在现有 monorepo 内部运行 `vp create @org` 时，Vite+ 会在选择器中隐藏该条目；如果用户在该上下文中显式输入 `vp create @org/<entry>`，则会以清晰的错误信息报错。这与 Vite+ 现有的 `vite:monorepo` 内置项过滤方式一致，参见 `packages/cli/src/create/initial-template-options.ts:9-31`。

典型用法：某个组织的 `@org/create` manifest 会列出一个 `monorepo: true` 条目（用于 greenfield 消费者），并搭配若干单包条目（web / mobile / server / library），这些条目也可用于在 monorepo 内部为单独的包生成脚手架。

### 版本管理

默认情况下，manifest 会以 `@org/create@latest` 为解析目标。组织维护者可以在 `template` 字段中为每个条目固定特定版本（例如 `@your-org/template-web@2.3.0`）。我们不会在 manifest 条目上额外添加单独的 `version` 字段，以避免出现两个相互竞争的控制项。

### 发布检查清单

1. 创建 `@org/create`（带 scope 的 npm 包），如果你还没有的话。
2. 在 `package.json` 中添加一个 `createConfig.templates` 数组。
3. （可选）提供一个 `bin` 启动器，以兼容 `npm create @org`。
4. 发布。
5. 使用 `vp create @org --no-interactive`（会打印可用的模板名称）或 `vp create @org`（会打开选择器）进行验证。
6. （可选）在你的内部模板仓库中提交 `create: { defaultTemplate: '@org' }`。

### 向后兼容性

如果你已经将 `@org/create` 作为单模板包发布，**添加 `createConfig.templates` 对 `vp create` 用户来说不是破坏性变更**——选择器会替代直接执行，而每个 manifest 条目仍然可以指向你现有的模板。使用普通 `npm create @org` 的用户无论哪种方式都不受影响；他们仍然会继续运行你的 `bin` 脚本。

## 错误处理

| 情况                                                                             | 行为                                                                                                                                                                                                    |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| npm 上不存在 `@org/create`                                                      | 与当前相同的 `"template not found"` 错误。                                                                                                                                                              |
| `@org/create` 存在，但没有 `createConfig.templates`                              | 继续执行当前行为：运行 `@org/create`。不会报错。                                                                                                                                                         |
| `createConfig.templates` 不是数组                                               | 模式错误：`@org/create: createConfig.templates must be an array`。                                                                                                                                      |
| manifest 条目缺少 `name` / `description` / `template`                            | 模式错误，并指出有问题的索引和字段。                                                                                                                                                                    |
| manifest 条目存在重复的 `name`                                                  | 模式错误，列出重复项。                                                                                                                                                                                  |
| 选定的模板解析失败（404、URL 错误）                                               | 带上下文的下游错误：`selected 'web' from @your-org/create: <downstream error>`。                                                                                                                        |
| 获取 manifest 时发生网络失败                                                     | 硬错误。用户显式输入 `@org` 时，绝不要静默跳过选择器。                                                                                                                                                   |
| 在未带 `@org:<name>` 的情况下使用 `--no-interactive`                             | 报错并列出有效名称（见上文）。                                                                                                                                                                           |
| 所有 manifest 条目都被过滤掉（例如在 monorepo 内部时全部都是 `monorepo: true`）  | 输出一条 `info:` 提示（`"No templates from @org/create are applicable inside a monorepo — showing Vite+ built-in templates instead."`），并切换到内置选择器。这样可避免用户走进死路。                  |
| `vp create @org:<name>`，其中 `name` 的 `monorepo: true` 且当前目录是 monorepo    | 与内置项相同的错误：`Cannot create a monorepo inside an existing monorepo`（与 `bin.ts:468-472` 一致）。                                                                                                |
| `vp create @org:<name>`，其中 `name` 不在 manifest 中（或 manifest 不存在）      | 硬错误，列出可用条目——不会静默回退到 `@org/create-name` 这种短写形式，因为该短写形式保留给带斜杠的格式。                                                                                                |
| 打包路径（`./foo`）解析到了 `@org/create` 根目录之外                              | 在 manifest 校验阶段报模式错误：`createConfig.templates[i].template escapes the package root`。                                                                                                         |
| 打包路径指向 tarball 中不存在的目录                                              | 脚手架错误：`selected 'demo' from @your-org/create: ./templates/demo not found in @your-org/create@1.0.0`。                                                                                              |
| tarball 下载或解压失败                                                            | 带上游原因的硬错误。重试前会清理缓存中的部分解压内容。                                                                                                                                                     |

## 备选方案

### (a) 独立的 `@org/vp-templates` 包

早先有一个提案建议提供一个专门的 `@org/vp-templates` 包，这会引入一个新的短写规则（`vp create @org` → `@org/vp-templates`）。**已拒绝**，原因如下：

- 现有的 `@org/create` 短写已经符合生态约定（`npm create @org`、`yarn create @org`）。
- 通过 manifest 是否存在来控制选择器行为，能清晰地区分这两种模式，而无需引入新规则。
- 已经发布 `@org/create` 的组织，无需再发布第二个包即可采用 Vite+。

### (b) 包内单独的 `templates.json` 文件

**已拒绝**，因为 `package.json` 中的 `createConfig.templates` 可以通过一次 `npm view` / registry HEAD 请求读取，而无需获取包的 tarball。`templates.json` 则需要下载 tarball 或使用类似 degit 的 git 拉取，这两者都更慢，且失败模式更多。

### (c) 位于 `~/.vite-plus/config.json` 的用户级默认配置

**已推迟**到未来的 RFC。项目级配置显然是优先事项：公司只需在仓库中设置一次，之后每个 clone 都会继承它。想要个人默认值的独立用户，可以先使用 shell alias，直到后续 RFC 落地。

### (d) `exports['./templates']` 的 JS 原生 manifest

**已拒绝**，因为为了枚举模板而执行包，意味着为了一个本应是静态列表的内容，需要进行网络下载 + 沙箱运行。另外，这还会迫使选择器的每一种实现（Vite+、未来移植版本、文档工具）都启动一个 JS 运行时。

### (e) 在 CLI 层对 `@org` 做特殊处理

**已拒绝**，因为它与现有的 `discoverTemplate` 流程不够可组合。接入 `discoverTemplate` 可以复用所有现有的模板解析、父目录推断以及 runner 管线。

## 实现状态

已合并到分支 `vp-create-support-org`（PR #1398）。具体落地如下：

| 模块                                            | 作用                                                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `packages/cli/src/create/org-manifest.ts`       | `parseOrgScopedSpec`、`readOrgManifest`、schema 校验（包括 `__vp_` 保留前缀检查）。                                |
| `packages/cli/src/create/org-resolve.ts`        | `resolveOrgManifestForCreate`、`getConfiguredDefaultTemplate`、picker / `--no-interactive` 表格分发。              |
| `packages/cli/src/create/org-picker.ts`         | `pickOrgTemplate` 交互式 picker、escape-hatch 入口、基于上下文的过滤。                                             |
| `packages/cli/src/create/org-tarball.ts`        | `ensureOrgPackageExtracted`、`resolveBundledPath`、`sanitizeHostForPath`、完整性校验、模式保留。                    |
| `packages/cli/src/create/templates/bundled.ts`  | `executeBundledTemplate`（用于相对路径 manifest 条目的目录复制脚手架）。                                           |
| `packages/cli/src/create/discovery.ts`          | `bundledLocalPath` + `skipShorthand` 参数，将 manifest 结果接入现有模板流程。                                      |
| `packages/cli/src/create/bin.ts`                | 统一的 monorepo 分支（builtin + bundled）、`git init` 提示、为 `@org` monorepo 注入 `injectCreateDefaultTemplate`。 |
| `packages/cli/src/create/utils.ts`              | `ensureGitignoreNodeModules` 在 `git init` 之后的保证。                                                             |
| `packages/cli/src/define-config.ts`             | 在 `UserConfig` 上补充 `create: { defaultTemplate?: string }`。                                                     |
| `packages/cli/src/migration/migrator.ts`        | `injectCreateDefaultTemplate` 辅助函数（由 `bin.ts` 调用，仅在 bundled monorepo 上启用）。                         |
| `packages/cli/src/utils/npm-config.ts`          | `.npmrc` 解析器、`getNpmRegistry(scope?)`、`getNpmAuthHeader(url)`、`fetchNpmResource`（401/403 重试）。          |
| `packages/cli/src/resolve-vite-config.ts`       | 导出 `findWorkspaceRoot`，用于默认模板的向上查找。                                                                 |
| `docs/guide/create.md`, `docs/config/create.md` | 编写指南和 `create.defaultTemplate` 参考文档。                                                                      |

## 测试

`packages/cli/snap-tests/` 下的端到端 snap-test fixture 使用一个共享的本地 mock registry（`.shared/mock-npm-registry.mjs`），它为每个 fixture 提供各自的 `mock-manifest.json` 以及 `<fixture>/tarballs/` 目录中的任意 tarball。CI 保持快速且离线。

| 夹具                                      | 验证内容                                                                                                                           |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `create-org-bundled`                     | `vp create @org:<entry>` 会解压 tarball，并为单项目 bundled 子目录生成脚手架。                                                     |
| `create-org-bundled-escape-check`        | `./../outside` 路径在 schema 校验阶段就被拒绝，不会进行任何 tarball 拉取。                                                         |
| `create-org-bundled-monorepo`            | bundled 的 `monorepo: true` 条目：脚手架 + `git init` + `create.defaultTemplate: '@org'` 注入 + `.gitignore` 中包含 `node_modules`。 |
| `create-org-config-default`              | 在设置了 `create.defaultTemplate` 的仓库中执行 `vp create` 时会使用配置的 org。                                                    |
| `create-org-invalid-manifest`            | 无效的 `createConfig.templates` 会产生 schema 错误。                                                                               |
| `create-org-monorepo-filter`             | 在 monorepo 内运行时，`monorepo: true` 条目会在 picker / `--no-interactive` 输出中被隐藏。                                         |
| `create-org-monorepo-direct-in-monorepo` | 在 monorepo 内执行 `vp create @org:<monorepo-entry>` 会明确报错。                                                                  |
| `create-org-no-interactive-error`        | `--no-interactive` 且未提供名称时会报错，并打印完整的 manifest 表（名称 + 描述 + 模板）。                                         |
| `snap-tests-global/new-vite-monorepo`    | 内置的 `vp create vite:monorepo` 不会自动注入 `create.defaultTemplate`（这是 gating 的负例）。                                       |

`packages/cli/src/**/__tests__/` 下的单元测试：

- `org-manifest.spec.ts` — `parseOrgScopedSpec`（包括 `@scope@version`、`@scope:name@version` 形式）、`filterManifestForContext`、`readOrgManifest` 正常路径 + schema 错误 + 版本钉定 + 401/403 认证重试。
- `org-tarball.spec.ts` — `parseEntryMode`、`normalizeEntryName`、`cleanupStaleStagingDirs`、`resolveBundledPath` 路径逃逸、`sanitizeHostForPath`（Windows 非法字符）。
- `org-picker.spec.ts` — 交互式 picker 过滤 + escape-hatch 路由 + 每次调用的 UUID 哨兵值。
- `org-resolve.spec.ts` — 通过 monorepo 标记向上查找 `getConfiguredDefaultTemplate`。
- `utils.spec.ts` — `ensureGitignoreNodeModules`（新建 / 追加 / 无换行 / no-op / 结尾斜杠 / CRLF / `node_modules/sub` / `!node_modules` 等情况）。
- `migrator.spec.ts` — `injectCreateDefaultTemplate`（在 scope 已设置时注入，空值时跳过，保留已有的 `create:`）。
- `npm-config.spec.ts`（`packages/cli/src/utils/__tests__/`）— `.npmrc` 优先级（project > user）、作用域 registry 解析、`_authToken` 提取。

这些 snap-tests 在单元级场景使用 stubbed `fetch`，在端到端场景使用 mock registry。我们**不会**发布一个专门的 `@voidzero-dev/create-test-fixture` 包；registry 表面的回归频率较低，可以在下游修复。

## CLI 帮助输出

`vp create --help` 的相关新增内容：

```
Usage: vp create [TEMPLATE] [OPTIONS] [-- TEMPLATE_OPTIONS]

Arguments:
  TEMPLATE           用于脚手架生成的模板。可以是：
                       - 组织作用域（例如 @your-org），用于组织模板
                       - 组织条目（例如 @your-org:web），用于特定的
                         manifest 条目
                       - 当前已接受的任何值：create-*、github:*、vite:*、
                         @scope/package、本地包名
                     省略时，如果已设置，则使用 vite.config.ts 中的
                     `create.defaultTemplate`。

Options:
  ...existing flags...

Configuration (vite.config.ts):
  create.defaultTemplate   bare `vp create` 使用的默认 org/template。
```

## 兼容性

- **已经存在的单模板 `@org/create` 组织包**：在它们通过添加 `createConfig.templates` 主动启用之前，行为保持不变。
- **普通的 `npm create @org` / `yarn create @org`**：不受影响。这些消费者运行的是包的 `bin` 脚本，不在 Vite+ 的范围内。
- **现有的 `@org/name` 简写**：不变。`vp create @org/foo` 仍然会像以前一样精确展开为 `@org/create-foo`。只有使用 `:` 分隔符时才会触发 manifest 查找（`vp create @org:foo`），因此不会与真实的 `@org/anything` npm 包发生冲突。

## 真实世界使用示例

### 拥有已发布 `@org/create` manifest 的组织

```bash
# 发现
vp create @your-org
# → 选择器包含：web、mobile、server、library

# 直接指定
vp create @your-org:server

# 非交互式（CI）
vp create @your-org:library --no-interactive --directory ./packages/new-lib
```

### 带默认值的企业 monorepo

```ts
// 公司模板种子仓库中的 vite.config.ts
export default defineConfig({
  create: { defaultTemplate: '@your-org' },
});
```

```bash
# 在该仓库内：工程师只需输入 `vp create`
vp create
# → 来自 @your-org/create 的 picker，并在末尾附带一个
#   “Vite+ 内置模板”条目，供需要 vite:library 等模板的用户选择

# 显式使用 builtin（绕过已配置的默认值）
vp create vite:library
```

### 混合说明符 manifest

```json
{
  "createConfig": {
    "templates": [
      { "name": "web", "description": "Next.js 应用", "template": "@your-org/template-web" },
      { "name": "docs", "description": "文档站点", "template": "github:acme/template-docs" },
      { "name": "tool", "description": "CLI 工具", "template": "vite:library" }
    ]
  }
}
```

## 未来增强

- **用户级默认 org**，位于 `~/.vite-plus/config.json`。
- **多个默认 org**（当配置是数组时，picker 覆盖多个 scope）。
- **非 npm 的 manifest 来源**（原始 URL、git 仓库），用于不会发布到 npm 的 org。
- **manifest 分组 / 分类**，适用于模板数量大于约 10 个的 org。
- **安装后提示**，在用户直接安装 `@org/create` 时展示 `vp create @org`。

## 已达成的决定

- **picker 实现**：使用普通的 `@voidzero-dev/vite-plus-prompts` `select`，并带前缀过滤。如果真实使用反馈出现卡顿，再在后续改为模糊搜索 picker（例如包装器的 `autocomplete`）。
- **不提供 `--list` 标志**：manifest 查看通过 `vp create @org --no-interactive` 完成，它会把完整的 manifest 表（名称、描述、解析后的模板说明符）作为错误输出的一部分打印出来。这样脚本、CI 日志和 AI agent 就有足够上下文来选择模板，而不需要专门的 `--list` 标志。
- **网络失败 = 硬错误**：当用户明确输入了 `@org` 时，绝不会静默跳过 picker。网络不稳定的用户会得到清晰、可操作的错误，而不是莫名其妙地回退到单模板。
- **始终可以从 org picker 到达内置模板**：当设置了 `create.defaultTemplate` 时，org picker 会在末尾追加一个 “Vite+ 内置模板” 条目，并路由到现有的 `getInitialTemplateOptions` 流程。没有新的 CLI 标志；像 `vp create vite:application` 这样的显式说明符仍然是脚本化的逃生口。（解决了 #1398 中的评审反馈。）
- **bundled 子目录模板**：manifest 条目可以使用相对路径（`./templates/demo`），它们相对于外层 `@org/create` 包根目录解析。Vite+ 会按 `<host>/<scope>/<version>` 将 tarball 拉取并解压一次到 `$VP_HOME/tmp/create-org/<host>/<scope>/create/<version>/`，然后通过目录复制进行脚手架生成。这样一个 org 就能在单个包里发布 N 个模板，而不是发布 N 个独立的 `@org/template-*` 包——这也是 `create-*` 生态（`create-vite`、`create-next-app`、企业套件）中的主流模式。任何逃逸出包根目录的路径都会在 schema 校验阶段被拒绝。
- **仅使用本地测试夹具**：snap-tests 和单元测试都使用本地 mock registry / stubbed `fetch`。不发布专门的 fixture 包——registry 表面的回归频率较低，并且会在下游捕获。
- **配置字段名用单数 `defaultTemplate`**：因为当前 RFC 只支持单个值，这个命名更自然。如果以后增加对多个默认 org 的支持，会放到单独的 `defaultTemplates: string[]` 字段下，而不是复用单数形式。
- **第一版不提供 `--json` 输出模式**：`--no-interactive` 的固定列文本表已经可以被机器解析。如果下游工具反馈不便，再重新评估。
  
### 实现过程中新增的决定

- **使用 `@scope:name`（冒号）作为 manifest 条目分隔符**：而不是 `@scope/name`（后者会与真实的 npm 包说明符以及已有的 `@scope/create-name` 简写冲突）。这也与内置模板现有的 `vite:monorepo` / `vite:library` 语法一致。
- **使用 `createConfig.templates`（而不是 `vp.templates`）**：这是一个工具中立的键名，延续了现有的 `publishConfig` 先例。其他脚手架工具可以采用同样的约定，而不需要一个带有 `vp` 命名空间倾向的设计。
- **支持钉定版本**：`@scope@1.2.3` 和 `@scope:name@next` 会先通过 `dist-tags[...]` 解析，然后再走 `versions[...]`。未知版本会直接报错。
- **`.npmrc` registry + auth，遇到 challenge 再重试**：解析器会把用户 / 项目级 `.npmrc` 与 `npm_config_*` 环境变量叠加，并尊重 `@scope:registry=...` 覆盖。第一次请求以匿名方式发出；只有在收到 401/403 challenge 后，解析器才会发送匹配的 `_authToken` / `_auth` / username:\_password，因此公共 registry 永远看不到 token。
- **条目名称保留 `__vp_` 前缀**：schema 校验会拒绝以 `__vp_` 开头的 manifest 名称。内部哨兵值（例如 picker 的 escape-hatch UUID）放在这个前缀下，永远不会与用户编写的条目冲突。
- **与 registry 感知相关的缓存键**：缓存路径包含一个 `sanitizeHostForPath(<tarballUrl host>)` 片段，因此两个仓库即使通过不同的 `.npmrc` scope 映射解析到同一个 `<scope>@<version>`，也不会共享同一个缓存槽位。清理时会把 Windows 非法字符（`\ / : * ? " < > |` 以及 IPv6 方括号）替换为 `_`。
- **原子解压 + 清理陈旧 staging 目录**：tarball 会先解压到 `<destDir>.tmp-<pid>-<timestamp>`，再原子重命名到位；重命名竞态中输掉的一方会被解析为缓存命中。每次新的解压开始时，都会清理 24 小时以前的同级 staging 目录。
- **保留 tar 条目模式位**：`gradlew`、`mvnw`、`bin/*` 以及类似文件在解压后仍保持 `0755` 位。`setuid`、`setgid` 和 sticky 位会被去掉——这些不应出现在用户态脚手架中。
- **`keywords` 字段被移除**：它在早期原型中出现过，但从未被 picker 使用。与其保留一个“已校验但未使用”的字段，不如直接从 schema 中删除（YAGNI）。
- **`create.defaultTemplate` 的自动注入受到 gating**：只有在用户刚刚通过 `vp create @scope:<entry>` 生成脚手架，并且该条目是 `monorepo: true` 时才会触发。带有 scoped package 名称的内置 `vp create vite:monorepo` 不会自动注入——这里的 scope 只是 npm 发布细节，不是模板 org 的选择。
- **`git init` 提示在 monorepo 路径中统一处理**：提示与 spawn 都放在 `bin.ts` 的 monorepo 分支中，在这里 `vite:monorepo` 与 bundled 的 `@org` monorepo 汇合；两者都会询问，并且在非交互模式下默认选择 yes。
- **`.gitignore` 在 `git init` 后始终排除 `node_modules`**：bundled 的 `@org` 模板可能没有携带 `.gitignore`。在 `git init` 成功后，`ensureGitignoreNodeModules` 会新建一个包含 `node_modules\n` 的文件，或者在缺失时追加该行，并且处理 CRLF / `node_modules/` / `!node_modules` 等边界情况。如果该行已经存在，则保持不变。
- **`findWorkspaceRoot` 仍然只识别 monorepo 标记**：曾经尝试过让它识别 `.git`，但后来回滚了。没有 monorepo 标记的独立仓库不会获得配置向上查找——调用方要么指向正确的起始目录，要么接受这种延后处理。

## 结论

- `vp create @org` 变为一个由组织拥有的清单支持的品牌化入口点。
- 通过 `@org/create` 的 `package.json` 中的单个 `createConfig.templates` 字段进行启用。
- 在仓库中通过 `create: { defaultTemplate: '@org' }` 进行采用。
- 对现有的 `@org/create` 发布者零风险。
- 与 `code-generator.md` 的双模式策略一致。
