# RFC: Vite+ 过时包命令

## 摘要

添加 `vite outdated` 命令，该命令会自动适配检测到的包管理器（pnpm/npm/yarn/bun）来检查过时的包。这有助于开发者识别有哪些包已有更新版本、保持依赖处于最新状态，并通过展示哪些包可以更新来管理安全漏洞。

## 动机

目前，开发者必须手动使用各个包管理器特定的命令来检查过时包：

```bash
pnpm outdated [<pattern>...]
npm outdated [[@scope/]<package>...]
yarn outdated [<package>...]
```

这会在依赖管理工作流中造成摩擦，并且需要记住不同的语法。一个统一的接口将带来以下好处：

1. **简化依赖更新**：一个命令可跨所有包管理器使用
2. **自动检测**：自动使用正确的包管理器
3. **一致性**：无论底层工具是什么，语法都相同
4. **集成性**：与现有的 Vite+ 功能无缝协作

### 目前的痛点

```bash
# 开发者需要知道使用的是哪个包管理器
pnpm outdated                         # pnpm 项目
npm outdated                          # npm 项目
yarn outdated                         # yarn 项目

# 不同的输出格式
pnpm outdated --format json           # pnpm - JSON 输出
npm outdated --json                   # npm - JSON 输出
yarn outdated                         # yarn - 表格格式（v1 中没有 JSON）

# 不同的工作区目标定位
pnpm outdated --filter app            # pnpm - 过滤工作区
npm outdated --workspace app          # npm - 指定工作区
yarn outdated                         # yarn - v1 中没有工作区过滤

# 不同的依赖类型过滤
pnpm outdated --prod                  # pnpm - 仅生产依赖
npm outdated                          # npm - 没有过滤选项
yarn outdated                         # yarn - 没有过滤选项
```

### 拟议方案

```bash
# 适用于所有包管理器
vite outdated                         # 检查所有包
vite outdated <package>               # 检查指定包

# 输出格式
vite outdated --format json           # JSON 输出（映射到 pnpm --format json、npm --json、yarn --json）
vite outdated --format list           # 列表输出（映射到 pnpm --format list、npm --parseable）
vite outdated --format table          # 表格格式（默认）
vite outdated --long                  # 详细输出

# 工作区操作
vite outdated --filter app            # 在指定工作区中检查（映射到 pnpm --filter、npm --workspace）
vite outdated -r                      # 跨工作区递归检查（映射到 pnpm -r、npm --all）
vite outdated -w                      # 包含工作区根目录（pnpm）
vite outdated -w -r                   # 包含工作区根目录并递归检查（pnpm）

# 依赖类型过滤
vite outdated -P                      # 仅生产依赖（pnpm）
vite outdated --prod                  # 仅生产依赖（pnpm）
vite outdated -D                      # 仅 dev 依赖（pnpm）
vite outdated --dev                   # 仅 dev 依赖（pnpm）
vite outdated --compatible            # 仅符合 package.json 要求的版本（pnpm）

# 排序和过滤
vite outdated --sort-by name          # 按名称排序结果（pnpm）
vite outdated --no-optional           # 排除可选依赖（pnpm）
```

## 拟议方案

### 命令语法

```bash
vite outdated [PACKAGE...] [OPTIONS]
```

**示例：**

```bash
# 基本用法
vite outdated
vite outdated react
vite outdated "*gulp-*" @babel/core

# 输出格式
vite outdated --format json           # JSON 输出
vite outdated --format list           # 列表输出
vite outdated --long                  # 详细输出

# 工作区操作
vite outdated -r                      # 在所有工作区中递归
vite outdated --recursive             # 在所有工作区中递归
vite outdated --filter app            # 在指定工作区中检查
vite outdated -w                      # 包含工作区根目录（pnpm）
vite outdated -w -r                   # 包含工作区根目录并递归检查（pnpm）

# 依赖类型过滤
vite outdated -P                      # 仅生产依赖（pnpm）
vite outdated --prod                  # 仅生产依赖（pnpm）
vite outdated -D                      # 仅 dev 依赖（pnpm）
vite outdated --dev                   # 仅 dev 依赖（pnpm）
vite outdated --no-optional           # 排除可选依赖（pnpm）
vite outdated --compatible            # 仅兼容版本（pnpm）

# 排序
vite outdated --sort-by name          # 按名称排序结果（pnpm）

# 全局包
vite outdated -g                      # 检查全局安装的包
```

### 全局包检查

仅使用 `npm` 来检查全局安装的包，因为 `vp install -g` 使用的是 `npm` cli 来安装全局包。

```bash
vite outdated -g                      # 检查全局安装的包

-> npm outdated -g
```

### 命令映射

**pnpm 参考：**

- https://pnpm.io/cli/outdated
- 使用模式支持检查过时包

**npm 参考：**

- https://docs.npmjs.com/cli/v11/commands/npm-outdated
- 列出过时包

**yarn 参考：**

- https://classic.yarnpkg.com/en/docs/cli/outdated (yarn@1)
- https://yarnpkg.com/cli/upgrade-interactive (yarn@2+)
- 检查过时的包依赖

**bun 参考：**

- https://bun.sh/docs/cli/outdated
- 检查当前项目中的过时包

