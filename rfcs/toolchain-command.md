# RFC：Vite+ Toolchain Inspection Command

- 状态：Proposed
- 相关：[why-package-command.md](./why-package-command.md)、
  [packages/core/BUNDLING.md](../packages/core/BUNDLING.md)、
  [packages/cli/BUNDLING.md](../packages/cli/BUNDLING.md)、
  [docs/guide/upgrade.md](../docs/guide/upgrade.md)

## Summary

新增顶层 `vp toolchain` 命令。它会显示当前 Vite+ 发布版本中使用的确切工具和引擎：

```bash
vp toolchain
vp toolchain vite
vp toolchain vite rolldown oxc
vp toolchain --json
vp toolchain --global
```

`vite-plus` 包包含一个静态工具链清单。该命令读取此文件。它不会运行包管理器或依赖代码，也不会使用网络。

`vp why` 保留其包管理器行为。对于可读输出，它会针对清单检查每个查询。如果查询匹配，则显示 `vp toolchain` 提示。

## Motivation

Vite+ 固定了 `vp build`、`vp test` 和 `vp check` 使用的工具。项目的 peer dependencies 不得更改这些版本。

包管理器无法显示完整的工具链：

- `@voidzero-dev/vite-plus-core` 捆绑了 Vite、Rolldown 和 tsdown。
- Vite+ 会将 Rolldown 的原生绑定编译到其原生 addon 中。
- Oxc 和其他 Rust 引擎可能没有已安装的 npm 包。
- `pnpm why`、`npm explain`、Yarn 和 Bun 描述的是已安装的包图。
- 在已迁移的项目中解析 `vite/package.json` 会返回 Vite+ core 别名。该包版本标识的是 Vite+ 发布版本，而不是捆绑的 Vite 版本。

`vp --version` 显示的是扁平摘要。`vite-plus/versions` 向 JavaScript 提供相同的主版本。两者都不会显示关系、Oxc 或 Vite Task。

要检查项目是否可以使用新的转换功能，维护者可能需要：

1. 暴露该功能的 Vite 版本；
2. 该 Vite 发布版本背后的 Rolldown 和 Oxc 版本；以及
3. 提供这些版本的 Vite+ 发布版本。

每个 Vite+ 发布版本都必须包含这些版本信息。

## Goals

- 显示当前目录所选中的确切工具链。
- 显示包、捆绑工具和编译引擎之间的关系。
- 支持针对一个或多个工具的精确查询。
- 包含包管理器无法显示的隐藏版本。
- 提供带有架构版本的 JSON。
- 在离线状态下工作，且无需运行受管理的 Node.js 运行时。
- 从同一个清单生成 `vp toolchain`、`vp --version` 和公共导出。

## Non-goals

- 替代 `vp why` 或复现包管理器的依赖解析。
- 列出所有 npm 传递依赖、Rust crate、可选 peer 或平台绑定包。
- 确定上游功能是否存在于某个特定版本中。
- 获取变更日志、发布说明、提交记录或 registry 元数据。
- 允许项目覆盖 Vite+ 捆绑的工具版本。
- 将 Vite+ 工具更改为 peer dependencies。
- 生成软件物料清单。

## Manifest Scope

工具链清单包含会影响 Vite+ 行为或兼容性的组件：

1. Vite+ 分发包，包括 `vite-plus` 和
   `@voidzero-dev/vite-plus-core`。
2. Vite+ 调用或组合的面向用户的工具，包括 Vite、Rolldown、
   Vitest、Oxlint、Oxfmt、oxlint-tsgolint、tsdown 和 Vite Task。
3. 其版本会影响工具行为的捆绑或编译引擎。
   版本 1 包含 Oxc 和 Oxc Resolver。

清单排除普通的实现依赖。例如终端格式化库、文件 glob 工具和 HTTP 客户端。清单还排除平台绑定包，前提是它们与所提供的工具具有相同版本。

`vp toolchain` 使用此有限图。使用 `vp why` 和 `vp list` 查看已安装的 npm 图。

