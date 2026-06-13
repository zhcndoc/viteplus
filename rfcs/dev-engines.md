# RFC: `devEngines` 支持运行时和包管理器选择

## 摘要

将 `package.json#devEngines` 作为 Vite+ 中 Node.js 运行时选择和包管理器选择的一级来源，遵循 [OpenJS devEngines 字段提案](https://github.com/openjs-foundation/package-metadata-interoperability-working-group/blob/main/devengines-field-proposal.md)，并采用**兼容性优先**规则：

- **现有项目**：写入时仍以当前事实来源为准。已有的 `.node-version` 会继续被 `vp env pin` 更新；已有的顶层 `packageManager` 会继续被包管理器锁定逻辑更新（Corepack 兼容）。
- **新项目**：`devEngines.runtime` 和 `devEngines.packageManager` 成为推荐且默认的清单字段。
- **冲突**：冲突声明由 `vp env doctor` 以 semver 感知方式提示，绝不静默解决。

本 RFC 实现了在 [#864](https://github.com/voidzero-dev/vite-plus/issues/864) 中达成一致的方案，并吸收了该讨论串中的评审意见（semver 感知冲突检测、`devEngines.packageManager` 的范围保留、处理规范定义的全部字段形态）。

## 动机

`devEngines` 是声明开发环境需求的跨工具标准，npm（v10.9+）、pnpm（`devEngines.runtime` 用于 Node 管理）以及 Corepack 已支持。Vite+ 目前：

- 读取 `devEngines.runtime` 用于 Node 解析，但优先级最低，而且没有遵守 `onFail`。
- 完全忽略 `devEngines.packageManager`（`crates/vite_install/src/package_manager.rs:288` 处仍是 TODO）。更糟的是，在一个明确使用 `devEngines.packageManager` 加锁文件的项目中，当前自动锁定会向 `package.json` 写入冗余的顶层 `packageManager` 字段，和用户选定的清单冲突。
- 只会写入 `.node-version`（`vp env pin`）和 `packageManager`（自动锁定、`vp create`、`vp migrate`），因此采用 `devEngines` 标准的用户没有写入路径支持。

#864 中的社区反馈要求 Vite+ 未来把 `devEngines` 作为标准，同时不破坏已有的 `.node-version` / `packageManager` 工作流。

## 背景

### devEngines 规范

根据 [OpenJS 提案](https://github.com/openjs-foundation/package-metadata-interoperability-working-group/blob/main/devengines-field-proposal.md)：

```typescript
interface DevEngines {
  os?: DevEngineDependency | DevEngineDependency[];
  cpu?: DevEngineDependency | DevEngineDependency[];
  libc?: DevEngineDependency | DevEngineDependency[];
  runtime?: DevEngineDependency | DevEngineDependency[];
  packageManager?: DevEngineDependency | DevEngineDependency[];
}

interface DevEngineDependency {
  name: string; // required
  version?: string; // semver range, same syntax as engines.node; absent = any
  onFail?: 'ignore' | 'warn' | 'error' | 'download'; // default: error
}
```

与本 RFC 相关的规范语义：

- `version` 是**可选**的；缺省表示任意版本都满足。
- `version` 使用 **semver 范围语法**（类似 `engines.node`）。LTS 别名（`lts/*`、`lts/iron`）不是有效值。
- `onFail` 默认为 `error`。在**数组形式**下，使用第一个可接受选项；前面的元素默认 `ignore`，只有最后一个元素默认 `error`。
- 每个子字段都接受单个对象或对象数组。

### 当前 Vite+ 行为

**Node.js 解析链**（`crates/vite_global_cli/src/commands/env/config.rs`、`crates/vite_js_runtime/src/runtime.rs`）：

1. `VITE_PLUS_NODE_VERSION` 环境变量（会话）
2. `~/.vite-plus/.session-node-version`（会话）
3. `.node-version`（向上查找）
4. `package.json#engines.node`（向上查找）
5. `package.json#devEngines.runtime[name="node"]`（向上查找）
6. 用户默认值（`~/.vite-plus/config.json`）
7. 最新 LTS

**包管理器检测链**（`crates/vite_install/src/package_manager.rs`；[rfcs/package-manager-detection.md](./package-manager-detection.md) 已随本 RFC 更新，并记录了新的链路）：

1. `packageManager` 字段（精确版本，可选 hash）
2. Lockfile（`pnpm-workspace.yaml`、`pnpm-lock.yaml`、`yarn.lock` 等），版本为 `latest`
3. 配置文件（`.pnpmfile.cjs`、`bunfig.toml` 等），版本为 `latest`
4. 显式默认值 / 交互选择

**当前写入路径**：

- `vp env pin` 只写 `.node-version`（`crates/vite_global_cli/src/commands/env/pin.rs`）。
- 当从 `latest` 解析并下载某个包管理器后，`PackageManagerBuilder::build()` 会自动把精确版本写入 `packageManager` 字段（`set_package_manager_field()`）。
- `vp create` / `vp migrate` 会在缺失时写入 `packageManager`（`packages/cli/src/migration/migrator.ts#setPackageManager`）。
- `vp migrate` 会把 `.nvmrc` / Volta 锁定转换成 `.node-version`。

**现有解析**（`crates/vite_shared/src/package_json.rs`）：`DevEngines` 只有 `runtime`；`RuntimeEngine { name, version, on_fail }` 中所有字段默认空字符串；`on_fail` 虽已解析，但未使用。

## 指导原则：兼容性优先

> 现有 `.node-version` 在 Node.js 上优先。现有 `packageManager` 在包管理器上优先。新项目使用 `devEngines.runtime` 和 `devEngines.packageManager`。冲突声明由 `vp env doctor` 提示，而不是静默解决。

下面的每个设计决策都源于这条规则。

## 详细设计

### 1. 共享解析：符合规范的 `DevEngines`

将 `crates/vite_shared/src/package_json.rs` 泛化为：

```rust
/// 一条 devEngines 依赖项（规范：DevEngineDependency）。
pub struct DevEngineDependency {
    pub name: Str,                  // 规范要求必填
    pub version: Option<Str>,       // 可选；None = 任意版本都满足
    pub on_fail: Option<OnFail>,    // 可选；有效默认值取决于位置
}

pub enum OnFail { Ignore, Warn, Error, Download }

/// 单个对象或数组（规范允许每个子字段两者皆可）。
pub enum DevEngineField {
    Single(DevEngineDependency),
    Multiple(Vec<DevEngineDependency>),
}

pub struct DevEngines {
    pub runtime: Option<DevEngineField>,
    pub package_manager: Option<DevEngineField>,
    // os / cpu / libc：暂不解析；超出范围（见非目标）
}
```

解析规则：

- **读取时宽容**：格式错误的条目（缺少 `name`、未知的 `onFail` 值、单个条目的 JSON 形状无效）会被跳过并发出警告；它绝不会中断解析，也不会影响无关命令。这与现有的 `normalize_version`“警告并忽略”行为一致。
- **有效 `onFail`**：单个对象默认 `error`；数组中除最后一个元素外都默认 `ignore`，最后一个默认 `error`（符合规范）。
- **`version` 缺失或为空**：视为“任意版本都满足”。就解析而言，该条目不施加版本约束。
- **未知的 `onFail` 字符串**：按位置默认值处理，并给出警告。

`RuntimeEngineConfig` / `RuntimeEngine` 会被新通用类型替代（或别名化），让 runtime 和 packageManager 共用一套实现，正如 #864 中所建议的那样（一次性处理“每个字段的不同形状”）。

### 2. Node.js 运行时

#### 2.1 读取优先级

建议链路（变更已标出）：

1. `VITE_PLUS_NODE_VERSION` 环境变量（会话）
2. `.session-node-version`（会话）
3. `.node-version`（向上查找）
4. **`package.json#devEngines.runtime[name="node"]`（向上查找）**（移到 `engines.node` 之上）
5. `package.json#engines.node`（向上查找）
6. 用户默认值
7. 最新 LTS

交换第 4 和第 5 的理由：`engines.node` 是面向使用者的支持范围（通常较宽，例如 `>=18`），而 `devEngines.runtime` 按定义是开发环境需求，也是 npm/pnpm 对开发工具实际生效的字段。当二者并存时，开发专用字段应该驱动开发运行时。这个问题在 #864 中被提出，也与 pnpm 的行为一致。

决定：此次 RFC 同步落地这一重排。兼容性影响：只有同时声明**两个字段**且解析结果**不一致**的项目会改变行为，而 `vp env doctor` 会恰好标记这些项目。

向上查找算法保持不变：在向父目录移动前，每一层目录都会按上述顺序检查各来源。

#### 2.2 数组形式和非 node 运行时

- 按数组顺序评估条目；使用第一个 `name == "node"` 的条目（与 Vite+ 管理的运行时所适用的规范“第一个可接受选项”一致）。
- 对于 Vite+ 不管理的运行时（`deno`、`bun` 等），会跳过解析。`vp env doctor` 会将其列为信息提示（“声明的运行时 `deno` 不由 Vite+ 管理”）。
- 如果不存在 `node` 条目，则链路回退到 `engines.node`。

#### 2.3 `onFail` 语义

> **状态：**截至本 PR，`runtime.onFail` **已解析并保留，但尚未真正生效**。管理模式总是解析并下载所需版本（等同于 `onFail: "download"`），而解析/下载失败无论声明的 `onFail` 是什么都会作为错误暴露。下表是计划中的未来行为，记录在 [Deferred / Future Work](#deferred--future-work) 中。

实现后预期语义：管理模式已经实现了最强补救措施（`download`），因此 `onFail` 主要在无法补救或处于系统优先模式（`vp env off`）时才有意义：

| `onFail`          | 管理模式（`vp env on`，默认）                                          | 系统优先模式（`vp env off`）                                                  |
| ----------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `ignore`          | 跳过该条目继续解析                                                         | 跳过该条目；使用系统 Node                                                   |
| `warn`            | 正常解析并下载；若失败则警告并继续链路                                     | 若系统 Node 不满足范围：警告，然后仍然使用系统 Node                          |
| `error`（默认）   | 正常解析并下载；若失败则以错误退出                                         | 若系统 Node 不满足范围：以错误退出                                            |
| `download`        | 解析并下载（Vite+ 默认行为）                                                | 若系统 Node 不满足范围：回退到管理下载                                       |

说明：

- “若失败”包括：上游不存在该版本/范围，或下载失败（网络、平台）。
- 当前默认的管理模式体验不变：普通 `{ "name": "node", "version": "^24.0.0" }` 的行为与今天完全一致（解析并下载）。

#### 2.4 `vp env pin` 的写入目标

`vp env pin <version>` 会在当前目录中选择写入目标：

| 当前工作目录状态                                                         | 写入目标                                                              |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| 存在 `.node-version`                                                     | 更新 `.node-version`（行为不变）                                      |
| 不存在 `.node-version`；`package.json` 有 `devEngines.runtime` 的 node 条目 | 更新该条目的 `version`（保留 `onFail` 和兄弟条目）                     |
| 不存在 `.node-version`；`package.json` 存在但没有 node runtime 条目     | 添加 `devEngines.runtime` 的 node 条目，并设 `onFail: "download"`     |
| 当前目录没有 `package.json`                                              | 创建 `.node-version`（行为不变；没有别的地方可写）                     |

- `engines.node` **永远不是** pin 目标：它是面向使用者的约束，重写它会改变发布包的契约。更广泛地说，任何 Vite+ 写入路径（pin、unpin、自动锁定、create、migrate）都不会删除或修改已有的 `engines.node`；它始终保持不变。
- 当更新数组形式中的现有 node 条目时，只修改该条目的 `version`；其他运行时和 `onFail` 值都保留。
- 显式 `--target` 标志会覆盖选择：`vp env pin 24 --target node-version` 或 `--target dev-engines`。该标志始终优先生效：即使存在 `.node-version`，`--target dev-engines` 也会写入 `devEngines.runtime`，并附带说明：在删除 `.node-version` 之前，它仍然具有解析优先级。

值语义（与已实现的 `vp env pin` 行为一致，即在 pin 时将所有输入解析为精确版本；两种目标完全相同）：

| 输入              | 写入目标（`.node-version` 或 `devEngines.runtime.version`）                            |
| ----------------- | ---------------------------------------------------------------------------------------- |
| `24.11.1`（精确） | `24.11.1`（已针对 registry 验证）                                                         |
| `24`（部分）      | 在 pin 时解析为精确版本（例如 `24.11.1`）                                                |
| `^24.0.0`（范围） | 在 pin 时解析为精确版本                                                                  |
| `lts` / `latest`  | 在 pin 时解析为精确版本                                                                  |

pin 始终写入精确版本（“pin”就是锁定；这也是当前 `.node-version` 的行为，并会保留给两个目标）。偏好在 `devEngines.runtime` 中保留范围的团队可以直接编辑 `package.json`；Vite+ 会读取并保留范围，只是不通过 `vp env pin` 代写它们。第 5.2 节中的 alias 到 semver 转换表适用于 `vp migrate`（它会保留 `.nvmrc` 值的浮动意图），不适用于 pin。

规则：Vite+ 在**读取**时保持宽容（`devEngines.runtime.version` 中即使是别名也能解析，但 `doctor` 会警告其不符合规范），在**写入**时保持严格（只会向 `devEngines` 写入有效的 semver 范围或精确版本）。

当 `.node-version` 是写入目标，且同时存在 `devEngines.runtime` 的 node 条目时：

- 如果新的 pin 版本**满足**声明的范围，则不会改动其他内容（该范围仍然是可信的）。
- 如果**不满足**：在交互式终端中，`vp env pin` 会提示同步（`devEngines.runtime ("^24.0.0") is no longer satisfied. Update it to match? [Y/n]`），与 pin 现有的覆盖确认一致。在非交互环境中，它会发出警告并指向 `vp env doctor`。它绝不会在没有确认的情况下重写另一来源。

#### 2.5 `vp env pin`（显示）和 `vp env unpin`

- 不带参数的 `vp env pin` 会报告当前活动 pin 及其来源，现在也包括 `devEngines.runtime` 这一可能来源（`VersionSource::DevEnginesRuntime` 的显示字符串已存在）。继承自父目录的 pin 对两种来源都会报告，按每个目录先检查 `.node-version`，再检查 `devEngines.runtime` 的 node 条目（与解析顺序一致）。
- `vp env unpin` / `vp env pin --unpin` 会从 `vp env pin` 本应写入的同一目标中移除 pin：若存在则删除 `.node-version`；否则从 `devEngines.runtime` 中移除 node 条目（若其变为空，则删除整个 `devEngines.runtime` 键；若 `devEngines` 也变空，则删除 `devEngines`）。

### 3. 包管理器

#### 3.1 检测优先级

新的链路（插入处已标出）：

1. `packageManager` 字段（精确版本，可选 hash；不变）
2. **`devEngines.packageManager`（新增）**
3. Lockfile（不变）
4. 配置文件（不变）
5. 显式默认值 / 交互选择（不变）

当 **`packageManager`** 和 **`devEngines.packageManager`** 同时存在时：

- `packageManager` 字段驱动选择（它是精确且可通过 hash 验证的，也符合 Corepack 的优先级）。
- 如果该字段的名称或版本不满足 `devEngines.packageManager` 约束，命令会输出一行警告，`vp env doctor` 会报告细节。警告会说明这将在未来版本中变为硬错误（先警告、后报错的过渡）。npm 在这种情况下已经会报错，因此由 npm 驱动的项目今天就能得到强制检查。

#### 3.2 解析 `devEngines.packageManager` 条目

- `name` 必须是 `pnpm`、`yarn`、`npm`、`bun` 之一。对于其他名称（规范允许命名空间开放）：在数组形式下，跳到下一项；如果不再有可用条目，则应用最后一个条目的有效 `onFail`（`error` → 以清晰消息失败；`ignore`/`warn` → 继续沿检测链向下）。对不支持的管理器，`download` 会报错。
- `version` 可以是精确值、范围或缺失：
  - 精确值（`11.5.1`）：直接使用（与 `packageManager` 字段路径相同，只是没有 hash）。
  - 范围（`^11.0.0`）或缺失（= 任意）：
    1. 如果 `$VP_HOME/package_manager/<name>/` 下已有已下载版本满足该范围，则使用其中最高的满足版本（适合离线，无需网络）。
    2. 否则从 npm registry 解析最新的满足版本，获取精简元数据文档（`Accept: application/vnd.npm.install-v1+json`，以 KB 计，而不是多 MB 的完整 packument）并下载。
  - 一旦某个满足的版本已下载，步骤 1 会短路后续所有解析，因此 registry 只会在没有已缓存满足版本时被查询（不需要单独的 TTL 缓存）。
  - 预发布版本会被排除在范围解析之外，除非需求本身包含预发布标记（例如 `^12.0.0-0`），且没有稳定版本满足它。
- `onFail`（当前 PR）：**只有在数组中没有任何条目命名受支持的包管理器时**才会生效（上面的那一项）——`ignore`/`warn` 继续沿检测链向下，`error`/`download` 失败。一旦选中了受支持条目，就**尚未**查询其 `onFail`：后续无法解析的范围或下载/安装失败会直接作为错误暴露，而不是回退到下一项。按条目回退（按顺序尝试每个受支持条目，在失败时应用其有效 `onFail`）记录在 [Deferred / Future Work](#deferred--future-work) 中。

#### 3.3 自动锁定行为变更

当前：每当检测到的版本是 `latest`（lockfile / 配置 / 交互式检测）时，Vite+ 会把下载到的精确版本写回 `packageManager` 字段。

提议：

| 检测来源                        | 自动写入行为                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `packageManager` 字段            | 无需写入（已经是精确值）；不变                                                                                                                               |
| `devEngines.packageManager` 精确 | 无需写入                                                                                                                                                     |
| `devEngines.packageManager` 范围 | **不写入。** 该范围是用户选定的事实来源；把它冻结到 `packageManager` 会制造第二个冲突来源（#864 评审意见）                                                   |
| Lockfile / 配置 / 交互式         | 将精确解析版本写入 **`devEngines.packageManager`**，并设 `onFail: "download"`（新的默认目标），而不是写入 `packageManager` 字段 |

最后一行就是把“新项目默认使用 devEngines”的规则应用到自动锁定路径。已经有 `packageManager` 字段的项目不会走到这一行，因此 Corepack 锁定的仓库会保持当前行为。决定：自动写入的值是**精确版本**（保留今天的确定性保证）；如果团队更喜欢范围，可以之后手动编辑字段，Vite+ 会保留它（范围来源绝不会被冻结）。

自动写入的形态：

```json
{
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "11.5.1",
      "onFail": "download"
    }
  }
}
```

自动锁定绝不会替换它未写入的条目：当 `devEngines.packageManager` 已经声明了 Vite+ 不会处理的条目（例如另一个包管理器且 `onFail: "ignore"`，其检测最终落到了 lockfile），解析出的条目会追加到现有数组；如果原本是单个条目，则会转换为数组形式，并保留原始条目在前。只有在该字段缺失或格式错误时，才会写入单个条目。

#### 3.4 暴露来源

- `vp env --current --json` 在 `package_manager` 块里新增可能值 `"source": "devEngines.packageManager"`（与已有的 `"packageManager"` 并列）。
- `vp env which pnpm` 及相关命令会像 Node 一样报告解析来源。

### 4. `vp env doctor` 冲突检测

所有检查都**感知 semver**：满足声明范围的精确版本不算冲突（`.node-version: 24.11.1` 与 `devEngines.runtime.version: ^24.0.0` 兼容；#864 评审意见）。

`.node-version` 与 `devEngines.runtime` 的兼容共存**不会**被标记（甚至不会提示）。这两者是合法的互操作模式，而不是需要清理的冗余：`.node-version` 被 fnm/nvm/asdf/Netlify/`actions/setup-node` 读取，而 `devEngines.runtime` 是 npm/pnpm 标准，因此项目通常会有意同时保留两者。只有当二者实际分歧（真正冲突）时，doctor 才会警告；这也能捕捉后续漂移，例如 `.node-version` 被升级到超出声明范围。

每条检查所查看的 `package.json` 与其诊断对象相匹配：

- **运行时检查** 使用“最近优先”的向上查找语义，类似 Node.js 解析。`.node-version` 与 `devEngines.runtime` 的冲突检查会在两侧都遵循解析路径：只有当 `.node-version` 实际赢得解析、且在祖先清单中也找到了 `devEngines.runtime` 声明时才触发（被更近位置的 `devEngines.runtime` 覆盖的父级 `.node-version` 不算冲突）。
- **包管理器检查** 检查 **工作区根目录** 的 `package.json`：这就是 `vp install` 读取 `packageManager` / `devEngines.packageManager` 的文件，在 monorepo 中它可能不是最近的那个 `package.json`，而是更高层文件。

新增检查：

| 检查                                                                       | 严重级别 | 示例消息                                                                                   |
| -------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| `.node-version` 不满足 `devEngines.runtime[node].version`                 | warn     | `.node-version (22.13.0) does not satisfy devEngines.runtime "^24.0.0"`                    |
| 解析到的 Node 版本不满足 `engines.node`                                    | warn     | （扩展现有 `check_version_compatibility` 警告）                                            |
| `packageManager` 名称与 `devEngines.packageManager` 名称不同              | warn     | `packageManager is "npm@11.4.0" but devEngines.packageManager requires "pnpm"`             |
| `packageManager` 版本不满足 `devEngines.packageManager` 范围              | warn     | `packageManager pnpm@10.9.0 does not satisfy devEngines.packageManager "^11.0.0"`          |
| `devEngines.runtime.version` 不是有效的 semver 范围（例如 `lts/*`）       | warn     | `devEngines.runtime.version "lts/*" is not a valid semver range (see devEngines spec)`     |
| 格式错误的 `devEngines` 条目（缺少 `name`、未知 `onFail`）                | warn     | `devEngines.packageManager entry is missing "name" and was ignored`                        |
| Vite+ 不管理的运行时条目（`deno` 等）                                      | info     | `devEngines.runtime declares "deno", which is not managed by Vite+`                        |
| 不支持的 `devEngines.packageManager` 名称                                 | warn     | `devEngines.packageManager "vlt" is not supported (supported: pnpm, yarn, npm, bun)`       |

Doctor 从不自动修复；它只会解释在优先级规则下哪个来源获胜，以及应当修改什么。

### 5. `vp create` 和 `vp migrate`

#### 5.1 `vp create`（新项目）

- 模板（`packages/cli/templates/*/package.json`）会新增 `devEngines` 块；当项目两个字段都不声明时，`setPackageManager()` 会写入 `devEngines.packageManager`（而不是 `packageManager` 字段）：

```json
{
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "^24.0.0",
      "onFail": "download"
    },
    "packageManager": {
      "name": "pnpm",
      "version": "11.5.1",
      "onFail": "download"
    }
  }
}
```

- 决定（评审后修订）：模板保留其现有的 `engines.node` 条目（`>=22.12.0`）**不变**，并在旁边新增 `devEngines` 块。`engines.node` 继续作为广泛理解的面向使用者的下限（CI 镜像、Renovate、Netlify、pnpm 强制检查）；`devEngines.runtime` 承载开发要求（例如上面示例中的当前 LTS 主版本 `^24.0.0`）。doctor 会防止两者漂移。
- 在现有工作区内创建时，仍遵守该工作区现有事实来源（沿用 [rfcs/package-manager-detection.md](./package-manager-detection.md) 中不变的优先级）。

#### 5.2 `vp migrate`（现有项目）

与 `vp env pin` 相同的优先级规则：

- 项目已经有 `.node-version`：保留它（今天的行为）。
- 项目已经有 `packageManager`：继续更新该字段（今天的行为）。
- `.nvmrc` / Volta 迁移目标为 `devEngines.runtime`；提示会明确目的地（“将 .nvmrc 迁移到 devEngines.runtime？”）。有效 semver 值原样迁移；别名值会在迁移时转换为 semver（评审决定）：

| 源值（`.nvmrc`）           | 写入 `devEngines.runtime.version`           | 说明                                                                 |
| -------------------------- | ------------------------------------------- | -------------------------------------------------------------------- |
| `20.18.0` / `v20.18.0`     | `20.18.0`                                   | 精确值，原样保留（去掉 `v` 前缀）                                     |
| `20` / `20.18` / `^20.0.0` | 原样                                        | 本来就是有效 semver 范围                                             |
| `lts/iron`（代号）         | `^20.0.0`（该代号对应的主线）               | 同一发布线，忠实转换                                                 |
| `lts/*`                    | `^<当前 LTS 主版本>.0.0`（例如 `^24.0.0`） | 会丢失未来 LTS 线的浮动；迁移输出会注明这一点                         |
| `lts/-1`、`lts/-2`（偏移） | `^<解析后的主版本>.0.0`                     | 偏移在迁移时解析                                                     |
| `latest` / `node`          | 迁移时解析出的精确版本                      | “始终最新”没有对应的 semver；迁移输出会注明这一点                    |

- Volta 的 `volta.node` 始终是精确值，因此会原样迁移。

### 6. JSON 编辑保真度

对 `package.json` 的写入必须尽量局部化：

- 保留键顺序（`set_package_manager_field` 已启用 serde_json 的 `preserve_order`）。
- 检测并保留文件现有缩进风格（2 空格、4 空格、tab）和末尾换行风格，而不是无条件 `to_string_pretty`。
- 添加 `devEngines` 时，如存在 `engines`，则紧邻其后放置；否则追加到末尾。
- TypeScript 侧复用现有的 `editJsonFile` 辅助函数。

一个共享的 Rust 小工具（位于 `vite_shared`）将负责“编辑 `package.json` 中的单个字段并保留格式”，供 pin、自动锁定和 unpin 使用。

## 规范符合性矩阵

| 规范特性                                              | 本 RFC 之后的 Vite+ 支持情况                                                                                                                                                              |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `runtime`（单个 + 数组）                              | 支持，针对 `name: "node"`；其他 runtime 由 doctor 暴露，不负责管理                                                                                                                        |
| `packageManager`（单个 + 数组）                       | 支持，适用于 pnpm / yarn / npm / bun                                                                                                                                                      |
| `version` 可选，semver 范围语法                       | 支持（宽松读取，严格写入）                                                                                                                                                               |
| `onFail`（`ignore` / `warn` / `error` / `download`） | 部分支持：用于驱动 `packageManager` 的不支持名称回退；其他情况会被解析/保留，但尚未生效（见第 2.3 节和 [延后 / 未来工作](#deferred--future-work)）                                         |
| 数组 `onFail` 默认值（前者 `ignore`，最后者 `error`） | 支持                                                                                                                                                                                      |
| `os` / `cpu` / `libc`                                 | 不在范围内（未来可能作为 doctor 检查）                                                                                                                                                    |
| 完整性哈希                                            | 不属于该规范；`packageManager` 字段哈希仍然受支持                                                                                                                                         |

## 非目标

- 通过 `devEngines.runtime` 管理非 Node runtime（例如 `deno`，或把 `bun` 作为 runtime）。
- 校验 `devEngines.os` / `cpu` / `libc`。
- 作为一个通用强制层，处理除 pnpm / yarn / npm / bun 之外的任意包管理器名称。
- 更改 session 覆盖行为（`vp env use`、`VITE_PLUS_NODE_VERSION`）。

## 延后 / 未来工作

`onFail` 会被解析、保留并校验（`vp env doctor` 会标记未知值），但本 PR 中**尚未实现**完整的行为矩阵。当前会与不会生效的内容如下：

| 字段             | 当前的 `onFail` 行为                                                                                                                                                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `runtime`        | 不生效。受管模式始终会解析并下载（等同于 `download`）；无论 `onFail` 是什么，失败都会报错。第 2.3 节的矩阵属于未来工作。                                                                                                               |
| `packageManager` | 仅在数组中没有任何条目命中受支持的包管理器时才生效：`ignore` / `warn` 会继续检测链，`error` / `download` 会失败。后续解析/下载失败时，不会再检查已选中（受支持）条目的 `onFail`。 |

延后行为按优先级排序如下：

1. **逐条目 `packageManager` 回退。** 按顺序尝试每个受支持的数组条目；当某个条目的范围无法解析，或其版本下载/安装失败时，应用该条目生效后的 `onFail`（`ignore` / `warn` 前进到下一个条目或继续检测链；`error` 失败）。在检查该条目的 `onFail` 之前，总会先尝试该受支持条目（即 `onFail` 不会预先跳过某个条目）。
2. **Runtime `onFail` 矩阵**（第 2.3 节）：在 `devEngines.runtime` 的受管模式和 system-first 模式下，以及在 shim 分发和 `vp env use` 中，区分 `ignore` / `warn` / `error` / `download`。

这两项都刻意与本 PR 分离：逐条目回退会把 `onFail` 贯穿到异步下载路径，而 runtime 矩阵会触及版本解析和 shim 分发的热路径。在它们落地之前，上面的文档仅描述已实现的子集。

## 兼容性影响摘要

| 场景                                                                  | 之前                                                      | 之后                                                         |
| --------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------ |
| 带有 `.node-version` 的项目                                            | `.node-version` 优先；pin 会更新它                        | 不变                                                         |
| 带有 `packageManager` 字段的项目                                       | 该字段优先；不自动写入                                   | 不变（若 devEngines 冲突，还会额外给出一致性警告）            |
| 带有 `devEngines.packageManager` + lockfile 的项目                    | devEngines 被忽略；自动 pin **注入** `packageManager`    | devEngines 驱动选择；不再注入字段                             |
| 只有 lockfile 的项目（两个字段都没有）                                 | 自动 pin 写入精确的 `packageManager`                     | 自动 pin 写入精确的 `devEngines.packageManager`               |
| 同时有 `engines.node` 和 `devEngines.runtime` 且二者不一致的项目      | `engines.node` 优先                                       | `devEngines.runtime` 优先；doctor 发出警告                    |
| 在有 `package.json` 但没有 `.node-version` 的目录里执行 `vp env pin` | 创建 `.node-version`                                      | 写入 `devEngines.runtime`                                     |
| `.nvmrc` / Volta pin 的 `vp migrate`                                   | 创建 `.node-version`                                      | 写入 `devEngines.runtime`（会把别名转换为 semver）            |

## 实现计划

### 阶段 1：共享解析与 JSON 编辑

1. 将 `crates/vite_shared/src/package_json.rs` 泛化为符合规范的 `DevEngineDependency` / `DevEngineField` / `OnFail` 类型；为 `DevEngines` 增加 `package_manager`；实现宽松解析规则；实现生效的 `onFail` 计算；为每种规范形态编写单元测试（单个、数组、缺失 version、缺失 onFail、格式错误的条目）。
2. 将保留格式的 package.json 编辑辅助工具添加到 `vite_shared`。

### 阶段 2：包管理器检测

1. 将 `devEngines.packageManager` 插入 `get_package_manager_type_and_version()`（替换 `crates/vite_install/src/package_manager.rs:288` 处的 TODO）；进行名称校验；处理数组；处理 `onFail`。
2. 针对已下载版本进行范围解析，并通过 npm 的精简元数据文档进行 registry 回退。
3. 当来源是 `devEngines.packageManager` 时抑制自动写入；当两个字段都不存在时，将自动 pin 重定向到 `devEngines.packageManager`。
4. 当 `packageManager` 和 `devEngines.packageManager` 不一致时给出一致性警告（先警告，后错误的过渡提示）。
5. 通过 NAPI 绑定和 `vp env --current --json` 暴露新的来源。

### 阶段 3：`vp env` 命令

1. `vp env pin` 的目标选择、`--target` 标志、值规则、同步提示（TTY）/ 警告（非交互式）；`vp env unpin` 对称地移除。
2. 调整 runtime 读取优先级顺序。
3. ~~shim 分发和 `vp env use` / system-first 路径中的 `onFail` 矩阵。~~ 延后：runtime `onFail` 已解析，但尚未生效（见 [延后 / 未来工作](#deferred--future-work)）。
4. 所有新的 `vp env doctor` 检查。

### 阶段 4：create / migrate

1. 模板化 `devEngines` 块（并保留现有的 `engines.node`，其保持不变）；重定向 `setPackageManager()`。
2. 将 `.nvmrc` / Volta 迁移到 `devEngines.runtime`，包括别名到 semver 的转换表。

### 阶段 5：文档和测试

1. 按需更新 `docs/guide/env.md`、`docs/guide/install.md`、`docs/config/*`。
2. ~~更新 [rfcs/package-manager-detection.md](./package-manager-detection.md)（将 `devEngines.packageManager` 从 Future Enhancements 移到算法中）以及 [rfcs/env-command.md](./env-command.md)（解析链）。~~ 已与本 RFC 一并完成，同时还包括 [rfcs/js-runtime.md](./js-runtime.md) 和 [rfcs/migration-command.md](./migration-command.md)。
3. 增加快照测试（本地和全局），覆盖：pin 到 devEngines、在已有 `.node-version` 的情况下 pin、从 devEngines 取消 pin、使用 `devEngines.packageManager` 进行安装（精确值、范围、数组、不支持的名称、与 `packageManager` 字段冲突）、doctor 冲突输出、create/migrate 输出。
4. 在 `package_manager.rs` 和 `package_json.rs` 现有测试套件旁增加 Rust 单元测试。

阶段 1 到 3 是核心；4 和 5 可以在后续 PR 中落地。

## 已解决的问题

RFC 评审中的决定（2026-06-04）：

| #   | 问题                                                             | 决定                                                                                                                                 |
| --- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `devEngines.runtime` 与 `engines.node` 的读取优先级              | 将 `devEngines.runtime` 提到 `engines.node` 之上，并随本 RFC 一起落地；doctor 会标记行为发生变化的项目                   |
| 2   | 当两个字段都不存在时，自动 pin 的目标和值                      | 写入 `devEngines.packageManager`，使用精确解析版本并设置 `onFail: "download"`                                               |
| 3   | 同时存在 `.node-version` 和 `devEngines.runtime` 时如何 pin   | 更新 `.node-version`；如果 devEngines 范围损坏，在交互式终端中提示同步，在非交互式环境中警告 |
| 4   | pin 覆盖标志                                                    | `--target node-version` / `--target dev-engines`；显式标志始终优先，即使另一个来源存在                                    |
| 5   | 不受支持的 `devEngines.packageManager` 名称                      | 由 `onFail` 驱动：`ignore` / `warn` 继续沿检测链向下；`error`（默认）和 `download` 以清晰消息失败                   |
| 6   | 模板化 `engines.node`                                           | 修订为：现有的 `engines.node` 在任何地方都不会被删除或修改；模板会保持其不变，并在其旁边添加 `devEngines`          |
| 7   | `.nvmrc` / Volta 的迁移目标                                     | `devEngines.runtime`；迁移时会将别名值转换为 semver（见第 5.2 节的转换表）                                                 |
| 8   | `packageManager` 与 `devEngines.packageManager` 冲突的严重级别 | 先发出警告，并提示在未来版本中会变成错误，然后再切换为硬错误                                                            |

## 参考资料

- 问题： [voidzero-dev/vite-plus#864](https://github.com/voidzero-dev/vite-plus/issues/864)（计划： [评论](https://github.com/voidzero-dev/vite-plus/issues/864#issuecomment-4582332165)，来自 @TheAlexLichter 的审查说明）
- 规范： [OpenJS devEngines 字段提案](https://github.com/openjs-foundation/package-metadata-interoperability-working-group/blob/main/devengines-field-proposal.md)，[讨论 #15](https://github.com/openjs-foundation/package-metadata-interoperability-working-group/issues/15)
- npm： [package.json devEngines 文档](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devengines)
- pnpm： [devEngines.runtime 支持](https://github.com/pnpm/pnpm/issues/8153)
- 相关 RFC： [package-manager-detection.md](./package-manager-detection.md)，[env-command.md](./env-command.md)，[js-runtime.md](./js-runtime.md)
