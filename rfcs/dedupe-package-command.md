# RFC：Vite+ 去重包命令

## 摘要

添加 `vp dedupe` 命令，它会自动适配检测到的包管理器（pnpm/npm/yarn/bun），通过移除重复包并在锁文件中将旧依赖升级到更新且兼容的版本来优化依赖树。这有助于减少冗余并提升项目效率。

## 动机

目前，开发者必须手动使用各个包管理器特定的命令来去重依赖：

```bash
pnpm dedupe
npm dedupe
yarn dedupe  # 仅 yarn@2+ 支持
```

这会给依赖管理工作流带来摩擦，并且需要记住不同的语法。统一接口将：

1. **简化依赖优化**：一个命令可跨所有包管理器使用
2. **自动检测**：自动使用正确的包管理器
3. **一致性**：无论底层工具如何，语法保持一致
4. **集成**：与现有 Vite+ 功能无缝协作

### 当前痛点

```bash
# 开发者需要知道当前使用的是哪个包管理器
pnpm dedupe                    # pnpm 项目
npm dedupe                     # npm 项目
yarn dedupe                    # yarn@2+ 项目

# 不同的检查模式
pnpm dedupe --check            # pnpm - 在不修改的情况下检查
npm dedupe --dry-run           # npm - 在不修改的情况下检查
yarn dedupe --check            # yarn@2+ - 在不修改的情况下检查
```

### 提议的解决方案

```bash
# 适用于所有包管理器
vp dedupe                    # 去重依赖

# 检查模式（dry-run）
vp dedupe --check            # 检查去重是否会产生变更
```

## 提议的解决方案

### 命令语法

#### 去重命令

```bash
vp dedupe [OPTIONS]
```

**示例：**

```bash
# 基本去重
vp dedupe

# 检查模式（预览变更而不修改）
vp dedupe --check
```

### 命令映射

#### 去重命令映射

**pnpm 参考：**

- https://pnpm.io/cli/dedupe
- 执行安装并在可使用更新版本时移除锁文件中的旧依赖

**npm 参考：**

- https://docs.npmjs.com/cli/v11/commands/npm-dedupe
- 通过移除冗余包来减少包树中的重复

**yarn 参考：**

- https://yarnpkg.com/cli/dedupe（yarn@2+）
- 注意：yarn@2+ 有专门的 `yarn dedupe` 命令，并支持 `--check` 模式

| Vite+ 标志   | pnpm          | npm          | yarn@2+       | bun | 描述                      |
| ----------- | ------------- | ------------ | ------------- | --- | ---------------------------- |
| `vp dedupe` | `pnpm dedupe` | `npm dedupe` | `yarn dedupe` | N/A | 去重依赖                  |
| `--check`   | `--check`     | `--dry-run`  | `--check`     | N/A | 检查是否会发生变更 |

**注意**：

- pnpm 使用 `--check` 作为 dry-run，npm 使用 `--dry-run`，yarn@2+ 使用 `--check`
- yarn@1 没有 dedupe 命令，因此不受支持
- bun 目前不支持 dedupe 命令

### 跨包管理器的去重行为差异

#### pnpm

**去重行为：**

- 扫描锁文件（`pnpm-lock.yaml`）中的重复依赖
- 在可能的情况下将旧版本升级到更新且兼容的版本
- 移除锁文件中的冗余条目
- 以优化后的依赖进行一次全新安装
- `--check` 标志在不修改文件的情况下预览变更

**退出码：**

- 0：成功或不需要变更
- 非零：会发生变更（使用 `--check` 时）

#### npm

**去重行为：**

- 在本地包树（`node_modules`）中搜索重复包
- 尝试通过将依赖上移到更高层来简化结构
- 在 semver 允许的情况下移除重复包
- 同时修改 `node_modules` 和 `package-lock.json`
- `--dry-run` 会在不做修改的情况下展示将要执行的操作

