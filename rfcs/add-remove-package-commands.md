# RFC：Vite+ 增加和移除包命令

## 概要

添加 `vp add` 和 `vp remove` 命令，它们会根据检测到的包管理器（pnpm/yarn/npm/bun）自动适配，用于添加和移除包，并支持多个包、常见标志，以及基于 pnpm API 设计的 workspace 感知操作。

## 动机

目前，开发者必须手动使用各个包管理器特定的命令：

```bash
pnpm add react
yarn add react
npm install react
bun add react
```

这会给 monorepo 工作流带来阻力，并且需要记住不同的语法。一个统一的接口将：

1. **简化工作流**：一个命令可跨所有包管理器工作
2. **自动检测**：自动使用正确的包管理器
3. **一致性**：无论底层工具如何，语法保持一致
4. **集成**：与现有 Vite+ 功能无缝协作

### 当前痛点

```bash
# 开发者需要知道正在使用哪个包管理器
pnpm add -D typescript  # pnpm 项目
yarn add --dev typescript  # yarn 项目
npm install --save-dev typescript  # npm 项目
bun add --dev typescript  # bun 项目

# 不同的移除命令
pnpm remove lodash
yarn remove lodash
npm uninstall lodash
bun remove lodash
```

### 提议的解决方案

```bash
# 适用于所有包管理器
vp add typescript -D
vp remove lodash

# 多个包
vp add react react-dom
vp remove axios lodash

# Workspace 操作
vp add react --filter app
vp add @myorg/utils --workspace --filter app
vp add lodash -w  # 添加到 workspace 根目录
```

## 提议的解决方案

### 命令语法

#### Add 命令

```bash
vp add <PACKAGES>... [OPTIONS]
```

**示例：**

```bash
# 添加生产依赖
vp add react react-dom

# 添加开发依赖
vp add -D typescript @types/react

# 添加指定精确版本
vp add react -E

# 添加 peer 依赖
vp add --save-peer react

# 添加可选依赖
vp add -O sharp

# Workspace 操作
vp add react --filter app              # 添加到特定包
vp add @myorg/utils --workspace --filter app  # 添加 workspace 依赖
vp add lodash -w                       # 添加到 workspace 根目录
vp add react --filter "app*"           # 添加到多个包（模式匹配）
vp add utils --filter "!@myorg/core"   # 排除包
```

##### 带有 `PACKAGES` 参数的 `vp install` 命令

为了适配用户对 `npm install <PACKAGES>…` 的习惯和体验，`vp install <PACKAGES>...` 将被特殊处理为 add 命令的别名。

以下命令会在处理时自动转换为 add 命令：

```bash
vp install <PACKAGES>... [OPTIONS]

-> vp add <PACKAGES>... [OPTIONS]
```

##### 仅使用 npm cli 安装全局包

对于全局包，我们将仅使用 npm cli（除了 bun，它原生支持 `bun add -g`）。

