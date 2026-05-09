# RFC：Vite+ 链接与取消链接包命令

## 摘要

添加 `vp link`（别名：`vp ln`）和 `vp unlink` 命令，根据检测到的包管理器（pnpm/yarn/npm/bun）自动适配，用于创建和移除指向本地包的符号链接，使其可在系统范围内或其他位置访问。这将支持本地包开发和测试工作流。

## 动机

目前，开发者必须手动使用各包管理器特定的命令来链接本地包：

```bash
pnpm link --global
pnpm link --global <pkg>
yarn link
yarn link <package>
npm link
npm link <package>
```

这给本地开发工作流带来了阻力，并且需要记住不同的语法。一个统一的接口将：

1. **简化本地开发**：一条命令适用于所有包管理器
2. **自动检测**：自动使用正确的包管理器
3. **一致性**：无论底层工具是什么，语法都相同
4. **集成**：与现有的 Vite+ 功能无缝协作

### 当前痛点

```bash
# 开发者需要知道当前使用的是哪种包管理器
pnpm link --global                    # pnpm 项目 - 注册当前包
pnpm link --global react              # pnpm 项目 - 链接全局包
yarn link                             # yarn 项目 - 注册当前包
yarn link react                       # yarn 项目 - 链接全局包
npm link                              # npm 项目 - 注册当前包
npm link react                        # npm 项目 - 链接全局包

# 不同的 unlink 命令
pnpm unlink --global
pnpm unlink --global react
yarn unlink
yarn unlink react
npm unlink
npm unlink react
```

### 提议的解决方案

```bash
# 适用于所有包管理器

# 将当前包注册为全局可链接包
vp link
vp ln

# 将全局包链接到当前项目
vp link react
vp ln lodash

# 将某个目录中的包链接过来
vp link ./packages/my-lib
vp link ../other-project

# 工作区操作
vp link --filter app                # 在指定包中链接
vp link react --filter "app*"       # 在多个包中链接

# 取消链接操作
vp unlink                           # 取消当前包的链接
vp unlink react                     # 取消指定包的链接
vp unlink --filter app              # 在指定工作区中取消链接
```

## 提议的解决方案

### 命令语法

#### Link 命令

```bash
vp link [PACKAGE]
vp ln [PACKAGE]        # 别名
```

**示例：**

```bash
# 将当前包注册为全局可链接包（使其可被链接）
vp link
vp ln

# 将全局包链接到当前项目
vp link react
vp link @types/node

# 将本地目录作为包链接
vp link ./packages/utils
vp link ../my-other-project
```

#### Unlink 命令

```bash
vp unlink [PACKAGE] [OPTIONS]
```

**示例：**

```bash
# 从全局取消注册当前包
vp unlink

# 从当前项目取消某个包的链接
vp unlink react
vp unlink @types/node

# 在每个工作区包中取消链接（仅 pnpm）
vp unlink --recursive
vp unlink -r
```

### 命令映射

#### Link 命令映射

**pnpm 参考：**

- https://pnpm.io/cli/link
- pnpm link 会为本地包创建符号链接，或链接全局包

**yarn 参考：**

- https://classic.yarnpkg.com/en/docs/cli/link (yarn@1)
- https://yarnpkg.com/cli/link (yarn@2+)
- yarn link 会注册/链接包

**npm 参考：**

- https://docs.npmjs.com/cli/v11/commands/npm-link
- npm link 会在包之间创建符号链接

**bun 参考：**

- https://bun.sh/docs/cli/link
- bun link 会为本地包创建符号链接

| Vite+ 命令      | pnpm              | yarn@1            | yarn@2+           | npm              | bun              | 描述                                   |
| --------------- | ----------------- | ----------------- | ----------------- | ---------------- | ---------------- | -------------------------------------- |
| `vp link`       | `pnpm link`       | `yarn link`       | `yarn link`       | `npm link`       | `bun link`       | 注册当前包或链接到本地目录             |
| `vp link <pkg>` | `pnpm link <pkg>` | `yarn link <pkg>` | `yarn link <pkg>` | `npm link <pkg>` | `bun link <pkg>` | 将包链接到当前项目                     |
| `vp link <dir>` | `pnpm link <dir>` | `yarn link <dir>` | `yarn link <dir>` | `npm link <dir>` | `bun link <dir>` | 将 `<dir>` 目录中的包链接到当前项目    |