**退出码：**

- 0：成功
- 非零：发生错误

#### yarn@2+（Berry）

**去重行为：**

- 拥有专门的 `yarn dedupe` 命令
- 扫描锁文件（`yarn.lock`）中的重复依赖
- 通过移除冗余条目来去重包
- `--check` 标志在不修改文件的情况下预览变更
- 根据配置使用 Plug'n'Play 或 node_modules

**退出码：**

- 0：成功或不需要变更
- 非零：会发生变更（使用 `--check` 时）

**注意**：yarn@1 没有 dedupe 命令，Vite+ 不支持

### 实现架构

#### 1. 命令结构

**文件**：`crates/vite_task/src/lib.rs`

添加新的命令变体：

```rust
#[derive(Subcommand, Debug)]
pub enum Commands {
    // ... 现有命令

    /// 通过移除旧版本来去重依赖
    #[command(disable_help_flag = true)]
    Dedupe {
        /// 检查去重是否会产生变更（pnpm: --check, npm: --dry-run）
        #[arg(long)]
        check: bool,

        /// 传递给包管理器的参数
        #[arg(allow_hyphen_values = true, trailing_var_arg = true)]
        args: Vec<String>,
    },
}
```

#### 2. 包管理器适配器

**文件**：`crates/vite_package_manager/src/commands/dedupe.rs`（新文件）

```rust
use std::{collections::HashMap, process::ExitStatus};

use vite_error::Error;
use vite_path::AbsolutePath;

use crate::package_manager::{
    PackageManager, PackageManagerType, ResolveCommandResult, format_path_env, run_command,
};

#[derive(Debug, Default)]
pub struct DedupeCommandOptions<'a> {
    pub check: bool,
    pub pass_through_args: Option<&'a [String]>,
}

impl PackageManager {
    /// 使用包管理器运行 dedupe 命令。
    #[must_use]
    pub async fn run_dedupe_command(
        &self,
        options: &DedupeCommandOptions<'_>,
        cwd: impl AsRef<AbsolutePath>,
    ) -> Result<ExitStatus, Error> {
        let resolve_command = self.resolve_dedupe_command(options);
        run_command(&resolve_command.bin_path, &resolve_command.args, &resolve_command.envs, cwd)
            .await
    }

    /// 解析 dedupe 命令。
    #[must_use]
    pub fn resolve_dedupe_command(&self, options: &DedupeCommandOptions) -> ResolveCommandResult {
        let bin_name: String;
        let envs = HashMap::from([("PATH".to_string(), format_path_env(self.get_bin_prefix()))]);
        let mut args: Vec<String> = Vec::new();

        match self.client {
            PackageManagerType::Pnpm => {
                bin_name = "pnpm".into();
                args.push("dedupe".into());

                // pnpm 使用 --check 作为 dry-run
                if options.check {
                    args.push("--check".into());
                }
            }
            PackageManagerType::Yarn => {
                bin_name = "yarn".into();
                args.push("dedupe".into());

                // yarn@2+ 支持 --check
                if options.check {
                    args.push("--check".into());
                }
            }
            PackageManagerType::Npm => {
                bin_name = "npm".into();
                args.push("dedupe".into());

                if options.check {
                    args.push("--dry-run".into());
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

更新以包含 dedupe 模块：

```rust
pub mod add;
mod install;
pub mod remove;
pub mod update;
pub mod link;
pub mod unlink;
pub mod dedupe;  // 添加这一行
```

#### 3. Dedupe 命令实现

**文件**：`crates/vite_task/src/dedupe.rs`（新文件）

```rust
use vite_error::Error;
use vite_path::AbsolutePathBuf;
use vite_package_manager::{
    PackageManager,
    commands::dedupe::DedupeCommandOptions,
};
use vite_workspace::Workspace;

pub struct DedupeCommand {
    workspace_root: AbsolutePathBuf,
}