> 因为 yarn 在 [version>=2.x](https://yarnpkg.com/migration/guide#use-yarn-dlx-instead-of-yarn-global) 上不支持全局包安装，而且 pnpm 的全局安装存在一些 bug，例如 `wrong bin file` 问题。

```bash
vp install -g <PACKAGES>...
vp add -g <PACKAGES>...

-> npm install -g <PACKAGES>...
```

#### Remove 命令

```bash
vp remove <PACKAGES>... [OPTIONS]
vp rm <PACKAGES>... [OPTIONS]        # 别名
```

**示例：**

```bash
# 移除包
vp remove lodash axios

# 移除开发依赖
vp rm typescript

# 别名支持
vp rm old-package

# Workspace 操作
vp remove lodash --filter app          # 从特定包中移除
vp rm utils --filter "app*"            # 从多个包中移除
vp remove -g typescript                # 移除全局包
```

### 命令映射

#### Add 命令映射

- https://pnpm.io/cli/add#options
- https://yarnpkg.com/cli/add#options
- https://docs.npmjs.com/cli/v11/commands/npm-install#description
- https://bun.sh/docs/cli/add

| Vite+ 标志                           | pnpm                     | yarn                                            | npm                             | bun               | 说明                                                    |
| ------------------------------------ | ------------------------ | ----------------------------------------------- | ------------------------------- | ----------------- | ------------------------------------------------------- |
| `<packages>`                         | `add <packages>`         | `add <packages>`                                | `install <packages>`            | `add <packages>`  | 添加包                                                  |
| `--filter <pattern>`                 | `--filter <pattern> add` | `workspaces foreach -A --include <pattern> add` | `install --workspace <pattern>` | 不适用            | 目标特定的 workspace 包                                  |
| `-w, --workspace-root`               | `-w`                     | `-W` 用于 v1，v2+ 不适用                        | `--include-workspace-root`      | 不适用            | 添加到 workspace 根目录（忽略 workspace 根目录检查）      |
| `--workspace`                        | `--workspace`            | 不适用                                           | 不适用                          | 不适用            | 仅当包存在于 workspace 中时才添加（pnpm 特有）            |
| `-P, --save-prod`                    | `--save-prod` / `-P`     | 不适用                                           | `--save-prod` / `-P`            | 不适用            | 保存到 `dependencies`。默认行为                          |
| `-D, --save-dev`                     | `-D`                     | `--dev` / `-D`                                  | `--save-dev` / `-D`             | `--dev` / `-d`    | 保存到 `devDependencies`                                |
| `--save-peer`                        | `--save-peer`            | `--peer` / `-P`                                 | `--save-peer`                   | `--peer`          | 保存到 `peerDependencies` 和 `devDependencies`          |
| `-O, --save-optional`                | `-O`                     | `--optional` / `-O`                             | `--save-optional` / `-O`        | `--optional`      | 保存到 `optionalDependencies`                           |
| `-E, --save-exact`                   | `-E`                     | `--exact` / `-E`                                | `--save-exact` / `-E`           | `--exact` / `-E`  | 保存精确版本                                             |
| `-g, --global`                       | `-g`                     | `global add`                                    | `--global` / `-g`               | `--global` / `-g` | 全局安装                                                 |
| `--save-catalog`                     | 仅 pnpm@10+              | 不适用                                           | 不适用                          | 不适用            | 将新的依赖保存到默认 catalog                             |
| `--save-catalog-name <catalog_name>` | 仅 pnpm@10+              | 不适用                                           | 不适用                          | 不适用            | 将新的依赖保存到指定 catalog                             |
| `--allow-build <names>`              | 仅 pnpm@10+              | 不适用                                           | 不适用                          | 不适用            | 允许运行 postinstall 的包名列表                           |

**注意**：对于 pnpm，`--filter` 必须放在命令之前（例如，`pnpm --filter app add react`）。对于 yarn/npm，它会集成到命令结构中。

#### Remove 命令映射

- https://pnpm.io/cli/remove#options
- https://yarnpkg.com/cli/remove#options
- https://docs.npmjs.com/cli/v11/commands/npm-uninstall#description
- https://bun.sh/docs/cli/remove

| Vite+ 标志             | pnpm                        | yarn                                               | npm                               | bun                 | 说明                                           |
| ---------------------- | --------------------------- | -------------------------------------------------- | --------------------------------- | ------------------- | ---------------------------------------------- |
| `<packages>`           | `remove <packages>`         | `remove <packages>`                                | `uninstall <packages>`            | `remove <packages>` | 移除包                                         |
| `-D, --save-dev`       | `-D`                        | 不适用                                             | `--save-dev` / `-D`               | 不适用             | 仅从 `devDependencies` 中移除                   |
| `-O, --save-optional`  | `-O`                        | 不适用                                             | `--save-optional` / `-O`          | 不适用             | 仅从 `optionalDependencies` 中移除              |
| `-P, --save-prod`      | `-P`                        | 不适用                                             | `--save-prod` / `-P`              | 不适用             | 仅从 `dependencies` 中移除                      |
| `--filter <pattern>`   | `--filter <pattern> remove` | `workspaces foreach -A --include <pattern> remove` | `uninstall --workspace <pattern>` | 不适用             | 目标特定的 workspace 包                         |
| `-w, --workspace-root` | `-w`                        | 不适用                                             | `--include-workspace-root`        | 不适用             | 从 workspace 根目录中移除                       |
| `-r, --recursive`      | `-r, --recursive`           | `-A, --all`                                        | `--workspaces`                    | 不适用             | 递归地从所有 workspace 包中移除                 |
| `-g, --global`         | `-g`                        | 不适用                                             | `--global` / `-g`                 | `--global` / `-g`   | 移除全局包                                      |

**注意**：与 add 类似，pnpm 的 `--filter` 必须放在命令之前。

**别名：**

- `vp rm` = `vp remove`
- `vp un` = `vp remove`
- `vp uninstall` = `vp remove`

#### Workspace Filter 模式

基于 pnpm 的 filter 语法：

| 模式         | 说明                   | 示例                                   |
| ------------ | ---------------------- | -------------------------------------- |
| `<pkg-name>` | 精确包名               | `--filter app`                         |
| `<pattern>*` | 通配符匹配             | `--filter "app*"` 匹配 app、app-web     |
| `@<scope>/*` | scope 匹配             | `--filter "@myorg/*"`                  |
| `!<pattern>` | 排除模式               | `--filter "!test*"` 排除测试包         |
| `<pkg>...`   | 包及其依赖             | `--filter "app..."`                    |
| `...<pkg>`   | 包及其依赖者           | `--filter "...utils"`                  |

**多个 Filter：**

```bash
vp add react --filter app --filter web  # 同时添加到 app 和 web
vp add react --filter "app*" --filter "!app-test"  # 添加到 app*，但排除 app-test
```

#### 透传参数

Vite+ 未覆盖的额外参数都可以通过透传参数来处理。

`--` 之后的所有参数都会传递给包管理器。

```bash
vp add react --allow-build=react,napi -- --use-stderr

-> pnpm add --allow-build=react,napi --use-stderr react
-> yarn add --use-stderr react
-> npm install --use-stderr react
-> bun add --use-stderr react
```

### 实现架构

#### 1. 命令结构

**文件**：`crates/vite_task/src/lib.rs`

添加新的命令变体：

```rust
#[derive(Subcommand, Debug)]
pub enum Commands {
    // ... 现有命令

    /// 向依赖中添加包
    #[command(disable_help_flag = true)]
    Add {
        /// 要添加的包
        packages: Vec<String>,

        /// 过滤 monorepo 中的包（可重复使用）
        #[arg(long, value_name = "PATTERN")]
        filter: Vec<String>,

        /// 添加到 workspace 根目录（忽略 workspace 根目录检查）
        #[arg(short = 'w', long)]
        workspace_root: bool,

        /// 仅当包存在于 workspace 中时才添加
        #[arg(long)]
        workspace: bool,

        /// 传递给包管理器的参数
        #[arg(allow_hyphen_values = true, trailing_var_arg = true)]
        args: Vec<String>,
    },

    /// 从依赖中移除包
    #[command(disable_help_flag = true, alias = "rm", alias = "un", alias = "uninstall")]
    Remove {
        /// 要移除的包
        packages: Vec<String>,

        /// 过滤 monorepo 中的包（可重复使用）
        #[arg(long, value_name = "PATTERN")]
        filter: Vec<String>,

        /// 从 workspace 根目录中移除
        #[arg(short = 'w', long)]
        workspace_root: bool,

        /// 传递给包管理器的参数
        #[arg(allow_hyphen_values = true, trailing_var_arg = true)]
        args: Vec<String>,
    },
}
```

#### 2. 包管理器适配器

**文件**：`crates/vite_package_manager/src/package_manager.rs`

添加用于翻译命令的方法：

```rust
impl PackageManager {
    /// 解析包管理器的 add 命令
    pub fn resolve_add_command(&self) -> &'static str {
        match self.client {
            PackageManagerType::Pnpm => "add",
            PackageManagerType::Yarn => "add",
            PackageManagerType::Npm => "install",
            PackageManagerType::Bun => "add",
        }
    }

    /// 解析包管理器的 remove 命令
    pub fn resolve_remove_command(&self) -> &'static str {
        match self.client {
            PackageManagerType::Pnpm => "remove",
            PackageManagerType::Yarn => "remove",
            PackageManagerType::Npm => "uninstall",
            PackageManagerType::Bun => "remove",
        }
    }

    /// 构建带 workspace 支持的命令参数
    pub fn build_add_args(
        &self,
        packages: &[String],
        filters: &[String],
        workspace_root: bool,
        workspace_only: bool,
        extra_args: &[String],
    ) -> Vec<String> {
        let mut args = Vec::new();

        match self.client {
            PackageManagerType::Pnpm => {
                // pnpm：--filter 必须放在命令之前
                for filter in filters {
                    args.push("--filter".to_string());
                    args.push(filter.clone());
                }
                args.push("add".to_string());
                args.extend_from_slice(packages);
                if workspace_root {
                    args.push("-w".to_string());
                }
                if workspace_only {
                    args.push("--workspace".to_string());
                }
                args.extend_from_slice(extra_args);
            }
            PackageManagerType::Yarn => {
                // yarn：workspace <pkg> add
                if !filters.is_empty() {
                    // yarn workspace <name> add
                    for filter in filters {
                        args.push("workspace".to_string());
                        args.push(filter.clone());
                    }
                }
                args.push("add".to_string());
                args.extend_from_slice(packages);
                if workspace_root {
                    args.push("-W".to_string());
                }
                args.extend_from_slice(extra_args);
            }
            PackageManagerType::Npm => {
                // npm：--workspace 必须放在 install 之前
                if !filters.is_empty() {
                    for filter in filters {
                        args.push("--workspace".to_string());
                        args.push(filter.clone());
                    }
                }
                args.push("install".to_string());
                args.extend_from_slice(packages);
                if workspace_root {
                    args.push("-w".to_string());
                }
                args.extend_from_slice(extra_args);
            }
            PackageManagerType::Bun => {
                // bun：简单的 add 命令，不支持 workspace filter
                args.push("add".to_string());
                args.extend_from_slice(packages);
                args.extend_from_slice(extra_args);
            }
        }

        args
    }

    /// 构建带 workspace 支持的 remove 命令参数
    pub fn build_remove_args(
        &self,
        packages: &[String],
        filters: &[String],
        workspace_root: bool,
        extra_args: &[String],
    ) -> Vec<String> {
        let mut args = Vec::new();

        match self.client {
            PackageManagerType::Pnpm => {
                for filter in filters {
                    args.push("--filter".to_string());
                    args.push(filter.clone());
                }
                args.push("remove".to_string());
                args.extend_from_slice(packages);
                if workspace_root {
                    args.push("-w".to_string());
                }
                args.extend_from_slice(extra_args);
            }
            PackageManagerType::Yarn => {
                if !filters.is_empty() {
                    for filter in filters {
                        args.push("workspace".to_string());
                        args.push(filter.clone());
                    }
                }
                args.push("remove".to_string());
                args.extend_from_slice(packages);
                args.extend_from_slice(extra_args);
            }
            PackageManagerType::Npm => {
                if !filters.is_empty() {
                    for filter in filters {
                        args.push("--workspace".to_string());
                        args.push(filter.clone());
                    }
                }
                args.push("uninstall".to_string());
                args.extend_from_slice(packages);
                args.extend_from_slice(extra_args);
            }
            PackageManagerType::Bun => {
                // bun：简单的 remove 命令，不支持 workspace filter
                args.push("remove".to_string());
                args.extend_from_slice(packages);
                args.extend_from_slice(extra_args);
            }
        }

        args
    }
}
```

#### 3. Add 命令实现

**文件**：`crates/vite_task/src/add.rs`（新文件）

```rust
pub struct AddCommand {
    workspace_root: AbsolutePathBuf,
}

impl AddCommand {
    pub fn new(workspace_root: AbsolutePathBuf) -> Self {
        Self { workspace_root }
    }

    pub async fn execute(
        self,
        packages: Vec<String>,
        filters: Vec<String>,
        workspace_root: bool,
        workspace_only: bool,
        extra_args: Vec<String>,
    ) -> Result<ExecutionSummary, Error> {
        let package_manager = PackageManager::builder(&self.workspace_root).build().await?;
        let workspace = Workspace::partial_load(self.workspace_root)?;

        let resolve_command = package_manager.resolve_command();

        // 构建带 workspace 支持的命令
        let full_args = package_manager.build_add_args(
            &packages,
            &filters,
            workspace_root,
            workspace_only,
            &extra_args,
        );

        let resolved_task = ResolvedTask::resolve_from_builtin_with_command_result(
            &workspace,
            "add",
            full_args.iter().map(String::as_str),
            ResolveCommandResult {
                bin_path: resolve_command.bin_path,
                envs: resolve_command.envs,
            },
            false,
        )?;

        let mut task_graph: StableGraph<ResolvedTask, ()> = Default::default();
        task_graph.add_node(resolved_task);
        let summary = ExecutionPlan::plan(task_graph, false)?.execute(&workspace).await?;
        workspace.unload().await?;

        Ok(summary)
    }
}
```

#### 4. Remove 命令实现

**文件**：`crates/vite_task/src/remove.rs`（新文件）

```rust
pub struct RemoveCommand {
    workspace_root: AbsolutePathBuf,
}

impl RemoveCommand {
    pub fn new(workspace_root: AbsolutePathBuf) -> Self {
        Self { workspace_root }
    }

    pub async fn execute(
        self,
        packages: Vec<String>,
        filters: Vec<String>,
        workspace_root: bool,
        extra_args: Vec<String>,
    ) -> Result<ExecutionSummary, Error> {
        let package_manager = PackageManager::builder(&self.workspace_root).build().await?;
        let workspace = Workspace::partial_load(self.workspace_root)?;

        let resolve_command = package_manager.resolve_command();

        // 构建带 workspace 支持的命令
        let full_args = package_manager.build_remove_args(
            &packages,
            &filters,
            workspace_root,
            &extra_args,
        );

        let resolved_task = ResolvedTask::resolve_from_builtin_with_command_result(
            &workspace,
            "remove",
            full_args.iter().map(String::as_str),
            ResolveCommandResult {
                bin_path: resolve_command.bin_path,
                envs: resolve_command.envs,
            },
            false,
        )?;

        let mut task_graph: StableGraph<ResolvedTask, ()> = Default::default();
        task_graph.add_node(resolved_task);
        let summary = ExecutionPlan::plan(task_graph, false)?.execute(&workspace).await?;
        workspace.unload().await?;

        Ok(summary)
    }
}
```

### 特殊处理

#### 1. 全局包

Yarn 对全局操作需要不同的命令结构：

```rust
// pnpm/npm/bun: <bin> add -g <package>
// yarn: <bin> global add <package>

fn handle_global_flag(args: &[String], pm_type: PackageManagerType) -> (Vec<String>, bool) {
    let has_global = args.contains(&"-g".to_string()) || args.contains(&"--global".to_string());
    let filtered_args: Vec<String> = args.iter()
        .filter(|a| *a != "-g" && *a != "--global")
        .cloned()
        .collect();

    (filtered_args, has_global)
}
```

#### 2. Workspace Filters

pnpm 使用 `--filter` 放在命令前，而 yarn/npm 使用不同的方法：

```rust
fn build_workspace_command(
    pm_type: PackageManagerType,
    filters: &[String],
    operation: &str,
    packages: &[String],
) -> Vec<String> {
    match pm_type {
        PackageManagerType::Pnpm => {
            // pnpm --filter <pkg> add <deps>
            let mut args = Vec::new();
            for filter in filters {
                args.push("--filter".to_string());
                args.push(filter.clone());
            }
            args.push(operation.to_string());
            args.extend_from_slice(packages);
            args
        }
        PackageManagerType::Yarn => {
            // yarn workspace <pkg> add <deps>
            let mut args = Vec::new();
            if let Some(filter) = filters.first() {
                args.push("workspace".to_string());
                args.push(filter.clone());
            }
            args.push(operation.to_string());
            args.extend_from_slice(packages);
            args
        }
        PackageManagerType::Npm => {
            // npm install <deps> --workspace <pkg>
            let mut args = vec![operation.to_string()];
            args.extend_from_slice(packages);
            for filter in filters {
                args.push("--workspace".to_string());
                args.push(filter.clone());
            }
            args
        }
        PackageManagerType::Bun => {
            // bun：不支持 workspace filter
            let mut args = vec![operation.to_string()];
            args.extend_from_slice(packages);
            args
        }
    }
}
```

#### 3. Workspace 依赖

当使用 `--workspace` 标志添加 workspace 依赖时：

```bash
# pnpm：以 workspace: 协议添加
vp add @myorg/utils --workspace --filter app
# → pnpm --filter app add @myorg/utils --workspace
# → 添加为："@myorg/utils": "workspace:*"

# 不使用 --workspace：尝试从 registry 安装
vp add @myorg/utils --filter app
# → pnpm --filter app add @myorg/utils
# → 尝试从 npm registry 安装（如果尚未发布，可能失败）
```

## 设计决策

### 1. 不缓存

**决策**：不缓存 add/remove 操作。

**原因**：

- 这些命令会修改 package.json 和 lockfile
- 副作用使得缓存不合适
- 每次执行都应重新运行
- 类似于 `vp install` 的工作方式

**实现**：设置 `cacheable: false`，或者完全跳过缓存。

### 2. 参数透传

**决策**：在包名之后的所有参数直接透传给包管理器。

**原因**：

- 包管理器有很多标志参数（npm 有 40+ 个）
- 维护完整的标志映射很容易出错
- 透传可以访问所有功能
- 只翻译关键命令名称差异

**示例**：

```bash
vp add react --save-exact
# → pnpm add react --save-exact
# → yarn add react --save-exact
# → npm install react --save-exact
# → bun add react --exact
```

### 3. 仅支持常用标志

**决策**：只显式支持最常用的标志，并进行自动翻译。

**常用标志**：

- `-D, --save-dev` - 各家均支持
- `-g, --global` - yarn 需要特殊处理；bun 使用 `--global` / `-g`
- `-E, --save-exact` - 各家均支持
- `-P, --save-peer` - 各家均支持
- `-O, --save-optional` - 各家均支持

**高级标志**：原样透传

### 4. 命令别名

**决策**：为 remove 命令支持多个别名。

**别名**：

- `vp remove`（主命令）
- `vp rm`（短别名）
- `vp un`（短别名，与 pnpm 一致）
- `vp uninstall`（显式，与 npm 一致）

**原因**：符合用户对其他工具的预期。

### 5. 支持多个包

**决策**：允许在单个命令中指定多个包。

**示例**：

```bash
vp add react react-dom @types/react -D
vp remove lodash axios underscore
```

**实现**：包名作为标志前的位置参数。

## 错误处理

### 未指定包

```bash
$ vp add
Error: No packages specified
Usage: vp add <PACKAGES>... [OPTIONS]
```

### 未检测到包管理器

```bash
$ vp add react
Error: No package manager detected
Please run one of:
  - vp install (to set up package manager)
  - Add packageManager field to package.json
```

### 无效的包名

让底层包管理器负责校验并提供清晰的错误信息。

## 用户体验

### 成功输出

```bash
$ vp add react react-dom
Detected package manager: pnpm@10.15.0
Running: pnpm add react react-dom

 WARN  deprecated inflight@1.0.6: ...

Packages: +2
++
Progress: resolved 150, reused 140, downloaded 10, added 2, done

dependencies:
+ react 18.3.1
+ react-dom 18.3.1

Done in 2.3s
```

### 错误输出

```bash
$ vp add invalid-package-that-does-not-exist
Detected package manager: pnpm@10.15.0
Running: pnpm add invalid-package-that-does-not-exist

 ERR_PNPM_FETCH_404  GET https://registry.npmjs.org/invalid-package-that-does-not-exist: Not Found - 404

This error happened while installing the dependencies of undefined@undefined

Error: Command failed with exit code 1
```

## 考虑过的替代方案

### 方案 1：标志翻译层

将所有标志翻译为各包管理器对应的等价形式：

```bash
vp add react --dev
# → pnpm add react -D
# → yarn add react --dev
# → npm install react --save-dev
# → bun add react --dev
```

**被拒绝的原因**：

- 维护负担重（npm 40+ 个标志）
- 包管理器会随着新标志不断演进
- 透传更简单、更灵活
- 用户可以直接使用原生标志

### 方案 2：为每个包管理器单独提供命令

```bash
vp pnpm:add react
vp yarn:add react
vp npm:install react
vp bun:add react
```

**被拒绝的原因**：

- 背离统一接口的初衷
- 更冗长
- 无法利用自动检测

### 方案 3：交互模式

以交互方式提示输入包和选项：

```bash
$ vp add
? Which packages to add? react
? Add as dev dependency? Yes
```

**初始版本中被拒绝的原因**：

- 对有经验的用户来说更慢
- 不能用于脚本化
- 之后可以作为可选模式再添加

## 实现计划

### 阶段 1：核心功能

1. 在 `Commands` 枚举中添加 `Add` 和 `Remove` 命令变体
2. 创建 `add.rs` 和 `remove.rs` 模块
3. 实现包管理器命令解析
4. 添加基础错误处理

### 阶段 2：特殊情况

1. 以不同方式处理 yarn 全局命令
2. 校验包名（可选）
3. 支持特定 workspace 的操作

### 阶段 3：测试

1. 命令解析的单元测试
2. 使用模拟包管理器的集成测试
3. 使用真实包管理器进行手动测试

### 阶段 4：文档

1. 更新 CLI 文档
2. 在 README 中添加示例
3. 记录标志兼容性矩阵

## 测试策略

### 测试包管理器版本

- pnpm@9.x [WIP]
- pnpm@10.x
- pnpm@11.x
- yarn@1.x [WIP]
- yarn@4.x
- npm@10.x
- npm@11.x [WIP]
- bun@1.x

### 单元测试

```rust
#[test]
fn test_add_command_resolution() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    assert_eq!(pm.resolve_add_command(), "add");

    let pm = PackageManager::mock(PackageManagerType::Npm);
    assert_eq!(pm.resolve_add_command(), "install");

    let pm = PackageManager::mock(PackageManagerType::Bun);
    assert_eq!(pm.resolve_add_command(), "add");
}

#[test]
fn test_remove_command_resolution() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    assert_eq!(pm.resolve_remove_command(), "remove");

    let pm = PackageManager::mock(PackageManagerType::Npm);
    assert_eq!(pm.resolve_remove_command(), "uninstall");

    let pm = PackageManager::mock(PackageManagerType::Bun);
    assert_eq!(pm.resolve_remove_command(), "remove");
}

#[test]
fn test_build_add_args_pnpm() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.build_add_args(
        &["react".to_string()],
        &["app".to_string()],
        false,
        false,
        &[],
    );
    assert_eq!(args, vec!["--filter", "app", "add", "react"]);
}

#[test]
fn test_build_add_args_with_workspace_root() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.build_add_args(
        &["typescript".to_string()],
        &[],
        true,  // 工作区根目录
        false,
        &["-D".to_string()],
    );
    assert_eq!(args, vec!["add", "typescript", "-w", "-D"]);
}

#[test]
fn test_build_add_args_yarn_workspace() {
    let pm = PackageManager::mock(PackageManagerType::Yarn);
    let args = pm.build_add_args(
        &["react".to_string()],
        &["app".to_string()],
        false,
        false,
        &[],
    );
    assert_eq!(args, vec!["workspace", "app", "add", "react"]);
}

#[test]
fn test_build_remove_args_with_filter() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.build_remove_args(
        &["lodash".to_string()],
        &["utils".to_string()],
        false,
        &[],
    );
    assert_eq!(args, vec!["--filter", "utils", "remove", "lodash"]);
}
```

### 集成测试

为每个包管理器创建测试夹具：

```
fixtures/add-remove-test/
  pnpm-workspace.yaml
  package.json
  packages/
    app/
      package.json
    utils/
      package.json
  test-steps.json
```

测试用例：

1. 添加单个包
2. 添加多个包
3. 使用 -D 标志添加
4. 使用 --filter 向特定包添加
5. 使用 --filter 通配符模式添加
6. 使用 -w 添加到 workspace 根目录
7. 使用 --workspace 添加 workspace 依赖
8. 删除单个包
9. 删除多个包
10. 使用 --filter 删除
11. 无效包的错误处理
12. yarn/npm 上不兼容 filter 的错误处理

## CLI 帮助输出

### add 命令

```bash
$ vp add --help
Add packages to dependencies

Usage: vp add <PACKAGES>... [OPTIONS]

Arguments:
  <PACKAGES>...  Packages to add

Options:
  --filter <PATTERN>   Filter packages in monorepo (can be used multiple times)
  -w, --workspace-root Add to workspace root (ignore-workspace-root-check)
  --workspace          Only add if package exists in workspace
  -D, --save-dev       Add as dev dependency
  -P, --save-peer      Add as peer dependency
  -O, --save-optional  Add as optional dependency
  -E, --save-exact     Save exact version
  -g, --global         Install globally
  -h, --help           Print help

Filter Patterns:
  <name>           Exact package name match
  <pattern>*       Wildcard match (pnpm only)
  @<scope>/*       Scope match (pnpm only)
  !<pattern>       Exclude pattern (pnpm only)
  <pkg>...         Package and dependencies (pnpm only)
  ...<pkg>         Package and dependents (pnpm only)

Examples:
  vp add react react-dom
  vp add -D typescript @types/react
  vp add react --filter app
  vp add react --filter "app*" --filter "!app-test"
  vp add @myorg/utils --workspace --filter web
  vp add lodash -w
```

### remove 命令

```bash
$ vp remove --help
Remove packages from dependencies

Usage: vp remove <PACKAGES>... [OPTIONS]

Aliases: rm, un, uninstall

Arguments:
  <PACKAGES>...  Packages to remove

Options:
  --filter <PATTERN>   Filter packages in monorepo (can be used multiple times)
  -w, --workspace-root Remove from workspace root
  -g, --global         Remove global packages
  -h, --help           Print help

Filter Patterns:
  <name>           Exact package name match
  <pattern>*       Wildcard match (pnpm only)
  @<scope>/*       Scope match (pnpm only)
  !<pattern>       Exclude pattern (pnpm only)

Examples:
  vp remove lodash
  vp remove axios underscore lodash
  vp rm lodash --filter app
  vp remove utils --filter "app*"
  vp rm old-package
```

## 性能考虑

1. **不缓存**：操作直接运行，无缓存开销
2. **单次执行**：与任务运行器不同，这些是一次性操作
3. **透传**：处理最少，只做命令翻译
4. **自动检测**：复用现有的包管理器检测逻辑（已缓存）

## 安全考虑

1. **包名校验**：让包管理器负责校验
2. **锁文件完整性**：由包管理器保证完整性
3. **不执行代码**：只是透传给受信任的包管理器
4. **审计标志**：用户可以通过透传添加 `--audit`

## 向后兼容性

这是一个没有破坏性变更的新功能：

- 现有命令不受影响
- 新命令是增量添加的
- 不更改任务配置
- 不更改缓存行为

## 迁移路径

### 采用方式

用户可以立即开始使用：

```bash
# 旧方式（特定于包管理器）
pnpm add react
yarn add react
npm install react
bun add react

# 新方式（适用于任何包管理器）
vp add react
```

### 可发现性

添加到：

- CLI 帮助输出
- 文档
- VSCode 扩展建议
- Shell 补全

## 文档要求

### 用户指南

添加到 CLI 文档中：

````markdown
### 添加包

```bash
vp add <packages>... [OPTIONS]
```
````

会自动使用检测到的包管理器（pnpm/yarn/npm/bun）。

**基础示例：**

- `vp add react` - 添加生产依赖
- `vp add -D typescript` - 添加开发依赖
- `vp add react react-dom` - 添加多个包

**工作区示例：**

- `vp add react --filter app` - 添加到特定包
- `vp add react --filter "app*"` - 添加到多个包（pnpm）
- `vp add @myorg/utils --workspace --filter web` - 添加工作区依赖
- `vp add lodash -w` - 添加到工作区根目录

**常用选项：**

- `--filter <pattern>` - 目标特定工作区包
- `-w, --workspace-root` - 添加到工作区根目录
- `--workspace` - 添加工作区依赖（pnpm）
- `-D, --save-dev` - 作为开发依赖添加
- `-E, --save-exact` - 保存精确版本
- `-P, --save-peer` - 作为 peer 依赖添加
- `-O, --save-optional` - 作为可选依赖添加
- `-g, --global` - 全局安装

### 删除包

```bash
vp remove <packages>... [OPTIONS]
vp rm <packages>... [OPTIONS]
```

别名：`rm`、`un`、`uninstall`

**基础示例：**

- `vp remove lodash` - 删除包
- `vp rm axios underscore` - 删除多个包

**工作区示例：**

- `vp remove lodash --filter app` - 从特定包中删除
- `vp rm utils --filter "app*"` - 从多个包中删除（pnpm）
- `vp remove -g typescript` - 删除全局包

**选项：**

- `--filter <pattern>` - 目标特定工作区包
- `-w, --workspace-root` - 从工作区根目录删除
- `-g, --global` - 删除全局包

````
### 包管理器兼容性

记录 flag 支持矩阵：

| Flag | pnpm | yarn | npm | bun |
|------|------|------|-----|-----|
| `-D` | ✅ | ✅ | ✅ | ✅ |
| `-E` | ✅ | ✅ | ✅ | ✅ |
| `-P` | ✅ | ✅ | ✅ | ✅ |
| `-O` | ✅ | ✅ | ✅ | ✅ |
| `-g` | ✅ | ⚠️（使用 global） | ✅ | ✅ |

## 工作区操作深入说明

### 过滤模式（受 pnpm 启发）

遵循 pnpm 的 filter API：

**精确匹配：**
```bash
vp add react --filter app
# → pnpm --filter app add react
````

**通配符模式：**

```bash
vp add react --filter "app*"
# → pnpm --filter "app*" add react
# 匹配：app、app-web、app-mobile
```

**范围模式：**

```bash
vp add lodash --filter "@myorg/*"
# → pnpm --filter "@myorg/*" add lodash
# 匹配 @myorg 作用域中的所有包
```

**排除模式：**

```bash
vp add react --filter "!test*"
# → pnpm --filter "!test*" add react
# 添加到所有包，除以 test 开头的包之外
```

**多个过滤器：**

```bash
vp add react --filter app --filter web
# → pnpm --filter app --filter web add react
# 同时添加到 app 和 web 包
```

**依赖选择器：**

```bash
# 添加到包及其所有依赖
vp add lodash --filter "app..."
# → pnpm --filter "app..." add lodash

# 添加到包及其所有依赖者
vp add utils --filter "...core"
# → pnpm --filter "...core" add utils
```

### 工作区根目录操作

向工作区根目录添加依赖（需要特殊 flag）：

```bash
vp add -D typescript -w
# → pnpm add -D typescript -w  （pnpm）
# → yarn add -D typescript -W  （yarn）
# → npm install -D typescript -w  （npm）
# → bun add --dev typescript  （bun，没有 workspace root flag）
```

**原因**：默认情况下，包管理器会阻止向工作区根目录添加，以鼓励正确的包结构。

### 工作区协议

用于内部 monorepo 依赖：

```bash
# 使用 workspace: 协议添加工作区依赖
vp add @myorg/utils --workspace --filter app
# → pnpm --filter app add @myorg/utils --workspace
# → 添加："@myorg/utils": "workspace:*"

# 指定版本
vp add "@myorg/utils@workspace:^" --filter app
# → 添加："@myorg/utils": "workspace:^"
```

### 包管理器兼容性

| 功能                       | pnpm              | yarn                 | npm                     | bun              | 说明                     |
| -------------------------- | ----------------- | -------------------- | ----------------------- | ---------------- | ------------------------ |
| `--filter <pattern>`       | ✅ 原生支持       | ⚠️ `workspace <name>` | ⚠️ `--workspace <name>` | ❌ 不支持         | 语法不同                 |
| 多个过滤器                 | ✅ 可重复使用 flag | ❌ 仅支持单个         | ⚠️ 有限                 | ❌ 不支持         | pnpm 最灵活              |
| 通配符模式                 | ✅ 完整支持       | ⚠️ 有限               | ❌ 不支持通配符         | ❌ 不支持         | pnpm 最佳                |
| 排除 `!`                   | ✅ 支持           | ❌ 不支持             | ❌ 不支持               | ❌ 不支持         | 仅 pnpm                  |
| 依赖选择器 `...`          | ✅ 支持           | ❌ 不支持             | ❌ 不支持               | ❌ 不支持         | 仅 pnpm                  |
| `-w`（根目录）             | ✅ `-w`           | ✅ `-W`              | ✅ `-w`                 | ❌ 不支持         | flag 略有不同           |
| `--workspace` 协议         | ✅ 支持           | ❌ 需手动处理         | ❌ 需手动处理           | ❌ 不支持         | pnpm 特性               |

**优雅降级**：

- pnpm 的高级特性（通配符、排除、选择器）在 yarn/npm/bun 上会报错，并给出有帮助的信息
- 基础的 `--filter <exact-name>` 可在所有包管理器上正常工作

## 未来增强

### 1. 为 yarn/npm/bun 增强过滤支持

为 yarn/npm/bun 实现通配符转换：

```bash
vp add react --filter "app*"
# → 对 yarn：对每个匹配的包运行 `yarn workspace app add react`
# → 对 npm：对每个匹配的包运行 `npm install react --workspace app`
# → 对 bun：在每个匹配的包目录中运行 `bun add react`
```

### 2. 交互模式

> 参考 ni 的交互模式 https://github.com/antfu-collective/ni

```bash
$ vp add --interactive
? Select for package > tsdown
❯   tsdown                         v0.15.7 - git+https://github.com/rolldown/tsdown.git
    tsdown-config-silverwind       v1.4.0 - git+https://github.com/silverwind/tsdown-config-silverwind.git
    @storm-software/tsdown         v0.45.0 - git+https://github.com/storm-software/storm-ops.git
    create-tsdown                  v0.15.7 - git+https://github.com/rolldown/tsdown.git
    shadcn-auv                     v0.0.1 - git+https://github.com/ohojs/shadcn-auv.git
    ts-build-wizard                v1.0.3 - git+https://github.com/Alireza-Tabatabaeian/react-app-registry.git
    vite-plugin-shadcn-registry    v0.0.6 - git+https://github.com/myshkouski/vite-plugin-shadcn-registry.git
    @qds.dev/tools                 v0.3.3 - https://www.npmjs.com/package/@qds.dev/tools
    feishu-bot-notify              v0.1.3 - git+https://github.com/duowb/feishu-bot-notify.git
    @memo28.pro/bundler            v0.0.2 - https://www.npmjs.com/package/@memo28.pro/bundler
    tsdown-jsr-exports-lint        v0.1.4 - git+https://github.com/kazupon/tsdown-jsr-exports-lint.git
    @miloas/tsdown                 v0.13.0 - git+https://github.com/rolldown/tsdown.git
    @socket-synced-state/server    v0.0.9 - https://www.npmjs.com/package/@socket-synced-state/server
    @gamedev-sensei/tsdown-config  v2.0.1 - git+ssh://git@github.com/gamedev-sensei/package-extras.git
  ↓ 0xpresc-test                   v0.1.0 - https://www.npmjs.com/package/0xpresc-test

? install tsdown as › - Use arrow-keys. Return to submit.
❯   prod
    dev
    peer
```

### 3. 升级命令

```bash
vp upgrade react
vp upgrade --latest
vp upgrade --interactive
```

### 4. 智能建议

```bash
$ vp add react
Adding react...
💡 建议：是否为 TypeScript 支持安装 @types/react？
   运行：vp add -D @types/react
```

### 5. 依赖分析

```bash
$ vp add react
Analyzing dependency impact...
  Will add:
    react@18.3.1 (85KB)
    + scheduler@0.23.0 (5KB)
  Total size: 90KB

Proceed? (Y/n)
```

## 未决问题

1. **我们是否应该警告 peer 依赖冲突？**
   - 建议：让包管理器处理警告
   - 之后可以通过自定义警告增强

2. **我们是否应该支持版本指定符？**
   - 建议：支持，并直接透传给包管理器
   - 示例：`vp add react@18.2.0`

3. **我们是否应该支持作用域包快捷写法？**
   - 建议：不做特殊处理，原样透传
   - 示例：`vp add @types/react` 可自然工作

4. **我们是否应该阻止添加到错误的依赖类型？**
   - 建议：不做校验，信任包管理器
   - 包管理器已经能很好地处理这个问题

5. **如何处理 yarn/npm 上 pnpm 特有的 filter 功能？**
   - 建议：对于 yarn/npm 的通配符/排除：
     - 方案 A：报错并清晰说明这是 pnpm 专有特性
     - 方案 B：我们自己解析通配符并对每个包执行命令
   - 推荐：先采用方案 A，之后再加入方案 B

6. **我们是否应该支持 workspace 协议配置？**
   - 建议：透传给 pnpm，并在 .npmrc 中为用户记录文档
   - 示例：在 .npmrc 中设置 `save-workspace-protocol=rolling`
   - Vite+ 不需要显式处理这一点

7. **我们是否应该校验被过滤的包是否存在？**
   - 建议：让包管理器进行校验
   - 原生工具会给出更清晰的错误信息
   - 避免重复实现工作区解析逻辑

## 成功指标

1. **采用率**：使用 `vp add/remove` 与直接使用包管理器的用户占比
2. **错误率**：跟踪命令失败率与直接使用包管理器时的对比
3. **用户反馈**：关于命令易用性的调查/issue
4. **性能**：测量相较于直接调用包管理器的开销（目标 <100ms）

## 实施时间线

- **第 1 周**：核心实现（命令解析、包管理器适配器）
- **第 2 周**：测试（单元测试、集成测试）
- **第 3 周**：文档和示例
- **第 4 周**：审查、润色和发布

## 依赖项

### 新依赖

不需要 - 利用现有的：

- `vite_package_manager` - 包管理器检测
- `clap` - 命令解析
- 现有任务执行基础设施

### 修改的文件

- `crates/vite_task/src/lib.rs` - 添加命令枚举变体
- `crates/vite_task/src/add.rs` - 新文件
- `crates/vite_task/src/remove.rs` - 新文件
- `crates/vite_package_manager/src/package_manager.rs` - 添加命令解析方法
- `docs/cli.md` - 文档更新

## 工作区功能实现优先级

### 阶段 1：核心功能（MVP）

- ✅ 基本的添加/移除，不带过滤器
- ✅ 支持多个包
- ✅ 自动检测包管理器
- ✅ 常用标志（-D、-E、-P、-O）

### 阶段 2：工作区支持（以 pnpm 为重点）

- ✅ `--filter <exact-name>` 适用于所有包管理器
- ✅ `-w` 标志用于工作区根目录
- ✅ `--workspace` 标志用于工作区依赖（pnpm）
- ✅ 通配符模式 `*`（仅 pnpm，其他情况报错）
- ✅ 范围模式 `@scope/*`（仅 pnpm）

### 阶段 3：高级过滤器（以 pnpm 为重点）

- 排除模式 `!<pattern>`（仅 pnpm）
- 依赖选择器 `...`（仅 pnpm）
- 支持多个过滤器
- 为 yarn/npm 提供优雅降级

### 阶段 4：跨包管理器兼容性（可选）

- 为 yarn/npm 解析通配符
- 为每个匹配的包运行过滤后的命令
- 在所有包管理器之间提供统一行为

## 真实世界使用示例

### Monorepo 包管理

```bash
# 将 React 添加到所有前端包
vp add react react-dom --filter "@myorg/app-*"

# 将测试库添加到所有包
vp add -D vitest --filter "*"

# 将共享工具添加到 app 包（工作区依赖）
vp add @myorg/shared-utils --workspace --filter "@myorg/app-*"

# 从所有包中移除已弃用的包
vp remove moment --filter "*"

# 将 TypeScript 添加到工作区根目录（共享配置）
vp add -D typescript @types/node -w
```

### 开发工作流

```bash
# 克隆新的 monorepo
git clone <repo>
vp install

# 向 web 应用添加新的功能依赖
cd packages/web
vp add axios react-query

# 向特定包添加开发工具
vp add -D webpack-bundle-analyzer --filter web

# 从 utils 包中移除未使用的依赖
vp rm lodash underscore --filter utils

# 将工作区包作为依赖添加
vp add @myorg/ui-components --workspace --filter web
```

### 从直接使用包管理器迁移

```bash
# 之前（特定于包管理器）
pnpm --filter app add react
yarn workspace app add react
npm install react --workspace app

# 之后（统一）
vp add react --filter app
```

## 结论

本 RFC 提议添加 `vp add` 和 `vp remove` 命令，以为 pnpm/yarn/npm 之间的包管理提供统一接口。该设计：

- ✅ 自动适配检测到的包管理器
- ✅ 在单个命令中支持多个包
- ✅ **完整支持工作区，遵循 pnpm 的 API 设计**
- ✅ **支持用于定位特定包的过滤模式**
- ✅ **支持工作区根目录和 workspace 协议**
- ✅ 使用透传以获得最大灵活性
- ✅ 无缓存开销（按要求）
- ✅ 利用现有基础设施，实现简单
- ✅ 为包管理器特定功能提供优雅降级
- ✅ 可扩展以支持未来增强

该实现遵循 pnpm 久经验证的工作区 API 设计，同时为 yarn/npm 用户提供优雅降级。这将通过统一、直观的界面，为 monorepo 开发者带来立竿见影的价值。
