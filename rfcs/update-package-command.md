# RFC: Vite+ 更新包命令

## 摘要

添加 `vp update`（别名：`vp up`）命令，该命令会自动适配检测到的包管理器（pnpm/yarn/npm/bun），用于将包更新到其在指定 semver 范围内的最新版本，并支持更新到绝对最新版本、感知工作区的操作以及交互模式。

## 动机

目前，开发者必须手动使用各个包管理器特定的命令来更新依赖：

```bash
pnpm update react
yarn upgrade react
npm update react
```

这会给 monorepo 工作流带来摩擦，并且需要记住不同的语法。统一的接口将会：

1. **简化工作流**：一条命令可跨所有包管理器使用
2. **自动检测**：自动使用正确的包管理器
3. **一致性**：无论底层工具如何，语法保持一致
4. **集成**：可与现有的 Vite+ 功能无缝协作

### 当前痛点

```bash
# 开发者需要知道正在使用哪个包管理器
pnpm update react --latest          # pnpm 项目
yarn upgrade react --latest         # yarn 项目
npm update react                    # npm 项目（没有 --latest 标志）

# 更新所有包时使用不同命令
pnpm update                         # pnpm
yarn upgrade                        # yarn@1 / yarn@2+ 使用 yarn upgrade-interactive
npm update                          # npm
```

### 提议的解决方案

```bash
# 适用于所有包管理器
vp update react             # 在 semver 范围内更新到最新版本
vp up react --latest        # 更新到绝对最新版本
vp update                   # 更新所有包

# 工作区操作
vp update --filter app                    # 更新特定包
vp update react --latest --filter "app*"  # 更新多个包中的最新版本
vp update -r                              # 在所有工作区中递归更新
```

## 提议的解决方案

### 命令语法

#### 更新命令

```bash
vp update [PACKAGES]... [OPTIONS]
vp up [PACKAGES]... [OPTIONS]        # 别名
```

**示例：**

```bash
# 更新到 semver 范围内的最新版本
vp update react react-dom

# 更新到绝对最新版本
vp update react --latest
vp up react -L

# 更新所有依赖
vp update

# 更新到最新版本
vp update --latest

# 仅更新开发依赖
vp update -D

# 仅更新生产依赖
vp update -P

# 工作区操作
vp update --filter app                    # 更新特定包
vp update react --latest --filter "app*"  # 更新多个包中的最新版本
vp update -r                              # 更新所有工作区包
vp update -g typescript                   # 更新全局包

# 交互模式（仅 pnpm）
vp update --interactive
vp up -i

# 高级选项
vp update --no-optional                   # 跳过可选依赖
vp update --no-save                       # 仅更新 lockfile
vp update react --latest --no-save        # 在不保存的情况下测试最新版本
```

### 命令映射

#### 更新命令映射

- https://pnpm.io/cli/update
- https://yarnpkg.com/cli/up (yarn@2+)
- https://classic.yarnpkg.com/en/docs/cli/upgrade (yarn@1)
- https://docs.npmjs.com/cli/v11/commands/npm-update
- https://bun.sh/docs/cli/update

