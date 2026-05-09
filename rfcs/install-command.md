# RFC：Vite+ 安装命令

## 摘要

添加 `vp install` 命令（别名：`vp i`），可根据检测到的包管理器（pnpm/yarn/npm/bun）自动适配，在项目中安装所有依赖，并支持常见标志，以及基于 pnpm API 设计的、感知工作区的操作。

## 动机

当前，开发者必须手动使用各个包管理器特定的命令：

```bash
pnpm install
yarn install
npm install
```

这会给 monorepo 工作流带来摩擦，并且需要记住不同的语法。一个统一的接口将：

1. **简化工作流**：一个命令即可跨所有包管理器使用
2. **自动检测**：自动使用正确的包管理器
3. **一致性**：无论底层工具如何，语法保持一致
4. **集成**：可与现有的 Vite+ 功能无缝协作

### 当前痛点

```bash
# 开发者需要知道正在使用哪个包管理器
pnpm install --frozen-lockfile  # pnpm 项目
yarn install --frozen-lockfile  # yarn 项目（v1）或 --immutable（v2+）
npm ci                          # npm 项目（干净安装）
bun install --frozen-lockfile   # bun 项目

# 生产环境安装使用不同的标志
pnpm install --prod
yarn install --production
npm install --omit=dev
```

### 提议的解决方案

```bash
# 适用于所有包管理器
vp install
vp i

# 携带标志
vp install --frozen-lockfile
vp install --prod
vp install --ignore-scripts

# 工作区操作
vp install --filter app
```

### 命令语法

```bash
vp install [OPTIONS]
vp i [OPTIONS]
```

**示例：**

```bash
# 安装所有依赖
vp install
vp i

# 生产环境安装（不包含 devDependencies）
vp install --prod
vp install -P

# 冻结锁文件（CI 模式）
vp install --frozen-lockfile

# 优先离线（可用时使用缓存）
vp install --prefer-offline

# 强制重新安装
vp install --force

# 忽略脚本
vp install --ignore-scripts

# 工作区操作
vp install --filter app              # 为指定包安装
```

### 命令选项

| 选项                   | 简写  | 描述                                                 |
| ---------------------- | ----- | ---------------------------------------------------- |
| `--prod`               | `-P`  | 不安装 devDependencies                               |
| `--dev`                | `-D`  | 仅安装 devDependencies                               |
| `--no-optional`        |       | 不安装 optionalDependencies                          |
| `--frozen-lockfile`    |       | 如果需要更新 lockfile，则失败                         |
| `--no-frozen-lockfile` |       | 允许更新 lockfile（与 --frozen-lockfile 相反）        |
| `--lockfile-only`      |       | 仅更新 lockfile，不安装                               |
| `--prefer-offline`     |       | 在可用时使用缓存包                                   |
| `--offline`            |       | 仅使用缓存中已有的包                                 |
| `--force`              | `-f`  | 强制重新安装所有依赖                                 |
| `--ignore-scripts`     |       | 不运行生命周期脚本                                   |
| `--no-lockfile`        |       | 不读取或生成 lockfile                                |
| `--fix-lockfile`       |       | 修复损坏的 lockfile 条目                              |
| `--shamefully-hoist`   |       | 创建扁平的 node_modules（pnpm）                       |
| `--resolution-only`    |       | 仅重新运行解析以进行 peer dependency 分析             |
| `--silent`             |       | 抑制输出（静默模式）                                 |
| `--filter <pattern>`   |       | 过滤 monorepo 中的包                                 |
| `--workspace-root`     | `-w`  | 仅在工作区根目录安装                                  |
| `--save-exact`         | `-E`  | 保存精确版本（仅在添加包时）                           |
| `--save-peer`          |       | 保存到 peerDependencies（仅在添加包时）                |
| `--save-optional`      | `-O`  | 保存到 optionalDependencies                          |
| `--save-catalog`      |       | 保存到默认 catalog（仅在添加包时）                    |
| `--global`             | `-g`  | 全局安装（仅在添加包时）                               |

### 命令映射

#### 安装命令映射

- https://pnpm.io/cli/install
- https://yarnpkg.com/cli/install
- https://classic.yarnpkg.com/en/docs/cli/install
- https://docs.npmjs.com/cli/v11/commands/npm-install
- https://bun.sh/docs/cli/install

