# RFC：Vite+ Why 包命令

## 摘要

新增 `vp why`（别名：`vp explain`）命令，该命令会自动适配检测到的包管理器（pnpm/npm/yarn/bun），用于展示所有依赖指定包的包。这有助于开发者理解依赖关系、审计包的使用情况，并调试依赖树问题。

## 动机

目前，开发者必须手动使用不同包管理器特定的命令来了解某个包为什么被安装：

```bash
pnpm why <package>
npm explain <package>
yarn why <package>
```

这会给依赖分析工作流带来摩擦，并且需要记住不同的语法。一个统一的接口将：

1. **简化依赖分析**：一条命令可跨所有包管理器工作
2. **自动检测**：自动使用正确的包管理器
3. **一致性**：无论底层工具如何，语法都保持一致
4. **集成**：可与现有 Vite+ 功能无缝协作

### 当前痛点

```bash
# 开发者需要知道当前使用的是哪种包管理器
pnpm why react                    # pnpm 项目
npm explain react                 # npm 项目（命令名不同）
yarn why react                    # yarn 项目

# 不同的输出格式
pnpm why react --json             # pnpm - JSON 输出
npm explain react --json          # npm - JSON 输出
yarn why react                    # yarn - 自定义格式

# 不同的工作区目标指定方式
pnpm why react --filter app       # pnpm - 过滤工作区
npm explain react --workspace app # npm - 指定工作区
yarn why react                    # yarn - 无工作区过滤
```

### 拟议解决方案

```bash
# 适用于所有包管理器
vp why <package>                # 显示包为何被安装
vp explain <package>            # 别名（与 npm 对齐）

# 输出格式
vp why react --json             # JSON 输出
vp why react --long             # 详细输出
vp why react --parseable        # 可解析格式

# 工作区操作
vp why react --filter app       # 在特定工作区中检查（pnpm）
vp why react -r                 # 跨工作区递归检查

# 依赖类型过滤
vp why react --prod             # 仅生产依赖
vp why react --dev              # 仅开发依赖
vp why react --depth 2          # 限制树深度
```

## 拟议解决方案

### 命令语法

#### Why 命令

```bash
vp why <PACKAGE> [OPTIONS]
vp explain <PACKAGE> [OPTIONS]        # 别名
```

**示例：**

```bash
# 基本用法
vp why react
vp explain lodash

# 多个包（pnpm 风格）
vp why react react-dom
vp why "babel-*" "eslint-*"

# 输出格式
vp why react --json             # JSON 输出
vp why react --long             # 详细输出
vp why react --parseable        # 可解析输出

# 工作区操作
vp why react -r                 # 在所有工作区中递归
vp why react --filter app       # 在特定工作区中检查（pnpm）

# 依赖类型过滤
vp why react --prod             # 仅生产依赖
vp why react --dev              # 仅开发依赖
vp why react --no-optional      # 排除可选依赖

# 深度控制
vp why react --depth 3          # 将树深度限制为 3 层

# 全局包
vp why typescript -g            # 检查全局安装的包

# 自定义 finder（仅 pnpm）
vp why react --find-by myFinder # 使用 .pnpmfile.cjs 中的 finder 函数
```

### 全局包检查

仅使用 `npm` 来检查全局安装的包，因为 `vp install -g` 使用的是 `npm` cli 来安装全局包。

```bash
vp why typescript -g            # 检查全局安装的包

-> npm why typescript -g
```

### 命令映射

#### Why 命令映射

**pnpm 参考：**

- https://pnpm.io/cli/why
- 显示所有依赖指定包的包

**npm 参考：**

- https://docs.npmjs.com/cli/v11/commands/npm-explain
- 解释为什么某个包被安装（别名：`npm why`）

**yarn 参考：**

- https://classic.yarnpkg.com/en/docs/cli/why（yarn@1）
- https://yarnpkg.com/cli/why（yarn@2+）
- 标识某个包为何已被安装