当 Vite+ 添加面向用户的工具时，维护者必须更新该图。当 Vite+ 添加会影响兼容性的隐藏引擎时，也必须更新该图。

## Command Interface

```text
Usage: vp toolchain [OPTIONS] [TOOLS]...

Show active Vite+ tools, versions, and relationships

Arguments:
  [TOOLS]...  Tool or package names to show

Options:
      --json    Print the graph as JSON
      --global  Use the global Vite+ toolchain
  -h, --help    Print help
```

不提供工具名称时，该命令会打印完整图。工具名称用于选择图中的一个或多个部分。

示例：

```bash
vp toolchain                       # Active local-first toolchain
vp toolchain vite                  # Vite and its ownership/engine chain
vp toolchain rolldown oxc          # Union of both matching branches
vp toolchain @voidzero-dev/vite-plus-core
vp toolchain --global              # Ignore the project's local vite-plus
vp toolchain vite --json           # Stable JSON result
```

版本 1 接受精确名称和已定义的别名。不接受 glob。

## Source Resolution

默认情况下，`vp toolchain` 遵循正常的本地优先路由：

1. 使用为当前目录解析到的已安装本地 `vite-plus`。
2. 如果路由未找到本地包，则使用与正在运行的全局 `vp` 配对的 Vite+ 包。

输出会标识所选源。`--global` 会跳过本地解析。

全局二进制文件会将完整命令发送给选定的本地 Vite+ 包。仅当不存在本地包时，它才会读取全局清单。用户传入 `--global` 时，它也会读取全局清单。

项目 lockfile 无法描述 core 中捆绑的代码，也无法描述编译到原生 addon 中的 crate。lockfile 可能包含不相关的 Vite、Rolldown 或 Oxc 副本。因此，该命令不会将 lockfile 用作发布版本信息。

## Readable Output

该命令会打印带有关系标签的所有权树：

```text
Vite+ toolchain (local)

vite-plus@0.2.4
|-- depends on @voidzero-dev/vite-plus-core@0.2.4
|   |-- bundles vite@8.1.3
|   |   `-- uses rolldown@1.1.4
|   |-- bundles rolldown@1.1.4
|   |   |-- compiles oxc@0.138.0
|   |   `-- compiles oxc-resolver@11.22.0
|   `-- bundles tsdown@0.22.3
|-- depends on vitest@4.1.10
|-- depends on oxlint@1.72.0
|-- depends on oxlint-tsgolint@0.24.0
|-- depends on oxfmt@0.57.0
`-- compiles vite-task (built 2026-08-06T09:30:00Z, revision <revision>)
```

这些版本显示的是编写此 RFC 时的仓库状态，不属于命令契约。

可读树可以重复共享节点，以显示两种关系。JSON 中每个节点 ID 只有一个条目。

### Filtered output

对于每个筛选条件，该命令会保留：

- 显示 Vite+ 如何提供匹配组件的每个父节点；以及
- 其引擎链中的每个下游 `uses` 或 `compiles` 关系。

例如：

```text
$ vp toolchain vite

Vite+ toolchain (local)

vite-plus@0.2.4
`-- depends on @voidzero-dev/vite-plus-core@0.2.4
    `-- bundles vite@8.1.3
        `-- uses rolldown@1.1.4
            |-- compiles oxc@0.138.0
            `-- compiles oxc-resolver@11.22.0
```

对于多个筛选条件，该命令返回这些节点和边的并集。

### Name matching

筛选条件匹配节点的：

- 稳定 ID；
- 规范包名或工具名；或者
- 声明的别名。

初始别名包括：

| 查询             | 节点                           |
| ---------------- | ------------------------------ |
| `vite-plus-core` | `@voidzero-dev/vite-plus-core` |
| `tsgolint`       | `oxlint-tsgolint`              |
| `vite-task`      | Vite Task                      |
| `oxc-resolver`   | Oxc Resolver                   |

包名和工具名区分大小写。这与 npm 和 Cargo 名称一致。

如果筛选条件未知，该命令以状态码 1 退出：

