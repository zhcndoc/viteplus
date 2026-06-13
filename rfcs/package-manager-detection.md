# RFC：包管理器检测

## 摘要

本文档说明 Vite+ 如何判断项目使用的包管理器（pnpm/yarn/npm/bun）。该检测会在包管理命令（`vp install`、`vp add`、`vp remove` 等）执行前自动运行，并驱动与 PM 相关的行为，包括命令翻译、锁文件处理、工作区配置以及匹配的包管理器 shim。

## 检测算法

Vite+ 使用严格的、按优先级排序的算法来检测包管理器。第一个匹配项获胜。

### 优先级 1：`package.json` 中的 `packageManager` 字段

最高优先级信号。如果根目录 `package.json` 包含 `packageManager` 字段，则无条件使用它。

```json
{
  "packageManager": "pnpm@10.19.0"
}
```

**格式**：`<name>@<semver>[+<hash>]`

- `name` 必须是以下之一：`pnpm`、`yarn`、`npm`、`bun`
- `semver` 必须是有效的（例如：`10.19.0`、`4.0.0`）
- 可选的哈希后缀：`pnpm@10.0.0+sha512.abc123...`

**错误**：

- 无效的 semver → `PackageManagerVersionInvalid` 错误
- 未知名称 → `UnsupportedPackageManager` 错误