#### Unlink 命令映射

**pnpm 参考：**

- https://pnpm.io/cli/unlink
- 从 node_modules 中取消包的链接，并移除全局链接

**yarn 参考：**

- https://classic.yarnpkg.com/en/docs/cli/unlink (yarn@1)
- https://yarnpkg.com/cli/unlink (yarn@2+)
- 取消之前链接过的包

**npm 参考：**

- https://docs.npmjs.com/cli/v11/commands/npm-uninstall
- npm unlink 会移除符号链接

| Vite+ 命令             | pnpm                      | yarn@1              | yarn@2+             | npm                | bun          | 描述                           |
| --------------------- | ------------------------- | ------------------- | ------------------- | ------------------ | ------------ | ------------------------------ |
| `vp unlink`           | `pnpm unlink`             | `yarn unlink`       | `yarn unlink`       | `npm unlink`       | `bun unlink` | 取消当前包的链接               |
| `vp unlink <pkg>`     | `pnpm unlink <pkg>`       | `yarn unlink <pkg>` | `yarn unlink <pkg>` | `npm unlink <pkg>` | `bun unlink` | 取消指定包的链接               |
| `vp unlink --recursive` | `pnpm unlink --recursive` | N/A                 | `yarn unlink --all` | N/A                | N/A          | 在每个工作区包中取消链接       |

### 各包管理器之间的 Link/Unlink 行为差异

#### pnpm

**Link 行为：**

- `pnpm link`：将当前包依赖链接到本地目录
- `pnpm link <pkg>`：将一个包链接到当前项目（会同时搜索全局和本地）
- `pnpm link <dir>`：直接链接本地目录（无需全局注册）

**Unlink 行为：**

- `pnpm unlink`：取消当前包依赖的链接（移除符号链接）
- `pnpm unlink <pkg>`：取消指定包的链接
- `pnpm unlink --global`：从全局存储中取消当前包的链接

#### yarn

**Link 行为（yarn@1）：**

- `yarn link`：将当前包注册到全局
- `yarn link <pkg>`：将全局包链接到当前项目
- 不支持直接目录链接（需要先在目标包中执行 `yarn link`）

**Link 行为（yarn@2+）：**

- `yarn link`：为当前包创建链接
- `yarn link <pkg>`：链接包
- `yarn link <dir>`：链接本地目录

**Unlink 行为：**

- `yarn unlink`：取消当前包的链接
- `yarn unlink <pkg>`：取消指定包的链接

#### npm

**Link 行为：**

- `npm link`：为当前包创建全局符号链接
- `npm link <pkg>`：将全局包链接到当前项目
- `npm link <dir>`：链接本地目录包

**Unlink 行为：**

- `npm unlink`：移除当前包的全局符号链接
- `npm unlink <pkg>`：从当前项目中移除包

#### bun

**Link 行为：**

- `bun link`：将当前包注册为可链接包
- `bun link <pkg>`：将已注册的包链接到当前项目
- `--save`：在 package.json 的依赖项中添加 `link:` 前缀

**Unlink 行为：**

- `bun unlink`：取消当前包的链接

### 实现架构

#### 1. 命令结构

**文件**：`crates/vite_task/src/lib.rs`

添加新的命令变体：

```rust
#[derive(Subcommand, Debug)]
pub enum Commands {
    // ... 现有命令

    /// 为本地开发链接包
    #[command(disable_help_flag = true, alias = "ln")]
    Link {
        /// 要链接的包名或目录
        /// 如果为空，则将当前包注册到全局
        package: Option<String>,

        /// 传递给包管理器的参数
        #[arg(allow_hyphen_values = true, trailing_var_arg = true)]
        args: Vec<String>,
    },

    /// 取消链接包
    #[command(disable_help_flag = true)]
    Unlink {
        /// 要取消链接的包名
        /// 如果为空，则将当前包在全局取消链接
        package: Option<String>,

        /// 在每个工作区包中取消链接（仅 pnpm）
        #[arg(short = 'r', long)]
        recursive: bool,

        /// 传递给包管理器的参数
        #[arg(allow_hyphen_values = true, trailing_var_arg = true)]
        args: Vec<String>,
    },
}
```