| Vite+ 标志               | pnpm                      | npm                     | yarn@1              | yarn@2+                  | bun             | 描述                                                         |
| ------------------------ | ------------------------- | ----------------------- | ------------------- | ------------------------ | --------------- | ------------------------------------------------------------ |
| `vp why <pkg>`            | `pnpm why <pkg>`          | `npm explain <pkg>`     | `yarn why <pkg>`    | `yarn why <pkg> --peers` | `bun why <pkg>` | 显示包为何被安装                                               |
| `--json`                  | `--json`                  | `--json`                | `--json`            | `--json`                 | N/A             | JSON 输出格式                                                 |
| `--long`                  | `--long`                  | N/A                     | N/A                 | N/A                      | N/A             | 详细输出（仅 pnpm）                                           |
| `--parseable`             | `--parseable`             | N/A                     | N/A                 | N/A                      | N/A             | 可解析格式（仅 pnpm）                                         |
| `-r, --recursive`         | `-r, --recursive`         | N/A                     | N/A                 | `--recursive`            | N/A             | 跨所有工作区检查                                               |
| `--filter <pattern>`      | `--filter <pattern>`      | `--workspace <pattern>` | N/A                 | N/A                      | N/A             | 目标特定工作区（pnpm/npm）                                     |
| `-w, --workspace-root`    | `-w`                      | N/A                     | N/A                 | N/A                      | N/A             | 在工作区根目录检查（pnpm 特有）                                 |
| `-P, --prod`              | `-P, --prod`              | N/A                     | N/A                 | N/A                      | N/A             | 仅生产依赖（仅 pnpm）                                         |
| `-D, --dev`               | `-D, --dev`               | N/A                     | N/A                 | N/A                      | N/A             | 仅开发依赖（仅 pnpm）                                         |
| `--depth <number>`        | `--depth <number>`        | N/A                     | N/A                 | N/A                      | `--depth`       | 限制树深度（pnpm/bun）                                        |
| `--no-optional`           | `--no-optional`           | N/A                     | `--ignore-optional` | N/A                      | N/A             | 排除可选依赖（仅 pnpm）                                       |
| `-g, --global`            | `-g, --global`            | N/A                     | N/A                 | N/A                      | N/A             | 检查全局安装的包                                               |
| `--exclude-peers`         | `--exclude-peers`         | N/A                     | N/A                 | Removes `--peers` flag   | N/A             | 排除 peer 依赖（yarn@2+ 默认包含 peers）                      |
| `--find-by <finder_name>` | `--find-by <finder_name>` | N/A                     | N/A                 | N/A                      | N/A             | 使用 .pnpmfile.cjs 中的 finder 函数                            |

**注意：**

- npm 使用 `explain` 作为主命令，`why` 作为别名，支持多个包
- pnpm 使用 `why` 作为主命令，支持多个包和 glob 模式
- yarn 在 v1 和 v2+ 中都有 `why` 命令，但输出格式不同，只支持单个包
- pnpm 拥有最全面的过滤和输出选项
- npm 的输出更简单，聚焦于依赖路径
- bun 使用 `bun why <pkg>` 作为直接子命令（不是 `bun pm why`）；它提供依赖关系的树状可视化

**别名：**

- `vp explain` = `vp why`（与 npm 的主命令名一致）

### 不同包管理器之间的 Why 行为差异

#### pnpm

**Why 行为：**

- 显示所有依赖指定包的包
- 支持多个包和 glob 模式：`pnpm why babel-* eslint-*`
- 展示包含完整路径的依赖树
- 在 10 个终端叶子节点后截断输出，以防止内存问题
- 支持使用 `--filter` 进行工作区过滤
- 可按依赖类型（prod、dev、optional）过滤
- 支持限制深度
- 可用 `-g` 检查全局包

**输出格式：**

```
Legend: production dependency, optional only, dev only

package-a@1.0.0 /path/to/package-a
└── react@18.3.1
    └── react-dom@18.3.1

package-b@2.0.0 /path/to/package-b
└─┬ @testing-library/react@14.0.0
  └── react@18.3.1
```

**选项：**

- `--json`：JSON 格式
- `--long`：扩展信息
- `--parseable`：可解析格式（无树结构）
- `-r`：跨工作区递归
- `--filter`：工作区过滤
- `--prod`/`--dev`：依赖类型过滤
- `--depth`：限制树深度
- `--exclude-peers`：排除 peer 依赖

#### npm

**Explain 行为：**

- 显示某个包为何被安装的依赖路径
- 主命令是 `explain`，`why` 是别名
- 输出简单、聚焦，显示依赖链
- 支持使用 `--workspace` 指定工作区
- 支持 JSON 输出

**输出格式：**

```
react@18.3.1
node_modules/react
  react@"^18.3.1" from react-dom@18.3.1
  node_modules/react-dom
    react-dom@"^18.3.1" from the root project
  react@"^18.3.1" from @testing-library/react@14.0.0
  node_modules/@testing-library/react
    @testing-library/react@"^14.0.0" from the root project
```

**选项：**

- `--json`：JSON 格式
- `--workspace`：目标特定工作区

#### yarn@1（Classic）

**Why 行为：**

- 标识某个包为何已被安装
- 显示哪些包依赖它
- 显示磁盘大小信息（包含和不包含依赖）
- 显示该包是否被 hoist
- 可以接受包名、文件夹路径或文件路径

**输出格式：**

```
[1/4] 🤔  Why do we have the package "jest"?
[2/4] 🚚  Required dependencies
info Reasons this module exists
   - "@my/package#devDependencies" depends on it
   - Hoisted from "@my/package#jest"
[3/4] 💾  Disk size without dependencies: "0B"
[4/4] 📦  Dependencies using this package
```

**选项：**

- 无命令行选项
- 仅支持单个包