**参考**：[Node.js Corepack packageManager 字段](https://nodejs.org/api/packages.html#packagemanager)

显式字段还会控制匹配的包管理器 shim，包括为该管理器生成的别名。如果项目声明 `packageManager: "npm@11.14.0"`，则 `npm` 和 `npx` shim 会运行 npm 11.14.0。其他别名遵循相同规则：`pnpm`/`pnpx`、`yarn`/`yarnpkg`，以及 `bun`/`bunx`。如果项目声明的是 `pnpm`、`yarn` 或 `bun`，调用 `npm` 仍然会运行 npm；Vite+ 从不把一个包管理器的 shim 命令翻译成另一个。

当 `devEngines.packageManager` 也有声明时，`packageManager` 字段仍然决定选择结果，但如果该字段的名称或版本不满足 `devEngines` 约束，Vite+ 会发出警告（在未来版本中此警告将变为硬错误；npm 在这种情况下已经会报错）。参见 [RFC：devEngines 支持](./dev-engines.md)。

### 优先级 2：`package.json` 中的 `devEngines.packageManager` 字段

如果没有 `packageManager` 字段，Vite+ 会按照 [devEngines 规范](https://github.com/openjs-foundation/package-metadata-interoperability-working-group/blob/main/devengines-field-proposal.md) 检查 `devEngines.packageManager`：

```json
{
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "^11.0.0",
      "onFail": "download"
    }
  }
}
```

- 支持单个对象或对象数组；条目按顺序求值，首个 `name` 受支持的条目获胜。
- `name` 必须是 `pnpm`、`yarn`、`npm`、`bun` 之一。数组形式中不支持的名称会被跳过。当没有任何条目命名了受支持的包管理器时，最后一个条目的有效 `onFail` 决定结果：`ignore`/`warn` 继续沿检测链向下，`error`/`download` 则以明确消息失败。
- `version` 可以是精确版本、semver 范围，或者省略（任意版本都满足）。如果可能，范围会解析为一个已下载的满足版本；否则解析为 npm registry 中最新的满足版本（通过精简元数据文档获取）。除非范围本身包含预发布标记且没有稳定版本满足它，否则会排除预发布版本。
- 范围来源不会被冻结为精确的 `packageManager` 字段；该范围仍是唯一事实来源。
- `onFail` 其余部分会被解析并保留，但目前尚未生效：被选中的（受支持的）条目如果其版本无法解析或下载，会直接报错，而不会回退。参见该 RFC 的 [延期 / 未来工作](./dev-engines.md#deferred--future-work)。

完整语义（冲突处理、doctor 检查以及延期的 `onFail` 矩阵）请参见 [RFC：devEngines 支持](./dev-engines.md)。

### 优先级 3：锁文件

如果既没有找到 `packageManager` 也没有找到 `devEngines.packageManager`，Vite+ 会检查工作区根目录中的锁文件。按以下顺序检查：

| 文件                  | 检测到的 PM | 备注                             |
| --------------------- | ----------- | -------------------------------- |
| `pnpm-workspace.yaml` | pnpm        | 工作区定义文件                   |
| `pnpm-lock.yaml`      | pnpm        | 锁文件                           |
| `yarn.lock`           | yarn        | 锁文件                           |
| `.yarnrc.yml`         | yarn        | Yarn Berry（v2+）配置            |
| `package-lock.json`   | npm         | 锁文件                           |
| `bun.lock`            | bun         | 文本格式锁文件（推荐）           |
| `bun.lockb`           | bun         | 二进制格式锁文件（旧版）         |

当从锁文件检测到时，版本会设为 `"latest"`（在下载时解析）。

### 优先级 4：配置文件

优先级较低、但可指示包管理器的配置文件：

| 文件              | 检测到的 PM | 备注                                        |
| ----------------- | ----------- | ------------------------------------------- |
| `.pnpmfile.cjs`   | pnpm        | [pnpm hooks](https://pnpm.io/pnpmfile)      |
| `pnpmfile.cjs`    | pnpm        | 旧格式（pnpm v5.x）                         |
| `bunfig.toml`     | bun         | [Bun 配置](https://bun.sh/docs/pm)          |
| `yarn.config.cjs` | yarn        | Yarn Berry（v2+）配置                       |

### 优先级 5：显式默认值

如果调用方提供了默认包管理器类型（某些代码路径会在内部使用），则使用该默认值，并将版本设为 `"latest"`。

### 优先级 6：交互式选择

如果未检测到任何信号，且未提供默认值，则行为取决于环境：

#### CI 环境

检查常见的 CI 环境变量：

- `CI`、`CONTINUOUS_INTEGRATION`、`GITHUB_ACTIONS`、`GITLAB_CI`、`CIRCLECI`、`TRAVIS`、`JENKINS_URL`、`BUILDKITE`、`DRONE`、`CODEBUILD_BUILD_ID`（AWS CodeBuild）、`TF_BUILD`（Azure Pipelines）

**结果**：自动选择 `pnpm`，不提示用户。

#### 非交互式终端

如果 stdin 不是 TTY（管道输入、非交互式 shell）：

**结果**：自动选择 `pnpm`，不提示用户。

#### 交互式终端

显示一个可用键盘导航的菜单：

```
未检测到包管理器。请选择一个：
   使用 ↑↓ 方向键导航，按 Enter 确认，按 1-4 快速选择

  ▶ [1] pnpm（推荐）←
    [2] npm
    [3] yarn
    [4] bun
```

如果交互式菜单失败（终端兼容性问题），则回退到简单文本提示：

```
未检测到包管理器。请选择一个：
────────────────────────────────────────────────
  [1] pnpm（推荐）
  [2] npm
  [3] yarn
  [4] bun

请输入你的选择（1-4）[默认：1]：
```

## CLI 标志：`--package-manager`

`vp create` 命令支持 `--package-manager` 标志，用于显式指定包管理器：

```bash
vp create vite:monorepo --no-interactive --package-manager bun
```

**`vp create` 的解析优先级**：

1. 检测到的工作区包管理器（`packageManager` 字段或 `devEngines.packageManager`；现有 monorepo 优先）
2. `--package-manager` CLI 标志
3. 交互式提示 / 自动默认值（pnpm）

这确保了 monorepo 一致性：如果你在一个已经有 `packageManager` 字段的现有工作区中运行 `vp create`，工作区设置会优先于 CLI 标志。

## 自动更新行为

在检测并下载之后，Vite+ 会将解析出的版本写回 `package.json`，以便后续运行具有确定性：

- 从 `packageManager` 字段或精确的 `devEngines.packageManager` 版本检测：已经是精确版本，无需写入。
- 从 `devEngines.packageManager` 范围检测：不写入；该范围是用户的唯一事实来源，不会被冻结为精确版本。
- 从锁文件、配置文件或交互式选择检测：会将精确解析版本写入 `devEngines.packageManager`，并设置 `onFail: "download"`。

写入时会保留 Vite+ 不处理的现有条目（例如，另一个包管理器声明为 `onFail: "ignore"`）：解析出的条目会追加到现有数组中；现有单个条目会转换为数组形式，并保留原始条目在前；只有在字段缺失或格式错误时，才会写入单个条目。

这可以确保：

- 未来运行使用确定性的版本（匹配优先级 1 或 2）
- 团队成员获得一致的版本
- CI 环境使用确定性的版本

## 版本解析

| 检测方法                                      | 使用的版本                                                                                             |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `packageManager` 字段                        | 字段中的精确版本（例如 `10.19.0`）                                                               |
| `devEngines.packageManager`（精确版本）      | 字段中的精确版本                                                                                 |
| `devEngines.packageManager`（范围或缺失）    | 已下载版本中最高的满足版本，否则为 npm registry 中最新的满足版本 |
| 锁文件/配置检测                               | `"latest"`：解析为 npm registry 中最新的稳定版本                                          |
| 交互式选择                                     | `"latest"`：解析为 npm registry 中最新的稳定版本                                          |

**特殊情况**：

- **yarn ≥ 2.0.0**：从 `@yarnpkg/cli-dist` 下载，而不是 `yarn` npm 包
- **bun**：从 `@oven/bun-{os}-{arch}` 下载平台相关的原生二进制文件（包括 Alpine Linux 的 musl 变体）

## 工作区和 monorepo 检测

工作区检测根据以下内容确定 `is_monorepo`：

- `pnpm-workspace.yaml` → monorepo（pnpm）
- 带有 `workspaces` 字段的 `package.json` → monorepo（npm/yarn/bun）

包管理器类型和 monorepo 状态共同决定：

- 要监视哪些锁文件模式用于缓存失效
- 是否支持 catalog（pnpm、yarn、bun 支持，npm 不支持）
- 如何翻译 workspace 过滤器（`--filter`）

## 检测信号总结

### 按包管理器分类

| Package Manager | Lockfiles               | Config Files                                           | Fields                                        |
| --------------- | ----------------------- | ------------------------------------------------------ | --------------------------------------------- |
| pnpm            | `pnpm-lock.yaml`        | `pnpm-workspace.yaml`, `.pnpmfile.cjs`, `pnpmfile.cjs` | `packageManager`, `devEngines.packageManager` |
| yarn            | `yarn.lock`             | `.yarnrc.yml`, `.yarnrc`, `yarn.config.cjs`            | `packageManager`, `devEngines.packageManager` |
| npm             | `package-lock.json`     | —                                                      | `packageManager`, `devEngines.packageManager` |
| bun             | `bun.lock`, `bun.lockb` | `bunfig.toml`                                          | `packageManager`, `devEngines.packageManager` |

### 缓存失效（fingerprint 忽略项）

每个包管理器都有特定文件，在变更时会触发缓存失效：

| 包管理器 | 监视的文件                                                                 |
| -------- | -------------------------------------------------------------------------- |
| pnpm     | `pnpm-workspace.yaml`、`pnpm-lock.yaml`、`.pnpmfile.cjs`、`pnpmfile.cjs`、`.pnp.cjs` |
| yarn     | `.yarnrc`、`.yarnrc.yml`、`yarn.config.cjs`、`yarn.lock`、`.yarn/**/*`、`.pnp.cjs`   |
| npm      | `package-lock.json`、`npm-shrinkwrap.json`                                 |
| bun      | `bun.lock`、`bun.lockb`、`bunfig.toml`                                     |
| All      | `**/package.json`、`.npmrc`                                                |

## 实现

### Rust（核心检测）

- **文件**：`crates/vite_install/src/package_manager.rs`
- **函数**：`get_package_manager_type_and_version()` —— 按优先级顺序检测
- **函数**：`prompt_package_manager_selection()` —— CI/TTY/交互式回退
- **枚举**：`PackageManagerType` —— `Pnpm`、`Yarn`、`Npm`、`Bun`

### TypeScript（CLI 集成）

- **文件**：`packages/cli/src/utils/workspace.ts` —— `detectWorkspace()` 封装 NAPI 绑定
- **文件**：`packages/cli/src/utils/prompts.ts` —— `selectPackageManager()` 用于非交互式默认值
- **文件**：`packages/cli/src/create/bin.ts` —— 处理 `--package-manager` 标志

### NAPI 绑定（桥接）

- **文件**：`packages/cli/binding/src/package_manager.rs` —— `detectWorkspace()` 导出到 JS

## 未来增强

### 多个锁文件冲突解决

当前，如果存在多个锁文件（例如同时存在 `pnpm-lock.yaml` 和 `package-lock.json`），则会按优先级顺序静默使用第一个找到的文件。未来的增强可以在发现冲突锁文件时发出警告，并建议清理。