#### 2. 包管理器适配器

**文件**：`crates/vite_package_manager/src/commands/link.rs`（新文件）

```rust
use std::{collections::HashMap, process::ExitStatus};

use vite_error::Error;
use vite_path::AbsolutePath;

use crate::package_manager::{
    PackageManager, PackageManagerType, ResolveCommandResult, format_path_env, run_command,
};

#[derive(Debug, Default)]
pub struct LinkCommandOptions<'a> {
    pub package: Option<&'a str>,
    pub pass_through_args: Option<&'a [String]>,
}

impl PackageManager {
    /// 使用包管理器运行 link 命令。
    #[must_use]
    pub async fn run_link_command(
        &self,
        options: &LinkCommandOptions<'_>,
        cwd: impl AsRef<AbsolutePath>,
    ) -> Result<ExitStatus, Error> {
        let resolve_command = self.resolve_link_command(options);
        run_command(&resolve_command.bin_path, &resolve_command.args, &resolve_command.envs, cwd)
            .await
    }

    /// 解析 link 命令。
    #[must_use]
    pub fn resolve_link_command(&self, options: &LinkCommandOptions) -> ResolveCommandResult {
        let bin_name: String;
        let envs = HashMap::from([("PATH".to_string(), format_path_env(self.get_bin_prefix()))]);
        let mut args: Vec<String> = Vec::new();

        match self.client {
            PackageManagerType::Pnpm => {
                bin_name = "pnpm".into();
                args.push("link".into());
            }
            PackageManagerType::Yarn => {
                bin_name = "yarn".into();
                args.push("link".into());
            }
            PackageManagerType::Npm => {
                bin_name = "npm".into();
                args.push("link".into());
            }
        }

        // 如果指定了包/目录，则添加
        if let Some(package) = options.package {
            args.push(package.to_string());
        }

        // 添加透传参数
        if let Some(pass_through_args) = options.pass_through_args {
            args.extend_from_slice(pass_through_args);
        }

        ResolveCommandResult { bin_path: bin_name, args, envs }
    }
}
```

**文件**：`crates/vite_package_manager/src/commands/unlink.rs`（新文件）

```rust
use std::{collections::HashMap, process::ExitStatus};

use vite_error::Error;
use vite_path::AbsolutePath;

use crate::package_manager::{
    PackageManager, PackageManagerType, ResolveCommandResult, format_path_env, run_command,
};

#[derive(Debug, Default)]
pub struct UnlinkCommandOptions<'a> {
    pub package: Option<&'a str>,
    pub recursive: bool,
    pub pass_through_args: Option<&'a [String]>,
}

impl PackageManager {
    /// 使用包管理器运行 unlink 命令。
    #[must_use]
    pub async fn run_unlink_command(
        &self,
        options: &UnlinkCommandOptions<'_>,
        cwd: impl AsRef<AbsolutePath>,
    ) -> Result<ExitStatus, Error> {
        let resolve_command = self.resolve_unlink_command(options);
        run_command(&resolve_command.bin_path, &resolve_command.args, &resolve_command.envs, cwd)
            .await
    }

    /// 解析 unlink 命令。
    #[must_use]
    pub fn resolve_unlink_command(&self, options: &UnlinkCommandOptions) -> ResolveCommandResult {
        let bin_name: String;
        let envs = HashMap::from([("PATH".to_string(), format_path_env(self.get_bin_prefix()))]);
        let mut args: Vec<String> = Vec::new();

        match self.client {
            PackageManagerType::Pnpm => {
                bin_name = "pnpm".into();
                args.push("unlink".into());

                if options.recursive {
                    args.push("--recursive".into());
                }
            }
            PackageManagerType::Yarn => {
                bin_name = "yarn".into();
                args.push("unlink".into());

                if options.recursive {
                    args.push("--all".into());
                }
            }
            PackageManagerType::Npm => {
                bin_name = "npm".into();
                args.push("unlink".into());

                if options.recursive {
                    println!("Warning: npm doesn't support --recursive for unlink command");
                }
            }
        }

        // 如果指定了包，则添加
        if let Some(package) = options.package {
            args.push(package.to_string());
        }

        // 添加透传参数
        if let Some(pass_through_args) = options.pass_through_args {
            args.extend_from_slice(pass_through_args);
        }

        ResolveCommandResult { bin_path: bin_name, args, envs }
    }
}
```