| Vite+ 标志             | pnpm                   | npm                                 | yarn@1          | yarn@2+                    | bun                  | 说明                                          |
| ---------------------- | ---------------------- | ----------------------------------- | --------------- | -------------------------- | -------------------- | --------------------------------------------- |
| `vite outdated`        | `pnpm outdated`        | `npm outdated`                      | `yarn outdated` | `yarn upgrade-interactive` | `bun outdated`       | 检查过时包                                    |
| `<pattern>...`         | `<pattern>...`         | `[[@scope/]<pkg>]`                  | `[<package>]`   | N/A                        | N/A                  | 要检查的包模式                                 |
| `--long`               | `--long`               | `--long`                            | N/A             | N/A                        | N/A                  | 扩展输出格式                                   |
| `--format <format>`    | `--format <format>`    | json: `--json`/ list: `--parseable` | `--json`        | N/A                        | N/A                  | 输出格式（table/list/json）                   |
| `-r, --recursive`      | `-r, --recursive`      | `--all`                             | N/A             | N/A                        | `-r` / `--recursive` | 跨所有工作区检查                               |
| `--filter <pattern>`   | `--filter <pattern>`   | `--workspace <pattern>`             | N/A             | N/A                        | `--filter` / `-F`    | 目标特定工作区                                 |
| `-w, --workspace-root` | `-w, --workspace-root` | `--include-workspace-root`          | N/A             | N/A                        | N/A                  | 包含工作区根目录                               |
| `-P, --prod`           | `-P, --prod`           | N/A                                 | N/A             | N/A                        | `--production`       | 仅生产依赖                                     |
| `-D, --dev`            | `-D, --dev`            | N/A                                 | N/A             | N/A                        | N/A                  | 仅 dev 依赖（pnpm 特有）                      |
| `--no-optional`        | `--no-optional`        | N/A                                 | N/A             | N/A                        | `--omit optional`    | 排除可选依赖                                   |
| `--compatible`         | `--compatible`         | N/A                                 | N/A             | N/A                        | N/A                  | 仅显示兼容版本（pnpm 特有）                   |
| `--sort-by <field>`    | `--sort-by <field>`    | N/A                                 | N/A             | N/A                        | N/A                  | 按字段排序结果（pnpm 特有）                   |
| `-g, --global`         | `-g, --global`         | `-g, --global`                      | N/A             | N/A                        | N/A                  | 检查全局安装的包                               |

**注意：**

- pnpm 支持模式匹配，可选择性地检查包
- npm 接受包名，但不接受 glob 模式
- yarn@1 接受包名，但过滤选项有限
- yarn@2+ 使用交互模式（`upgrade-interactive`）而不是传统的 `outdated`
- pnpm 具有最全面的过滤和输出选项
- bun 支持用于工作区过滤的 `--filter` / `-F`、用于跨所有工作区检查的 `-r` / `--recursive`、用于仅生产依赖的 `--production`，以及用于排除可选依赖的 `--omit optional`
- bun 不支持 JSON 输出格式（`--format json`）

### 各包管理器之间的 outdated 行为差异

#### pnpm

**outdated 行为：**

- 支持模式的过时包检查
- 支持 glob 模式：`pnpm outdated "*gulp-*" @babel/core`
- 显示 current、wanted 和 latest 版本
- 支持使用 `--filter` 进行工作区过滤
- 可按依赖类型过滤（prod、dev、optional）
- 多种输出格式（table、list、json）
- 使用 `--compatible` 仅显示兼容版本

**输出格式：**

```
Package         Current  Wanted  Latest
react           18.2.0   18.3.1  18.3.1
lodash          4.17.20  4.17.21 4.17.21
@babel/core     7.20.0   7.20.12 7.25.8
```

**选项：**

- `--format`：输出格式（table、list、json）
- `--long`：扩展信息
- `-r`：跨工作区递归
- `--filter`：工作区过滤
- `--prod`/`--dev`：依赖类型过滤
- `--compatible`：仅兼容版本
- `--sort-by`：按字段排序结果
- `--no-optional`：排除可选依赖

#### npm

**outdated 行为：**

- 列出过时包
- 显示 current、wanted、latest、location 和 depended by
- 支持使用 `--workspace` 进行工作区定位
- 可使用 `--all` 显示所有依赖（包括传递依赖）
- 提供 JSON 和可解析输出
- 彩色输出（红色 = 应该更新，黄色 = 主版本）

**输出格式：**

```
Package         Current  Wanted  Latest  Location             Depended by
react           18.2.0   18.3.1  18.3.1  node_modules/react   my-app
lodash          4.17.20  4.17.21 4.17.21 node_modules/lodash  my-app
```

**选项：**

- `--json`：JSON 格式
- `--long`：扩展信息（显示包类型）
- `--parseable`：可解析格式
- `--all`：显示所有过时包，包括传递依赖
- `--workspace`：目标指定工作区

#### yarn@1（经典版）

**outdated 行为：**

- 检查过时的包依赖
- 显示包名、current、wanted、latest、包类型和 URL
- 简单的表格输出
- 可检查指定包
- 不支持 JSON 输出
- 不支持工作区过滤

**输出格式：**

```
Package         Current  Wanted  Latest  Package Type  URL
react           18.2.0   18.3.1  18.3.1  dependencies  https://...
lodash          4.17.20  4.17.21 4.17.21 dependencies  https://...
```

**选项：**

- 没有用于过滤或格式化的命令行选项
- 以参数形式接受包名

#### yarn@2+（Berry）

**outdated 行为：**

- 使用 `yarn upgrade-interactive` 代替 `outdated`
- 打开全屏终端界面
- 显示带状态对比的过期包
- 允许选择性升级
- 与传统 `outdated` 命令采用不同的范式

**输出格式：**

交互式终端 UI，显示：

- 包名
- 当前版本
- 可用版本
- 选择复选框

**选项：**