| Vite+ 标志              | pnpm                        | yarn@1               | yarn@2+                                     | npm                            | bun                    | 描述                                                       |
| ---------------------- | --------------------------- | -------------------- | ------------------------------------------- | ------------------------------ | ---------------------- | ---------------------------------------------------------- |
| `[packages]`           | `update [packages]`         | `upgrade [packages]` | `up [packages]`                             | `update [packages]`            | `update [packages]`    | 更新指定包（若省略则更新全部）                               |
| `-L, --latest`         | `--latest` / `-L`           | `--latest`           | 不适用（默认行为）                           | 不适用                         | `--latest`             | 更新到最新版本（忽略 semver 范围）                           |
| `-g, --global`         | 不适用                       | 不适用               | 不适用                                      | `--global` / `-g`              | 不适用                 | 更新全局包                                                 |
| `-r, --recursive`      | `-r, --recursive`           | 不适用               | `--recursive` / `-R`                        | `--workspaces`                 | `--recursive` / `-r`   | 递归更新所有工作区包                                        |
| `--filter <pattern>`   | `--filter <pattern> update` | 不适用               | `workspaces foreach --include <pattern> up` | `update --workspace <pattern>` | 不适用                 | 目标为特定工作区包                                           |
| `-w, --workspace-root` | `-w`                        | 不适用               | 不适用                                      | `--include-workspace-root`     | 不适用                 | 包括工作区根目录                                             |
| `-D, --dev`            | `--dev` / `-D`              | 不适用               | 不适用                                      | `--include=dev`                | 不适用                 | 仅更新 devDependencies                                      |
| `-P, --prod`           | `--prod` / `-P`             | 不适用               | 不适用                                      | `--include=prod`               | `--production`         | 仅更新 dependencies 和 optionalDependencies                |
| `-i, --interactive`    | `--interactive` / `-i`      | 不适用               | `--interactive` / `-i`                      | 不适用                         | `--interactive` / `-i` | 显示过时包并选择要更新的内容                                |
| `--no-optional`        | `--no-optional`             | 不适用               | 不适用                                      | `--no-optional`                | `--omit optional`      | 不更新 optionalDependencies                                 |
| `--no-save`            | `--no-save`                 | 不适用               | 不适用                                      | `--no-save`                    | `--no-save`            | 仅更新 lockfile，不修改 package.json                         |
| `--workspace`          | `--workspace`               | 不适用               | 不适用                                      | 不适用                         | 不适用                 | 仅在包存在于工作区时更新（pnpm 特有）                        |

**注意**：

- 对于 pnpm，`--filter` 必须放在命令之前（例如：`pnpm --filter app update react`）
- Yarn@2+ 使用 `up` 或 `upgrade` 命令，并且默认会更新到最新版本
- Yarn@1 使用 `upgrade` 命令
- npm 不支持 `--latest` 标志，它始终只会在 semver 范围内更新
- `--no-optional` 会跳过更新 optionalDependencies（pnpm/npm/bun）
- `--no-save` 会在不修改 package.json 的情况下更新 lockfile（pnpm/npm/bun）
- bun 支持 `--recursive`、`--latest`、`--interactive`、`--production`、`--omit optional` 和 `--no-save` 标志

**别名：**

- `vp up` = `vp update`

### 命令翻译策略

#### 全局包更新

对于全局包，仅使用 npm cli（与 add/remove 一致）：

```bash
vp update -g typescript
-> npm update --global typescript
```

#### 最新版本更新

不同包管理器对“latest”的处理方式不同：

**pnpm**：有明确的 `--latest` 标志

```bash
vp update react --latest
-> pnpm update --latest react
```

**yarn@1**：有 `--latest` 标志

```bash
vp update react --latest
-> yarn upgrade --latest react
```

**yarn@2+**：默认就是更新到最新版本，使用 `^` 或 `~` 进行范围更新

```bash
vp update react --latest
-> yarn up react                    # 已经会更新到最新版本
```

**npm**：没有 `--latest` 标志，只能更新到 semver 范围内

```bash
vp update react --latest
-> npx npm-check-updates -u react && npm install
# 或者提示用户并在范围内更新
-> npm update react
```

### 实现架构

#### 1. 命令结构

**文件**：`crates/vite_task/src/lib.rs`

添加新的命令变体：

```rust
#[derive(Subcommand, Debug)]
pub enum Commands {
    // ... 现有命令

    /// 将包更新到其最新版本
    #[command(alias = "up")]
    Update {
        /// 更新到最新版本（忽略 semver 范围）
        #[arg(short = 'L', long)]
        latest: bool,

        /// 更新全局包
        #[arg(short = 'g', long)]
        global: bool,

        /// 在所有工作区包中递归更新
        #[arg(short = 'r', long)]
        recursive: bool,

        /// 过滤 monorepo 中的包（可重复使用）
        #[arg(long, value_name = "PATTERN")]
        filter: Option<Vec<String>>,

        /// 包括工作区根目录
        #[arg(short = 'w', long)]
        workspace_root: bool,

        /// 仅更新 devDependencies
        #[arg(short = 'D', long)]
        dev: bool,

        /// 仅更新 dependencies（生产依赖）
        #[arg(short = 'P', long)]
        prod: bool,

        /// 交互模式 - 显示过时包并进行选择
        #[arg(short = 'i', long)]
        interactive: bool,

        /// 不更新 optionalDependencies
        #[arg(long)]
        no_optional: bool,

        /// 仅更新 lockfile，不修改 package.json
        #[arg(long)]
        no_save: bool,

        /// 要更新的包（可选 - 若省略则更新全部）
        packages: Vec<String>,

        /// 传递给包管理器的额外参数
        #[arg(last = true, allow_hyphen_values = true)]
        pass_through_args: Option<Vec<String>>,
    },
}
```