#### 3. Link 命令实现

**文件**：`crates/vite_task/src/link.rs`（新文件）

```rust
pub struct LinkCommand {
    workspace_root: AbsolutePathBuf,
}

impl LinkCommand {
    pub fn new(workspace_root: AbsolutePathBuf) -> Self {
        Self { workspace_root }
    }

    pub async fn execute(
        self,
        package: Option<String>,
        extra_args: Vec<String>,
    ) -> Result<ExecutionSummary, Error> {
        let package_manager = PackageManager::builder(&self.workspace_root).build().await?;
        let workspace = Workspace::partial_load(self.workspace_root)?;

        let resolve_command = package_manager.resolve_command();

        // 构建 link 命令选项
        let link_options = LinkCommandOptions {
            package: package.as_deref(),
            pass_through_args: if extra_args.is_empty() { None } else { Some(&extra_args) },
        };

        let full_args = package_manager.build_link_args(&link_options);

        let resolved_task = ResolvedTask::resolve_from_builtin_with_command_result(
            &workspace,
            "link",
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

#### 4. Unlink 命令实现

**文件**：`crates/vite_task/src/unlink.rs`（新文件）

```rust
pub struct UnlinkCommand {
    workspace_root: AbsolutePathBuf,
}

impl UnlinkCommand {
    pub fn new(workspace_root: AbsolutePathBuf) -> Self {
        Self { workspace_root }
    }