- 仅交互模式
- 使用 `yarn upgrade-interactive` 进行检查和升级

### 实现架构

#### 1. 命令结构

**文件**：`crates/vite_task/src/lib.rs`

添加新的命令变体：

```rust
#[derive(Subcommand, Debug)]
pub enum Commands {
    // ... 现有命令

    /// 检查过时包
    #[command(disable_help_flag = true)]
    Outdated {
        /// 要检查的包名（pnpm 中支持 glob 模式）
        #[arg(value_name = "PACKAGE")]
        packages: Vec<String>,

        /// 显示扩展信息
        #[arg(long)]
        long: bool,

        /// 输出格式：table（默认）、list 或 json
        /// 映射到：pnpm: --format <format>，npm: --json/--parseable，yarn@1: --json
        #[arg(long, value_name = "FORMAT")]
        format: Option<String>,

        /// 跨所有工作区递归检查
        /// 映射到：pnpm: -r，npm: --all
        #[arg(short = 'r', long)]
        recursive: bool,

        /// 过滤 monorepo 中的包（可重复使用）
        /// 映射到：pnpm: --filter <pattern>，npm: --workspace <pattern>
        #[arg(long, value_name = "PATTERN")]
        filter: Vec<String>,

        /// 包含工作区根目录
        /// 映射到：pnpm: -w/--workspace-root，npm: --include-workspace-root
        #[arg(short = 'w', long)]
        workspace_root: bool,

        /// 仅生产和可选依赖（pnpm 特有）
        #[arg(short = 'P', long)]
        prod: bool,

        /// 仅 dev 依赖（pnpm 特有）
        #[arg(short = 'D', long)]
        dev: bool,

        /// 排除可选依赖（pnpm 特有）
        #[arg(long)]
        no_optional: bool,

        /// 仅显示兼容版本（pnpm 特有）
        #[arg(long)]
        compatible: bool,

        /// 按字段排序结果（pnpm 特有）
        #[arg(long, value_name = "FIELD")]
        sort_by: Option<String>,

        /// 检查全局安装的包
        #[arg(short = 'g', long)]
        global: bool,

        /// 传递给包管理器的附加参数
        #[arg(last = true, allow_hyphen_values = true)]
        pass_through_args: Option<Vec<String>>,
    },
}
```

#### 2. 包管理器适配器

**文件**：`crates/vite_package_manager/src/commands/outdated.rs`（新文件）

