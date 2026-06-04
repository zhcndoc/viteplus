# RFC: Vite+ `vp pm stage` 命令

- Issue: [#1674](https://github.com/voidzero-dev/vite-plus/issues/1674)
- 状态：已在 [#1715](https://github.com/voidzero-dev/vite-plus/pull/1715) 中实现

## 摘要

为 `vp pm` 命令组添加 `vp pm stage`。分阶段发布是 npm 的
新安全工作流，它在上传包与将其公开之间插入一个审批步骤：包会先上传到一个暂存区（无需 2FA），然后由维护者稍后从受信任设备上批准或拒绝（2FA）。`vp pm
stage` 通过统一的 `vp` 接口暴露该工作流，并适配检测到的包管理器（pnpm / npm / yarn / bun）。

该特性以结构化子命令组的形式提供，与现有的
`vp pm dist-tag` / `vp pm owner` / `vp pm token` 子命令保持一致：

```bash
vp pm stage publish [TARBALL|FOLDER]   # 将包上传到暂存区（无需 2FA）
vp pm stage list [PACKAGE_SPEC]        # 列出已暂存的版本
vp pm stage view <STAGE_ID>            # 显示某个暂存版本的详情
vp pm stage download <STAGE_ID>        # 下载暂存的 tarball 以便检查
vp pm stage approve <STAGE_ID>         # 将暂存版本提升为正式版本（2FA）
vp pm stage reject <STAGE_ID>          # 丢弃暂存版本（2FA）
```

## 动机

npm 推出了 **分阶段发布**（npm CLI ≥ 11.15.0，Node ≥ 22.14.0），
作为防御供应链攻击的一种手段：CI 可以在不持有 2FA 凭据的情况下将构建产物上传到暂存区，而由人工稍后批准。pnpm 正在添加等效的 `pnpm stage` 命令，而 yarn berry 已经通过 `yarn npm publish --staged` + `yarn npm stage …` 暴露了这一能力。

由于 Vite+ 已经对发布相关的其他接口进行了统一（`vp pm publish`、`vp pm dist-tag`、`vp pm owner`、…），因此暂存工作流也应该能以同样的方式访问，而不是迫使用户退回到原生的 `pnpm`/`npm`/`yarn` 调用。Issue #1674 明确要求提供一个 `vp pm stage` 透传，并且“正确委托给已配置的包管理器”，同时保持与其余 `vp pm <subcommand>` 接口“一致”。

### 背景：分阶段发布如何工作

| 步骤       | 命令                                   | 2FA?   | 说明                                                                                   |
| ---------- | -------------------------------------- | ------ | -------------------------------------------------------------------------------------- |
| 1. 暂存    | `npm stage publish`                    | ❌ 否  | 将 tarball 上传到待处理的暂存区。适合 CI / 受信任的发布者（OIDC）。                  |
| 2. 审核    | `npm stage list` / `view` / `download` | ❌ 否  | 检查已暂存的内容（也可在 npmjs.com 的 “Staged Packages” 标签页中查看）。              |
| 3. 批准    | `npm stage approve <id>`               | ✅ 是  | 提升到正式仓库。                                                                      |
| 3'. 拒绝   | `npm stage reject <id>`                | ✅ 是  | 丢弃该暂存版本。                                                                      |

#### 最低版本要求

不同包管理器的最低版本要求不同（并且 npm 还额外受 Node.js 版本限制），这也是下面版本门控决策的一个关键输入。

| PM           | 分阶段发布所需最低版本                                                                    |
| ------------ | ------------------------------------------------------------------------------------------ |
| npm          | CLI ≥ 11.15.0 **且** Node ≥ 22.14.0                                                       |
| pnpm         | pnpm ≥ 11.3.0（`pnpm stage` 在 “Added in: v11.3.0” 中引入；未单独记录 Node 下限）         |
| yarn ≥ 2     | 通过 npm 插件（`yarn npm publish --staged`）；由注册表侧支持，未记录单独的 yarn 下限       |
| yarn 1 / bun | 不支持                                                                                     |

参考资料：

- npm: <https://docs.npmjs.com/staged-publishing>
- pnpm: <https://pnpm.io/cli/stage>（在 pnpm 11.3 中加入，参见 <https://pnpm.io/blog/releases/11.3>）
- yarn（berry）: <https://yarnpkg.com/cli/npm/publish>（`--staged` 标志）以及 `yarn npm stage …`
- bun: 目前不支持分阶段发布（只有 `bun publish`）

## 提议的解决方案

### 命令面

`vp pm stage` 是一个子命令组；必须指定子命令（仅执行 `vp pm
stage` 会打印帮助信息，与 `vp pm dist-tag` 一致）。

```bash
vp pm stage <SUBCOMMAND>

Subcommands:
  publish    将包暂存以便发布（无需 2FA）
  list       列出已暂存的版本（别名：ls）
  view       显示某个暂存版本的详情
  download   下载暂存的 tarball 以便检查
  approve    将暂存版本提升到正式仓库（2FA）
  reject     丢弃暂存版本（2FA）
```

**示例：**

```bash
# 暂存当前包（适合 CI，无需 2FA）
vp pm stage publish
vp pm stage publish --tag next --access public

# 暂存一个预构建的 tarball
vp pm stage publish ./my-pkg-1.2.3.tgz

# 暂存每个可发布的 workspace 包（pnpm）
vp pm stage publish -r
vp pm stage publish --filter "@scope/*"

# 查看哪些内容已暂存
vp pm stage list
vp pm stage list my-pkg --json
vp pm stage view 1a2b3c4d
vp pm stage download 1a2b3c4d

# 批准 / 拒绝（需要在受信任设备上进行 2FA）
vp pm stage approve 1a2b3c4d
vp pm stage approve 1a2b3c4d --otp 123456
vp pm stage reject 1a2b3c4d
```

### 标志

遵循现有的 `vp pm` 约定，只建模通用、稳定的标志；其他内容通过尾随的 `-- <args>` 逃逸通道传递（`#[arg(last = true, allow_hyphen_values = true)]`）。

| 子命令     | 位置参数              | 已建模标志                                                                                                                                      |
| ---------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `publish`  | `[TARBALL\|FOLDER]`   | `--tag`、`--access <public\|restricted>`、`--otp`、`--dry-run`、`--json`、`-r/--recursive`、`--filter <pattern>`、`--provenance`、`--registry` |
| `list`     | `[PACKAGE_SPEC]`      | `--json`、`--registry`                                                                                                                           |
| `view`     | `<STAGE_ID>`          | `--json`、`--registry`                                                                                                                           |
| `download` | `<STAGE_ID>`          | `--registry`                                                                                                                                     |
| `approve`  | `<STAGE_ID>`          | `--otp`、`--registry`                                                                                                                            |
| `reject`   | `<STAGE_ID>`          | `--otp`、`--registry`                                                                                                                            |

`stage publish` 有意复用现有 `vp pm publish` 命令的选项词汇，这样两者的表现会保持一致。

### 命令映射

这是本 RFC 的核心。映射取决于每个包管理器实际支持什么。

| `vp pm stage …` | pnpm                       | npm                       | yarn ≥ 2 (berry)               | yarn 1 (classic)               | bun                            |
| --------------- | -------------------------- | ------------------------- | ------------------------------ | ------------------------------ | ------------------------------ |
| `publish [t]`   | `pnpm stage publish [t]`   | `npm stage publish [t]`   | `yarn npm publish --staged`    | ⚠️ → `npm stage publish`       | ⚠️ → `npm stage publish`       |
| `list [spec]`   | `pnpm stage list [spec]`   | `npm stage list [spec]`   | `yarn npm stage list [spec]`   | ⚠️ → `npm stage list`          | ⚠️ → `npm stage list`          |
| `view <id>`     | `pnpm stage view <id>`     | `npm stage view <id>`     | ⚠️ → `npm stage view <id>`     | ⚠️ → `npm stage view <id>`     | ⚠️ → `npm stage view <id>`     |
| `download <id>` | `pnpm stage download <id>` | `npm stage download <id>` | ⚠️ → `npm stage download <id>` | ⚠️ → `npm stage download <id>` | ⚠️ → `npm stage download <id>` |
| `approve <id>`  | `pnpm stage approve <id>`  | `npm stage approve <id>`  | `yarn npm stage approve <id>`  | ⚠️ → `npm stage approve`       | ⚠️ → `npm stage approve`       |
| `reject <id>`   | `pnpm stage reject <id>`   | `npm stage reject <id>`   | `yarn npm stage reject <id>`   | ⚠️ → `npm stage reject`        | ⚠️ → `npm stage reject`        |

⚠️ = 先打印一条 `output::warn` 信息，然后回退到 `npm stage …`（与现有的
`vp pm dist-tag`、`vp pm fund`、`vp pm token` 在仅支持注册表功能时回退到 npm 的方式一致）。

### ⚠️ 关键：`yarn stage` 不是分阶段发布

Yarn berry 内置了一个字面上叫 **`yarn stage`** 的命令（来自
`plugin-stage`），但它与 npm 分阶段发布 **完全无关**：它会将与 Yarn 相关的文件（`package.json`、`.yarnrc.yml`、链接器输出）暂存到你的 **git/mercurial** 暂存区，并且可以自动创建一个 release 提交
（<https://yarnpkg.com/cli/stage>）。

> `vp pm stage` **绝不能** 解析到 `yarn stage`。那样会触碰用户的 VCS 索引 / 创建提交，而不是执行发布。

对于 yarn，npm 分阶段发布是通过 **npm 插件** 到达的：

- 暂存：`yarn npm publish --staged`
- 管理：`yarn npm stage list` / `yarn npm stage approve` / `yarn npm stage reject`

yarn berry 在 `yarn npm stage` 下只暴露 `list` / `approve` / `reject`
（没有 `view` / `download`），因此这两个命令会回退到 `npm stage …`。

### 按包管理器的行为

#### pnpm

直接透传：`pnpm stage <sub> [args]`。pnpm 镜像了 npm 的子命令集合
（`publish`、`list`、`view`、`download`、`approve`、`reject`），并为 monorepo 增加了
`-r/--filter`。`--otp` 可用于 `approve`/`reject`。

#### npm

直接透传：`npm stage <sub> [args]`。这是规范实现；其他包管理器的缺失能力都会回退到这里。

#### yarn ≥ 2 (berry)

- `publish` → `yarn npm publish --staged`（并转发目标目录/tarball 以及
  `--tag`/`--access`/`--otp`/`--provenance`）。
- `list` / `approve` / `reject` → `yarn npm stage <sub>`。
- `view` / `download` → yarn 不支持；发出警告并回退到
  `npm stage <sub>`（注册表侧操作，数据相同）。

#### yarn 1 (classic)

不支持分阶段发布。yarn classic 在本仓库中已经将发布委托给 npm（`publish.rs`），因此所有 `stage` 子命令都会先警告，然后回退到
`npm stage <sub>`。

#### bun

不支持分阶段发布，也没有 `bun stage`。发出警告并回退到 `npm stage <sub>`，
这与 bun 上的 `vp pm dist-tag`/`fund`/`token` 保持一致。

## 实现架构

当前代码位于 `crates/vite_pm_cli/`（clap 表层 + 分发）和 `crates/vite_install/src/commands/`（按命令的解析器）中。`PackageManagerCommand`/`PmCommands` 枚举同时被全局 CLI 和本地 NAPI 绑定通过 `#[command(flatten)]` 共享，因此添加一个变体会自动同时暴露到两个 CLI 中。

### 1. Clap 表层：`crates/vite_pm_cli/src/cli.rs`

在 `PmCommands` 中添加一个 `Stage` 变体，以及一个 `StageCommands` 子命令枚举（参照现有的 `DistTagCommands`）：

```rust
// 在 enum PmCommands 中
/// 为发布准备一个包（npm staged publishing 工作流）
#[command(subcommand)]
Stage(StageCommands),
```

```rust
/// staged-publishing 子命令。
#[derive(Subcommand, Debug, Clone)]
pub enum StageCommands {
    /// 为发布准备一个包（无需 2FA）
    Publish {
        /// 要准备的 tarball 或文件夹
        #[arg(value_name = "TARBALL|FOLDER")]
        target: Option<String>,
        #[arg(long)] tag: Option<String>,
        #[arg(long)] access: Option<String>,
        #[arg(long, value_name = "OTP")] otp: Option<String>,
        #[arg(long)] dry_run: bool,
        #[arg(long)] json: bool,
        #[arg(short = 'r', long)] recursive: bool,
        #[arg(long, value_name = "PATTERN")] filter: Option<Vec<String>>,
        #[arg(long)] provenance: bool,
        #[arg(long, value_name = "URL")] registry: Option<String>,
        #[arg(last = true, allow_hyphen_values = true)] pass_through_args: Option<Vec<String>>,
    },
    /// 列出已暂存的版本
    #[command(visible_alias = "ls")]
    List {
        package: Option<String>,
        #[arg(long)] json: bool,
        #[arg(long, value_name = "URL")] registry: Option<String>,
        #[arg(last = true, allow_hyphen_values = true)] pass_through_args: Option<Vec<String>>,
    },
    /// 显示某个已暂存版本的详细信息
    View {
        stage_id: String,
        #[arg(long)] json: bool,
        #[arg(long, value_name = "URL")] registry: Option<String>,
        #[arg(last = true, allow_hyphen_values = true)] pass_through_args: Option<Vec<String>>,
    },
    /// 下载已暂存的 tarball 供检查
    Download {
        stage_id: String,
        #[arg(long, value_name = "URL")] registry: Option<String>,
        #[arg(last = true, allow_hyphen_values = true)] pass_through_args: Option<Vec<String>>,
    },
    /// 将已暂存版本晋升到正式 registry（2FA）
    Approve {
        stage_id: String,
        #[arg(long, value_name = "OTP")] otp: Option<String>,
        #[arg(long, value_name = "URL")] registry: Option<String>,
        #[arg(last = true, allow_hyphen_values = true)] pass_through_args: Option<Vec<String>>,
    },
    /// 丢弃已暂存版本（2FA）
    Reject {
        stage_id: String,
        #[arg(long, value_name = "OTP")] otp: Option<String>,
        #[arg(long, value_name = "URL")] registry: Option<String>,
        #[arg(last = true, allow_hyphen_values = true)] pass_through_args: Option<Vec<String>>,
    },
}
```

将 `PmCommands::is_quiet_or_machine_readable` 扩展为：对 `stage publish`/`list`/`view` 上的 `--json` 禁止装饰性输出：

```rust
Self::Stage(sub) => sub.is_quiet_or_machine_readable(),
```

并补充一个对应的 `impl StageCommands`，在 `Publish`/`List`/`View` 时返回 `*json`。

### 2. 解析器：`crates/vite_install/src/commands/stage.rs`（新增）

参照 `dist_tag.rs`：一个拥有所有权的 `StageSubcommand` 枚举、一个 `StageCommandOptions` 结构体，以及 `resolve_stage_command` / `run_stage_command`：

```rust
pub enum StageSubcommand {
    Publish { target: Option<String>, tag: Option<String>, access: Option<String>,
              otp: Option<String>, dry_run: bool, json: bool, recursive: bool,
              filters: Option<Vec<String>>, provenance: bool },
    List { package: Option<String>, json: bool },
    View { stage_id: String, json: bool },
    Download { stage_id: String },
    Approve { stage_id: String, otp: Option<String> },
    Reject { stage_id: String, otp: Option<String> },
}

pub struct StageCommandOptions<'a> {
    pub subcommand: StageSubcommand,
    pub registry: Option<&'a str>,
    pub pass_through_args: Option<&'a [String]>,
}

impl PackageManager {
    pub async fn run_stage_command(&self, options: &StageCommandOptions<'_>,
        cwd: impl AsRef<AbsolutePath>) -> Result<ExitStatus, Error> { /* run_command */ }

    pub fn resolve_stage_command(&self, options: &StageCommandOptions) -> ResolveCommandResult {
        // match self.client {
        //   Pnpm                       => bin "pnpm", ["stage", <sub>, ...]
        //   Npm                        => bin "npm",  ["stage", <sub>, ...]
        //   Yarn (berry) Publish       => bin "yarn", ["npm", "publish", "--staged", ...]
        //   Yarn (berry) List/Approve/Reject => bin "yarn", ["npm", "stage", <sub>, ...]
        //   Yarn (berry) View/Download => warn + bin "npm", ["stage", <sub>, ...]
        //   Yarn (classic) / Bun       => warn + bin "npm", ["stage", <sub>, ...]
        // }
    }
}
```

在 `crates/vite_install/src/commands/mod.rs` 中注册该模块：

```rust
pub mod stage;
```

### 3. 处理器：`crates/vite_pm_cli/src/handlers.rs`

导入 `stage::{StageCommandOptions, StageSubcommand}`，并在 `run_pm_subcommand` 中添加一个 `PmCommands::Stage` 分支，将 clap 的 `StageCommands` 转换为拥有所有权的 `StageSubcommand`（形状与现有的 `DistTag`/`Owner`/`Token` 分支一致）。

分发目标选择（`run_pm_subcommand` 顶部的 `needs_project` 块）：只有 `stage publish` 需要读取本地包并且需要真实项目；`list`/`view`/`download`/`approve`/`reject` 只依赖 registry，可以在 `build_package_manager_or_npm_default` 上运行（当没有 `package.json` 时回退到 npm），与今天的 `vp pm view` / `vp pm dist-tag` 完全一致：

```rust
let needs_project = matches!(command,
    // ……现有项……
    | PmCommands::Stage(StageCommands::Publish { .. })
);
```

`dispatch.rs` 无需修改；`PackageManagerCommand::Pm` 已经会转发到 `handlers::run_pm_subcommand`。

### 4. 接线总览

```
vp pm stage <sub>
  └─ cli.rs            PmCommands::Stage(StageCommands)            （共享，两种 CLI 都会用到）
       └─ handlers.rs  run_pm_subcommand → StageCommandOptions
            └─ stage.rs resolve_stage_command → run_command(<pm>, args)
```

## 设计决策

1. **使用结构化子命令，而不是自由字符串透传。** `vp pm cache` 使用自由的 `subcommand: String`，但发布相关的命令（`dist-tag`、`owner`、`token`、`config`）都建模成了带类型的子命令枚举。`stage` 具有一个规模较小、定义明确且稳定的子命令集合，因此使用类型化建模可以获得正确的 `--help`、Tab 补全以及每个子命令的独立标志，同时也能与周边命令保持一致。（更薄的透传是备选方案 1。）

2. **yarn 使用其原生 npm 插件，而不是 `yarn stage`。** 如上所述，`yarn stage` 是 git staging。yarn berry 真正的 staged-publishing 路径是 `yarn npm publish --staged` + `yarn npm stage …`。这样能尊重项目的 yarn 认证/registry 配置（`.yarnrc.yml`），而不是假设 npm 已经完成认证。（另见开放问题 1，讨论始终委派给 npm 的替代方案，这会与 `publish.rs` 保持一致。）

3. **bun 和 yarn-classic 回退到带警告的 `npm stage`。** staged publishing 是 registry 侧特性；npm 是参考客户端，而仓库里已经把仅 registry 侧的功能（`dist-tag`、`fund`、`token`、`search`、`ping`）路由到 npm。回退可以让工作流仍然可用，而不是直接硬失败。

4. **vp 中不做版本门控。** 各工具的最低版本不同：npm 需要 CLI ≥ 11.15.0 **且** Node ≥ 22.14.0，pnpm 需要 ≥ 11.3.0，yarn 通过其 npm 插件路由，而 npm 还额外受 Node 门控。与其在该特性稳定过程中跨四个包管理器追踪并维护这些门槛，不如直接透传，让底层工具自行输出权威的、与版本相关的错误。（`approve-builds` 确实做了门控，但那个门控是为了防护一种破坏性 flag 形态；staging 太新、变化太快，不适合固定门槛。见开放问题 2。）

5. **不缓存。** staging 会修改 registry 状态或查询实时状态；结果绝不能被缓存。

## 开放问题（请在评审中给出意见）

1. **yarn 策略：原生插件 vs. npm 委派。**
   - **（A）推荐：** 映射到 `yarn npm publish --staged` + `yarn npm stage …`
     （使用 yarn 自己的认证/registry；对 yarn 项目来说最正确）。
   - **（B）更简单/更一致：** 将所有 yarn `stage` 都委派给 `npm stage …`，
     与现有的 `publish.rs`（yarn → npm）保持一致。复杂度更低，但在由 yarn 管理的项目中，`npm` 可能没有完成认证。

2. **版本门控。** 推荐：不做门控（直接透传，让 PM 报错），
   尤其是因为不同工具的最低版本不同（npm ≥ 11.15.0 + Node ≥ 22.14.0；pnpm
   ≥ 11.3.0）。你是否希望改为友好的前置检查？

3. **yarn 的 `view` / `download`。** yarn berry 没有对应功能。推荐：
   发出警告并回退到 `npm stage view/download`。另一种方案：视为不支持并报错。

4. **`--registry` 建模。** 是否值得作为一等 flag 提供，还是仅依赖 `-- --registry <url>` 透传？（推荐：建模，因为 npm 回退路径会受益于显式传递。）

## 错误处理

```bash
# 底层工具版本过旧（透传会暴露真实错误）
$ vp pm stage publish
npm error staged publishing requires npm ≥ 11.15.0
# vp 以非零状态退出，并展示工具自己的消息

# bun / yarn-classic
$ vp pm stage approve 1a2b3c4d
warning: bun does not support staged publishing, falling back to npm stage
…

# 缺少必需的 stage id
$ vp pm stage approve
error: 未提供以下必需参数：
  <STAGE_ID>
```

## 测试策略

### 单元测试（`crates/vite_install/src/commands/stage.rs`）

参照 `dist_tag.rs` / `publish.rs` 的 mock-PM 测试，针对每个（PM，子命令）组合断言 `bin_path` + `args`：

```rust
#[test] fn pnpm_stage_publish()    // pnpm, ["stage", "publish"]
#[test] fn npm_stage_publish()     // npm,  ["stage", "publish"]
#[test] fn yarn_berry_stage_publish_uses_npm_plugin() // yarn, ["npm","publish","--staged"]
#[test] fn yarn_berry_stage_list()                    // yarn, ["npm","stage","list"]
#[test] fn yarn_berry_stage_view_falls_back_to_npm()  // npm,  ["stage","view","<id>"]
#[test] fn yarn1_stage_falls_back_to_npm()            // npm,  ["stage", ...]
#[test] fn bun_stage_falls_back_to_npm()              // npm,  ["stage", ...]
#[test] fn pnpm_stage_publish_recursive_filter()      // ["--filter","x","stage","publish"] ordering
#[test] fn stage_approve_otp()                        // ["stage","approve","<id>","--otp","123456"]
```

另外在 `cli.rs` 中添加一个 clap 解析测试（例如，`stage approve` 没有 id 时应报 `MissingRequiredArgument`）。

### Snap 测试

在现有的 `command-publish-*` / `command-pm-*` 旁边添加 fixture：

- 全局：`packages/cli/snap-tests-global/command-pm-stage-pnpm10`,
  `…-npm11`, `…-yarn4`, `…-bun`（断言每个 PM 对应解析后的命令行）。
- 本地：`packages/cli/snap-tests/command-pm-stage-pnpm10`。
- `vp pm stage --help` / `vp pm --help` 的快照会变化，因此需要重新生成并检查 diff（即使输出变化，snap 测试也可能通过）。

运行：`pnpm -F vite-plus snap-test-local command-pm-stage` 和 `pnpm -F vite-plus snap-test-global command-pm-stage`，然后查看 `git diff`。

## 文档

- `docs/guide/install.md`：`vp pm <command>` 的“Advanced”部分列出
  了转发的命令；添加 `vp pm stage`，附上一段简短的分阶段发布说明，并
  指向 npm 文档。
- 在相关位置注明 yarn 的注意事项（`vp pm stage` ≠ `yarn stage`）。
- 重新生成任何受影响的帮助快照（`command-pm-*`）。

## 兼容性矩阵

| 子命令     | pnpm                    | npm                    | yarn ≥ 2                       | yarn 1   | bun      | 备注                   |
| ---------- | ----------------------- | ---------------------- | ------------------------------ | -------- | -------- | ---------------------- |
| `publish`  | ✅ `pnpm stage publish` | ✅ `npm stage publish` | ✅ `yarn npm publish --staged` | ⚠️ → npm | ⚠️ → npm | 无 2FA                 |
| `list`     | ✅                      | ✅                     | ✅ `yarn npm stage list`       | ⚠️ → npm | ⚠️ → npm |                        |
| `view`     | ✅                      | ✅                     | ⚠️ → npm                       | ⚠️ → npm | ⚠️ → npm | yarn 没有 `view`      |
| `download` | ✅                      | ✅                     | ⚠️ → npm                       | ⚠️ → npm | ⚠️ → npm | yarn 没有 `download`  |
| `approve`  | ✅                      | ✅                     | ✅ `yarn npm stage approve`    | ⚠️ → npm | ⚠️ → npm | 2FA                    |
| `reject`   | ✅                      | ✅                     | ✅ `yarn npm stage reject`     | ⚠️ → npm | ⚠️ → npm | 2FA                    |

✅ 原生 · ⚠️ 警告并回退到 `npm stage …`

## 备选方案

1. **薄封装的自由字符串透传**（`Stage { subcommand: String, args }`，类似
   `vp pm cache`）。最容易添加，但会丢失类型化的 `--help`/标志位，并使
   yarn 差异（`yarn npm publish --staged`）无法清晰表达。
   因与 `dist-tag` 保持一致，改为类型化子命令而被否决。

2. **始终将 yarn 委托给 `npm stage`**（与 `publish.rs` 一致）。更简单，但
   会忽略 yarn 的原生插件以及项目的 yarn 认证/注册表配置。
   作为开放问题 1 记录，而不是单方面决定。

3. **在 vp 中硬编码版本门控。** 被否决：对于一个快速演进的特性来说，
   需要在 4 个 PM 之间进行高维护成本同步；底层工具自身的错误更准确。

4. **顶层 `vp stage`**，而不是 `vp pm stage`。被否决：staging 是一个
   包管理器透传功能，应该与其发布相关的兄弟命令一起归入 `vp pm` 组。

## 向后兼容性

仅追加：新增一个 `vp pm` 子命令。不会更改任何现有命令、配置或
缓存行为。