| Vite+ 标志              | pnpm                   | yarn@1                 | yarn@2+                                     | npm                         | bun                      | 描述                               |
| ---------------------- | ---------------------- | ---------------------- | ------------------------------------------- | --------------------------- | ------------------------ | ---------------------------------- |
| `vp install`           | `pnpm install`         | `yarn install`         | `yarn install`                              | `npm install`               | `bun install`            | 安装所有依赖                       |
| `--prod, -P`           | `--prod`               | `--production`         | N/A（使用 `.yarnrc.yml`）                    | `--omit=dev`                | `--production`           | 跳过 devDependencies               |
| `--dev, -D`            | `--dev`                | N/A                    | N/A                                         | `--include=dev --omit=prod` | N/A                      | 仅安装 devDependencies             |
| `--no-optional`        | `--no-optional`        | `--ignore-optional`    | N/A                                         | `--omit=optional`           | `--omit optional`        | 跳过 optionalDependencies          |
| `--frozen-lockfile`    | `--frozen-lockfile`    | `--frozen-lockfile`    | `--immutable`                               | `ci`（使用 `npm ci`）        | `--frozen-lockfile`      | 如果 lockfile 过期则失败            |
| `--no-frozen-lockfile` | `--no-frozen-lockfile` | `--no-frozen-lockfile` | `--no-immutable`                            | `install`（而不是 `ci`）    | `--no-frozen-lockfile`   | 允许更新 lockfile                   |
| `--lockfile-only`      | `--lockfile-only`      | N/A                    | `--mode update-lockfile`                    | `--package-lock-only`       | `--lockfile-only`        | 仅更新 lockfile                    |
| `--prefer-offline`     | `--prefer-offline`     | `--prefer-offline`     | N/A                                         | `--prefer-offline`          | N/A                      | 优先使用缓存包                     |
| `--offline`            | `--offline`            | `--offline`            | N/A                                         | `--offline`                 | N/A                      | 仅使用缓存                         |
| `--force, -f`          | `--force`              | `--force`              | N/A                                         | `--force`                   | `--force`                | 强制重新安装                       |
| `--ignore-scripts`     | `--ignore-scripts`     | `--ignore-scripts`     | `--mode skip-build`                         | `--ignore-scripts`          | `--ignore-scripts`       | 跳过生命周期脚本                   |
| `--no-lockfile`        | `--no-lockfile`        | `--no-lockfile`        | N/A                                         | `--no-package-lock`         | N/A                      | 跳过 lockfile                      |
| `--fix-lockfile`       | `--fix-lockfile`       | N/A                    | `--refresh-lockfile`                        | N/A                         | N/A                      | 修复损坏的 lockfile 条目            |
| `--shamefully-hoist`   | `--shamefully-hoist`   | N/A                    | N/A                                         | N/A                         | N/A（默认 hoisted）      | 扁平的 node_modules（pnpm）         |
| `--resolution-only`    | `--resolution-only`    | N/A                    | N/A                                         | N/A                         | N/A                      | 仅重新运行解析                     |
| `--silent`             | `--silent`             | `--silent`             | N/A（使用环境变量）                          | `--loglevel silent`         | `--silent`               | 抑制输出                           |
| `--filter <pattern>`   | `--filter <pattern>`   | N/A                    | `workspaces foreach -A --include <pattern>` | `--workspace <pattern>`     | `--filter <pattern>`     | 目标为特定工作区包                  |
| `-w, --workspace-root` | `-w`                   | `-W`                   | N/A                                         | `--include-workspace-root`  | N/A                      | 仅在根目录安装                     |

**说明：**

- `--frozen-lockfile`：对于 npm，这会映射为 `npm ci` 命令，而不是 `npm install`
- `--no-frozen-lockfile`：当两者同时指定时，优先级高于 `--frozen-lockfile`。会透传给实际的包管理器（pnpm：`--no-frozen-lockfile`，yarn@1：`--no-frozen-lockfile`，yarn@2+：`--no-immutable`，npm：使用 `npm install` 而不是 `npm ci`）
- `--prod`：yarn@2+ 需要在 `.yarnrc.yml` 中进行配置，而不是使用 CLI 标志
- `--ignore-scripts`：对于 yarn@2+，会映射为 `--mode skip-build`
- `--fix-lockfile`：自动修复损坏的 lockfile 条目（仅 pnpm 和 yarn@2+ 支持，npm 不支持）
- `--resolution-only`：重新运行依赖解析而不安装包。对 peer dependency 分析很有用（仅 pnpm 支持）
- `--shamefully-hoist`：pnpm 特有，会像 npm/yarn 一样创建扁平的 node_modules
- `--ignore-scripts`：对于 bun，使用 `--ignore-scripts` 来跳过生命周期脚本。
- `--silent`：抑制输出。对于 yarn@2+，请改用 `YARN_ENABLE_PROGRESS=false` 环境变量。对于 npm，会映射为 `--loglevel silent`

**添加包模式：**

当以参数形式提供包时（例如，`vp install react`），该命令会作为 `vp add` 的别名：