```rust
use std::{collections::HashMap, process::ExitStatus};

use vite_error::Error;
use vite_path::AbsolutePath;

use crate::package_manager::{
    PackageManager, PackageManagerType, ResolveCommandResult, format_path_env, run_command,
};

#[derive(Debug, Default)]
pub struct OutdatedCommandOptions<'a> {
    pub packages: &'a [String],
    pub long: bool,
    pub format: Option<&'a str>,
    pub recursive: bool,
    pub filters: Option<&'a [String]>,
    pub workspace_root: bool,
    pub prod: bool,
    pub dev: bool,
    pub no_optional: bool,
    pub compatible: bool,
    pub sort_by: Option<&'a str>,
    pub global: bool,
    pub pass_through_args: Option<&'a [String]>,
}

impl PackageManager {
    /// 使用包管理器运行 outdated 命令。
    #[must_use]
    pub async fn run_outdated_command(
        &self,
        options: &OutdatedCommandOptions<'_>,
        cwd: impl AsRef<AbsolutePath>,
    ) -> Result<ExitStatus, Error> {
        let resolve_command = self.resolve_outdated_command(options);
        run_command(&resolve_command.bin_path, &resolve_command.args, &resolve_command.envs, cwd)
            .await
    }

    /// 解析 outdated 命令。
    #[must_use]
    pub fn resolve_outdated_command(&self, options: &OutdatedCommandOptions) -> ResolveCommandResult {
        let bin_name: String;
        let envs = HashMap::from([("PATH".to_string(), format_path_env(self.get_bin_prefix()))]);
        let mut args: Vec<String> = Vec::new();

        // 全局包应仅使用 npm cli
        if options.global {
            bin_name = "npm".into();
            args.push("outdated".into());
            args.push("-g".into());
            args.extend_from_slice(options.packages);
            if let Some(pass_through_args) = options.pass_through_args {
                args.extend_from_slice(pass_through_args);
            }
            return ResolveCommandResult { bin_path: bin_name, args, envs };
        }

        match self.client {
            PackageManagerType::Pnpm => {
                bin_name = "pnpm".into();

                // pnpm：--filter 必须放在命令前
                if let Some(filters) = options.filters {
                    for filter in filters {
                        args.push("--filter".into());
                        args.push(filter.clone());
                    }
                }

                args.push("outdated".into());

                // 处理 format 选项
                if let Some(format) = options.format {
                    args.push("--format".into());
                    args.push(format.into());
                }

                if options.long {
                    args.push("--long".into());
                }

                if options.workspace_root {
                    args.push("--workspace-root".into());
                }

                if options.recursive {
                    args.push("--recursive".into());
                }

                if options.prod {
                    args.push("--prod".into());
                }

                if options.dev {
                    args.push("--dev".into());
                }

                if options.no_optional {
                    args.push("--no-optional".into());
                }

                if options.compatible {
                    args.push("--compatible".into());
                }

                if let Some(sort_by) = options.sort_by {
                    args.push("--sort-by".into());
                    args.push(sort_by.into());
                }

                if options.global {
                    args.push("--global".into());
                }

                // 添加包（pnpm 支持 glob 模式）
                args.extend_from_slice(options.packages);
            }
            PackageManagerType::Yarn => {
                bin_name = "yarn".into();

                // 检查是否为 yarn@2+（使用 upgrade-interactive）
                if !self.version.starts_with("1.") {
                    println!("Note: yarn@2+ uses 'yarn upgrade-interactive' for checking outdated packages");
                    args.push("upgrade-interactive".into());

                    // 提示不支持的标志
                    if options.format.is_some() {
                        println!("Warning: --format not supported by yarn@2+");
                    }
                } else {
                    // yarn@1
                    args.push("outdated".into());

                    // 添加包（yarn@1 支持包名）
                    args.extend_from_slice(options.packages);

                    // yarn@1 支持 --json 格式
                    if let Some(format) = options.format {
                        if format == "json" {
                            args.push("--json".into());
                        } else {
                            println!("Warning: yarn@1 only supports json format, not {}", format);
                        }
                    }
                }

                // 通用警告
                if options.long {
                    println!("Warning: --long not supported by yarn");
                }
                if options.workspace_root {
                    println!("Warning: --workspace-root not supported by yarn");
                }
                if options.recursive {
                    println!("Warning: --recursive not supported by yarn");
                }
                if let Some(filters) = options.filters {
                    if !filters.is_empty() {
                        println!("Warning: --filter not supported by yarn");
                    }
                }
                if options.prod || options.dev {
                    println!("Warning: --prod/--dev not supported by yarn");
                }
                if options.no_optional {
                    println!("Warning: --no-optional not supported by yarn");
                }
                if options.compatible {
                    println!("Warning: --compatible not supported by yarn");
                }
                if options.sort_by.is_some() {
                    println!("Warning: --sort-by not supported by yarn");
                }
            }
            PackageManagerType::Npm => {
                bin_name = "npm".into();
                args.push("outdated".into());

                // npm 格式标志 - 从 --format 转换
                if let Some(format) = options.format {
                    match format {
                        "json" => args.push("--json".into()),
                        "list" => args.push("--parseable".into()),
                        "table" => {}, // 默认，无需标志
                        _ => println!("Warning: npm only supports formats: json, list, table"),
                    }
                }

                if options.long {
                    args.push("--long".into());
                }

                // npm 工作区标志 - 从 --filter 转换
                if let Some(filters) = options.filters {
                    for filter in filters {
                        args.push("--workspace".into());
                        args.push(filter.clone());
                    }
                }

                // 当设置 workspace_root 时，npm 使用 --include-workspace-root
                if options.workspace_root {
                    args.push("--include-workspace-root".into());
                }

                // npm 的 --all 对应 -r/--recursive
                if options.recursive {
                    args.push("--all".into());
                }

                if options.global {
                    args.push("--global".into());
                }

                // 添加包（npm 支持包名）
                args.extend_from_slice(options.packages);

                // 提示 pnpm 特有标志
                if options.prod || options.dev {
                    println!("Warning: --prod/--dev not supported by npm");
                }
                if options.no_optional {
                    println!("Warning: --no-optional not supported by npm");
                }
                if options.compatible {
                    println!("Warning: --compatible not supported by npm");
                }
                if options.sort_by.is_some() {
                    println!("Warning: --sort-by not supported by npm");
                }
            }
        }

        // 添加透传参数
        if let Some(pass_through_args) = options.pass_through_args {
            args.extend_from_slice(pass_through_args);
        }

        ResolveCommandResult { bin_path: bin_name, args, envs }
    }
}
```

**文件**：`crates/vite_package_manager/src/commands/mod.rs`

更新以包含 outdated 模块：

```rust
pub mod add;
mod install;
pub mod remove;
pub mod update;
pub mod link;
pub mod unlink;
pub mod dedupe;
pub mod why;
pub mod outdated;  // 添加这一行
```

#### 3. Outdated 命令实现

**文件**：`crates/vite_task/src/outdated.rs`（新文件）

```rust
use vite_error::Error;
use vite_path::AbsolutePathBuf;
use vite_package_manager::{
    PackageManager,
    commands::outdated::OutdatedCommandOptions,
};
use vite_workspace::Workspace;

pub struct OutdatedCommand {
    workspace_root: AbsolutePathBuf,
}

impl OutdatedCommand {
    pub fn new(workspace_root: AbsolutePathBuf) -> Self {
        Self { workspace_root }
    }

    pub async fn execute(
        self,
        packages: Vec<String>,
        long: bool,
        format: Option<String>,
        recursive: bool,
        filters: Vec<String>,
        prod: bool,
        dev: bool,
        no_optional: bool,
        compatible: bool,
        sort_by: Option<String>,
        global: bool,
        extra_args: Vec<String>,
    ) -> Result<ExecutionSummary, Error> {
        let package_manager = PackageManager::builder(&self.workspace_root).build().await?;
        let workspace = Workspace::partial_load(self.workspace_root)?;

        // 构建 outdated 命令选项
        let outdated_options = OutdatedCommandOptions {
            packages: &packages,
            long,
            format: format.as_deref(),
            recursive,
            filters: if filters.is_empty() { None } else { Some(&filters) },
            prod,
            dev,
            no_optional,
            compatible,
            sort_by: sort_by.as_deref(),
            global,
            pass_through_args: if extra_args.is_empty() { None } else { Some(&extra_args) },
        };

        let exit_status = package_manager
            .run_outdated_command(&outdated_options, &workspace.root)
            .await?;

        // 注意：如果发现过时包，outdated 命令可能以 code 1 退出
        // 这是预期行为，不是错误
        if !exit_status.success() {
            let exit_code = exit_status.code();
            // Exit code 1 通常表示发现了过时包，这是可以接受的
            if exit_code != Some(1) {
                return Err(Error::CommandFailed {
                    command: "outdated".to_string(),
                    exit_code,
                });
            }
        }

        workspace.unload().await?;

        Ok(ExecutionSummary::default())
    }
}
```