#### yarn@2+（Berry）

**Why 行为：**

- 显示某个包为何存在于依赖树中
- 输出比 yarn@1 更精简
- 支持跨工作区递归检查
- 默认包含 peer 依赖（使用 `--peers` 标志）
- 使用 `--exclude-peers` 移除 `--peers` 标志

**输出格式：**

```
➤ YN0000: react@npm:18.3.1
➤ YN0000: └ Required by: react-dom@npm:18.3.1
➤ YN0000: └ Required by: @testing-library/react@npm:14.0.0
```

**选项：**

- `--recursive`：跨工作区检查
- `--peers`：包含 peer 依赖（由 Vite+ 默认添加）
- 不同的插件系统可能会影响输出

### 实现架构

#### 1. 命令结构

**文件**：`crates/vite_task/src/lib.rs`

添加新的命令变体：

```rust
#[derive(Subcommand, Debug)]
pub enum Commands {
    // ... 现有命令

    /// 显示某个包为何被安装
    #[command(disable_help_flag = true, alias = "explain")]
    Why {
        /// 要检查的包
        packages: Vec<String>,

        /// 以 JSON 格式输出
        #[arg(long)]
        json: bool,

        /// 显示扩展信息（仅 pnpm）
        #[arg(long)]
        long: bool,

        /// 显示可解析输出（仅 pnpm）
        #[arg(long)]
        parseable: bool,

        /// 跨所有工作区递归检查
        #[arg(short = 'r', long)]
        recursive: bool,

        /// 过滤 monorepo 中的包（仅 pnpm）
        #[arg(long, value_name = "PATTERN")]
        filter: Vec<String>,

        /// 在工作区根目录检查（仅 pnpm）
        #[arg(short = 'w', long)]
        workspace_root: bool,

        /// 仅生产依赖（仅 pnpm）
        #[arg(short = 'P', long)]
        prod: bool,

        /// 仅开发依赖（仅 pnpm）
        #[arg(short = 'D', long)]
        dev: bool,

        /// 限制树深度（仅 pnpm）
        #[arg(long)]
        depth: Option<u32>,

        /// 排除可选依赖（仅 pnpm）
        #[arg(long)]
        no_optional: bool,

        /// 检查全局安装的包（仅 pnpm）
        #[arg(short = 'g', long)]
        global: bool,

        /// 排除 peer 依赖（仅 pnpm）
        #[arg(long)]
        exclude_peers: bool,

        /// 使用在 .pnpmfile.cjs 中定义的 finder 函数（仅 pnpm）
        #[arg(long)]
        find_by: Option<String>,

        /// 传递给包管理器的参数
        #[arg(allow_hyphen_values = true, trailing_var_arg = true)]
        args: Vec<String>,
    },
}
```

#### 2. 包管理器适配器

**文件**：`crates/vite_package_manager/src/commands/why.rs`（新文件）