    pub async fn execute(
        self,
        package: Option<String>,
        recursive: bool,
        extra_args: Vec<String>,
    ) -> Result<ExecutionSummary, Error> {
        let package_manager = PackageManager::builder(&self.workspace_root).build().await?;
        let workspace = Workspace::partial_load(self.workspace_root)?;

        let resolve_command = package_manager.resolve_command();

        // 构建 unlink 命令选项
        let unlink_options = UnlinkCommandOptions {
            package: package.as_deref(),
            recursive,
            pass_through_args: if extra_args.is_empty() { None } else { Some(&extra_args) },
        };

        let full_args = package_manager.build_unlink_args(&unlink_options);

        let resolved_task = ResolvedTask::resolve_from_builtin_with_command_result(
            &workspace,
            "unlink",
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

## 设计决策

### 1. 不缓存

**决策**：不缓存 link/unlink 操作。

**理由**：

- 这些命令会创建/移除符号链接
- 副作用使缓存不合适
- 每次执行都应重新运行
- 与 add/remove/install 的工作方式类似

### 2. 本地目录链接

**决策**：支持直接链接本地目录。

**理由**：

- monorepo 开发中的常见场景
- 允许在发布前测试包
- pnpm、yarn 和 npm 都支持这一点
- 比全局注册流程更简单

**示例**：

```bash
# 不进行全局注册，直接链接本地包
vp link ./packages/my-lib
vp link ../other-project/packages/utils
```

### 3. 全局与本地链接

**决策**：同时支持全局注册和本地目录链接。

**理由**：

- 不同工作流需要不同方案
- 全局：适用于在多个项目中使用的包
- 本地：适用于 monorepo/相关项目开发
- 与原生包管理器能力一致

### 4. 递归解除链接支持

**决策**：为 unlink 支持 `--recursive` 标志（pnpm 和 yarn@2+），并在能力不足时优雅降级。

**理由**：

- pnpm 支持 `--recursive` 标志，可在每个 workspace 包中解除链接
- yarn@2+ 支持 `--all` 标志，提供类似功能
- 提供整个 workspace 范围的清理能力
- 在 npm 和 yarn@1 不可用时向用户发出警告
- 与其他 workspace 功能保持一致

## 错误处理

### 未检测到包管理器

```bash
$ vp link react
Error: No package manager detected
Please run one of:
  - vp install (to set up package manager)
  - Add packageManager field to package.json
```

### 不支持的功能

```bash
$ vp unlink --recursive
Warning: npm doesn't support --recursive for unlink command
# 按标准 unlink 继续执行（不带 --recursive 标志）
```

## 用户体验

### Link 成功输出

```bash
$ vp link
Detected package manager: pnpm@10.15.0
Running: pnpm link --global

+ my-package@1.0.0

Done in 0.5s
```

```bash
$ vp link my-package
Detected package manager: pnpm@10.15.0
Running: pnpm link --global my-package

Packages: +1
+
Progress: resolved 1, reused 0, downloaded 0, added 1, done

dependencies:
+ my-package link:~/.pnpm-store/my-package

Done in 1.2s
```

```bash
$ vp link ./packages/utils
Detected package manager: npm@11.0.0
Running: npm link ./packages/utils

npm WARN EBADENGINE Unsupported engine
added 1 package

Done in 2.1s
```

### Unlink 成功输出

```bash
$ vp unlink
Detected package manager: pnpm@10.15.0
Running: pnpm unlink

- my-package@1.0.0

Done in 0.3s
```

```bash
$ vp unlink react
Detected package manager: yarn@4.0.0
Running: yarn unlink react

Removed react

Done in 0.8s
```

## 考虑过的替代设计

### 替代方案 1：分离全局和本地命令

```bash
vp link:global          # 全局注册
vp link:local <dir>     # 链接本地目录
```

**被拒绝，因为**：

- 需要记住更多命令
- 与原生包管理器 API 不一致
- 相比基于标志的方式不够直观

### 替代方案 2：自动检测链接类型

```bash
vp link              # 自动检测：无 package 时为全局，有目录时为本地
vp link react        # 自动检测：全局包或本地目录
```

**被拒绝，因为**：

- 行为有歧义
- 很难预测会发生什么
- 显式标志更清晰

### 替代方案 3：交互模式

```bash
$ vp link
? 你想链接什么？
  > 将当前包全局注册
    链接一个全局包
    链接一个本地目录
```

**在初始版本中被拒绝**：

- 对有经验的用户来说更慢
- 不适合脚本化
- 以后可以作为可选模式添加

## 实现计划

### 阶段 1：核心功能

1. 在 `Commands` 枚举中添加 `Link` 和 `Unlink` 命令变体
2. 在两个 crate 中创建 `link.rs` 和 `unlink.rs` 模块
3. 实现包管理器命令解析
4. 添加基础错误处理

### 阶段 2：高级功能

1. 支持本地目录链接
2. 实现 pnpm 特定的 `--dir` 标志
3. 添加 npm save 标志支持
4. 处理 workspace 过滤（仅 pnpm）

### 阶段 3：测试

1. 为命令解析编写单元测试
2. 使用模拟包管理器进行集成测试
3. 测试全局和本地链接
4. 测试 workspace 操作

### 阶段 4：文档

1. 更新 CLI 文档
2. 在 README 中添加示例
3. 记录包管理器兼容性
4. 添加故障排查指南

## 测试策略

### 测试包管理器版本

- pnpm@9.x
- pnpm@10.x
- pnpm@11.x（在 CI=true 下向 `vp unlink` 传入 `-- --no-frozen-lockfile`；参见 snap-tests `command-unlink-pnpm11`）
- yarn@1.x
- yarn@4.x
- npm@10.x
- npm@11.x
- bun@1.x [WIP]

### 单元测试

```rust
#[test]
fn test_pnpm_link_no_package() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.resolve_link_command(&LinkCommandOptions {
        package: None,
        ..Default::default()
    });
    assert_eq!(args, vec!["link"]);
}

#[test]
fn test_pnpm_link_package() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.resolve_link_command(&LinkCommandOptions {
        package: Some("react"),
        ..Default::default()
    });
    assert_eq!(args, vec!["link", "react"]);
}

#[test]
fn test_pnpm_link_directory() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.resolve_link_command(&LinkCommandOptions {
        package: Some("./packages/utils"),
        ..Default::default()
    });
    assert_eq!(args, vec!["link", "./packages/utils"]);
}

#[test]
fn test_yarn_link_basic() {
    let pm = PackageManager::mock(PackageManagerType::Yarn);
    let args = pm.resolve_link_command(&LinkCommandOptions {
        package: None,
        ..Default::default()
    });
    assert_eq!(args, vec!["link"]);
}

#[test]
fn test_npm_link_package() {
    let pm = PackageManager::mock(PackageManagerType::Npm);
    let args = pm.resolve_link_command(&LinkCommandOptions {
        package: Some("react"),
        ..Default::default()
    });
    assert_eq!(args, vec!["link", "react"]);
}

#[test]
fn test_pnpm_unlink_no_package() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.resolve_unlink_command(&UnlinkCommandOptions {
        package: None,
        recursive: false,
        ..Default::default()
    });
    assert_eq!(args, vec!["unlink"]);
}

#[test]
fn test_pnpm_unlink_recursive() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.resolve_unlink_command(&UnlinkCommandOptions {
        package: None,
        recursive: true,
        ..Default::default()
    });
    assert_eq!(args, vec!["unlink", "--recursive"]);
}
```

### 集成测试

为每个包管理器创建测试夹具：

```
fixtures/link-unlink-test/
  pnpm-workspace.yaml
  package.json
  packages/
    lib-a/
      package.json
    lib-b/
      package.json
  test-steps.json
```

测试用例：

1. 将当前包全局注册
2. 将全局包链接到项目
3. 链接本地目录
4. 解除当前包的链接
5. 解除指定包的链接
6. 使用 --recursive 解除链接（仅 pnpm）
7. 针对 yarn/npm 不支持的 --recursive 发出警告

## CLI 帮助输出

### Link 命令

```bash
$ vp link --help
Link packages for local development

Usage: vp link [PACKAGE]

Aliases: ln

Arguments:
  [PACKAGE]  Package name or directory to link
             If empty, registers current package globally

Options:
  -h, --help             Print help

Link Types:
  Global Registration:   vp link (no package)
  Link Global Package:   vp link <package-name>
  Link Local Directory:  vp link <path>

Examples:
  vp link                        # Register current package globally
  vp ln                          # Same as above (alias)
  vp link react                  # Link global package 'react'
  vp link ./packages/utils       # Link local directory
  vp link ../my-lib              # Link from parent directory
```

### Unlink 命令

```bash
$ vp unlink --help
Unlink packages

Usage: vp unlink [PACKAGE] [OPTIONS]

Arguments:
  [PACKAGE]  Package name to unlink
             If empty, unlinks current package globally

Options:
  -r, --recursive        Unlink in every workspace package (pnpm and yarn@2+)
  -h, --help             Print help

Examples:
  vp unlink                      # Unlink current package
  vp unlink react                # Unlink 'react' from current project
  vp unlink --recursive          # Unlink in all workspace packages (pnpm and yarn@2+)
  vp unlink -r                   # Same as above (short form)
```

## 性能考虑

1. **不缓存**：操作直接运行，没有缓存开销
2. **符号链接创建**：操作快速，对性能影响极小
3. **单次执行**：不同于任务运行器，这些都是一次性操作
4. **自动检测**：复用现有的包管理器检测逻辑（已缓存）

## 安全性考虑

1. **符号链接安全性**：符号链接是标准包管理器功能
2. **路径校验**：在链接前验证目录是否存在
3. **不执行代码**：仅通过包管理器创建/移除符号链接
4. **全局存储**：遵循包管理器的全局存储位置

## 向后兼容性

这是一个不会引入破坏性变更的新功能：

- 现有命令不受影响
- 新命令是增量添加
- 不更改任务配置
- 不更改缓存行为

## 迁移路径

### 采用方式

用户可以立即开始使用：

```bash
# 旧方式
pnpm link --global
pnpm link --global react

# 新方式（适用于任何包管理器）
vp link
vp link react
```

### 可发现性

添加到：

- CLI 帮助输出
- 文档
- VSCode 扩展建议
- Shell 补全

## 真实世界使用示例

### 本地包开发

```bash
# 正在处理一个共享库
cd ~/projects/my-monorepo/packages/shared-utils
vp link                           # 全局注册

# 在另一个项目中使用它
cd ~/projects/my-app
vp link shared-utils              # 链接全局包

# 或者直接链接，而不进行全局注册
cd ~/projects/my-app
vp link ~/projects/my-monorepo/packages/shared-utils
```

### Monorepo 开发

```bash
# 在所有 workspace 包中解除链接（仅 pnpm）
vp unlink --recursive             # 从所有 workspace 中解除当前包的链接
vp unlink -r                      # 同上（短格式）
```

### 测试未发布的变更

```bash
# 开发一个库
cd ~/my-lib
npm version patch
vp link

# 在使用方项目中测试
cd ~/consuming-app
vp link my-lib
npm test

# 完成后解除链接
vp unlink my-lib
npm install my-lib@latest
```

## 包管理器兼容性

| 功能                 | pnpm                    | yarn@1           | yarn@2+           | npm              | bun              | 备注             |
| -------------------- | ----------------------- | ---------------- | ----------------- | ---------------- | ---------------- | ---------------- |
| 链接包/目录          | `link`                  | `link`           | `link`            | `link`           | `link`           | 全部支持         |
| 使用包进行链接       | `link <pkg>`            | `link <pkg>`     | `link <pkg>`      | `link <pkg>`     | `link <pkg>`     | 全部支持         |
| 链接本地目录         | `link <dir>`            | `link <dir>`     | `link <dir>`      | `link <dir>`     | `link <dir>`     | 全部支持         |
| 保存到 package.json  | 不适用                  | 不适用           | 不适用            | 不适用           | `--save`         | bun 特有         |
| 取消链接             | `unlink`                | `unlink`         | `unlink`          | `unlink`         | `unlink`         | 全部支持         |
| 递归取消链接         | ✅ `unlink --recursive` | ❌ 不支持         | ✅ `unlink --all` | ❌ 不支持         | ❌ 不支持         | pnpm 和 yarn@2+ |

## 未来增强

### 1. 链接状态命令

显示当前已链接的包：

```bash
vp link:status
vp link --list

# 输出：
已链接的包：
  react -> ~/.pnpm-global/5/node_modules/react
  my-lib -> ~/projects/my-lib
```

### 2. 自动链接工作区依赖

自动链接所有工作区依赖：

```bash
vp link --workspace-deps

# 扫描 package.json 中的 workspace: 协议依赖
# 并自动进行链接
```

### 3. 链接分组

保存并恢复链接配置：

```bash
vp link --save-config dev
vp link --load-config dev

# .vite-link.json:
{
  "configs": {
    "dev": {
      "links": [
        { "package": "my-lib", "path": "../my-lib" },
        { "package": "shared-utils", "path": "./packages/utils" }
      ]
    }
  }
}
```

### 4. 链接验证

验证已链接的包是否有效：

```bash
vp link --verify

# 检查所有符号链接是否指向有效目录
# 报告损坏的链接
```

## 待解决问题

1. **我们是否应该在链接前验证目录是否存在？**
   - 建议：是，若目录不存在则提供清晰的错误提示
   - 比起晦涩的包管理器错误，这会带来更好的用户体验

2. **我们是否应该支持相对路径？**
   - 建议：是，在传递给包管理器之前先解析相对路径
   - 让从任何位置执行命令都更直观

3. **在 yarn/npm 上链接但不进行全局注册时，我们是否应该警告？**
   - 建议：否，这是标准行为
   - 用户对这种工作流有预期

4. **我们是否应该支持一次性取消链接所有包？**
   - 建议：后续增强，不是 MVP
   - 使用场景：测试前“清空重来”

5. **我们是否应该为常见问题提供更好的错误消息？**
   - 建议：是，检测常见错误并提供有帮助的建议
   - 示例：找不到包 → “你是否先在包目录中运行了 'vp link'？”

## 成功指标

1. **采用率**：使用 `vp link/unlink` 的用户占比 vs 直接使用包管理器
2. **错误率**：跟踪命令失败率 vs 直接使用包管理器
3. **用户反馈**：关于命令易用性的调查/问题反馈
4. **性能**：测量相较于直接调用包管理器的额外开销（目标 <100ms）

## 结论

此 RFC 提议添加 `vp link` 和 `vp unlink` 命令，以便为 pnpm/yarn/npm/bun 之间的本地包开发提供统一接口。设计如下：

- ✅ 自动适配检测到的包管理器
- ✅ 同时支持包链接和本地目录链接
- ✅ 为简洁性提供最少选项（unlink 仅支持 --recursive）
- ✅ 在所有包管理器之间保持一致行为
- ✅ 清晰的错误消息和警告
- ✅ 无缓存开销
- ✅ 利用现有基础设施，易于实现
- ✅ 可扩展以支持未来增强

该实现遵循与其他包管理器命令相同的模式，同时保持接口简单直观，适用于本地包开发工作流。