## 设计决策

### 1. 不缓存

**决策**：不要缓存过时操作。

**原因**：

- `outdated` 会查询远程注册表以获取最新版本
- 随着新版本发布，结果会频繁变化
- 缓存会提供过期信息
- 用户在检查更新时期望获得最新数据

### 2. 模式支持

**决策**：接受模式，但当包管理器不支持 glob 模式时发出警告。

**原因**：

- pnpm 支持 glob 模式：`pnpm outdated "*gulp-*" @babel/core`
- npm 和 yarn 接受包名，但不接受 glob 模式
- 向用户警告受限的模式支持
- 比直接报错提供更好的用户体验

### 3. 退出码处理

**决策**：不要将 `outdated` 命令的退出码 1 视为错误。

**原因**：

- 当发现过时包时，包管理器会返回退出码 1
- 这是预期行为，不是失败
- 只将其他退出码视为错误
- 与包管理器语义保持一致

### 4. 输出格式支持

**决策**：支持 pnpm 的 `--format` 标志，以及 npm 的 `--json`/`--parseable` 标志。

**原因**：

- pnpm 提供带有 table/list/json 选项的 `--format`
- npm 有单独的 `--json` 和 `--parseable` 标志
- yarn@1 的表格输出是固定的
- yarn@2+ 使用交互模式
- 按包管理器适当地转换标志

### 5. 工作区过滤

**决策**：同时支持 pnpm 的 `--filter` 和 npm 的 `--workspace` 模式。

**原因**：

- 不同的包管理器使用不同的标志
- 适当地转换标志
- 当标志不受支持时发出警告
- 与其他 Vite+ 命令保持一致

### 6. 依赖类型过滤

**决策**：支持 pnpm 的 `--prod`、`--dev`、`--no-optional` 标志，并在不支持时发出警告。

**原因**：

- pnpm 允许按依赖类型进行过滤
- npm 或 yarn 中不可用
- 对有针对性的更新很有用
- 不支持时发出警告

### 7. Yarn@2+ 行为

**决策**：对 yarn@2+ 使用 `upgrade-interactive`，而不是 `outdated`。

**原因**：

- yarn@2+ 建议使用 `upgrade-interactive` 来检查更新
- 提供交互式 UI，而不是简单的表格
- 虽然范式不同，但达到相同目标
- 告知用户这种不同的行为

## 错误处理

### 未检测到包管理器

```bash
$ vite outdated
Error: No package manager detected
Please run one of:
  - vp install (to set up package manager)
  - Add packageManager field to package.json
```

### 无效的格式选项

```bash
$ vite outdated --format invalid
Error: Invalid format 'invalid'
Valid formats: table, list, json
```

### 不支持的标志警告

```bash
$ vite outdated --prod
Detected package manager: npm@11.0.0
Warning: --prod not supported by npm
Running: npm outdated
```

## 用户体验

### 成功输出（pnpm）

```bash
$ vite outdated
Detected package manager: pnpm@10.15.0
Running: pnpm outdated

Package         Current  Wanted  Latest
react           18.2.0   18.3.1  18.3.1
lodash          4.17.20  4.17.21 4.17.21
@babel/core     7.20.0   7.20.12 7.25.8

Done in 1.2s
```

### 成功输出（npm）

```bash
$ vite outdated
Detected package manager: npm@11.0.0
Running: npm outdated

Package         Current  Wanted  Latest  Location             Depended by
react           18.2.0   18.3.1  18.3.1  node_modules/react   my-app
lodash          4.17.20  4.17.21 4.17.21 node_modules/lodash  my-app

Done in 0.8s
```

### 成功输出（yarn@1）

```bash
$ vite outdated
Detected package manager: yarn@1.22.19
Running: yarn outdated

Package         Current  Wanted  Latest  Package Type  URL
react           18.2.0   18.3.1  18.3.1  dependencies  https://...
lodash          4.17.20  4.17.21 4.17.21 dependencies  https://...

Done in 1.0s
```

### JSON 输出（pnpm）

```bash
$ vite outdated --format json
Detected package manager: pnpm@10.15.0
Running: pnpm outdated --format json

[
  {
    "packageName": "react",
    "current": "18.2.0",
    "wanted": "18.3.1",
    "latest": "18.3.1",
    "dependencyType": "dependencies"
  },
  {
    "packageName": "lodash",
    "current": "4.17.20",
    "wanted": "4.17.21",
    "latest": "4.17.21",
    "dependencyType": "dependencies"
  }
]

Done in 1.1s
```

### 模式匹配（pnpm）

```bash
$ vite outdated "*babel*" "eslint-*"
Detected package manager: pnpm@10.15.0
Running: pnpm outdated "*babel*" "eslint-*"

Package              Current  Wanted   Latest
@babel/core          7.20.0   7.20.12  7.25.8
@babel/preset-env    7.20.0   7.20.12  7.25.8
eslint-config-next   13.0.0   13.0.7   14.2.5
eslint-plugin-react  7.32.0   7.32.2   7.37.2

Done in 1.3s
```

### 工作区过滤（pnpm）

```bash
$ vite outdated --filter app -r
Detected package manager: pnpm@10.15.0
Running: pnpm --filter app outdated --recursive

Scope: app

Package         Current  Wanted  Latest
react           18.2.0   18.3.1  18.3.1
react-dom       18.2.0   18.3.1  18.3.1

Done in 1.0s
```