```rust
use std::{collections::HashMap, process::ExitStatus};

use vite_error::Error;
use vite_path::AbsolutePath;

use crate::package_manager::{
    PackageManager, PackageManagerType, ResolveCommandResult, format_path_env, run_command,
};

#[derive(Debug, Default)]
pub struct WhyCommandOptions<'a> {
    pub packages: &'a [String],
    pub json: bool,
    pub long: bool,
    pub parseable: bool,
    pub recursive: bool,
    pub filters: Option<&'a [String]>,
    pub workspace_root: bool,
    pub prod: bool,
    pub dev: bool,
    pub depth: Option<u32>,
    pub no_optional: bool,
    pub global: bool,
    pub exclude_peers: bool,
    pub find_by: Option<&'a str>,
    pub pass_through_args: Option<&'a [String]>,
}

impl PackageManager {
    /// 使用包管理器运行 why 命令。
    #[must_use]
    pub async fn run_why_command(
        &self,
        options: &WhyCommandOptions<'_>,
        cwd: impl AsRef<AbsolutePath>,
    ) -> Result<ExitStatus, Error> {
        let resolve_command = self.resolve_why_command(options);
        run_command(&resolve_command.bin_path, &resolve_command.args, &resolve_command.envs, cwd)
            .await
    }

    /// 解析 why 命令。
    #[must_use]
    pub fn resolve_why_command(&self, options: &WhyCommandOptions) -> ResolveCommandResult {
        let bin_name: String;
        let envs = HashMap::from([("PATH".to_string(), format_path_env(self.get_bin_prefix()))]);
        let mut args: Vec<String> = Vec::new();

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

                args.push("why".into());

                if options.json {
                    args.push("--json".into());
                }

                if options.long {
                    args.push("--long".into());
                }

                if options.parseable {
                    args.push("--parseable".into());
                }

                if options.recursive {
                    args.push("--recursive".into());
                }

                if options.workspace_root {
                    args.push("--workspace-root".into());
                }

                if options.prod {
                    args.push("--prod".into());
                }

                if options.dev {
                    args.push("--dev".into());
                }

                if let Some(depth) = options.depth {
                    args.push("--depth".into());
                    args.push(depth.to_string());
                }

                if options.no_optional {
                    args.push("--no-optional".into());
                }

                if options.global {
                    args.push("--global".into());
                }

                if options.exclude_peers {
                    args.push("--exclude-peers".into());
                }

                if let Some(find_by) = options.find_by {
                    args.push("--find-by".into());
                    args.push(find_by.to_string());
                }

                // 添加包（pnpm 支持多个包）
                args.extend_from_slice(options.packages);
            }
            PackageManagerType::Yarn => {
                bin_name = "yarn".into();

                args.push("why".into());

                // yarn 只支持单个包
                if options.packages.len() > 1 {
                    eprintln!("Warning: yarn only supports checking one package at a time, using first package");
                }
                args.push(options.packages[0].clone());

                // yarn@2+ 支持 --recursive
                if options.recursive && !self.version.starts_with("1.") {
                    args.push("--recursive".into());
                }

                // yarn@2+：默认添加 --peers，除非设置了 --exclude-peers
                if !self.version.starts_with("1.") && !options.exclude_peers {
                    args.push("--peers".into());
                }

                // 对不支持的标志发出警告
                if options.json {
                    eprintln!("Warning: --json not supported by yarn");
                }
                if options.long {
                    eprintln!("Warning: --long not supported by yarn");
                }
                if options.parseable {
                    eprintln!("Warning: --parseable not supported by yarn");
                }
                if let Some(filters) = options.filters {
                    if !filters.is_empty() {
                        eprintln!("Warning: --filter not supported by yarn");
                    }
                }
                if options.prod || options.dev {
                    eprintln!("Warning: --prod/--dev not supported by yarn");
                }
                if options.find_by.is_some() {
                    eprintln!("Warning: --find-by not supported by yarn");
                }
            }
            PackageManagerType::Npm => {
                bin_name = "npm".into();

                // npm 使用 'explain' 作为主命令
                args.push("explain".into());

                // npm: --workspace 放在命令之后
                if let Some(filters) = options.filters {
                    for filter in filters {
                        args.push("--workspace".into());
                        args.push(filter.clone());
                    }
                }

                if options.json {
                    args.push("--json".into());
                }

                // 添加包（npm 支持多个包）
                args.extend_from_slice(options.packages);

                // 对 pnpm 特定标志发出警告
                if options.long {
                    eprintln!("Warning: --long not supported by npm");
                }
                if options.parseable {
                    eprintln!("Warning: --parseable not supported by npm");
                }
                if options.prod || options.dev {
                    eprintln!("Warning: --prod/--dev not supported by npm");
                }
                if options.depth.is_some() {
                    eprintln!("Warning: --depth not supported by npm");
                }
                if options.find_by.is_some() {
                    eprintln!("Warning: --find-by not supported by npm");
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

更新以包含 why 模块：

```rust
pub mod add;
mod install;
pub mod remove;
pub mod update;
pub mod link;
pub mod unlink;
pub mod dedupe;
pub mod why;  // 添加这一行
```

#### 3. Why 命令实现

**文件**：`crates/vite_task/src/why.rs`（新文件）

```rust
use vite_error::Error;
use vite_path::AbsolutePathBuf;
use vite_package_manager::{
    PackageManager,
    commands::why::WhyCommandOptions,
};
use vite_workspace::Workspace;

pub struct WhyCommand {
    workspace_root: AbsolutePathBuf,
}

impl WhyCommand {
    pub fn new(workspace_root: AbsolutePathBuf) -> Self {
        Self { workspace_root }
    }

