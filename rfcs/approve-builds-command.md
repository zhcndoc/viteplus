# RFC: Vite+ 审批构建命令（`vp pm approve-builds`）

## 摘要

在 `vp pm` 命令组下新增 `vp pm approve-builds` 子命令，以提供一个统一的、跨包管理器的接口，用于批准（或拒绝）依赖生命周期脚本（`preinstall` / `install` / `postinstall`）。该设计与 [`pnpm approve-builds`](https://pnpm.io/cli/approve-builds) 保持一一对应，并适配 [`bun pm trust`](https://bun.com/docs/pm/cli/pm#trust)；对于 npm 和 yarn（它们没有等价的一等公民命令），则采用“警告并无操作”的回退策略。

这是 [pm-command-group.md](./pm-command-group.md) 的一个子 RFC，并扩展了 `vp pm` 子命令列表。

## 动机

现代包管理器默认采用 **按需启用生命周期脚本执行** 的机制，以缓解供应链攻击：

- **pnpm ≥ v10** 默认忽略所有安装脚本，并要求通过 `pnpm-workspace.yaml` 中的 `allowBuilds` 映射显式批准。
- **bun** 会阻止任何未列入 `trustedDependencies`（在 `package.json` 中）或不在 bun 默认受信任列表中的依赖执行生命周期脚本。
- **npm** 仍然默认执行生命周期脚本，但可以在 `.npmrc` 中通过 `ignore-scripts=true` 关闭。
- **yarn (Berry)** 默认阻止第三方构建脚本（`enableScripts` 为 `false`）；按包启用则通过 `package.json` 中的 `dependenciesMeta.<pkg>.built: true` 完成。

这就形成了两条并行工作流，处理的是**同一个概念任务**——“我信任 `esbuild` 执行其 post-install 构建”：

```bash
# pnpm
pnpm approve-builds                       # 交互式
pnpm approve-builds esbuild fsevents      # 按名称
pnpm approve-builds esbuild !core-js      # 批准 esbuild，拒绝 core-js
pnpm approve-builds --all                 # 批准所有待处理项

# bun
bun pm trust esbuild                      # 信任一个包
bun pm trust --all                        # 信任所有待处理项

# npm / yarn
#（没有等价命令；用户必须手动编辑 package.json 或配置）
```

### 痛点

1. **概念分歧**：pnpm 将批准信息存储在 `pnpm-workspace.yaml`（`allowBuilds:`）中，bun 将其存储在 `package.json`（`trustedDependencies:`）中。两者语义相似，但位于不同文件且结构不同。
2. **模型不对称**：pnpm 同时支持 _允许_ 和 _拒绝_（通过 `!pkg`），而 bun 只支持 _信任_（拒绝是默认状态）。
3. **CI 可移植性**：如今，若一个 monorepo 在 pnpm 与 bun 之间迁移，所有构建批准自动化都必须重写。

### 拟议方案

一个统一的 Vite+ 子命令路由到基础包管理器的惯用命令：

```bash
# 适用于所有包管理器
vp pm approve-builds                          # 交互式提示（pnpm）/ 警告（bun, npm, yarn）
vp pm approve-builds esbuild fsevents         # 批准列出的包
vp pm approve-builds esbuild !core-js         # 批准 esbuild，拒绝 core-js（仅 pnpm）
vp pm approve-builds --all                    # 批准所有待处理包
```

## 拟议方案

### 命令语法

```bash
vp pm approve-builds [PACKAGES...] [OPTIONS]
```

**位置参数：**

- `PACKAGES...`：一个或多个要批准的包名。
  - 以前缀 `!` 表示拒绝（`!core-js`）——仅 pnpm 支持；对于 bun，会打印警告，说明该模型不支持 denylist，并跳过被拒绝的条目。
  - 若省略所有位置参数（且不使用 `--all`），pnpm 会进入**交互模式**；bun 没有交互式选择器，因此我们会打印一条 `note`，要求用户显式传入包名。

**选项：**

- `--all`：批准当前所有待审批的包。映射到 `pnpm approve-builds --all`（pnpm v10.32.0 新增）以及 `bun pm trust --all`。

（故意与 pnpm 的文档表面保持一致。`pnpm approve-builds --global` 已在 pnpm v11.0.0 中移除，因此我们不暴露 `-g/--global`。其他交互细节——列出待处理包、显示默认受信任列表、CI 确认门控——都推迟到后续 RFC；见 [未来增强](#future-enhancements)。）

### 子命令行为

#### 1. 交互模式

```bash
$ vp pm approve-builds
Detected package manager: pnpm@10.32.0
Running: pnpm approve-builds

? Choose which packages to build (Press <space> to select, <a> to toggle all, <i> to invert selection)
 ◯ @biomejs/biome
 ◯ esbuild
 ◯ fsevents
 ◯ sharp
```

- **pnpm**：以交互方式转发到 `pnpm approve-builds`（由 pnpm 提供 TUI）。
- **bun**：bun 对 `bun pm trust` 没有交互式选择器。Vite+ 会打印：

  ```
  note  bun pm trust requires package names. Run `bun pm untrusted` to see
        which packages are pending, then pass them explicitly:
          vp pm approve-builds <pkg> [<pkg>...]
          vp pm approve-builds --all
  ```

  退出码 0。

- **npm**：打印警告并以 0 退出（无操作）：

  ```
  warn  npm runs lifecycle scripts by default. To restrict them, set
        `ignore-scripts=true` in .npmrc and rebuild approved packages with
        `vp pm rebuild <package>`.
  ```

- **yarn**：打印警告并以 0 退出（无操作）：

  ```
  warn  yarn does not run third-party build scripts by default. To allow a
        package, set `dependenciesMeta["<package>"].built: true` in package.json.
  ```

#### 2. 直接批准

```bash
$ vp pm approve-builds esbuild fsevents
Detected package manager: pnpm@10.32.0
Running: pnpm approve-builds esbuild fsevents
✔ esbuild approved
✔ fsevents approved
```

- **pnpm**：直接透传；pnpm 会更新 `pnpm-workspace.yaml` 中的 `allowBuilds`。
- **bun**：调用 `bun pm trust esbuild fsevents`；bun 会将 `trustedDependencies` 追加到 `package.json`。
- **npm / yarn**：打印上面所示的警告并以 0 退出。

#### 3. 拒绝语法（`!pkg`）

```bash
$ vp pm approve-builds esbuild !core-js
Detected package manager: pnpm@10.32.0
Running: pnpm approve-builds esbuild !core-js
✔ esbuild approved
✗ core-js denied
```

- **pnpm**：直接透传（原生语法）。
- **bun**：Vite+ 会打印：

  ```
  warn  bun does not support denylisting build scripts. Packages outside
        `trustedDependencies` in package.json` are already denied by default.
        Skipping: core-js
  ```

  然后将非拒绝的普通位置参数（`esbuild`）转发给 `bun pm trust`。

- **npm / yarn**：同上警告；无操作。

#### 4. `--all`

```bash
$ vp pm approve-builds --all
Detected package manager: bun@1.3.0
Running: bun pm trust --all
✔ Trusted 4 packages
```

- **pnpm** ≥ v10.32.0：转发到 `pnpm approve-builds --all`。
- **pnpm** < v10.32.0：报错并给出用法提示，要求用户升级 pnpm 或显式列出包。
- **bun**：转发到 `bun pm trust --all`。
- **npm / yarn**：同上警告；无操作。

### 命令映射

**pnpm 参考：**

- https://pnpm.io/cli/approve-builds
- https://pnpm.io/settings#allowbuilds

**bun 参考：**

- https://bun.com/docs/pm/cli/pm#trust

**npm 参考：**

- 没有等价命令。最接近的配置项：[`ignore-scripts`](https://docs.npmjs.com/cli/v11/using-npm/config#ignore-scripts) 和 [`npm rebuild`](https://docs.npmjs.com/cli/v11/commands/npm-rebuild)。

**yarn 参考：**

- 没有等价命令。yarn@2+ 默认已阻止第三方构建脚本（[`enableScripts`](https://yarnpkg.com/configuration/yarnrc#enableScripts) 默认为 `false`）；按包启用通过 `package.json` 中的 [`dependenciesMeta.<pkg>.built`](https://yarnpkg.com/configuration/manifest#dependenciesMeta) 完成。

| Vite+ 标志                    | pnpm                                     | npm        | yarn@1     | yarn@2+    | bun                         | 说明                            |
| ----------------------------- | ---------------------------------------- | ---------- | ---------- | ---------- | --------------------------- | ------------------------------- |
| `vp pm approve-builds`        | `pnpm approve-builds`                    | N/A（警告） | N/A（警告） | N/A（警告） | N/A（提示）                  | 交互式提示（仅 pnpm）            |
| `vp pm approve-builds <pkg>`  | `pnpm approve-builds <pkg>`              | N/A（警告） | N/A（警告） | N/A（警告） | `bun pm trust <pkg>`        | 批准指定包                      |
| `vp pm approve-builds !<pkg>` | `pnpm approve-builds !<pkg>`             | N/A（警告） | N/A（警告） | N/A（警告） | N/A（警告——模型不匹配）     | 拒绝指定包（仅 pnpm）           |
| `--all`                       | `pnpm approve-builds --all`（≥ v10.32.0） | N/A（警告） | N/A（警告） | N/A（警告） | `bun pm trust --all`        | 批准所有待处理包               |

**说明：**

- **`!pkg` 拒绝语法仅适用于 pnpm。** 对于 bun，会以警告拒绝该语法，并明确指出受影响的位置参数名（这样用户能注意到，而不是悄悄得到一个部分批准的结果）。
- **npm 和 yarn 从不拥有 `approve-builds` 命令。** Vite+ 会打印一行 `warn` 并以 0 退出。对于 npm（默认执行脚本），警告会指向 `ignore-scripts`。对于 yarn（默认阻止第三方脚本），警告会指向 `dependenciesMeta.<pkg>.built`。我们刻意以 0 退出（而不是非 0），这样在异构环境中机会式运行 `vp pm approve-builds` 的 monorepo 脚本不会失败。
- **bun 的无参数模式** 也会以 0 退出并打印 `note`（因为 `bun pm trust` 需要包名；没有可转发的交互式选择器）。
- **配置存储不同：** pnpm 将内容写入 `pnpm-workspace.yaml` 的 `allowBuilds:` 下；bun 将内容写入 `package.json` 的 `trustedDependencies: []` 下。Vite+ 不会统一存储位置——各个 PM 都由自己维护状态。（见 [设计决策 §2](#2-do-not-normalize-storage)。）

### 实现架构

#### 1. 命令结构

**文件**：`crates/vite_task/src/lib.rs`

在 `PmCommands` 下新增一个变体：

```rust
#[derive(Subcommand, Debug)]
pub enum PmCommands {
    // ... existing subcommands

    /// 批准依赖生命周期脚本（install/postinstall）运行
    ApproveBuilds {
        /// 要批准的包。以前缀 `!` 表示拒绝（仅 pnpm）。
        /// 省略则进入交互模式（仅 pnpm）。
        packages: Vec<String>,

        /// 批准当前所有待处理包
        #[arg(long)]
        all: bool,
    },
}
```

#### 2. 包管理器适配器

**文件**：`crates/vite_package_manager/src/commands/approve_builds.rs`（新文件）

```rust
use std::process::ExitStatus;

use vite_error::Error;
use vite_path::AbsolutePath;
use vite_shared::output::{note, warn};

use crate::package_manager::{PackageManager, PackageManagerType};

pub struct ApproveBuildsOptions<'a> {
    pub packages: &'a [String],
    pub all: bool,
}

impl PackageManager {
    /// 批准依赖生命周期脚本。
    pub async fn run_approve_builds(
        &self,
        opts: ApproveBuildsOptions<'_>,
        cwd: impl AsRef<AbsolutePath>,
    ) -> Result<ExitStatus, Error> {
        match self.client {
            PackageManagerType::Pnpm => self.pnpm_approve_builds(opts, cwd).await,
            PackageManagerType::Bun => self.bun_approve_builds(opts, cwd).await,
            PackageManagerType::Npm => {
                warn(
                    "npm runs lifecycle scripts by default. To restrict them, set \
                     `ignore-scripts=true` in .npmrc and rebuild approved packages with \
                     `vp pm rebuild <package>`.",
                );
                Ok(ExitStatus::default()) // exit 0 — no-op
            }
            PackageManagerType::Yarn => {
                note(
                    "yarn does not run third-party build scripts by default. To allow a \
                     package, set `dependenciesMeta[\"<package>\"].built: true` in package.json.",
                );
                Ok(ExitStatus::default()) // exit 0 — no-op
            }
        }
    }

    async fn pnpm_approve_builds(
        &self,
        opts: ApproveBuildsOptions<'_>,
        cwd: impl AsRef<AbsolutePath>,
    ) -> Result<ExitStatus, Error> {
        if opts.all && self.version_lt("10.32.0") {
            return Err(Error::Usage(
                "`--all` requires pnpm ≥ 10.32.0. Upgrade pnpm or pass package names explicitly."
                    .into(),
            ));
        }

        let mut args = vec!["approve-builds".to_string()];
        if opts.all {
            args.push("--all".into());
        }
        args.extend(opts.packages.iter().cloned());
        self.run_raw("pnpm", &args, cwd).await
    }

    async fn bun_approve_builds(
        &self,
        opts: ApproveBuildsOptions<'_>,
        cwd: impl AsRef<AbsolutePath>,
    ) -> Result<ExitStatus, Error> {
        // 拒绝 `!pkg` 语法，并给出清晰的警告。
        let (denies, approves): (Vec<&String>, Vec<&String>) =
            opts.packages.iter().partition(|p| p.starts_with('!'));
        if !denies.is_empty() {
            let names: Vec<String> =
                denies.iter().map(|p| p.trim_start_matches('!').to_string()).collect();
            warn(&format!(
                "bun does not support denylisting build scripts. Packages outside\n  \
                 `trustedDependencies` in package.json are already denied by default.\n  \
                 Skipping: {}",
                names.join(", ")
            ));
        }

        // 无参数模式：bun 没有交互式选择器。
        if approves.is_empty() && !opts.all {
            note(
                "bun pm trust requires package names. Run `bun pm untrusted` to see\n  \
                 which packages are pending, then pass them explicitly:\n    \
                 vp pm approve-builds <pkg> [<pkg>...]\n    \
                 vp pm approve-builds --all",
            );
            return Ok(ExitStatus::default());
        }

        let mut args = vec!["pm".to_string(), "trust".into()];
        if opts.all {
            args.push("--all".into());
        }
        args.extend(approves.iter().map(|s| s.to_string()));
        self.run_raw("bun", &args, cwd).await
    }
}
```

**文件**：`crates/vite_package_manager/src/commands/mod.rs`

```rust
pub mod add;
mod install;
pub mod remove;
pub mod update;
pub mod link;
pub mod unlink;
pub mod dedupe;
pub mod why;
pub mod outdated;
pub mod approve_builds;  // <- 添加此项
// pub mod pm;             // （未来；来自 pm-command-group RFC）
```

#### 3. CLI 实现

**文件**：`crates/vite_task/src/approve_builds.rs`（新文件）

```rust
use vite_error::Error;
use vite_package_manager::{
    PackageManager,
    commands::approve_builds::ApproveBuildsOptions,
};
use vite_path::AbsolutePathBuf;
use vite_workspace::Workspace;

pub struct ApproveBuildsCommand {
    workspace_root: AbsolutePathBuf,
}

impl ApproveBuildsCommand {
    pub fn new(workspace_root: AbsolutePathBuf) -> Self {
        Self { workspace_root }
    }

    pub async fn execute(self, packages: Vec<String>, all: bool) -> Result<(), Error> {
        let package_manager = PackageManager::builder(&self.workspace_root).build().await?;
        let workspace = Workspace::partial_load(self.workspace_root.clone())?;

        let status = package_manager
            .run_approve_builds(
                ApproveBuildsOptions { packages: &packages, all },
                &workspace.root,
            )
            .await?;

        if !status.success() {
            return Err(Error::CommandFailed {
                command: "pm approve-builds".into(),
                exit_code: status.code(),
            });
        }
        workspace.unload().await?;
        Ok(())
    }
}
```

## 设计决策

### 1. 严格镜像 pnpm 已文档化的表面能力

**决策**：Vite+ 仅暴露 `pnpm approve-builds` 文档中说明的内容——位置参数包名（带 `!pkg` 拒绝前缀）以及 `--all`。Bun 的额外命令（`bun pm untrusted`、`bun pm default-trusted`）**不**会被折叠成标志位。

**理由**：pnpm 和 bun 只共享“批准这些包”这一操作。添加 `--list`、`--default-trusted`、`-y` 或 `-g` 要么是凭空发明出 pnpm 文档表面并不存在的标志，要么是掩盖 bun 的独立命令模型。如果以后需要 `vp pm untrusted` 和 `vp pm default-trusted`，它们应该作为 `pm` 下的同级子命令单独存在（类似 bun）——那应是后续 RFC，而不是这里的范围蔓延。

### 2. 不规范化存储

**决策**：Vite+ **不会**把 `pnpm-workspace.yaml ↔ package.json#trustedDependencies` 重写成一个共享文件。

**理由**：

- 这两种格式表达的语义不同（`allowBuilds: { core-js: false }` 没有 bun 的对应物）。
- 每次命令都在它们之间往返转换，会修改用户意料之外的文件。
- 包管理器之间的迁移很少见；按需转换（例如未来的 `vp migrate` 步骤）才是进行这类翻译的合适位置，而不是日常的 `approve-builds` 命令。
- 仅适用于 pnpm 的 `!pkg` 拒绝语法仍然有意义，不会被悄悄丢失。

### 3. `!pkg` 拒绝语法：仅 pnpm 支持，显示警告

**决策**：接受位置参数中的 `!pkg`；对于 bun，输出一个 `warn`，指出受影响的包，并继续处理已批准的包。

**理由**：

- 悄悄丢弃 `!core-js` 会让用户误以为自己已经拒绝了某个包，而实际上并没有。
- 直接报错会让一位开发者在 `vp pm approve-builds esbuild !core-js` 时受阻——他可能是从 pnpm 教程复制了命令，但恰好在某个仓库里使用 bun。
- 该警告会指出被丢弃的包名，因此这种差异是可审计的。

### 4. npm / yarn：警告 + 退出码 0

**决策**：在 npm 和 yarn 上输出 `warn`，并返回退出码 0。

**理由**：

- **npm** 默认会运行生命周期脚本——该警告会提示如何去 _限制_ 它们（`ignore-scripts=true`）。
- **yarn（Berry）** 默认会阻止第三方构建脚本；按包启用的配置位于 `package.json` 中（`dependenciesMeta.<pkg>.built: true`）。我们使用 `warn` 提示这个字段，而不是自行修改文件——这样可以保持在 RFC 有意收紧的范围内。
- 两种场景都使用 `warn`（而不是 `note`）以保持一致：用户调用了 `approve-builds`，但在该包管理器上无法完成请求的动作，因此需要一个可见信号和手动替代方案。
- 退出码 0 使得在不同仓库中有条件运行 `vp pm approve-builds --all` 的 CI 脚本可以正常工作。
- 返回非 0（另一种选择）会破坏 monorepo 编排脚本，并要求针对不同 PM 编写条件分支。

### 5. bun 上无参数：`note` + 退出码 0

**决策**：当在 bun 上以无参数（且没有 `--all`）调用 `vp pm approve-builds` 时，输出 `note` 并返回退出码 0，而不是构建一个由 Vite+ 维护的交互式选择器。

**理由**：

- 实现一个选择器需要解析 `bun pm untrusted` 的输出并复用 prompts 模块——这是一项有意义的工作，如果未来需要，应该作为独立 RFC 落地。
- 当前行为保持了该 RFC 的范围最小，并忠实于 pnpm 已文档化的标志集合。

### 6. 不缓存

**决策**：不缓存 approve-builds 的结果。

**理由**：此命令会修改配置文件；缓存会是不正确的。

## 错误处理

### 未检测到包管理器

```
$ vp pm approve-builds
error  未检测到包管理器。
       请运行以下命令之一：
         - vp install（以设置包管理器）
         - 在 package.json 中添加 `packageManager` 字段
```

### pnpm < v10.32.0 上使用 `--all`

```
$ vp pm approve-builds --all
Detected package manager: pnpm@10.20.0
error  `--all` 需要 pnpm ≥ 10.32.0。请升级 pnpm 或显式传入包名。
```

### 针对 bun 使用拒绝语法

```
$ vp pm approve-builds esbuild !core-js
Detected package manager: bun@1.3.0
warn  bun 不支持构建脚本黑名单。`package.json` 中不在
      `trustedDependencies` 里的包默认已被拒绝。
      Skipping: core-js
Running: bun pm trust esbuild
✔ 已信任 1 个包
```

### 底层命令失败

```
$ vp pm approve-builds esbuild
Detected package manager: pnpm@10.32.0
Running: pnpm approve-builds esbuild
ERR_PNPM_CONFIG_WRITE_FAILED: 无法写入 pnpm-workspace.yaml
exit code: 1
```

退出码会被传递。

## 用户体验

### 交互式批准（pnpm）

```
$ vp pm approve-builds
Detected package manager: pnpm@10.32.0
Running: pnpm approve-builds

? 选择要构建的包（按 <space> 选择，按 <a> 切换全部，按 <i> 反转选择）
❯◯ @biomejs/biome
 ◯ esbuild
 ◯ fsevents
 ◯ sharp

✔ 已更新 pnpm-workspace.yaml（allowBuilds）
```

### 直接批准（bun）

```
$ vp pm approve-builds esbuild fsevents
Detected package manager: bun@1.3.0
Running: bun pm trust esbuild fsevents
✔ 已更新 package.json（trustedDependencies）
```

### 批量批准

```
$ vp pm approve-builds --all
Detected package manager: bun@1.3.0
Running: bun pm trust --all
✔ 已信任 4 个包
```

### bun 上无参数

```
$ vp pm approve-builds
Detected package manager: bun@1.3.0
note  bun pm trust 需要包名。运行 `bun pm untrusted` 查看
      哪些包处于待处理状态，然后显式传入它们：
        vp pm approve-builds <pkg> [<pkg>...]
        vp pm approve-builds --all
```

### npm 上无操作

```
$ vp pm approve-builds
Detected package manager: npm@11.0.0
warn  npm 默认会运行生命周期脚本。若要限制它们，请在
      .npmrc 中设置 `ignore-scripts=true`，并使用
      `vp pm rebuild <package>` 重新构建已批准的包。
```

### yarn 上无操作

```
$ vp pm approve-builds esbuild
Detected package manager: yarn@4.0.0
warn  yarn 默认不会运行第三方构建脚本。要允许某个
      包，请在 package.json 中设置 `dependenciesMeta["<package>"].built: true`。
```

## 考虑过的替代设计

### 替代方案 1：拆分为 `vp pm trust` / `vp pm untrusted` / `vp pm allow-build`

```bash
vp pm trust esbuild
vp pm untrusted
vp pm allow-build esbuild
```

**被拒绝，因为：**

- 这会镜像各 PM 各自的术语，而不是将它们统一起来。
- 会让用户需要学习的表面能力增加三倍。
- 单一命令的形态更符合现有的 Vite+ 约定。

### 替代方案 2：将所有批准规范化到 Vite+ 自有文件中（例如 `vite-plus.json`）

```json
{ "approvedBuilds": ["esbuild", "fsevents"] }
```

**被拒绝，因为：**

- 这迫使 Vite+ 重新实现脚本执行门控（当前由 pnpm/bun 负责）。
- 会产生两个事实来源（`vite-plus.json` 和 PM 自己的文件）——漂移不可避免。
- 会丢失 pnpm 的允许/拒绝区分，以及版本特定条目（`nx@21.6.4 || 21.6.5: true`）。

### 替代方案 3：始终直接 shell out

```bash
vp pm approve-builds -- pnpm approve-builds --all
```

**被拒绝，因为：**

- 这违背了统一命令的初衷。
- 会迫使用户知道当前正在使用哪个 PM。
- 对 bun 没有等价方案（bun 没有可委托的 `approve-builds`）。

### 替代方案 4：安装时自动批准所有内容

**被拒绝，因为：**

- 这违背了 pnpm/bun 设计该门控机制时所要提供的供应链保护。
- 相比直接运行 pnpm/bun，这会造成安全回退。

### 替代方案 5：把 bun 的 untrusted/default-trusted 做成标志

```bash
vp pm approve-builds --list
vp pm approve-builds --default-trusted
```

**被拒绝，因为：**

- 这些标志并不存在于 pnpm 已文档化的表面能力中；加入它们等于发明了一套没有任何 PM 实际使用的统一词汇。
- bun 将它们建模为独立命令（`bun pm untrusted`、`bun pm default-trusted`）；更清晰的 Vite+ 镜像也应是独立子命令。
- 不在本 RFC 范围内；参见 [未来增强](#future-enhancements)。

## 实施计划

### 阶段 1：核心管线

1. 在 `crates/vite_task/src/lib.rs` 中为 `PmCommands` 增加 `ApproveBuilds` 变体。
2. 创建 `crates/vite_package_manager/src/commands/approve_builds.rs`，包含 pnpm + bun 适配器。
3. 为 pnpm 接通透传（`approve-builds`、`approve-builds <pkg>`、`approve-builds <pkg> !<pkg>`、`--all`）。
4. 接通 `bun pm trust`（位置参数 + `--all`），并附带 `!pkg` 过滤 + 警告。
5. 接通 npm/yarn 的警告路径（退出码 0）。
6. 接通 bun 无参数的 `note` 路径。

### 阶段 2：pnpm `--all` 的版本门控

1. 检测 pnpm 版本，并对 `< v10.32.0` 的 `--all` 返回错误，并附带用法提示。

### 阶段 3：测试 + snap 测试

1. 针对命令解析的单元测试（按 PM × 标志矩阵）。
2. 在 `packages/cli/snap-tests/` 中添加覆盖每个 PM 的 snap 测试。

### 阶段 4：文档

1. 更新 `vp pm --help`，列出新子命令。
2. 在 [pm-command-group RFC](./pm-command-group.md) 的兼容性矩阵中增加一行。
3. 将 `vp pm approve-builds` 添加到面向用户的 CLI 文档中。

## 测试策略

### 单元测试

```rust
#[test]
fn pnpm_basic_approve() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm).with_version("10.32.0");
    let opts = ApproveBuildsOptions { packages: &vec!["esbuild".into()], all: false };
    let cmd = pm.resolve_approve_builds(&opts);
    assert_eq!(cmd.bin, "pnpm");
    assert_eq!(cmd.args, vec!["approve-builds", "esbuild"]);
}

#[test]
fn pnpm_all_flag() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm).with_version("10.32.0");
    let opts = ApproveBuildsOptions { packages: &vec![], all: true };
    let cmd = pm.resolve_approve_builds(&opts);
    assert_eq!(cmd.args, vec!["approve-builds", "--all"]);
}

#[test]
fn pnpm_all_rejected_below_v10_32() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm).with_version("10.20.0");
    let opts = ApproveBuildsOptions { packages: &vec![], all: true };
    assert!(pm.resolve_approve_builds(&opts).is_err());
}

#[test]
fn pnpm_passes_deny_syntax_through() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm).with_version("10.32.0");
    let opts = ApproveBuildsOptions {
        packages: &vec!["esbuild".into(), "!core-js".into()],
        all: false,
    };
    let cmd = pm.resolve_approve_builds(&opts);
    assert_eq!(cmd.args, vec!["approve-builds", "esbuild", "!core-js"]);
}

#[test]
fn bun_deny_syntax_filtered_with_warning() {
    let pm = PackageManager::mock(PackageManagerType::Bun);
    let opts = ApproveBuildsOptions {
        packages: &vec!["esbuild".into(), "!core-js".into()],
        all: false,
    };
    let cmd = pm.resolve_approve_builds(&opts);
    assert_eq!(cmd.args, vec!["pm", "trust", "esbuild"]);
    assert!(cmd.warnings.iter().any(|w| w.contains("core-js")));
}

#[test]
fn bun_all_flag_passes_through() {
    let pm = PackageManager::mock(PackageManagerType::Bun);
    let opts = ApproveBuildsOptions { packages: &vec![], all: true };
    let cmd = pm.resolve_approve_builds(&opts);
    assert_eq!(cmd.args, vec!["pm", "trust", "--all"]);
}

#[test]
fn bun_no_args_emits_note() {
    let pm = PackageManager::mock(PackageManagerType::Bun);
    let opts = ApproveBuildsOptions { packages: &vec![], all: false };
    let result = pm.resolve_approve_builds(&opts);
    assert!(result.no_op);
    assert!(result.notes.iter().any(|n| n.contains("bun pm untrusted")));
}

#[test]
fn npm_warns_and_exits_zero() {
    let pm = PackageManager::mock(PackageManagerType::Npm);
    let result = pm.resolve_approve_builds(&Default::default());
    assert!(result.no_op);
    assert!(result.warnings.iter().any(|w| w.contains("ignore-scripts=true")));
}
```

### Snap 测试

在 `packages/cli/snap-tests/pm-approve-builds-{pnpm,bun,npm,yarn}` 下添加 fixture，覆盖：

- 无操作调用（npm/yarn 输出 warning，bun 输出 note）。
- bun 上的 `--all`。
- pnpm 上的 `--all`。
- bun 上的 `esbuild !core-js`（断言拒绝警告文本）。
- pnpm 上的 `esbuild !core-js`（断言透传）。

## CLI 帮助输出

```
$ vp pm approve-builds --help
批准依赖生命周期脚本（install/postinstall）运行

用法: vp pm approve-builds [OPTIONS] [PACKAGES]...

参数:
  [PACKAGES]...  要批准的包。使用 `!` 前缀表示拒绝（仅 pnpm）。
                 省略所有位置参数以启动交互模式（仅 pnpm）。

选项:
      --all   批准当前所有等待批准的包
  -h, --help  打印帮助

示例:
  vp pm approve-builds                       # 交互式提示（pnpm）
  vp pm approve-builds esbuild fsevents      # 批准特定包
  vp pm approve-builds esbuild !core-js      # 批准 esbuild，拒绝 core-js（仅 pnpm）
  vp pm approve-builds --all                 # 批准所有待处理的包
```

## 包管理器兼容性

| 能力                  | pnpm                                   | npm     | yarn@1                                          | yarn@2+                                         | bun                                     |
| --------------------- | -------------------------------------- | ------- | ----------------------------------------------- | ----------------------------------------------- | --------------------------------------- |
| 交互式（无参数）       | ✅ 原生                                 | ❌ 警告 | ❌ 警告                                         | ❌ 警告                                         | ❌ 注释（无选择器）                    |
| 按名称批准             | ✅ `pnpm approve-builds <pkg>`         | ❌ 警告 | ❌ 警告                                         | ❌ 警告                                         | ✅ `bun pm trust <pkg>`                 |
| 按名称拒绝（`!pkg`）   | ✅ `pnpm approve-builds !<pkg>`        | ❌ 警告 | ❌ 警告                                         | ❌ 警告                                         | ⚠️ 警告（模型不匹配）                 |
| `--all`               | ✅ ≥ v10.32.0（旧版本报错）            | ❌ 警告 | ❌ 警告                                         | ❌ 警告                                         | ✅ `bun pm trust --all`                 |
| 存储位置               | `pnpm-workspace.yaml` → `allowBuilds:` | n/a     | `package.json` → `dependenciesMeta.<pkg>.built` | `package.json` → `dependenciesMeta.<pkg>.built` | `package.json` → `trustedDependencies:` |

## 未来增强

### 1. `vp pm untrusted`

将 `bun pm untrusted` 作为并列子命令镜像实现。对于 pnpm，从 `pnpm install --lockfile-only --reporter=ndjson` 推导待处理列表（过滤 `ignored-scripts` 事件）。对于 npm/yarn，警告并以 0 退出。

### 2. `vp pm default-trusted`

将 `bun pm default-trusted` 作为并列子命令镜像实现。对于 pnpm/npm/yarn，打印一条 `note`，说明不存在这样的列表。

### 3. 跨 PM 迁移助手

`vp migrate approve-builds` 可以从 `pnpm-workspace.yaml` 中读取 `allowBuilds:`，并为 `package.json` 输出 `trustedDependencies:` 列表（反之亦然）。

### 4. CI 确认门槛 / `--yes`

如果用户反馈表明 `--all` 会在脚本中被无意执行，可以重新考虑添加确认提示 + `-y` 退出选项。今天不在范围内。

### 5. 审计集成

`vp pm audit`（已在 [pm 命令组 RFC](./pm-command-group.md) 中）可以在其 CVE 列表旁显示“此包当前已获批准可运行 install 脚本”。

## 安全考虑

1. **不会静默丢弃拒绝名单**：输入 `!core-js` 的 bun 用户会看到警告，而不是被静默忽略。
2. **不会规范化存储**：Vite+ 不会引入一种新的文件格式，避免成为“哪些脚本可以运行”的并行事实来源。
3. **透传保留 PM 原生审计**：pnpm 和 bun 继续负责实际的门控；Vite+ 只是一层轻量编排。

## 向后兼容性

这是 `vp pm` 命令组下的一个新子命令（该命令组本身也是新的）。没有破坏性变更。

- 与 [pm-command-group.md](./pm-command-group.md) 独立——可以在其之前、之后或同时发布。
- 不更改现有命令。
- 不更改缓存或任务图行为。

## 真实场景使用示例

### 在 `vp install` 之后批准

```bash
vp install
# pnpm 报告有 4 个包的构建脚本被忽略
vp pm approve-builds esbuild fsevents sharp
vp install   # 重新运行以实际执行已批准的脚本
```

### 在 CI 中批量批准

```yaml
- run: vp install
- run: vp pm approve-builds --all
```

### 在 pnpm 上混合批准/拒绝

```bash
vp pm approve-builds esbuild fsevents !core-js !some-tracker
```

## 结论

本 RFC 新增 `vp pm approve-builds`，作为对 `pnpm approve-builds` 的聚焦镜像，并适配了 `bun pm trust`。其表面积被有意控制得很小：

- ✅ 位置参数 `[PACKAGES...]`，并保留 pnpm 的 `!pkg` 拒绝前缀
- ✅ `--all` 标志（与 pnpm v10.32.0+ 和 bun 匹配）
- ✅ pnpm 交互模式透传；bun 无参数模式输出 `note`
- ✅ 保留 pnpm 的 `!pkg` 拒绝语法；对 bun 则发出警告（不会静默丢弃）
- ✅ npm 和 yarn 都会警告（分别指向 `ignore-scripts` 和 `dependenciesMeta.<pkg>.built`），并以 0 退出，保证 CI 脚本可移植
- ✅ 不引入新的存储格式——每个 PM 继续管理各自的配置
- ✅ 其他 bun 命令（`untrusted`、`default-trusted`）推迟为后续的并列子命令，而不是以标志位形式折叠进来