#### 2. 包管理器适配器

**文件**：`crates/vite_package_manager/src/update.rs`（新文件）

```rust
#[derive(Debug, Default)]
pub struct UpdateCommandOptions<'a> {
    pub packages: &'a [String],
    pub latest: bool,
    pub global: bool,
    pub recursive: bool,
    pub filters: Option<&'a [String]>,
    pub workspace_root: bool,
    pub dev: bool,
    pub prod: bool,
    pub interactive: bool,
    pub no_optional: bool,
    pub no_save: bool,
    pub pass_through_args: Option<&'a [String]>,
}

impl PackageManager {
    pub fn resolve_update_command(&self, options: &UpdateCommandOptions) -> ResolveCommandResult {
        let bin_name: String;
        let mut args: Vec<String> = Vec::new();

        // 全局包仅使用 npm
        if options.global {
            bin_name = "npm".into();
            args.push("update".into());
            args.push("--global".into());
            args.extend_from_slice(options.packages);
            return ResolveCommandResult { bin_path: bin_name, args, envs };
        }

        match self.client {
            PackageManagerType::Pnpm => {
                bin_name = "pnpm".into();
                // pnpm: --filter 必须放在命令之前
                if let Some(filters) = options.filters {
                    for filter in filters {
                        args.push("--filter".into());
                        args.push(filter.clone());
                    }
                }
                args.push("update".into());

                if options.latest {
                    args.push("--latest".into());
                }
                if options.workspace_root {
                    args.push("--workspace-root".into());
                }
                if options.recursive {
                    args.push("--recursive".into());
                }
                if options.dev {
                    args.push("--dev".into());
                }
                if options.prod {
                    args.push("--prod".into());
                }
                if options.interactive {
                    args.push("--interactive".into());
                }
                if options.no_optional {
                    args.push("--no-optional".into());
                }
                if options.no_save {
                    args.push("--no-save".into());
                }
            }
            PackageManagerType::Yarn => {
                bin_name = "yarn".into();

                // 确定 yarn 版本
                let is_yarn_v1 = self.version.starts_with("1.");

                if is_yarn_v1 {
                    // yarn@1: yarn upgrade [--latest]
                    if let Some(filters) = options.filters {
                        // yarn@1 对工作区过滤支持不佳
                        // 使用基础 workspace 命令
                        args.push("workspace".into());
                        args.push(filters[0].clone());
                    }
                    args.push("upgrade".into());
                    if options.latest {
                        args.push("--latest".into());
                    }
                } else {
                    // yarn@2+: yarn up（默认已经更新到最新版本）
                    if let Some(filters) = options.filters {
                        args.push("workspaces".into());
                        args.push("foreach".into());
                        args.push("--all".into());
                        for filter in filters {
                            args.push("--include".into());
                            args.push(filter.clone());
                        }
                    }
                    args.push("up".into());
                    if options.recursive {
                        args.push("--recursive".into());
                    }
                    if options.interactive {
                        args.push("--interactive".into());
                    }
                }
            }
            PackageManagerType::Npm => {
                bin_name = "npm".into();
                args.push("update".into());

                if let Some(filters) = options.filters {
                    for filter in filters {
                        args.push("--workspace".into());
                        args.push(filter.clone());
                    }
                }
                if options.workspace_root {
                    args.push("--include-workspace-root".into());
                }
                if options.recursive {
                    args.push("--workspaces".into());
                }
                if options.no_optional {
                    args.push("--no-optional".into());
                }
                if options.no_save {
                    args.push("--no-save".into());
                }

                // npm 没有 --latest 标志
                // 提示用户或以不同方式处理
                if options.latest {
                    eprintln!("Warning: npm doesn't support --latest flag. Use 'npm outdated' to check for updates.");
                }
            }
        }

        args.extend_from_slice(options.packages);
        if let Some(pass_through_args) = options.pass_through_args {
            args.extend_from_slice(pass_through_args);
        }

        ResolveCommandResult { bin_path: bin_name, args, envs }
    }
}
```