- `--save-exact, -E`：保存精确版本，而不是 semver 范围
- `--save-peer`：保存到 peerDependencies（以及 devDependencies）
- `--save-optional, -O`：保存到 optionalDependencies
- `--save-catalog`：保存到默认 catalog（仅 pnpm）
- `--global, -g`：全局安装

#### 工作区过滤模式

基于 pnpm 的 filter 语法：

| 模式          | 描述                 | 示例                                       |
| ------------ | -------------------- | ------------------------------------------ |
| `<pkg-name>` | 精确包名             | `--filter app`                             |
| `<pattern>*` | 通配匹配             | `--filter "app*"` 匹配 app、app-web        |
| `@<scope>/*` | scope 匹配           | `--filter "@myorg/*"`                      |
| `!<pattern>` | 排除模式             | `--filter "!test*"` 排除测试包             |
| `<pkg>...`   | 包及其依赖           | `--filter "app..."`                        |
| `...<pkg>`   | 包及其依赖者         | `--filter "...utils"`                      |

**多个过滤器：**

```bash
vp install --filter app --filter web  # 为 app 和 web 都安装
vp install --filter "app*" --filter "!app-test"  # app*，但排除 app-test
```

**注意**：对于 pnpm，`--filter` 必须放在命令之前（例如，`pnpm --filter app install`）。对于 yarn/npm，它集成在命令结构中。

#### 透传参数

未被 Vite+ 覆盖的额外参数可以通过透传参数处理。

所有在 `--` 之后的参数都会透传给包管理器。

```bash
vp install -- --use-stderr

-> pnpm install --use-stderr
-> yarn install --use-stderr
-> npm install --use-stderr
```

### 实现架构

#### 1. 命令结构

**文件**: `crates/vite_global/src/lib.rs`

添加新的命令变体：

```rust
#[derive(Subcommand, Debug)]
pub enum Commands {
    // ... 现有命令

    /// 安装所有依赖
    #[command(disable_help_flag = true, alias = "i")]
    Install {
        /// 不安装 devDependencies
        #[arg(short = 'P', long)]
        prod: bool,

        /// 仅安装 devDependencies
        #[arg(short = 'D', long)]
        dev: bool,

        /// 不安装 optionalDependencies
        #[arg(long)]
        no_optional: bool,

        /// 如果需要更新 lockfile，则失败（CI 模式）
        #[arg(long)]
        frozen_lockfile: bool,

        /// 仅更新 lockfile，不安装
        #[arg(long)]
        lockfile_only: bool,

        /// 在可用时使用缓存包
        #[arg(long)]
        prefer_offline: bool,

        /// 仅使用缓存中已有的包
        #[arg(long)]
        offline: bool,

        /// 强制重新安装所有依赖
        #[arg(short = 'f', long)]
        force: bool,

        /// 不运行生命周期脚本
        #[arg(long)]
        ignore_scripts: bool,

        /// 不读取或生成 lockfile
        #[arg(long)]
        no_lockfile: bool,

        /// 修复损坏的 lockfile 条目
        #[arg(long)]
        fix_lockfile: bool,

        /// 创建扁平的 node_modules（仅 pnpm）
        #[arg(long)]
        shamefully_hoist: bool,

        /// 重新运行解析以进行 peer dependency 分析
        #[arg(long)]
        resolution_only: bool,

        /// 过滤 monorepo 中的包（可多次使用）
        #[arg(long, value_name = "PATTERN")]
        filter: Vec<String>,

        /// 仅在工作区根目录安装
        #[arg(short = 'w', long)]
        workspace_root: bool,

        /// 要传递给包管理器的参数
        #[arg(allow_hyphen_values = true, trailing_var_arg = true)]
        args: Vec<String>,
    },
}
```

#### 2. 包管理器适配器

**文件**: `crates/vite_package_manager/src/commands/install.rs`

添加方法以转换命令：