```text
error: `rollup` is not in the Vite+ toolchain
hint: run `vp why rollup` to show project dependencies
```

如果存在接近的匹配项，错误信息可以从清单中建议一个名称。

## JSON Output

使用 `--json` 时，该命令不会显示 Vite+ 标题、样式或提示，而是写入一个 JSON 对象：

```json
{
  "schemaVersion": 1,
  "source": {
    "scope": "local",
    "path": "/project/node_modules/vite-plus",
    "vitePlusVersion": "0.2.4"
  },
  "nodes": [
    {
      "id": "vite-plus",
      "name": "vite-plus",
      "version": "0.2.4",
      "kind": "package",
      "delivery": ["dependency"],
      "aliases": []
    },
    {
      "id": "vite-plus-core",
      "name": "@voidzero-dev/vite-plus-core",
      "version": "0.2.4",
      "kind": "package",
      "delivery": ["dependency"],
      "aliases": ["vite-plus-core"]
    },
    {
      "id": "vite",
      "name": "vite",
      "version": "8.1.3",
      "kind": "tool",
      "delivery": ["bundled"],
      "aliases": []
    },
    {
      "id": "rolldown",
      "name": "rolldown",
      "version": "1.1.4",
      "kind": "tool",
      "delivery": ["bundled", "compiled"],
      "aliases": []
    },
    {
      "id": "oxc",
      "name": "oxc",
      "version": "0.138.0",
      "kind": "engine",
      "delivery": ["compiled"],
      "aliases": []
    }
  ],
  "edges": [
    {
      "from": "vite-plus",
      "to": "vite-plus-core",
      "relationship": "depends-on"
    },
    {
      "from": "vite-plus-core",
      "to": "vite",
      "relationship": "bundles"
    },
    {
      "from": "vite",
      "to": "rolldown",
      "relationship": "uses"
    },
    {
      "from": "rolldown",
      "to": "oxc",
      "relationship": "compiles"
    }
  ]
}
```

节点字段：

| 字段       | 含义                                               |
| ---------- | -------------------------------------------------- |
| `id`       | 边和筛选条件使用的稳定标识符                       |
| `name`     | 规范包、工具或引擎名称                             |
| `version`  | 可用时提供确切版本                                 |
| `revision` | 可用时提供确切源修订版本                           |
| `builtAt`  | 当版本信息无用时提供 UTC 原生构建时间              |
| `kind`     | `package`、`tool` 或 `engine`                     |
| `delivery` | 一个或多个：`dependency`、`bundled` 或 `compiled` |
| `aliases`  | 其他筛选名称                                       |

架构版本 1 定义以下边关系：

- `depends-on`：Vite+ 将该组件作为包依赖提供。
- `bundles`：Vite+ 将源代码或 JavaScript 输出合并到另一个包中。
- `uses`：工具在运行时使用该组件，但不拥有该组件。
- `compiles`：Vite+ 将该组件链接到原生 addon 中。

渲染器按照清单顺序写入节点和边。使用者必须按 ID 选择节点。

破坏性 JSON 更改需要递增 `schemaVersion`。可选字段、节点、边、别名和枚举值不需要递增。

## Published Toolchain Manifest

CLI 包构建会写入：

```text
packages/cli/dist/toolchain.json
packages/cli/dist/toolchain.js
packages/cli/dist/toolchain.d.ts
```

`vite-plus` 导出一个带类型的 JavaScript 形式：

```json
{
  "./toolchain": {
    "types": "./dist/toolchain.d.ts",
    "default": "./dist/toolchain.js"
  }
}
```

导出的对象包含发布版本图。在运行时，CLI 会添加 `source` 对象和安装路径。

构建还会从清单生成现有的 `vite-plus/versions` 导出。它保留当前键。构建过程和两个版本命令使用同一个版本列表。

### Version sources

构建过程从以下位置读取版本：