    pub async fn execute(
        self,
        packages: Vec<String>,
        json: bool,
        long: bool,
        parseable: bool,
        recursive: bool,
        filters: Vec<String>,
        workspace_root: bool,
        prod: bool,
        dev: bool,
        depth: Option<u32>,
        no_optional: bool,
        global: bool,
        exclude_peers: bool,
        extra_args: Vec<String>,
    ) -> Result<ExecutionSummary, Error> {
        if packages.is_empty() {
            return Err(Error::NoPackagesSpecified);
        }

        let package_manager = PackageManager::builder(&self.workspace_root).build().await?;
        let workspace = Workspace::partial_load(self.workspace_root)?;

        // 构建 why 命令选项
        let why_options = WhyCommandOptions {
            packages: &packages,
            json,
            long,
            parseable,
            recursive,
            filters: if filters.is_empty() { None } else { Some(&filters) },
            workspace_root,
            prod,
            dev,
            depth,
            no_optional,
            global,
            exclude_peers,
            pass_through_args: if extra_args.is_empty() { None } else { Some(&extra_args) },
        };

        let exit_status = package_manager
            .run_why_command(&why_options, &workspace.root)
            .await?;

        if !exit_status.success() {
            return Err(Error::CommandFailed {
                command: "why".to_string(),
                exit_code: exit_status.code(),
            });
        }

        workspace.unload().await?;

        Ok(ExecutionSummary::default())
    }
}
```

## 设计决策

### 1. 不缓存

**决策**：不要缓存 `why` 操作。

**理由**：

- `why` 查询当前依赖状态
- 结果取决于已安装的包
- 缓存会提供过时信息
- 该操作很快，不需要缓存

### 2. 支持多个包

**决策**：接受多个包，并将其传递给支持此功能的包管理器。

**理由**：

- pnpm 支持多个包：`pnpm why react react-dom`
- npm 支持多个包：`npm explain react react-dom`
- yarn 仅支持单个包
- 仅对 yarn 发出警告并使用第一个包
- 比直接报错更好的用户体验

### 3. 别名选择

**决策**：使用 `explain` 作为别名（与 npm 一致）。

**理由**：

- npm 使用 `explain` 作为主命令，`why` 作为别名
- 动词更具描述性
- 帮助 npm 用户感到熟悉
- 两个命令达成相同目标

### 4. 输出格式支持

**决策**：支持 pnpm 的输出格式标志，并在其他包管理器上给出警告。

**理由**：

- pnpm 有 `--json`、`--long`、`--parseable`
- npm 只有 `--json`
- yarn 的输出格式是固定的
- 就不支持的格式向用户发出警告

### 5. 工作区过滤

**决策**：支持 `--filter` 标志，并将其转换为相应包管理器的语法。

**理由**：

- pnpm 在命令前使用 `--filter`：`pnpm --filter app why react`
- npm 在命令后使用 `--workspace`：`npm explain --workspace app react`
- Vite+ 使用统一的 `--filter` 标志，并会适配转换
- yarn 不支持工作区过滤
- 与其他 Vite+ 命令保持一致

### 6. 依赖类型过滤

**决策**：支持 pnpm 的 `--prod`、`--dev`、`--no-optional` 标志，并在不支持时给出警告。

**理由**：

- pnpm 允许按依赖类型过滤
- npm 或 yarn 中不可用
- 有助于聚焦分析
- 不支持时发出警告

## 错误处理

### 未检测到包管理器

```bash
$ vp why react
Error: No package manager detected
Please run one of:
  - vp install (to set up package manager)
  - Add packageManager field to package.json
```

### 未指定包

```bash
$ vp why
error: the following required arguments were not provided:
  <PACKAGES>...

Usage: vp why [OPTIONS] <PACKAGES>... [-- <PASS_THROUGH_ARGS>...]

For more information, try '--help'.
```

### 未找到包

```bash
$ vp why nonexistent-package
Package 'nonexistent-package' is not in the project.
Exit code: 1
```

### 不支持的标志警告

```bash
$ vp why react --long
Warning: --long not supported by npm
Running: npm explain react
```

## 用户体验

### 成功输出（pnpm）

```bash
$ vp why react
Detected package manager: pnpm@10.15.0
Running: pnpm why react

Legend: production dependency, optional only, dev only

my-app@1.0.0 /Users/user/my-app

dependencies:
react 18.3.1
├── react-dom 18.3.1
└─┬ @testing-library/react 14.0.0
  └─┬ @testing-library/dom 9.3.4
    └─┬ @testing-library/user-event 14.5.2
      └── react-dom 18.3.1

devDependencies:
react 18.3.1
└── @types/react 18.3.3

Done in 0.5s
```

### 成功输出（npm）

```bash
$ vp explain react
Detected package manager: npm@11.0.0
Running: npm explain react

react@18.3.1
node_modules/react
  react@"^18.3.1" from react-dom@18.3.1
  node_modules/react-dom
    react-dom@"^18.3.1" from the root project
  react@"^18.3.1" from @testing-library/react@14.0.0
  node_modules/@testing-library/react
    @testing-library/react@"^14.0.0" from the root project

Done in 0.3s
```

### 成功输出（yarn）

```bash
$ vp why react
Detected package manager: yarn@1.22.19
Running: yarn why react

[1/4] 🤔  Why do we have the package "react"?
[2/4] 🚚  Required dependencies
info Reasons this module exists
   - "my-app#dependencies" depends on it
   - Hoisted from "my-app#react"
[3/4] 💾  Disk size without dependencies: "285KB"
[4/4] 📦  Dependencies using this package: react-dom, @testing-library/react

Done in 0.8s
```

### JSON 输出（pnpm）

```bash
$ vp why react --json
Detected package manager: pnpm@10.15.0
Running: pnpm why react --json