```rust
impl PackageManager {
    /// 构建 install 命令参数
    pub fn build_install_args(&self, options: &InstallOptions) -> InstallCommandResult {
        let mut args = Vec::new();
        let mut use_ci = false;

        match self.client {
            PackageManagerType::Pnpm => {
                // pnpm：--filter 必须放在命令之前
                for filter in &options.filters {
                    args.push("--filter".to_string());
                    args.push(filter.clone());
                }

                args.push("install".to_string());

                if options.prod {
                    args.push("--prod".to_string());
                }
                if options.dev {
                    args.push("--dev".to_string());
                }
                if options.no_optional {
                    args.push("--no-optional".to_string());
                }
                if options.frozen_lockfile {
                    args.push("--frozen-lockfile".to_string());
                }
                if options.lockfile_only {
                    args.push("--lockfile-only".to_string());
                }
                if options.prefer_offline {
                    args.push("--prefer-offline".to_string());
                }
                if options.offline {
                    args.push("--offline".to_string());
                }
                if options.force {
                    args.push("--force".to_string());
                }
                if options.ignore_scripts {
                    args.push("--ignore-scripts".to_string());
                }
                if options.no_lockfile {
                    args.push("--no-lockfile".to_string());
                }
                if options.fix_lockfile {
                    args.push("--fix-lockfile".to_string());
                }
                if options.shamefully_hoist {
                    args.push("--shamefully-hoist".to_string());
                }
                if options.resolution_only {
                    args.push("--resolution-only".to_string());
                }
                if options.workspace_root {
                    args.push("-w".to_string());
                }
            }

            PackageManagerType::Yarn => {
                args.push("install".to_string());

                if self.is_yarn_berry() {
                    // yarn@2+（Berry）
                    if options.frozen_lockfile {
                        args.push("--immutable".to_string());
                    }
                    if options.lockfile_only {
                        args.push("--mode".to_string());
                        args.push("update-lockfile".to_string());
                    }
                    if options.fix_lockfile {
                        args.push("--refresh-lockfile".to_string());
                    }
                    if options.ignore_scripts {
                        args.push("--mode".to_string());
                        args.push("skip-build".to_string());
                    }
                    if options.resolution_only {
                        eprintln!("警告：yarn@2+ 不支持 --resolution-only");
                    }
                    // 注意：yarn@2+ 使用 .yarnrc.yml 来控制 prod
                    if options.prod {
                        eprintln!("警告：yarn@2+ 需要在 .yarnrc.yml 中配置 --prod 行为");
                    }
                    // yarn@2+ 的 filter 处理方式不同 - 需要使用 workspaces foreach
                    if !options.filters.is_empty() {
                        // 对于 yarn@2+，我们需要使用：yarn workspaces foreach -A --include <pattern> install
                        // 这需要重构命令
                        args.clear();
                        args.push("workspaces".to_string());
                        args.push("foreach".to_string());
                        args.push("-A".to_string());
                        for filter in &options.filters {
                            args.push("--include".to_string());
                            args.push(filter.clone());
                        }
                        args.push("install".to_string());
                    }
                } else {
                    // yarn@1（Classic）
                    if options.prod {
                        args.push("--production".to_string());
                    }
                    if options.no_optional {
                        args.push("--ignore-optional".to_string());
                    }
                    if options.frozen_lockfile {
                        args.push("--frozen-lockfile".to_string());
                    }
                    if options.prefer_offline {
                        args.push("--prefer-offline".to_string());
                    }
                    if options.offline {
                        args.push("--offline".to_string());
                    }
                    if options.force {
                        args.push("--force".to_string());
                    }
                    if options.ignore_scripts {
                        args.push("--ignore-scripts".to_string());
                    }
                    if options.no_lockfile {
                        args.push("--no-lockfile".to_string());
                    }
                    if options.fix_lockfile {
                        eprintln!("警告：yarn@1 不支持 --fix-lockfile");
                    }
                    if options.resolution_only {
                        eprintln!("警告：yarn@1 不支持 --resolution-only");
                    }
                    if options.workspace_root {
                        args.push("-W".to_string());
                    }
                }
            }

            PackageManagerType::Npm => {
                // npm：对 frozen-lockfile 使用 `npm ci`
                if options.frozen_lockfile {
                    args.push("ci".to_string());
                    use_ci = true;
                } else {
                    args.push("install".to_string());
                }

                if options.prod {
                    args.push("--omit=dev".to_string());
                }
                if options.dev && !use_ci {
                    args.push("--include=dev".to_string());
                    args.push("--omit=prod".to_string());
                }
                if options.no_optional {
                    args.push("--omit=optional".to_string());
                }
                if options.lockfile_only && !use_ci {
                    args.push("--package-lock-only".to_string());
                }
                if options.prefer_offline {
                    args.push("--prefer-offline".to_string());
                }
                if options.offline {
                    args.push("--offline".to_string());
                }
                if options.force && !use_ci {
                    args.push("--force".to_string());
                }
                if options.ignore_scripts {
                    args.push("--ignore-scripts".to_string());
                }
                if options.no_lockfile && !use_ci {
                    args.push("--no-package-lock".to_string());
                }
                if options.fix_lockfile {
                    eprintln!("警告：npm 不支持 --fix-lockfile");
                }
                if options.resolution_only {
                    eprintln!("警告：npm 不支持 --resolution-only");
                }
                if options.workspace_root {
                    args.push("--include-workspace-root".to_string());
                }
                for filter in &options.filters {
                    args.push("--workspace".to_string());
                    args.push(filter.clone());
                }
            }
        }

        // 透传额外参数
        args.extend_from_slice(&options.extra_args);

        InstallCommandResult {
            command: if use_ci { "ci".to_string() } else { "install".to_string() },
            args,
        }
    }

    fn is_yarn_berry(&self) -> bool {
        // yarn@2+ 被称为 "Berry"
        !self.version.starts_with("1.")
    }
}

pub struct InstallOptions {
    pub prod: bool,
    pub dev: bool,
    pub no_optional: bool,
    pub frozen_lockfile: bool,
    pub lockfile_only: bool,
    pub prefer_offline: bool,
    pub offline: bool,
    pub force: bool,
    pub ignore_scripts: bool,
    pub no_lockfile: bool,
    pub fix_lockfile: bool,
    pub shamefully_hoist: bool,
    pub resolution_only: bool,
    pub filters: Vec<String>,
    pub workspace_root: bool,
    pub extra_args: Vec<String>,
}

pub struct InstallCommandResult {
    pub command: String,
    pub args: Vec<String>,
}
```