| 组件类型                       | 来源                                                           |
| ------------------------------ | -------------------------------------------------------------- |
| `vite-plus` 和 core 包         | 它们生成的 `package.json` 文件                                 |
| 捆绑的 JS 工具                 | core 构建期间生成的 `bundledVersions`                         |
| 受管理的 npm 工具              | 已解析的依赖 `package.json` 文件                               |
| 编译的 Rust 工具／引擎         | `cargo metadata --locked --format-version 1` 和 `Cargo.lock`  |
| Git 来源的 Rust 组件           | 确切修订版本，以及原生编译后的 UTC 构建时间                    |

维护者在一个小型源文件中定义图和别名。原生构建会记录其完成时间。清单生成器将此时间与上述版本和修订版本组合起来。仅 TypeScript 构建会使用现有的原生时间戳。如果不存在时间戳，清单只显示修订版本。`SOURCE_DATE_EPOCH` 用于为可复现构建设置时间戳。

在以下情况下，发布构建失败：

- 生成器无法解析必需节点；
- 必需节点没有确切版本、修订版本或构建时间；
- 某条边引用了未知节点；
- 节点 ID 或别名发生冲突；或者
- 生成的扁平 `versions` 导出与图不一致。

在运行时，`vp toolchain` 读取生成的文件。它不会读取仓库源文件，也不会在已安装的项目中运行 Cargo。

## Older Local Vite+ Releases

本地优先路由会将 `vp toolchain` 发送到选定的本地 Vite+ 包。旧版本地发布版本会拒绝该命令，并以非零状态退出。

全局 CLI 不会从旧包数据创建不完整的图。升级本地 Vite+ 发布版本后才能使用该命令。要显示全局发布版本，请运行 `vp toolchain --global`。

## Relationship to `vp --version`

`vp --version` 保留其简洁的环境摘要：

- 全局 `vp` 版本；
- 本地 `vite-plus` 版本；
- 主要工具版本；
- 包管理器；以及
- Node.js。

它从清单中读取工具行。使用 `vp toolchain` 选择工具并显示关系或引擎详细信息。

## Relationship to `vp why`

`vp why` 会将命令发送给检测到的包管理器。它保留现有参数、输出和退出状态，并显示已安装的包图。

可读输出查询成功后，Vite+ 会针对每个名称检查活动工具链清单。匹配时会添加一条提示：

```text
Vite+ also provides vite@8.1.3 through its toolchain.
Run `vp toolchain vite` to show this version and its relationships.
```

提示使用“also provides”，因为项目也可能安装上游 Vite。Vite+ 不会更改包管理器输出。查询失败时不会显示提示。对于 JSON 或可解析输出，也会省略提示。一条提示会包含所有匹配名称。

## Implementation

### Manifest generation

修改 `packages/cli/build.ts`。版本导出步骤首先生成工具链图，然后从图创建 `versions.js` 及其类型声明。

Core 在构建 Vite、Rolldown 和 tsdown 时生成 `bundledVersions`。CLI 生成器将这些版本与 npm 包数据和 Cargo 数据组合起来。

### Command implementation

共享的 Rust 代码负责解析、筛选和渲染图。全局 CLI 和本地 NAPI CLI 使用这段代码。

将顶层命令放在其他 Vite+ 版本和生命周期命令旁边。`vite_pm_cli` 负责运行包管理器的命令。

不使用 `--global` 时，全局二进制文件会将命令发送给选定的本地 Vite+ 包。本地包通过其 NAPI 绑定运行该命令。使用 `--global` 时，全局实现读取静态全局清单。本地包不存在时也会执行此操作。它不会启动 Node.js。

Rust 的 `--version` 实现读取共享清单，不再使用硬编码的 `TOOL_SPECS` 表。

### Documentation

将 `vp toolchain` 添加到：

- 顶层 CLI 帮助；
- 交互式命令选择器；
- `README.md` 和 `packages/cli/README.md`；
- 指南中的命令概览；
- 升级和故障排除文档；以及
- 讨论工具版本的生成式项目 agent 指南。

文档应说明 `vp why` 是包管理器操作。

## Testing

### Unit tests