impl DedupeCommand {
    pub fn new(workspace_root: AbsolutePathBuf) -> Self {
        Self { workspace_root }
    }

    pub async fn execute(
        self,
        check: bool,
        extra_args: Vec<String>,
    ) -> Result<ExitStatus, Error> {
        let package_manager = PackageManager::builder(&self.workspace_root).build().await?;

        // 构建 dedupe 命令选项
        let dedupe_options = DedupeCommandOptions {
            check,
            pass_through_args: if extra_args.is_empty() { None } else { Some(&extra_args) },
        };

        let exit_status = package_manager
            .run_dedupe_command(&dedupe_options, &self.workspace_root)
            .await?;

        if !exit_status.success() {
            if check {
                eprintln!("Deduplication would result in changes");
            }
            return Err(Error::CommandFailed {
                command: "dedupe".to_string(),
                exit_code: exit_status.code(),
            });
        }

        Ok(exit_status)
    }
}
```

## 设计决策

### 1. 不缓存

**决策**：不缓存 dedupe 操作。

**理由**：

- dedupe 会修改锁文件和依赖树
- 副作用使缓存不合适
- 每次执行都应分析当前状态
- 类似于 install/add/remove 的处理方式

### 2. 简化的标志支持

**决策**：仅支持 `--check` 标志用于 dry-run 验证。

**理由**：

- 保持命令简单且聚焦
- pnpm 和 yarn@2+ 使用 `--check`，npm 使用 `--dry-run`
- 统一的标志会映射到对应包管理器的标志
- 额外的 workspace/filter 标志会增加不必要的复杂度

### 3. yarn 支持

**决策**：仅支持 yarn@2+，不支持 yarn@1。

**理由**：

- yarn@2+ 有专门的 `yarn dedupe` 命令，并支持 `--check`
- yarn@1 没有 dedupe 命令（根据官方文档）
- 无需版本检测，从而简化实现
- 与官方 yarn 文档保持一致

### 4. 退出码处理

**决策**：当 `--check` 检测到变更时返回非零退出码。

**理由**：

- 与 pnpm 行为一致
- 对 CI/CD 流水线很有用
- 可用于验证是否需要去重
- 是 check/dry-run 模式的标准实践

## 错误处理

### 未检测到包管理器

```bash
$ vp dedupe
Error: No package manager detected
Please run one of:
  - vp install (to set up package manager)
  - Add packageManager field to package.json
```

### 检查模式检测到更改

```bash
$ vp dedupe --check
Checking if deduplication would make changes...
Changes detected. Run 'vp dedupe' to apply.
Exit code: 1
```

### 不支持的标志警告

```bash
$ vp dedupe --filter app
Warning: --filter not supported by npm, use --workspace instead
Running: npm dedupe
```

## 用户体验

### 成功输出

```bash
$ vp dedupe
Detected package manager: pnpm@10.15.0
Running: pnpm dedupe

Packages: -15
-15
Progress: resolved 250, reused 235, downloaded 0, added 0, done

Dependencies optimized. Removed 15 duplicate packages.

Done in 3.2s
```

```bash
$ vp dedupe --check
Detected package manager: pnpm@10.15.0
Running: pnpm dedupe --check

Would deduplicate 8 packages:
  - lodash: 4.17.20 → 4.17.21 (3 occurrences)
  - react: 18.2.0 → 18.3.1 (2 occurrences)
  - typescript: 5.3.0 → 5.5.0 (3 occurrences)

Run 'vp dedupe' to apply these changes.
Exit code: 1
```

```bash
$ vp dedupe --check
Detected package manager: npm@11.0.0
Running: npm dedupe --dry-run

removed 12 packages
updated 5 packages

This was a dry run. No changes were made.

Done in 4.5s
```

### Yarn@2+ 输出

```bash
$ vp dedupe
Detected package manager: yarn@4.0.0
Running: yarn dedupe