#### 3. 安装命令实现

**文件**: `crates/vite_global/src/install.rs`（新文件）

```rust
use vite_error::Error;
use vite_path::AbsolutePathBuf;
use vite_package_manager::{PackageManager, InstallOptions};

pub struct InstallCommand {
    workspace_root: AbsolutePathBuf,
}

impl InstallCommand {
    pub fn new(workspace_root: AbsolutePathBuf) -> Self {
        Self { workspace_root }
    }

    pub async fn execute(self, options: InstallOptions) -> Result<(), Error> {
        let package_manager = PackageManager::builder(&self.workspace_root).build().await?;

        let resolve_command = package_manager.resolve_command();
        let install_result = package_manager.build_install_args(&options);

        let status = package_manager
            .run_command(&install_result.args, &self.workspace_root)
            .await?;

        if !status.success() {
            return Err(Error::CommandFailed {
                command: format!("install"),
                exit_code: status.code(),
            });
        }

        Ok(())
    }
}
```

## 设计决策

### 1. 不缓存

**决策**：不缓存安装操作。

**理由**：

- 安装命令会修改 node_modules 和 lockfile
- 副作用使缓存不合适
- 每次执行都应重新运行
- 包管理器有自己的缓存机制

### 2. CI 使用冻结锁文件

**决策**：将 npm 的 `--frozen-lockfile` 映射为 `npm ci`。

**理由**：

- `npm ci` 是在 CI 中进行干净安装的推荐方式
- 它比 `npm install --frozen-lockfile` 更快
- 会自动移除现有的 node_modules
- 更符合 CI 最佳实践

### 3. 参数透传

**决策**：将 `--` 后面的所有参数直接传递给包管理器。

**理由**：

- 包管理器有很多标志位（npm 有 40+ 个）
- 维护完整的标志映射容易出错
- 透传可以访问全部功能
- 只翻译关键差异

### 4. 工作区支持

**决策**：支持使用 `--filter` 标志进行工作区筛选。

**理由**：

- 单仓库工作流需要选择性安装
- pnpm 的 filter 语法最强大
- 对其他包管理器优雅降级
- 与其他 Vite+ 命令保持一致

### 5. 别名支持

**决策**：支持 `vp i` 作为 `vp install` 的别名。

**理由**：

- 与 npm/yarn/pnpm 习惯一致（`npm i`、`yarn`、`pnpm i`）
- 输入更快
- 开发者更熟悉

## 错误处理

### 未检测到包管理器

```bash
$ vp install
Error: No package manager detected
Please run one of:
  - vp install (after adding packageManager to package.json)
  - Add packageManager field to package.json
```

### Lockfile 已过期

```bash
$ vp install --frozen-lockfile
Detected package manager: pnpm@10.15.0
Running: pnpm install --frozen-lockfile

ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json

Error: Command failed with exit code 1
```

### 网络错误

```bash
$ vp install --offline
Detected package manager: npm@11.0.0
Running: npm install --offline

npm ERR! code E404
npm ERR! 404 Not Found - GET https://registry.npmjs.org/some-package - Package not found in cache

Error: Command failed with exit code 1
```

## 用户体验

### 基础安装

```bash
$ vp install
Detected package manager: pnpm@10.15.0
Running: pnpm install

Lockfile is up to date, resolution step is skipped
Packages: +150
+++++++++++++++++++++++++++++++++++
Progress: resolved 150, reused 150, downloaded 0, added 150, done

Done in 1.2s
```

### CI 安装

```bash
$ vp install --frozen-lockfile
Detected package manager: npm@11.0.0
Running: npm ci

added 150 packages in 2.3s

Done in 2.3s
```

### 生产环境安装

```bash
$ vp install --prod
Detected package manager: pnpm@10.15.0
Running: pnpm install --prod

Packages: +80
++++++++++++++++++++
Progress: resolved 80, reused 80, downloaded 0, added 80, done

Done in 0.8s
```