## 考虑过的替代方案

### 备选方案 1：始终将退出码 1 视为错误

```bash
vite outdated
# 当发现过时包时退出码为 1
# 视为错误
```

**被拒绝的原因**：

- 发现过时包是正常情况，不是错误
- 会破坏 CI/CD 工作流
- 与包管理器行为一致
- 用户期望退出码 1 表示包需要更新

### 备选方案 2：自定义输出格式

```bash
vite outdated --format vite
# 在所有包管理器之间使用自定义统一格式
```

**被拒绝的原因**：

- 输出格式解析很脆弱
- 不同包管理器提供不同数据
- 更好的做法是透传原生输出
- 让用户看到与其包管理器一致的熟悉格式

### 备选方案 3：自动更新选项

```bash
vp outdated --update
# 自动更新所有过时包
```

**被拒绝的原因**：

- 将检查和更新混在一起很危险
- 用户应在更新前进行审查
- 已经存在单独的 `vp update` 命令
- 保持命令专注于单一目的

## 实施计划

### 第一阶段：核心功能

1. 在 `Commands` 枚举中添加 `Outdated` 命令变体
2. 在两个 crate 中创建 `outdated.rs` 模块
3. 实现包管理器命令解析
4. 将退出码 1 作为成功情况处理
5. 添加基础错误处理

### 第二阶段：高级功能

1. 实现输出格式选项（json、table、list、parseable）
2. 添加工作区过滤支持
3. 实现依赖类型过滤（prod、dev）
4. 添加模式匹配支持
5. 处理 yarn@2+ 交互模式

### 第三阶段：测试

1. 为命令解析编写单元测试
2. 测试模式匹配（pnpm）
3. 测试工作区操作
4. 测试输出格式选项
5. 测试退出码处理
6. 使用模拟包管理器进行集成测试

### 第四阶段：文档

1. 更新 CLI 文档
2. 在 README 中添加示例
3. 文档化包管理器兼容性
4. 添加故障排查指南

## 测试策略

### 测试包管理器版本

- pnpm@9.x
- pnpm@10.x
- pnpm@11.x
- yarn@1.x
- yarn@4.x
- npm@10.x
- npm@11.x
- bun@1.x [WIP]

### 单元测试

```rust
#[test]
fn test_pnpm_outdated_basic() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.resolve_outdated_command(&OutdatedCommandOptions {
        ..Default::default()
    });
    assert_eq!(args, vec!["outdated"]);
}

#[test]
fn test_pnpm_outdated_with_packages() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.resolve_outdated_command(&OutdatedCommandOptions {
        packages: &["*babel*".to_string(), "eslint-*".to_string()],
        ..Default::default()
    });
    assert_eq!(args, vec!["outdated", "*babel*", "eslint-*"]);
}

#[test]
fn test_pnpm_outdated_json() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.resolve_outdated_command(&OutdatedCommandOptions {
        format: Some("json"),
        ..Default::default()
    });
    assert_eq!(args, vec!["outdated", "--format", "json"]);
}

#[test]
fn test_npm_outdated_basic() {
    let pm = PackageManager::mock(PackageManagerType::Npm);
    let args = pm.resolve_outdated_command(&OutdatedCommandOptions {
        ..Default::default()
    });
    assert_eq!(args, vec!["outdated"]);
}

#[test]
fn test_npm_outdated_json() {
    let pm = PackageManager::mock(PackageManagerType::Npm);
    let args = pm.resolve_outdated_command(&OutdatedCommandOptions {
        format: Some("json"),
        ..Default::default()
    });
    assert_eq!(args, vec!["outdated", "--json"]);
}

#[test]
fn test_yarn_outdated_basic() {
    let pm = PackageManager::mock(PackageManagerType::Yarn);
    let args = pm.resolve_outdated_command(&OutdatedCommandOptions {
        ..Default::default()
    });
    assert_eq!(args, vec!["outdated"]);
}

#[test]
fn test_pnpm_outdated_with_filter() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.resolve_outdated_command(&OutdatedCommandOptions {
        filters: Some(&["app".to_string()]),
        recursive: true,
        ..Default::default()
    });
    assert_eq!(args, vec!["--filter", "app", "outdated", "--recursive"]);
}

#[test]
fn test_pnpm_outdated_prod_only() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.resolve_outdated_command(&OutdatedCommandOptions {
        prod: true,
        ..Default::default()
    });
    assert_eq!(args, vec!["outdated", "--prod"]);
}
```

### 集成测试

创建用于每个包管理器测试的 fixture：

```
fixtures/outdated-test/
  pnpm-workspace.yaml
  package.json (with some outdated deps)
  packages/
    app/
      package.json (with outdated deps)
    utils/
      package.json (with outdated deps)
  test-steps.json
```

测试用例：

1. 基础过时检查
2. 模式匹配（仅 pnpm）
3. JSON 输出
4. 特定工作区中过时检查
5. 递归工作区检查
6. 依赖类型过滤
7. 仅兼容版本
8. 全局包检查
9. 不支持标志的警告消息
10. 退出码 1 处理（发现过时项）

## CLI 帮助输出

