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
- `semver` 必须有效（例如：`10.19.0`、`4.0.0`）
- 可选的完整性哈希后缀：`pnpm@10.0.0+sha512.abc123...`（参见[完整性哈希](#integrity-hashes)）

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
- `onFail` 其余部分会被解析并保留，但目前尚未生效：被选中的（受支持的）条目如果其版本无法解析或下载，会直接报错，而不会回退。参见该 RFC 的[延期 / 未来工作](./dev-engines.md#deferred--future-work)。

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

1. 从现有 monorepo 中检测到的任何包管理器（来自清单字段、工作区文件、锁文件或包管理器配置）
2. `--package-manager` CLI 标志
3. 从非 monorepo 祖先目录中检测到的包管理器
4. 交互式提示 / 自动默认值（pnpm）

这样既能确保 monorepo 的一致性，又允许独立项目显式覆盖环境检测到的包管理器。

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

- **yarn ≥ 2.0.0**：从 `@yarnpkg/cli-dist` 下载，而不是从 `yarn` npm package 下载，并且只提取 `bin/yarn.js`。每个 2.x 预发布版本都算作 Yarn 2 或更高版本；参见 [Yarn 2 边界](#the-yarn-2-boundary)。
- **bun**：从 `@oven/bun-{os}-{arch}` 下载特定于平台的原生二进制文件（包括适用于 Alpine Linux 的 musl 变体）

## 完整性哈希

`packageManager` 字段可以携带完整性哈希：`yarn@4.17.1+sha512.ccbf…`。`corepack use` 会写入该后缀。Vite+ 对与 Corepack 相同的制品进行哈希，因此同一个固定版本可以在两种工具下使用。

| 包管理器                     | 声明的哈希涵盖的内容                              | Vite+ 还会验证的内容                                      |
| ---------------------------- | ------------------------------------------------- | ---------------------------------------------------------- |
| Yarn 2 及更高版本             | 提取后的 CLI，即 `bin/yarn.js`                    | —                                                          |
| npm、pnpm ≤ 11、Yarn Classic | npm package tarball                               | —                                                          |
| pnpm ≥ 12                   | 主 `pnpm` tarball                                 | 根据 registry 的 `dist.integrity` 验证平台 package         |
| bun                          | 主 `bun` tarball，Vite+ 从不下载该文件            | 根据 registry 的 `dist.integrity` 验证平台 package         |

Yarn 2 及更高版本是例外，因为 Corepack 从单个文件 `repo.yarnpkg.com/<version>/packages/yarnpkg-cli/bin/yarn.js` 安装 Berry，并对该文件进行哈希。Vite+ 则下载 `@yarnpkg/cli-dist` tarball，因此会提取 `bin/yarn.js` 并对该条目进行哈希。字节内容相同；只有依据不同。Vite+ 之前对 tarball 进行哈希，这会导致由 `corepack use` 写入的固定版本失败（问题 #2209）。

该固定版本只覆盖未经身份验证的归档文件中的一个文件，因此 Vite+ 只将该条目写入磁盘。其他归档条目不会进入安装目录，并且由归档控制的路径或符号链接无法逃出该目录。

### Vite+ 何时验证固定版本

Vite+ 下载制品时会对其进行哈希，并将已验证的固定版本记录在安装目录旁的 `<version>/.verified-pin` 中。后续命令会将自身的固定版本与该记录进行比较：

- 固定版本匹配。命令使用缓存，不再读取其他内容。
- 固定版本不同，或记录缺失。Vite+ 会对缓存中的 CLI 进行一次哈希，然后重写该记录。
- 哈希与固定版本不一致。命令会以 `Hash mismatch for <name>@<version>` 停止，并且消息会指出哈希所涵盖的制品。

Vite+ 不会在每次命令执行时重新读取 CLI。Corepack 提供相同的保证：它读取自己的 `.corepack` 记录后返回。信任边界是对 `$VP_HOME` 的写入权限，该目录还存放 `vp` 二进制文件、生成的 shim 以及受管理的 Node.js 运行时。

完整性验证失败会停止需要该包管理器的命令，包括 `vp run` 和 `vp exec`。在其他情况下，如果受管理的包管理器缺失（例如没有网络或版本未知），这些命令会继续执行。被吞掉的完整性验证失败最终会表现为“命令未找到”。

### Yarn 2 边界

Corepack 在 2.0.0 处分割 Yarn，并使用 `satisfiesWithPrereleases` 将该范围进行匹配；该函数会在比较前去除预发布标签。因此，对 Corepack 而言，每个 2.x 预发布版本都是 Berry 版本。Vite+ 只比较主版本号，结果一致：`yarn@4.0.0-rc.53` 会从 `@yarnpkg/cli-dist` 解析。`>=2.0.0` semver 范围会排除该版本，并将其发送到 Yarn Classic package，而该 package 从未发布过此版本。

## 工作区和 Monorepo 检测

工作区检测根据以下内容确定 `is_monorepo`：

- `pnpm-workspace.yaml` → monorepo（pnpm）
- 带有 `workspaces` 字段的 `package.json` → monorepo（npm/yarn/bun）

包管理器类型和 monorepo 状态共同决定：

- 要监视哪些锁文件模式用于缓存失效
- 是否支持 catalog（pnpm、yarn、bun 支持，npm 不支持）
- 如何翻译 workspace 过滤器（`--filter`）。

## 检测信号总结

### 按包管理器分类

| 包管理器 | 锁文件                   | 配置文件                                               | 字段                                         |
| -------- | ------------------------ | ------------------------------------------------------ | -------------------------------------------- |
| pnpm     | `pnpm-lock.yaml`         | `pnpm-workspace.yaml`、`.pnpmfile.cjs`、`pnpmfile.cjs` | `packageManager`、`devEngines.packageManager` |
| yarn     | `yarn.lock`              | `.yarnrc.yml`、`.yarnrc`、`yarn.config.cjs`            | `packageManager`、`devEngines.packageManager` |
| npm      | `package-lock.json`      | —                                                      | `packageManager`、`devEngines.packageManager` |
| bun      | `bun.lock`、`bun.lockb`  | `bunfig.toml`                                          | `packageManager`、`devEngines.packageManager` |

### 缓存失效（忽略指纹的文件）

每个包管理器都有特定文件，在变更时会触发缓存失效：

| 包管理器 | 监视的文件                                                                 |
| -------- | -------------------------------------------------------------------------- |
| pnpm     | `pnpm-workspace.yaml`、`pnpm-lock.yaml`、`.pnpmfile.cjs`、`pnpmfile.cjs`、`.pnp.cjs` |
| yarn     | `.yarnrc`、`.yarnrc.yml`、`yarn.config.cjs`、`yarn.lock`、`.yarn/**/*`、`.pnp.cjs`   |
| npm      | `package-lock.json`、`npm-shrinkwrap.json`                                 |
| bun      | `bun.lock`、`bun.lockb`、`bunfig.toml`                                     |
| 全部     | `**/package.json`、`.npmrc`                                                |

## 实现

### Rust（核心检测）

- **文件**：`crates/vp_pm_cli/src/package_manager.rs`
- **函数**：`get_package_manager_type_and_version()` —— 按优先级顺序检测
- **函数**：`prompt_package_manager_selection()` —— CI/TTY/交互式回退
- **函数**：`download_package_manager()` —— 下载、哈希并记录已验证的固定版本
- **函数**：`ensure_package_manager_bin()` —— 解析可执行文件，与全局 shim 共享
- **函数**：`verify_cached_cli_hash()` —— 将固定版本与已记录的固定版本进行比较
- **枚举**：`PackageManagerType` —— `Pnpm`、`Yarn`、`Npm`、`Bun`

### TypeScript（CLI 集成）

- **文件**：`packages/cli/src/utils/workspace.ts` —— 封装 NAPI 绑定的 `detectWorkspace()`
- **文件**：`packages/cli/src/utils/prompts.ts` —— `selectPackageManager()` 用于非交互式默认值
- **文件**：`packages/cli/src/create/bin.ts` —— 处理 `--package-manager` 标志

### NAPI 绑定（桥接）

- **文件**：`packages/cli/binding/src/package_manager.rs` —— 将 `detectWorkspace()` 导出到 JS。

## 未来增强

### 多个锁文件冲突解决

当前，如果存在多个锁文件（例如同时存在 `pnpm-lock.yaml` 和 `package-lock.json`），则会按优先级顺序静默使用第一个找到的文件。未来的增强可以在发现冲突锁文件时发出警告，并建议清理。