[
  {
    "name": "my-app",
    "version": "1.0.0",
    "path": "/Users/user/my-app",
    "dependencies": {
      "react": {
        "version": "18.3.1",
        "dependents": [
          {
            "name": "react-dom",
            "version": "18.3.1"
          },
          {
            "name": "@testing-library/react",
            "version": "14.0.0"
          }
        ]
      }
    }
  }
]

Done in 0.4s
```

### 多个包（pnpm）

```bash
$ vp why react react-dom lodash
Detected package manager: pnpm@10.15.0
Running: pnpm why react react-dom lodash

Legend: production dependency, optional only, dev only

my-app@1.0.0 /Users/user/my-app

react 18.3.1
└── react-dom 18.3.1

react-dom 18.3.1
dependency of my-app

lodash 4.17.21
└─┬ webpack 5.95.0
  └── babel-loader 9.2.1

Done in 0.6s
```

## 考虑过的替代设计

### 方案 1：分离命令名称

```bash
vp why <package>      # For pnpm/yarn
vp explain <package>  # For npm only
```

**被拒绝的原因**：

- 容易让人困惑该使用哪个
- 包管理器应该被抽象掉
- 别名比单独命令更好

### 方案 2：始终使用多包格式

```bash
vp why react react-dom  # Always accept multiple
# Error on npm/yarn
```

**被拒绝的原因**：

- 过于严格，会阻止使用
- 更好的方式是警告并使用第一个包
- 提供更好的用户体验

### 方案 3：自动转换输出格式

```bash
vp why react --json  # On yarn
# Attempt to convert yarn's output to JSON
```

**被拒绝的原因**：

- 输出格式解析很脆弱
- 不同包管理器的数据不同
- 更适合对不支持的功能发出警告
- 保留原生输出

## 实施计划

### 第 1 阶段：核心功能

1. 在 `Commands` 枚举中添加 `Why` 命令变体
2. 在两个 crate 中创建 `why.rs` 模块
3. 实现包管理器命令解析
4. 添加基础错误处理

### 第 2 阶段：高级功能

1. 实现输出格式选项（json、long、parseable）
2. 添加工作区过滤支持
3. 实现依赖类型过滤（prod、dev）
4. 处理深度限制

### 第 3 阶段：测试

1. 为命令解析编写单元测试
2. 使用模拟包管理器进行集成测试
3. 测试多包支持
4. 测试工作区操作
5. 测试输出格式选项

### 第 4 阶段：文档

1. 更新 CLI 文档
2. 在 README 中添加示例
3. 记录包管理器兼容性
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
- bun@1.x [进行中]

### 单元测试

```rust
#[test]
fn test_pnpm_why_basic() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.resolve_why_command(&WhyCommandOptions {
        packages: &["react".to_string()],
        ..Default::default()
    });
    assert_eq!(args, vec!["why", "react"]);
}

#[test]
fn test_pnpm_why_multiple_packages() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.resolve_why_command(&WhyCommandOptions {
        packages: &["react".to_string(), "lodash".to_string()],
        ..Default::default()
    });
    assert_eq!(args, vec!["why", "react", "lodash"]);
}

#[test]
fn test_pnpm_why_json() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.resolve_why_command(&WhyCommandOptions {
        packages: &["react".to_string()],
        json: true,
        ..Default::default()
    });
    assert_eq!(args, vec!["why", "--json", "react"]);
}

#[test]
fn test_npm_explain_basic() {
    let pm = PackageManager::mock(PackageManagerType::Npm);
    let args = pm.resolve_why_command(&WhyCommandOptions {
        packages: &["react".to_string()],
        ..Default::default()
    });
    assert_eq!(args, vec!["explain", "react"]);
}

#[test]
fn test_yarn_why_basic() {
    let pm = PackageManager::mock(PackageManagerType::Yarn);
    let args = pm.resolve_why_command(&WhyCommandOptions {
        packages: &["react".to_string()],
        ..Default::default()
    });
    assert_eq!(args, vec!["why", "react"]);
}

#[test]
fn test_pnpm_why_with_filter() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.resolve_why_command(&WhyCommandOptions {
        packages: &["react".to_string()],
        filters: Some(&["app".to_string()]),
        ..Default::default()
    });
    assert_eq!(args, vec!["--filter", "app", "why", "react"]);
}

#[test]
fn test_pnpm_why_with_depth() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.resolve_why_command(&WhyCommandOptions {
        packages: &["react".to_string()],
        depth: Some(3),
        ..Default::default()
    });
    assert_eq!(args, vec!["why", "--depth", "3", "react"]);
}
```

### 集成测试

创建用于测试各个包管理器的 fixtures：

```
fixtures/why-test/
  pnpm-workspace.yaml
  package.json
  packages/
    app/
      package.json (with react, lodash deps)
    utils/
      package.json (with lodash dep)
  test-steps.json