➤ YN0000: ┌ Resolution step
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: Done in 1.2s

Done in 1.2s
```

```bash
$ vp dedupe --check
Detected package manager: yarn@4.0.0
Running: yarn dedupe --check

➤ YN0000: Found 5 packages with duplicates
➤ YN0000: Run 'yarn dedupe' to apply changes

Exit code: 1
```

### 无需更改

```bash
$ vp dedupe
Detected package manager: pnpm@10.15.0
Running: pnpm dedupe

Already up-to-date

Done in 0.8s
```

## 考虑过的替代设计

### 备选方案 1：对不支持的标志直接报错

```bash
vp dedupe --filter app  # on npm
Error: --filter flag not supported by npm
```

**被拒绝的原因**：

- 过于严格，会阻止使用
- 更好的做法是警告后继续执行
- 用户可能有封装脚本
- 更倾向于优雅降级

### 备选方案 2：自动翻译所有标志

```bash
vp dedupe --filter app  # on npm
# Automatically translates to: npm dedupe --workspace app
```

**被拒绝的原因**：

- `--filter` 与 `--workspace` 语义不同
- pnpm 的 `--filter` 支持模式匹配，而 npm 的 `--workspace` 不支持
- 可能导致意外行为
- 更好的做法是警告并让用户自行调整

### 备选方案 3：单独的检查命令

```bash
vp dedupe:check
vp dedupe:run
```

**被拒绝的原因**：

- 需要记住更多命令
- 使用标志更符合惯例
- 与原生包管理器 API 保持一致
- 比 `--check` 标志不够直观

## 实施计划

### 阶段 1：核心功能

1. 在 `Commands` 枚举中添加 `Dedupe` 命令变体
2. 在两个 crate 中创建 `dedupe.rs` 模块
3. 实现包管理器命令解析
4. 添加基础错误处理

### 阶段 2：高级功能

1. 实现检查/试运行模式
2. 添加工作区过滤支持
3. 实现 npm 的依赖类型过滤
4. 处理 yarn@2+ 的特殊情况

### 阶段 3：测试

1. 针对命令解析的单元测试
2. 使用模拟包管理器的集成测试
3. 测试检查模式行为
4. 测试工作区操作

### 阶段 4：文档

1. 更新 CLI 文档
2. 在 README 中添加示例
3. 记录包管理器兼容性
4. 添加 CI/CD 使用示例

## 测试策略

### 测试包管理器版本

- pnpm@9.x（进行中）
- pnpm@10.x
- pnpm@11.x
- yarn@4.x（yarn@2+）
- npm@10.x
- npm@11.x（进行中）
- bun@1.x（不适用 - bun 不支持 dedupe）

### 单元测试

```rust
#[test]
fn test_pnpm_dedupe_basic() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.resolve_dedupe_command(&DedupeCommandOptions {
        ..Default::default()
    });
    assert_eq!(args, vec!["dedupe"]);
}

#[test]
fn test_pnpm_dedupe_check() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm);
    let args = pm.resolve_dedupe_command(&DedupeCommandOptions {
        check: true,
        ..Default::default()
    });
    assert_eq!(args, vec!["dedupe", "--check"]);
}

#[test]
fn test_npm_dedupe_basic() {
    let pm = PackageManager::mock(PackageManagerType::Npm);
    let args = pm.resolve_dedupe_command(&DedupeCommandOptions {
        ..Default::default()
    });
    assert_eq!(args, vec!["dedupe"]);
}

#[test]
fn test_npm_dedupe_check() {
    let pm = PackageManager::mock(PackageManagerType::Npm);
    let args = pm.resolve_dedupe_command(&DedupeCommandOptions {
        check: true,
        ..Default::default()
    });
    assert_eq!(args, vec!["dedupe", "--dry-run"]);
}