- 清单生成会解析所有必需的 npm 和 Cargo 节点。
- 无效的 ID、别名、边、版本和修订版本会导致生成失败。
- 构建过程从图派生 `vite-plus/versions`，并检查每个键。
- 精确名称和别名筛选条件会解析到预期节点。
- 筛选结果保留所有权祖先和下游引擎边。
- 多个筛选条件生成稳定的并集，且 JSON 节点不重复。
- 可读输出对共享节点使用稳定顺序。
- 未知筛选条件返回状态码 1，并提供包管理器提示。

### CLI snapshot tests

新增案例应放在 `crates/vite_cli_snapshots/tests/cli_snapshots/` 中：

| 场景                             | 预期覆盖范围                                         |
| -------------------------------- | ---------------------------------------------------- |
| 完整本地清单                     | 完整树和本地源                                       |
| `vp toolchain vite`              | Core、Vite、Rolldown、Oxc 和 Oxc Resolver 链        |
| 多个筛选条件                     | 分支的稳定并集                                       |
| 别名筛选                         | `vite-plus-core`、`vite-task` 和 `tsgolint` 解析    |
| `--json`                         | 有效 JSON，不含标题、样式或尾随文本                 |
| 无本地包                         | 全局源选择                                           |
| 本地项目中的 `--global`          | 强制使用全局源                                       |
| 旧版本地 Vite+ 包                | 本地 CLI 返回未知命令失败                            |
| 未知工具                         | 状态码 1 和 `vp why` 提示                             |
| `vp why vite`                    | 包管理器输出后跟工具链提示                           |
| `vp why vite --json`              | 未修改的 JSON 包管理器输出                           |

发布产物测试会使用每个平台绑定加载同一个清单。测试会将原生版本与编译发布输入进行比较。

## Performance and Security

- 该命令会解析选定的 `vite-plus` 包。
- 它读取一个 JSON 文件，筛选一个小型图，并写入输出。
- 它不会使用网络。
- 它不会运行依赖代码。
- CLI 从选定的 `vite-plus` 包中读取清单。
- 该命令不会将工具筛选条件用作文件系统路径。
- 清单包含公开的包版本和源修订版本。

## Backward Compatibility

新命令不会更改 `vp why` 标志或包管理器行为。JSON 输出不包含新提示。

`vite-plus/versions` 保持当前扁平结构。此发布版本新增 `vite-plus/toolchain`。

## Alternatives Considered

### Extend `vp --version`

`vp --version` 为用户提供简短的环境摘要。它不会选择图中的部分，也不会显示关系。JSON 输出也需要单独的命令。

### Name the command `vp versions`

`versions` 无法标识所有权，也会与管理 Node.js 版本的 `vp env list` 重名。

### Name the command `vp deps` or `vp tree`

这两个名称都暗示已安装的项目图。`toolchain` 能标识由 Vite+ 所拥有的发布数据。

### Change `vp why` to synthesize bundled nodes

`vp why` 显示包管理器依赖数据。合成节点会更改其可读输出和 JSON 输出。包管理器输出保持不变，因为 Vite+ 会单独打印提示。

### Read package manifests at runtime

运行时读取包可以找到 Vite、Rolldown、tsdown 和受管理的 npm 工具，但无法找到已编译的 Oxc 或 Vite Task 输入。这样还会重复清单生成器的工作。

### Query GitHub or the npm registry

远程查询在用户离线时会失败。它们描述的是 registry 数据，而不是已安装的文件。清单描述的是已安装的发布版本。

### Expose all Cargo and npm transitive dependencies

完整的传递依赖图会重复包管理器和 SBOM 工具的功能。清单只包含会影响 Vite+ 行为的组件。

### Use peer dependencies for bundled tools

peer dependencies 会允许项目解析更改 Vite+ 的运行时行为。该命令只显示版本，不会更改其所有权。

## Rollout

1. 生成并发布工具链清单和 `vite-plus/toolchain` 导出。
2. 从清单派生 `vite-plus/versions` 和 `vp --version` 中的工具行。
3. 添加 `vp toolchain`、筛选和 JSON 输出。
4. 添加可读的 `vp why` 提示。
5. 更新产品文档和生成式 agent 指南。