```bash
$ vite outdated --help
Check for outdated packages

Usage: vite outdated [PACKAGE]... [OPTIONS]

Arguments:
  [PACKAGE]...           Package name(s) to check (pnpm supports glob patterns)

Options:
  --long                 Show extended information
  --format <FORMAT>      Output format: table, list, or json
                         Maps to: pnpm: --format <format>, npm: --json/--parseable, yarn@1: --json
  -r, --recursive        Check recursively across all workspaces
                         Maps to: pnpm: -r, npm: --all
  --filter <PATTERN>     Filter packages in monorepo (can be used multiple times)
                         Maps to: pnpm: --filter <pattern>, npm: --workspace <pattern>
  -w, --workspace-root   Include workspace root
                         Maps to: pnpm: -w/--workspace-root, npm: --include-workspace-root
  -P, --prod             Only production and optional dependencies (pnpm only)
  -D, --dev              Only dev dependencies (pnpm only)
  --no-optional          Exclude optional dependencies (pnpm only)
  --compatible           Only show compatible versions (pnpm only)
  --sort-by <FIELD>      Sort results by field (pnpm only, supports 'name')
  -g, --global           Check globally installed packages
  -h, --help             Print help

Package Manager Behavior:
  pnpm:    Shows current, wanted, and latest versions in table format
  npm:     Shows current, wanted, latest, location, and depended by
  yarn@1:  Shows package info with current, wanted, latest, and URL
  yarn@2+: Uses interactive 'upgrade-interactive' command

Exit Codes:
  0: No outdated packages found
  1: Outdated packages found (not an error)
  Other: Command failed

Examples:
  vite outdated                        # 检查所有包
  vite outdated react                  # 检查特定包
  vite outdated "*babel*" "eslint-*"   # 使用模式检查（pnpm）
  vite outdated --format json          # JSON 输出
  vite outdated --long                 # 详细输出
  vite outdated -r                     # 在工作区中递归检查
  vite outdated --filter app           # 检查特定工作区中的内容
  vite outdated -w                     # 包含工作区根目录（pnpm）
  vite outdated -w -r                  # 包含工作区根目录并递归（pnpm）
  vite outdated --prod                 # 仅生产依赖（pnpm）
  vite outdated --compatible           # 仅兼容版本（pnpm）
  vite outdated --sort-by name         # 按名称排序结果（pnpm）
  vite outdated -g                     # 检查全局包
```

## 性能考量

1. **无缓存**：查询远程注册表，缓存会过期
2. **依赖网络**：性能取决于注册表响应时间
3. **并行检查**：某些包管理器会并行执行版本检查
4. **JSON 输出**：比表格格式更便于程序化解析

## 安全考量

1. **只读**：仅查询包版本，不进行修改
2. **注册表信任**：依赖 package registry 提供版本信息
3. **漏洞检测**：有助于识别已知存在漏洞的包
4. **适用于 CI**：可安全运行于 CI/CD 流水线中
5. **审计集成**：结果可用于安全审计

## 向后兼容性

这是一个没有破坏性变更的新功能：

- 现有命令不受影响
- 新命令是增量添加
- 任务配置无变化
- 缓存行为无变化

## 迁移路径

### 采用

用户可以立即开始使用：

```bash
# 旧方式
pnpm outdated
npm outdated
yarn outdated

# 新方式（适用于任何包管理器）
vite outdated
```

### CI/CD 集成

```yaml
# 检查过期包
- run: vite outdated --format json > outdated.json

# 如果关键包已过期则构建失败
- run: |
    vite outdated --format json > outdated.json
    # 解析 JSON 并检查关键包
    node scripts/check-critical-outdated.js

# 每周过期包报告
- run: vite outdated -r --format json > weekly-outdated-report.json
```

## 实际使用示例

### 检查更新

```bash
# 检查所有包
vite outdated

# 检查指定包
vite outdated react react-dom

# 使用模式匹配检查（pnpm）
vite outdated "@babel/*" "eslint-*"
```

### 生产依赖更新

```bash
# 仅生产依赖（pnpm）
vite outdated --prod

# 使用 JSON 输出以便自动化处理
vite outdated --prod --format json > prod-outdated.json
```

### 工作区分析

```bash
# 检查所有工作区
vite outdated -r

# 检查指定工作区
vite outdated --filter app

# 比较工作区
vite outdated --filter "app*" -r
```

### 兼容版本更新

```bash
# 仅显示符合 package.json 的版本（pnpm）
vite outdated --compatible

# 显示所有可能的更新
vite outdated
```

### 全局包更新

```bash
# 检查全局安装的包
vite outdated -g

# 检查指定的全局包
vite outdated -g typescript
```

## 包管理器兼容性