#[test]
fn test_yarn_dedupe_basic() {
    let pm = PackageManager::mock(PackageManagerType::Yarn);
    let args = pm.resolve_dedupe_command(&DedupeCommandOptions {
        ..Default::default()
    });
    assert_eq!(args, vec!["dedupe"]);
}

#[test]
fn test_yarn_dedupe_check() {
    let pm = PackageManager::mock(PackageManagerType::Yarn);
    let args = pm.resolve_dedupe_command(&DedupeCommandOptions {
        check: true,
        ..Default::default()
    });
    assert_eq!(args, vec!["dedupe", "--check"]);
}
```

### 集成测试

为每个包管理器创建测试夹具：

```
fixtures/dedupe-test/
  pnpm-workspace.yaml
  package.json
  packages/
    app/
      package.json (with duplicate deps)
    utils/
      package.json (with duplicate deps)
  test-steps.json
```

测试用例：

1. 基础去重
2. 不修改文件的检查模式
3. 检查模式的退出码验证
4. 透传参数处理
5. 包管理器检测与命令映射

## CLI 帮助输出

```bash
$ vp dedupe --help
Deduplicate dependencies by removing older versions

Usage: vp dedupe [OPTIONS] [-- <PASS_THROUGH_ARGS>...]

Options:
  --check                    Check if deduplication would make changes
                             (pnpm: --check, npm: --dry-run, yarn@2+: --check)

Behavior by Package Manager:
  pnpm:    Removes older dependencies from lockfile, upgrades to newer compatible versions
  npm:     Reduces duplication in package tree by moving dependencies up the tree
  yarn@2+: Scans lockfile and removes duplicate package entries

Note: yarn@1 does not have a dedupe command and is not supported

Examples:
  vp dedupe                          # Deduplicate all dependencies
  vp dedupe --check                  # Check if changes would occur
  vp dedupe -- --some-flag           # Pass custom flags to package manager
```

## 性能考虑

1. **无缓存**：操作直接运行，没有缓存开销
2. **锁文件分析**：快速解析并优化锁文件
3. **单次执行**：与任务运行器不同，这是一次性操作
4. **自动检测**：复用现有的包管理器检测逻辑（已缓存）
5. **CI/CD 优化**：检查模式可在无需完整安装的情况下快速验证

## 安全考虑

1. **锁文件完整性**：在优化的同时保持锁文件完整性
2. **版本约束**：遵守 `package.json` 中的 semver 约束
3. **不进行意外升级**：仅在允许的版本范围内去重
4. **审计兼容性**：可与审计命令配合使用，确保安全性

## 向后兼容性

这是一个不会引入破坏性变更的新功能：

- 现有命令不受影响
- 新命令是增量添加
- 不会修改任务配置
- 不会修改缓存行为

## 迁移路径

### 采用方式

用户可以立即开始使用：

```bash
# 旧方式
pnpm dedupe
npm dedupe

# 新方式（适用于任意包管理器）
vp dedupe
```

### CI/CD 集成

```yaml
# 之前
- run: pnpm dedupe --check

# 之后（适用于任意包管理器）
- run: vp dedupe --check
```

## 真实世界使用示例

### 本地开发

```bash
# 在长时间安装了许多包之后
vp dedupe                     # 清理重复项

# 检查是否需要清理
vp dedupe --check             # 预览更改
```

### CI/CD 流水线

```yaml
name: 检查依赖优化
on: [pull_request]

jobs:
  dedupe-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: vp install
      - run: vp dedupe --check
        name: 验证依赖已优化
```

### 更新后工作流

```bash
# 更新依赖
vp update --latest

# 更新后进行去重
vp dedupe