```

测试用例：

1. 单个包的基础 why
2. 多个包（仅 pnpm）
3. JSON 输出
4. 指定工作区的 why
5. 递归工作区检查
6. 依赖类型过滤
7. 深度限制
8. 全局包检查
9. 不支持标志的警告信息

## CLI 帮助输出

```bash
$ vp why --help
Show why a package is installed

Usage: vp why [OPTIONS] <PACKAGE>... [-- <PASS_THROUGH_ARGS>...]

Aliases: explain

Arguments:
  <PACKAGE>...           Package(s) to check (required, pnpm/npm support multiple, yarn uses first)

Options:
  --json                 Output in JSON format
  --long                 Show extended information (pnpm-specific)
  --parseable            Show parseable output (pnpm-specific)
  -r, --recursive        Check recursively across all workspaces
  --filter <PATTERN>     Filter packages in monorepo (pnpm-specific, can be used multiple times)
  -w, --workspace-root   Check in workspace root (pnpm-specific)
  -P, --prod             Only production dependencies (pnpm-specific)
  -D, --dev              Only dev dependencies (pnpm-specific)
  --depth <NUMBER>       Limit tree depth (pnpm-specific)
  --no-optional          Exclude optional dependencies (pnpm-specific)
  -g, --global           Check globally installed packages
  --exclude-peers        Exclude peer dependencies (pnpm/yarn@2+-specific)
  --find-by <FINDER_NAME> Use a finder function defined in .pnpmfile.cjs (pnpm-specific)
  -h, --help             Print help

Package Manager Behavior:
  pnpm:    Shows complete dependency tree with all dependents
  npm:     Shows dependency path explaining installation
  yarn@1:  Shows why package exists with disk size info
  yarn@2+: Shows dependency tree in streamlined format

Examples:
  vp why react                       # Show why react is installed
  vp explain lodash                  # Same as above (alias)
  vp why react react-dom             # Check multiple packages (pnpm/npm)
  vp why react --json                # JSON output
  vp why react --long                # Verbose output (pnpm)
  vp why react -r                    # Recursive across workspaces
  vp why react --filter app          # Check in specific workspace (pnpm)
  vp why react --prod                # Only production deps (pnpm)
  vp why react --depth 3             # Limit tree depth (pnpm)
  vp why typescript -g               # Check global packages
  vp why react --find-by myFinder    # Use custom finder (pnpm)
```

## 性能考量

1. **无缓存**：查询操作很快，缓存没有收益
2. **原生性能**：委托给包管理器经过优化的代码
3. **单次执行**：快速分析当前状态
4. **JSON 输出**：可被解析用于程序化使用

## 安全考量

1. **只读**：仅读取已安装的包，不做修改
2. **不执行代码**：只查询依赖树
3. **适合 CI**：可安全运行于 CI/CD 流水线
4. **审计集成**：帮助理解安全漏洞的来源

## 向后兼容性

这是一个没有破坏性变更的新特性：

- 现有命令不受影响
- 新命令是增量式的
- 不更改任务配置
- 不更改缓存行为

## 迁移路径

### 采用方式

用户可以立即开始使用：

```bash
# 旧方式
pnpm why react
npm explain react

# 新方式（适用于任意包管理器）
vp why react
vp explain react
```

### CI/CD 集成

```yaml
# 检查为何安装了特定包
- run: vp why lodash --json > why-lodash.json

# 验证预期的依赖路径
- run: vp why react | grep "react-dom"
```

## 真实场景使用示例

### 调试重复依赖

```bash
# 检查为何安装了多个版本
vp why lodash
vp why lodash --json | jq '.[] | .dependencies.lodash.version'

# 跨工作区检查
vp why lodash -r
```

### 理解传递依赖

```bash
# 为什么这里有这个间接依赖？
vp why core-js
vp why core-js --long

# 是谁在使用这个深层依赖？
vp why @babel/helper-plugin-utils
```

### 审计依赖

```bash
# 检查安全漏洞来源
vp why vulnerable-package
vp why vulnerable-package --prod  # 仅生产环境

# 找出 monorepo 中所有依赖者
vp why legacy-library -r --json
```

### 工作区分析

```bash
# 哪些工作区使用了这个包？
vp why react -r

# 检查特定工作区
vp why lodash --filter utils

# 比较不同工作区中的依赖原因
vp why axios --filter "app*" -r
```

### 生产依赖分析

```bash
# 哪些生产代码需要它？
vp why package --prod