#### 3. 更新命令实现

**文件**：`crates/vite_task/src/update.rs`（新文件）

```rust
pub struct UpdateCommand {
    workspace_root: AbsolutePathBuf,
}

impl UpdateCommand {
    pub fn new(workspace_root: AbsolutePathBuf) -> Self {
        Self { workspace_root }
    }

    pub async fn execute(
        self,
        packages: &[String],
        latest: bool,
        global: bool,
        recursive: bool,
        filters: Option<&[String]>,
        workspace_root: bool,
        dev: bool,
        prod: bool,
        interactive: bool,
        no_optional: bool,
        no_save: bool,
        pass_through_args: Option<&[String]>,
    ) -> Result<ExecutionSummary, Error> {
        // 检测包管理器
        let package_manager = PackageManager::builder(&self.workspace_root).build().await?;
        let workspace = Workspace::partial_load(self.workspace_root)?;

        let update_command_options = UpdateCommandOptions {
            packages,
            latest,
            global,
            recursive,
            filters,
            workspace_root,
            dev,
            prod,
            interactive,
            no_optional,
            no_save,
            pass_through_args,
        };
        let resolve_command = package_manager.resolve_update_command(&update_command_options);

        println!("正在运行: {} {}", resolve_command.bin_path, resolve_command.args.join(" "));

        let resolved_task = ResolvedTask::resolve_from_builtin_with_command_result(
            &workspace,
            "update",
            resolve_command.args.iter(),
            ResolveCommandResult { bin_path: resolve_command.bin_path, envs: resolve_command.envs },
            false,
            None,
        )?;

        let mut task_graph: StableGraph<ResolvedTask, ()> = Default::default();
        task_graph.add_node(resolved_task);
        let summary = ExecutionPlan::plan(task_graph, false)?.execute(&workspace).await?;
        workspace.unload().await?;

        Ok(summary)
    }
}
```

## 设计决策

### 1. 不缓存

**决定**：不缓存更新操作。

**理由**：

- 更新命令会修改 package.json 和 lockfiles
- 副作用使缓存不合适
- 每次执行都应重新运行
- 类似于 add/remove/install 的工作方式

### 2. 默认行为：更新全部 vs 指定

**决定**：当未指定包时，更新所有依赖。

**理由**：

- 与三种包管理器的行为一致
- 常见用例：`vp update` 用于更新全部
- 指定更新：`vp update react`

### 3. npm 的 latest 标志处理

**决定**：提示用户 npm 不支持 --latest，但仍然执行命令。

**理由**：

- npm 只会在 semver 范围内更新
- `npm-check-updates` 等替代工具存在，但需要单独安装
- 与其失败，不如先警告再继续

**替代方案**：可以集成 `npx npm-check-updates -u`：

```bash
vp update react --latest
# 对于 npm：npx npm-check-updates -u react && npm install
```

### 4. 交互模式

**决定**：为 pnpm 和 yarn@2+ 支持交互模式。

**理由**：

- pnpm 有 `--interactive` 标志
- yarn@2+ 有 `--interactive` 标志
- 为审查更新提供更好的用户体验
- npm 原生不支持此功能

### 5. 工作区过滤

**决定**：使用与 add/remove 命令相同的过滤方式。

**理由**：

- 保持命令间一致性
- 复用现有的过滤模式
- 与 pnpm 的 filter 语法配合良好

## 错误处理

### 未检测到包管理器

```bash
$ vp update react
Error: 未检测到包管理器
请运行以下任一命令：
  - vp install（用于设置包管理器）
  - 在 package.json 中添加 packageManager 字段
```

### 不支持交互模式

```bash
$ vp update --interactive
Warning: npm 不支持交互模式
正在改为执行标准更新...
```

## 用户体验

### 成功输出

```bash
$ vp update react --latest
Detected package manager: pnpm@10.15.0
Running: pnpm update --latest react

Packages: +0 -0 ~1
~1
Progress: resolved 150, reused 145, downloaded 1, added 0, done

dependencies:
~ react 18.2.0 → 18.3.1

Done in 1.2s
```

### 交互模式输出