# 验证一切仍然正常
vp test
```

## 包管理器兼容性

| 功能          | pnpm         | npm            | yarn@2+      | bun              | 备注                                      |
| ------------- | ------------ | -------------- | ------------ | ---------------- | ----------------------------------------- |
| 基础去重      | ✅ `dedupe`  | ✅ `dedupe`    | ✅ `dedupe`  | ❌ 不支持         | bun 没有 dedupe 命令                      |
| 检查/试运行   | ✅ `--check` | ✅ `--dry-run` | ✅ `--check` | ❌ 不支持         | npm 使用不同的标志名                      |
| 退出码        | ✅ 支持       | ✅ 支持         | ✅ 支持       | ❌ 不支持         | 在检查模式且有更改时都会返回非零退出码     |

**注意**：yarn@1 没有 dedupe 命令，因此不受支持。bun 目前也不支持 dedupe 命令。

## 未来增强

### 1. 去重报告

生成详细的去重变更报告：

```bash
vp dedupe --report

# 输出：
Deduplication Report:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Package         Old Version    New Version    Occurrences
lodash          4.17.20        4.17.21        3
react           18.2.0         18.3.1         2
typescript      5.3.0          5.5.0          3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 8 packages deduplicated
```

### 2. 安装后自动去重

安装后自动执行去重：

```bash
vp install --auto-dedupe

# Or configure in vite-task.json
{
  "options": {
    "autoDedupe": true
  }
}
```

### 3. 去重策略检查

在 CI 中强制执行去重策略：

```bash
vp dedupe --policy strict  # Fail if any duplicates exist
vp dedupe --policy warn    # Warn but don't fail
```

### 4. 依赖分析

展示为什么这些包会重复：

```bash
vp dedupe --why lodash

# Output:
lodash@4.17.20:
  - Required by: package-a@1.0.0 (via ^4.17.0)
  - Required by: package-b@2.0.0 (via ~4.17.20)

lodash@4.17.21:
  - Required by: package-c@3.0.0 (via ^4.17.21)

Recommendation: All can use lodash@4.17.21
```

## 未决问题

1. **我们是否应在更新后自动运行 dedupe？**
   - 提议：不应，保持命令分离
   - 用户可以组合使用：`vp update && vp dedupe`
   - 之后：为 update 命令添加 `--auto-dedupe` 标志

2. **我们是否应在 check 模式下显示详细差异？**
   - 提议：是，显示将会发生哪些变化
   - 帮助用户理解影响
   - 使用包管理器的原生输出

3. **我们是否应支持强制 dedupe（忽略 semver）？**
   - 提议：不应，风险太高
   - 可能破坏兼容性
   - 让包管理器处理约束

4. **我们是否应在 dedupe 期间警告安全漏洞？**
   - 提议：后续增强
   - 在 dedupe 后运行审计
   - 与现有审计工具集成

5. **我们是否应支持交互模式？**
   - 提议：后续增强
   - 让用户选择要去重的包
   - 类似于 `vp update --interactive`

## 成功指标

1. **采用率**：使用 `vp dedupe` 的用户占比 vs 直接使用包管理器
2. **依赖减少**：重复包平均减少数量
3. **CI 集成**：在 CI/CD 流水线中的使用情况，用于验证
4. **错误率**：跟踪命令失败率 vs 直接使用包管理器的情况

## 结论

本 RFC 提议添加 `vp dedupe` 命令，为 pnpm/npm/yarn@2+/bun 之间的依赖去重提供统一接口。该设计：

- ✅ 自动适配检测到的包管理器
- ✅ 支持用于验证的 check 模式（映射到 pnpm/yarn@2+ 的 --check，npm 的 --dry-run）
- ✅ 简洁、聚焦的 API，仅包含必要的 --check 标志
- ✅ 支持原生 dedupe 命令的 yarn@2+
- ✅ 支持高级用例的透传参数
- ✅ 无缓存开销
- ✅ 利用现有基础设施的简单实现
- ✅ 通过退出码对 CI/CD 友好
- ✅ 可扩展以支持未来增强

该实现遵循与其他包管理命令相同的模式，同时为依赖去重提供了一个简单、统一的接口。通过只聚焦于必要的 --check 标志，该命令保持了易用性和可理解性。