### 工作区安装

```bash
$ vp install --filter app
Detected package manager: pnpm@10.15.0
Running: pnpm --filter app install

Scope: 1 of 5 workspace projects
Packages: +50
++++++++++++++
Progress: resolved 50, reused 50, downloaded 0, added 50, done

Done in 0.5s
```

## 考虑过的替代设计

### 替代方案 1：始终使用原生命令

```bash
# 让用户直接调用包管理器
pnpm install
yarn install
npm install
```

**被拒绝，因为**：

- 没有抽象收益
- 脚本不可移植
- 需要知道包管理器
- 开发体验不一致

### 替代方案 2：自定义安装逻辑

实现我们自己的依赖解析和安装：

```rust
// 自定义依赖解析器
let deps = resolve_dependencies(&package_json)?;
download_packages(&deps)?;
link_packages(&deps)?;
```

**被拒绝，因为**：

- 复杂度极高
- 包管理器已经经过充分测试
- 会错过 PM 特定优化
- 维护负担过重

### 替代方案 3：环境变量检测

```bash
# 从环境中检测包管理器
VITE_PM=pnpm vp install
```

**被拒绝，因为**：

- 不如自动检测方便
- 需要额外配置
- 不同机器之间不可移植
- 现有的 lockfile 检测效果很好

## 实现计划

### 阶段 1：核心功能

1. 在 `Commands` 枚举中添加 `Install` 命令变体
2. 创建 `install.rs` 模块
3. 实现包管理器命令解析
4. 添加基础标志翻译

### 阶段 2：高级功能

1. 实现工作区筛选
2. 添加 `--frozen-lockfile` 到 `npm ci` 的映射
3. 处理 yarn@1 与 yarn@2+ 的差异
4. 添加参数透传支持

### 阶段 3：测试

1. 命令解析的单元测试
2. 使用模拟包管理器的集成测试
3. 使用真实包管理器的手动测试
4. CI 工作流测试

### 阶段 4：文档

1. 更新 CLI 文档
2. 在 README 中添加示例
3. 编写标志兼容性矩阵文档
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
- bun@1.x

### 单元测试

```rust
#[test]
fn test_pnpm_basic_install() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm, "10.0.0");
    let options = InstallOptions::default();
    let result = pm.build_install_args(&options);
    assert_eq!(result.args, vec!["install"]);
}

#[test]
fn test_pnpm_prod_install() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm, "10.0.0");
    let options = InstallOptions { prod: true, ..Default::default() };
    let result = pm.build_install_args(&options);
    assert_eq!(result.args, vec!["install", "--prod"]);
}

#[test]
fn test_npm_frozen_lockfile_uses_ci() {
    let pm = PackageManager::mock(PackageManagerType::Npm, "11.0.0");
    let options = InstallOptions { frozen_lockfile: true, ..Default::default() };
    let result = pm.build_install_args(&options);
    assert_eq!(result.command, "ci");
}

#[test]
fn test_yarn_berry_frozen_lockfile() {
    let pm = PackageManager::mock(PackageManagerType::Yarn, "4.0.0");
    let options = InstallOptions { frozen_lockfile: true, ..Default::default() };
    let result = pm.build_install_args(&options);
    assert_eq!(result.args, vec!["install", "--immutable"]);
}

#[test]
fn test_pnpm_filter() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm, "10.0.0");
    let options = InstallOptions {
        filters: vec!["app".to_string()],
        ..Default::default()
    };
    let result = pm.build_install_args(&options);
    assert_eq!(result.args, vec!["--filter", "app", "install"]);
}

#[test]
fn test_npm_workspace_filter() {
    let pm = PackageManager::mock(PackageManagerType::Npm, "11.0.0");
    let options = InstallOptions {
        filters: vec!["app".to_string()],
        ..Default::default()
    };
    let result = pm.build_install_args(&options);
    assert_eq!(result.args, vec!["install", "--workspace", "app"]);
}

#[test]
fn test_pnpm_fix_lockfile() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm, "10.0.0");
    let options = InstallOptions { fix_lockfile: true, ..Default::default() };
    let result = pm.build_install_args(&options);
    assert_eq!(result.args, vec!["install", "--fix-lockfile"]);
}

#[test]
fn test_yarn_berry_fix_lockfile() {
    let pm = PackageManager::mock(PackageManagerType::Yarn, "4.0.0");
    let options = InstallOptions { fix_lockfile: true, ..Default::default() };
    let result = pm.build_install_args(&options);
    assert_eq!(result.args, vec!["install", "--refresh-lockfile"]);
}

#[test]
fn test_yarn_berry_ignore_scripts() {
    let pm = PackageManager::mock(PackageManagerType::Yarn, "4.0.0");
    let options = InstallOptions { ignore_scripts: true, ..Default::default() };
    let result = pm.build_install_args(&options);
    assert_eq!(result.args, vec!["install", "--mode", "skip-build"]);
}

#[test]
fn test_pnpm_resolution_only() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm, "10.0.0");
    let options = InstallOptions { resolution_only: true, ..Default::default() };
    let result = pm.build_install_args(&options);
    assert_eq!(result.args, vec!["install", "--resolution-only"]);
}

#[test]
fn test_yarn_berry_filter() {
    let pm = PackageManager::mock(PackageManagerType::Yarn, "4.0.0");
    let options = InstallOptions {
        filters: vec!["app".to_string()],
        ..Default::default()
    };
    let result = pm.build_install_args(&options);
    assert_eq!(result.args, vec!["workspaces", "foreach", "-A", "--include", "app", "install"]);
}
```