```bash
$ vp up -i
Detected package manager: pnpm@10.15.0
Running: pnpm update --interactive

? Choose which packages to update: (Press <space> to select, <a> to select all)
❯◯ react 18.2.0 → 18.3.1
 ◯ react-dom 18.2.0 → 18.3.1
 ◯ typescript 5.0.0 → 5.5.0
 ◯ vite 5.0.0 → 6.0.0
```

## 考虑过的替代设计

### 方案 1：为最新更新单独提供命令

```bash
vp update react        # 在范围内更新
vp upgrade react       # 更新到最新
```

**被拒绝，因为**：

- 需要记住的命令更多
- `--latest` 标志更清晰
- 与 pnpm 的 API 设计一致

### 方案 2：始终更新到最新

```bash
vp update react        # 始终更新到最新
vp update react --range # 在 semver 范围内更新
```

**被拒绝，因为**：

- 破坏 semver 预期
- 与包管理器默认行为不同
- 可能导致意外的破坏性变更

## 实施计划

### 阶段 1：核心功能

1. 在 `Commands` 枚举中添加 `Update` 命令变体
2. 在两个 crate 中创建 `update.rs` 模块
3. 实现包管理器命令解析
4. 添加基础错误处理

### 阶段 2：高级功能

1. 添加交互模式支持
2. 实现工作区过滤
3. 添加 dev/prod 依赖过滤
4. 处理 yarn 版本检测

### 阶段 3：测试

1. 命令解析的单元测试
2. 使用模拟包管理器的集成测试
3. 测试交互模式（在支持的情况下）
4. 测试工作区操作

### 阶段 4：文档

1. 更新 CLI 文档
2. 在 README 中添加示例
3. 记录包管理器兼容性

## 测试策略

### 测试包管理器版本

- pnpm@9.x [WIP]
- pnpm@10.x
- pnpm@11.x
- yarn@1.x [WIP]
- yarn@4.x
- npm@10.x
- npm@11.x [WIP]
- bun@1.x [WIP]

### 单元测试

```rust
#[test]
fn test_pnpm_update_basic() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.resolve_update_command(&UpdateCommandOptions {
        packages: &["react".to_string()],
        latest: false,
        ..Default::default()
    });
    assert_eq!(args, vec!["update", "react"]);
}

#[test]
fn test_pnpm_update_latest() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.resolve_update_command(&UpdateCommandOptions {
        packages: &["react".to_string()],
        latest: true,
        ..Default::default()
    });
    assert_eq!(args, vec!["update", "--latest", "react"]);
}

#[test]
fn test_npm_update_latest_warning() {
    // 应该警告，但仍然执行
    let pm = PackageManager::mock(PackageManagerType::Npm);
    let args = pm.resolve_update_command(&UpdateCommandOptions {
        packages: &["react".to_string()],
        latest: true,
        ..Default::default()
    });
    assert_eq!(args, vec!["update", "react"]);
}
```

## CLI 帮助输出

```bash
$ vp update --help
Update packages to their latest versions

Usage: vp update [PACKAGES]... [OPTIONS]

Aliases: up

Arguments:
  [PACKAGES]...  Packages to update (updates all if omitted)

Options:
  -L, --latest           Update to latest version (ignore semver range)
  -g, --global           Update global packages
  -r, --recursive        Update recursively in all workspace packages
  --filter <PATTERN>     Filter packages in monorepo (can be used multiple times)
  -w, --workspace-root   Include workspace root
  -D, --dev              Update only devDependencies
  -P, --prod             Update only dependencies
  -i, --interactive      Show outdated packages and choose which to update
  --no-optional          Don't update optionalDependencies
  --no-save              Update lockfile only, don't modify package.json
  -h, --help             Print help

Examples:
  vp update                          # 在 semver 范围内更新所有包
  vp update react react-dom          # 更新指定包
  vp update --latest                 # 将所有包更新到最新版本
  vp up react -L                     # 将 react 更新到最新
  vp update -i                       # 交互模式
  vp update --filter app             # 更新特定工作区
  vp update -r                       # 更新所有工作区
  vp update -D                       # 仅更新 dev 依赖
  vp update --no-optional            # 跳过可选依赖
  vp update --no-save                # 仅更新 lockfile
```

## 真实世界使用示例

### Monorepo 包更新