| 功能               | pnpm               | npm                           | yarn@1           | yarn@2+             | bun                  | 备注                     |
| ------------------ | ------------------ | ----------------------------- | ---------------- | ------------------- | -------------------- | ------------------------ |
| 基本命令           | ✅ `outdated`      | ✅ `outdated`                 | ✅ `outdated`    | ⚠️ `upgrade-int...` | ✅ `outdated`        | yarn@2+ 使用交互式界面   |
| 模式匹配           | ✅ Glob patterns   | ⚠️ 包名                        | ⚠️ 包名           | ❌ 不支持            | ❌ 不支持             | pnpm 支持 glob 模式      |
| JSON 输出          | ✅ `--format json` | ✅ `--json`                   | ❌ 不支持         | ❌ 不支持            | ❌ 不支持             | 不同的标志               |
| 长输出             | ✅ `--long`        | ✅ `--long`                   | ❌ 不支持         | ❌ 不支持            | ❌ 不支持             | 仅 pnpm 和 npm           |
| 可解析             | ❌ 不支持          | ✅ `--parseable`              | ❌ 不支持         | ❌ 不支持            | ❌ 不支持             | 仅 npm                   |
| 递归               | ✅ `-r`            | ❌ 不支持                      | ❌ 不支持         | ❌ 不支持            | ✅ `-r`               | pnpm 和 bun              |
| 工作区筛选         | ✅ `--filter`      | ✅ `--workspace`              | ❌ 不支持         | ❌ 不支持            | ✅ `--filter` / `-F` | 不同的标志               |
| 工作区根目录       | ✅ `-w`            | ✅ `--include-workspace-root` | ❌ 不支持         | ❌ 不支持            | ❌ 不支持             | 不同的标志               |
| 依赖类型筛选       | ✅ `--prod/--dev`  | ❌ 不支持                      | ❌ 不支持         | ❌ 不支持            | ❌ 不支持             | 仅 pnpm                  |
| 仅兼容版本         | ✅ `--compatible`  | ❌ 不支持                      | ❌ 不支持         | ❌ 不支持            | ❌ 不支持             | 仅 pnpm                  |
| 排序结果           | ✅ `--sort-by`     | ❌ 不支持                      | ❌ 不支持         | ❌ 不支持            | ❌ 不支持             | 仅 pnpm                  |
| 全局检查           | ✅ `-g`            | ✅ `-g`                       | ❌ 不支持         | ❌ 不支持            | ❌ 不支持             | pnpm 和 npm              |
| 显示所有传递依赖   | ⚠️ `-r`            | ✅ `--all`                    | ❌ 不支持         | ❌ 不支持            | ❌ 不支持             | 不同的方法               |

## 未来增强

### 1. 严重性指示

根据 semver 显示更新严重性：

```bash
vite outdated --with-severity

Package         Current  Wanted  Latest  Severity
react           18.2.0   18.3.1  18.3.1  Minor
lodash          4.17.20  4.17.21 4.17.21 Patch
webpack         5.0.0    5.0.0   6.0.0   Major ⚠️
```

### 2. 安全集成

与安全公告集成：

```bash
vite outdated --format json --with-security

Package         Current  Latest  Security
lodash          4.17.20  4.17.21 🔴 High severity vulnerability
axios           0.21.0   1.7.0   🟡 Moderate severity issue
react           18.2.0   18.3.1  ✅ No known issues
```

### 3. 更新计划生成

通过依赖分析生成更新计划：

```bash
vite outdated --format json --plan > update-plan.json

# 输出：
{
  "safeUpdates": ["lodash@4.17.21", "react@18.3.1"],
  "breakingUpdates": ["webpack@6.0.0"],
  "blockedBy": {
    "webpack": ["babel-loader requires webpack@5"]
  }
}
```

### 4. 交互模式

为所有包管理器添加交互式选择模式：

```bash
vite outdated --interactive

# 显示交互式 UI：
┌─ Outdated Packages ────────────────────┐
│ [x] react       18.2.0 → 18.3.1       │
│ [x] lodash      4.17.20 → 4.17.21     │
│ [ ] webpack     5.0.0 → 6.0.0 (major) │
└────────────────────────────────────────┘
Press <space> to select, <enter> to update
```

### 5. 更新日志集成

显示更新的变更日志：

```bash
vite outdated --with-changelog

Package: react 18.2.0 → 18.3.1
Changes:
- Fix: Memory leak in useEffect
- Feat: New useDeferredValue hook
- Perf: Improved rendering performance
```

## 待解决问题

1. **我们是否应该以不同方式处理退出码 1？**
   - 建议：不，将找到过期包视为成功
   - 与包管理器行为一致
   - 符合用户预期

2. **我们是否应该添加 --fix 标志来自动更新？**
   - 建议：不，使用单独的 `vp update` 命令
   - 保持命令聚焦
   - 防止意外更新

3. **我们是否应该支持自定义输出格式？**
   - 建议：不，使用原生包管理器输出
   - 实现更简单
   - 用户更熟悉
   - 如有需要，未来可添加

4. **我们是否应该缓存注册表查询？**
   - 建议：不，始终查询最新数据
   - 注册表数据变化频繁
   - 用户期望获取当前信息

5. **我们是否应该以不同方式支持 yarn@2+？**
   - 建议：是，使用 `upgrade-interactive`
   - 与 yarn@2+ 的推荐方式一致
   - 向用户提供有关不同 UI 的说明

## 成功指标

1. **采用率**：使用 `vite outdated` 而非直接使用包管理器的用户占比
2. **更新频率**：用户检查后更新包的频率
3. **CI 集成**：在 CI/CD 中用于过期检查的使用情况
4. **用户反馈**：关于命令实用性的调查/问题
5. **安全影响**：含有漏洞的过期包数量减少

## 结论

本 RFC 提议添加 `vite outdated` 命令，以提供一个统一接口，用于跨 pnpm/npm/yarn/bun 检查过期包。该设计：

- ✅ 自动适配检测到的包管理器
- ✅ 支持模式匹配（pnpm），并可优雅降级
- ✅ 完整支持 pnpm 功能（格式、筛选、兼容性、排序）
- ✅ 兼容 npm 和 yarn，并提供适当警告
- ✅ 支持感知工作区的操作
- ✅ 多种输出格式（json、table、list、parseable）
- ✅ 正确处理退出码（1 = 找到过期包）
- ✅ 无缓存（始终获取最新数据）
- ✅ 注重安全（有助于识别有漏洞的包）
- ✅ 实现简单，充分利用现有基础设施
- ✅ 可扩展以支持未来增强（严重性、安全、交互式）

该实现遵循与其他包管理命令相同的模式，同时提供开发者维护项目中最新且安全依赖所需的依赖更新检查功能。