### 集成测试

为每个包管理器创建测试夹具：

```
fixtures/install-test/
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

1. 基础安装
2. 生产环境安装
3. 冻结 lockfile 安装
4. 工作区筛选安装
5. 递归安装
6. 离线安装
7. 强制重新安装
8. 忽略脚本安装

## CLI 帮助输出

```bash
$ vp install --help
Install all dependencies, or add packages if package names are provided

Usage: vp install [OPTIONS] [PACKAGES]...

Aliases: i

Options:
  -P, --prod               Do not install devDependencies
  -D, --dev                Only install devDependencies (install) / Save to devDependencies (add)
      --no-optional        Do not install optionalDependencies
      --frozen-lockfile    Fail if lockfile needs to be updated (CI mode)
      --no-frozen-lockfile Allow lockfile updates (opposite of --frozen-lockfile)
      --lockfile-only      Only update lockfile, don't install
      --prefer-offline     Use cached packages when available
      --offline            Only use packages already in cache
  -f, --force              Force reinstall all dependencies
      --ignore-scripts     Do not run lifecycle scripts
      --no-lockfile        Don't read or generate lockfile
      --fix-lockfile       Fix broken lockfile entries
      --shamefully-hoist   Create flat node_modules (pnpm only)
      --resolution-only    Re-run resolution for peer dependency analysis
      --silent             Suppress output (silent mode)
      --filter <PATTERN>   Filter packages in monorepo (can be used multiple times)
  -w, --workspace-root     Install in workspace root only
  -E, --save-exact         Save exact version (only when adding packages)
      --save-peer          Save to peerDependencies (only when adding packages)
  -O, --save-optional      Save to optionalDependencies (only when adding packages)
      --save-catalog       Save to default catalog (only when adding packages)
  -g, --global             Install globally (only when adding packages)
  -h, --help               Print help

Examples:
  vp install                      # Install all dependencies
  vp i                            # Short alias
  vp install --prod               # Production install
  vp install --frozen-lockfile    # CI mode (strict lockfile)
  vp install --filter app         # Install for specific package
  vp install --silent             # Silent install
  vp install react                # Add react (alias for vp add)
  vp install -D typescript        # Add typescript as devDependency
  vp install --save-peer react    # Add react as peerDependency