```bash
# 将所有前端包中的 React 更新到最新版本
vp update react react-dom --latest --filter "@myorg/app-*"

# 更新所有包中的所有 dev 依赖
vp update -D -r

# 在特定包中交互式更新
vp update -i --filter web

# 在 workspace root 中将所有内容更新到最新
vp update --latest -w

# 在整个 monorepo 中更新 TypeScript
vp update typescript --latest -r
```

### 开发工作流

```bash
# 交互式检查更新
vp up -i

# 在 semver 范围内更新所有依赖
vp update

# 更新安全补丁
vp update

# 更新到最新版本（重大更新）
vp update --latest

# 将指定包更新到最新
vp up react -L

# 更新全局包
vp update -g typescript

# 不保存到 package.json，测试更新
vp update --no-save

# 不包含可选依赖进行更新
vp update --no-optional
```

## 包管理器兼容性

| 功能            | pnpm               | yarn@1           | yarn@2+          | npm              | bun                    | 备注                       |
| --------------- | ------------------ | ---------------- | ---------------- | ---------------- | ---------------------- | -------------------------- |
| 更新命令         | `update`           | `upgrade`        | `up`             | `update`         | `update`               | 命令名称不同               |
| latest 标志      | `--latest` / `-L`  | `--latest`       | N/A（默认）      | ❌ 不支持        | `--latest`             | npm 只在范围内更新         |
| 交互式           | `--interactive`    | ❌ 不支持        | `--interactive`  | ❌ 不支持        | `--interactive` / `-i` | 支持有限                   |
| 工作区过滤        | `--filter`         | ⚠️ 有限           | ⚠️ 有限           | `--workspace`    | N/A                    | pnpm 最灵活                |
| 递归             | `--recursive`      | ❌ 不支持        | `--recursive`    | `--workspaces`   | `--recursive` / `-r`   | bun 支持 --recursive       |
| dev/prod 过滤    | `--dev` / `--prod` | ❌ 不支持        | ❌ 不支持        | ❌ 不支持        | ❌ 不支持               | 仅 pnpm 支持               |
| 全局             | `-g`               | `global upgrade` | ❌ 不支持        | `-g`             | ❌ 不支持               | 全局场景使用 npm           |
| 不含 optional    | `--no-optional`    | ❌ 不支持        | ❌ 不支持        | `--no-optional`  | `--omit optional`      | 跳过可选依赖               |
| 不保存           | `--no-save`        | ❌ 不支持        | ❌ 不支持        | `--no-save`      | `--no-save`            | 仅更新 lockfile            |

## 未来增强

### 1. outdated 命令

在更新前显示过期包：

```bash
vp outdated
vp outdated --filter app
```

### 2. 智能更新建议

```bash
$ vp update
Analyzing dependencies...
⚠️  可用的重大更新：
  react 17.0.0 → 18.3.1（破坏性变更）

✓ 次要更新：
  lodash 4.17.20 → 4.17.21

运行 'vp update --latest' 以更新到最新版本
运行 'vp update -i' 进入交互模式
```

### 3. 显示变更日志

```bash
$ vp update react --latest
Updating react 18.2.0 → 18.3.1

📝 Changelog:
  - 新增 useOptimistic hook
  - 性能改进
  - 错误修复

Continue? (Y/n)
```

## 成功指标

1. **采用率**：使用 `vp update` 而不是直接使用包管理器的用户百分比
2. **更新频率**：跟踪依赖保持最新的频率
3. **用户反馈**：关于命令易用性的调查/问题反馈
4. **错误率**：跟踪命令失败率与直接使用包管理器的对比

## 结论

本 RFC 提议添加 `vp update` 命令，以提供一个统一的接口，用于跨 pnpm/yarn/npm/bun 更新包。该设计：

- ✅ 自动适配检测到的包管理器
- ✅ 支持更新特定包或所有包
- ✅ 提供 `--latest` 标志以更新到超出 semver 范围的版本
- ✅ 具备完整的工作区支持与过滤功能
- ✅ 提供交互式模式以获得更好的用户体验（在受支持的情况下）
- ✅ 针对各包管理器特有功能进行优雅降级
- ✅ 没有缓存开销
- ✅ 借助现有基础设施实现简单

该实现遵循与 add/remove 命令相同的模式，同时提供开发者所需的更新专属功能。