# 排除开发依赖
vp why package --prod --json
```

## 包管理器兼容性

| 功能             | pnpm              | npm              | yarn@1           | yarn@2+          | bun              | 说明                    |
| ---------------- | ----------------- | ---------------- | ---------------- | ---------------- | ---------------- | ----------------------- |
| 基础命令         | `why`             | `explain`        | `why`            | `why`            | `why`            | npm 使用不同名称        |
| 多个包           | ✅ 支持           | ✅ 支持          | ❌ 仅单个        | ❌ 仅单个        | ❌ 仅单个        | pnpm 和 npm            |
| 通配符模式       | ✅ 支持           | ❌ 不支持        | ❌ 不支持        | ❌ 不支持        | ❌ 不支持        | 仅 pnpm               |
| JSON 输出        | ✅ `--json`       | ✅ `--json`      | ❌ 不支持        | ❌ 不支持        | ❌ 不支持        | 仅 pnpm 和 npm         |
| 长输出           | ✅ `--long`       | ❌ 不支持        | ❌ 不支持        | ❌ 不支持        | ❌ 不支持        | 仅 pnpm               |
| 可解析输出       | ✅ `--parseable`  | ❌ 不支持        | ❌ 不支持        | ❌ 不支持        | ❌ 不支持        | 仅 pnpm               |
| 递归             | ✅ `-r`           | ❌ 不支持        | ❌ 不支持        | ✅ `--recursive` | ❌ 不支持        | pnpm 和 yarn@2+        |
| 工作区过滤       | ✅ `--filter`     | ✅ `--workspace` | ❌ 不支持        | ❌ 不支持        | ❌ 不支持        | pnpm 和 npm            |
| 依赖类型过滤     | ✅ `--prod/--dev` | ❌ 不支持        | ❌ 不支持        | ❌ 不支持        | ❌ 不支持        | 仅 pnpm               |
| 深度限制         | ✅ `--depth`      | ❌ 不支持        | ❌ 不支持        | ❌ 不支持        | ✅ `--depth`     | pnpm 和 bun            |
| 全局检查         | ✅ `-g`           | ❌ 不支持        | ❌ 不支持        | ❌ 不支持        | ❌ 不支持        | 仅 pnpm               |
| 树状视图         | ❌ 不支持        | ❌ 不支持        | ❌ 不支持        | ❌ 不支持        | ✅ 内置          | bun 显示树状视图       |

## 未来增强

### 1. 依赖图可视化

生成可视化依赖图：

```bash
vp why react --graph > dep-graph.html

# ASCII 树状可视化
vp why react --tree
```

### 2. 跨版本比较 Why

展示依赖是如何变化的：

```bash
vp why lodash --compare-version 4.17.20

# 输出：
lodash@4.17.21（原为 4.17.20）
└── webpack 5.95.0（从 5.90.0 升级）
```

### 3. Why 报告

生成全面的依赖报告：

```bash
vp why --report-all > dependencies-report.json

# 所有包及其依赖者
# 适用于审计和优化
```

### 4. 循环依赖检测

高亮循环依赖：

```bash
vp why package-a --detect-circular

# 输出：
⚠️  检测到循环依赖：
package-a → package-b → package-c → package-a
```

### 5. 体积分析集成

展示体积影响：

```bash
vp why lodash --with-size

# 输出：
lodash@4.17.21（压缩后 285KB）
└── webpack（引入 15MB）
└── babel（引入 8MB）
总影响：23.3MB
```

## 未决问题

1. **是否应支持包路径查询（yarn 风格）？**
   - 建议：是，以兼容 yarn
   - 示例：`vp why node_modules/once/once.js`
   - 对其他包管理器转换为包名

2. **检查多个包时是否应聚合输出？**
   - 建议：否，分别展示结果
   - 与 pnpm 行为一致
   - 更易解析

3. **是否应支持交互模式？**
   - 建议：后续增强
   - 让用户以交互方式探索依赖树
   - 类似 `npm ls --interactive`

4. **是否应缓存 why 结果？**
   - 建议：否，始终查询当前状态
   - 依赖树变化频繁
   - 运行很快，无需缓存

5. **是否应与 audit 集成？**
   - 建议：后续增强
   - 内联显示安全信息
   - 示例：`vp why package --with-audit`

## 成功指标

1. **采用率**：使用 `vp why` 相比直接使用包管理器的用户百分比
2. **调试效率**：识别依赖问题所需时间
3. **CI 集成**：在 CI/CD 中用于依赖验证的使用情况
4. **用户反馈**：关于命令有用性的调查/问题反馈

## 结论

此 RFC 提议新增 `vp why` 命令，以提供一个统一接口，用于理解跨 pnpm/npm/yarn/bun 的依赖关系。该设计：

- ✅ 自动适配检测到的包管理器
- ✅ 支持多个包（pnpm）并在能力降级时优雅处理
- ✅ 完整支持 pnpm 特性（json、long、parseable、过滤器）
- ✅ 与 npm 和 yarn 兼容，并给出适当警告
- ✅ 支持工作区感知操作
- ✅ 清晰输出，展示依赖路径
- ✅ 无缓存（读取当前状态）
- ✅ 利用现有基础设施，实现简单
- ✅ 可扩展以支持未来增强（图、体积分析）

该实现遵循与其他包管理命令相同的模式，同时提供开发者所需的依赖分析能力，帮助他们理解、调试并优化依赖树。