```

## 性能考虑

1. **委托给包管理器**：利用 PM 内置优化
2. **无额外开销**：在运行 PM 命令前只进行最少处理
3. **缓存利用**：支持 `--prefer-offline` 和 `--offline` 标志
4. **并行安装**：包管理器负责处理并行化

## 安全考虑

1. **脚本执行**：`--ignore-scripts` 可防止执行不受信任的脚本
2. **锁文件完整性**：`--frozen-lockfile` 确保可重现的安装
3. **网络安全**：包管理器负责处理仓库认证
4. **透传安全**：参数会被安全地透传

## 向后兼容性

这是一个不会引入破坏性变更的新功能：

- 现有命令不受影响
- 新命令是增量添加
- 不更改任务配置
- 不更改缓存行为

## 包管理器兼容性矩阵

| 功能                   | pnpm | yarn@1 | yarn@2+                 | npm             | bun                     | 说明                       |
| ---------------------- | ---- | ------ | ----------------------- | --------------- | ----------------------- | -------------------------- |
| 基础安装               | ✅   | ✅     | ✅                      | ✅              | ✅                      | 全部支持                   |
| `--prod`               | ✅   | ✅     | ⚠️                      | ✅              | ✅                      | yarn@2+ 需要 .yarnrc.yml   |
| `--dev`                | ✅   | ❌     | ❌                      | ✅              | ❌                      | 支持有限                   |
| `--no-optional`        | ✅   | ✅     | ⚠️                      | ✅              | ✅                      | yarn@2+ 需要 .yarnrc.yml   |
| `--frozen-lockfile`    | ✅   | ✅     | ✅ `--immutable`        | ✅ `ci`         | ✅                      | npm 使用 `npm ci`          |
| `--no-frozen-lockfile` | ✅   | ✅     | ✅ `--no-immutable`     | ✅ `install`    | ✅                      | 透传给 PM                  |
| `--lockfile-only`      | ✅   | ❌     | ✅                      | ✅              | ✅                      | 不支持 yarn@1              |
| `--prefer-offline`     | ✅   | ✅     | ❌                      | ✅              | ❌                      | 不支持 yarn@2+、bun        |
| `--offline`            | ✅   | ✅     | ❌                      | ✅              | ❌                      | 不支持 yarn@2+、bun        |
| `--force`              | ✅   | ✅     | ❌                      | ✅              | ✅                      | 不支持 yarn@2+             |
| `--ignore-scripts`     | ✅   | ✅     | ✅ `--mode skip-build`  | ✅              | ✅                      |                            |
| `--no-lockfile`        | ✅   | ✅     | ❌                      | ✅              | ❌                      | 不支持 yarn@2+、bun        |
| `--fix-lockfile`       | ✅   | ❌     | ✅ `--refresh-lockfile` | ❌              | ❌              | 仅 pnpm 和 yarn@2+         |
| `--shamefully-hoist`   | ✅   | ❌     | ❌                      | ❌              | ❌（默认已 hoist）      | 仅 pnpm                    |
| `--resolution-only`    | ✅   | ❌     | ❌                      | ❌              | ❌                      | 仅 pnpm                    |
| `--silent`             | ✅   | ✅     | ⚠️（使用环境变量）      | ✅ `--loglevel` | ✅                      | yarn@2+ 使用环境变量       |
| `--filter`             | ✅   | ❌     | ✅ `workspaces foreach` | ✅              | ✅                      | 不支持 yarn@1              |

## 未来增强

### 1. 交互模式

```bash
$ vp install --interactive
? 选择要安装的包：
  [x] dependencies（150 个包）
  [ ] devDependencies（80 个包）
  [x] optionalDependencies（5 个包）
```

### 2. 安装进度

```bash
$ vp install --progress
正在安装依赖...
[============================] 100% | 150/150 个包
```

### 3. 依赖分析

```bash
$ vp install --analyze
正在安装依赖...

新增包：
  react@18.3.1（85KB）
  react-dom@18.3.1（120KB）

总计：150 个包，12.3MB

完成于 2.3s
```

### 4. 选择性更新

```bash
$ vp install --update react
# 安装并更新特定包
```

## 真实世界使用示例

### CI 流水线

```yaml
# .github/workflows/ci.yml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: 安装依赖
        run: vp install --frozen-lockfile

      - name: 构建
        run: vp build
```

### Docker 生产构建

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

# 仅进行生产环境安装
RUN npm install -g @voidzero/global && \
    vp install --prod --frozen-lockfile

COPY . .
RUN vp build
```

### Monorepo 开发

```bash
# 为特定包安装依赖
vp install --filter @myorg/web-app

# 切换分支后强制重新安装
vp install --force
```

### 离线开发

```bash
# 先填充缓存
vp install

# 之后，离线工作
vp install --offline
```

## 未决问题

1. **是否应支持 `--check` 标志？**
   - 提议：添加 `--check`，在不安装的情况下验证锁文件
   - 类似于 `pnpm install --lockfile-only`，但不会写入

2. **是否应自动检测 CI 环境？**
   - 提议：在 CI 中自动启用 `--frozen-lockfile`（类似 pnpm）
   - 可检查 `CI` 环境变量

3. **是否应支持包管理器版本锁定？**
   - 提议：遵循 package.json 中的 `packageManager` 字段
   - 已在包管理器检测中实现

4. **如何处理冲突的标志？**
   - 提议：让包管理器处理冲突
   - 例如：`--prod` 和 `--dev` 同时使用

## 结论

本 RFC 提议添加 `vp install` 命令，以提供一个统一的接口，用于在 pnpm/yarn/npm/bun 之间安装依赖。设计如下：

- ✅ 自动适配检测到的包管理器
- ✅ 支持常见安装标志
- ✅ 按照 pnpm 的 API 设计，提供完整的 workspace 支持
- ✅ 使用透传以获得最大灵活性
- ✅ 无缓存开销（委托给包管理器）
- ✅ 借助现有基础设施实现，方案简单
- ✅ 支持 `--frozen-lockfile`，对 CI 友好
- ✅ 可扩展以支持未来增强

该实现遵循与其他包管理命令（`add`、`remove`、`update`）相同的模式，同时为依赖安装提供统一、直观的接口。
