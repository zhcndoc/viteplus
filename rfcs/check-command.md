# RFC: `vp check` 命令

## 概要

添加 `vp check` 作为内置命令，在一次调用中运行格式校验、lint（代码检查）和类型检查。它为 CI 和本地开发提供一个统一的“快速检查”命令，区别于诸如测试套件之类的“慢检查”。

## 动机

目前，执行完整的代码质量检查需要串联多个命令：

```bash
# 来自单体仓库模板的“ready”脚本：
vp fmt && vp lint --type-aware && vp run -r test && vp run -r build
```

痛点：

- **缺少单一命令** 来满足最常见的 pre-commit/CI 检查：“我的代码是否正确？”
- 用户需要记住在 lint 时传入 `--type-aware` 和 `--type-check`
- `&&` 串联模式脆弱且冗长
- 各项目之间缺少标准化的“check”工作流

### 快速 vs 慢速检查

- **快速检查**（秒）：类型检查 + lint + 格式校验——静态分析，不执行代码
- **慢速检查**（分钟）：测试套件（Vitest）——会执行代码

`vp check` 面向 **快速检查** 这一类别。明确不包含测试——请使用 `vp test` 来完成。

## 命令语法

```bash
# 运行所有快速检查（fmt --check + lint --type-aware --type-check）
vp check

# 自动修复格式和 lint 问题
vp check --fix
vp check --fix --no-lint    # 仅修复格式

# 禁用特定检查
vp check --no-fmt
vp check --no-lint
vp check --no-type-aware
vp check --no-type-check
```

### 选项

| 标志                               | 默认值 | 描述                                             |
| ---------------------------------- | ------- | ------------------------------------------------------- |
| `--fix`                            | OFF     | 自动修复格式和 lint 问题                         |
| `--fmt` / `--no-fmt`               | ON      | 运行格式校验（`vp fmt --check`）                     |
| `--lint` / `--no-lint`             | ON      | 运行 lint 校验（`vp lint`）                              |
| `--type-aware` / `--no-type-aware` | ON      | 启用基于类型信息的 lint 规则（oxlint `--type-aware`）    |
| `--type-check` / `--no-type-check` | ON      | 启用 TypeScript 类型检查（oxlint `--type-check`） |
| `--no-error-on-unmatched-pattern`  | OFF     | 当模式未匹配时不要以错误退出        |

**标志依赖：** `--type-check` 要求 `--type-aware` 作为前置条件。

- `--type-aware` 启用使用类型信息的 lint 规则（例如 `no-floating-promises`）
- `--type-check` 启用实验性的 TypeScript 编译器级类型检查（需要 type-aware）
- 如果设置了 `--no-type-aware`，则 `--type-check` 也会被隐式禁用

在 `vp check` 中默认启用两者，以提供全面的静态分析。

### 文件路径参数

`vp check` 接受可选的尾随文件路径，这些路径会原样传递给 `fmt` 和 `lint`：

```bash
# 仅检查特定文件
vp check --fix src/index.ts src/utils.ts
```

当提供文件路径时：

- 这些路径会同时追加到 `fmt` 和 `lint` 子命令
- 在 `--fix` 模式下，会隐式启用 `--no-error-on-unmatched-pattern`，用于 `fmt` 和 `lint`，当所有提供的路径都被 ignorePatterns 排除时可避免错误。这是常见的 lint-staged 用例：暂存文件可能不会匹配工具特定的模式。
- 不带 `--fix` 时，未匹配的模式会被当作错误报告，除非显式传入 `--no-error-on-unmatched-pattern`。oxfmt 和 oxlint 都原生支持该标志。

这使得 lint-staged 能够无缝集成：

```json
"lint-staged": {
  "*.@(js|ts|tsx)": "vp check --fix"
}
```

lint-staged 会自动追加暂存的文件路径，因此 `vp check --fix` 例如会变成：`vp check --fix src/a.ts src/b.ts`。

## 行为

命令将 **按顺序** 运行，并采用 fail-fast 语义：

```
1. vp fmt --check                          (校验格式，不自动修复)
2. vp lint --type-aware --type-check       (lint + 类型检查)
```

任一步骤失败，`vp check` 都会立即以非零退出码退出。

## CLI 输出

`vp check` 只应为**成功的阶段**打印**完成摘要**：

```text
pass: 所有 989 个文件都已正确格式化（423ms，16 个线程）
pass: 在 150 个文件中未发现警告、lint 错误或类型错误（452ms，16 个线程）
```

输出规则：

- 不要打印被委托的命令，例如 `vp fmt --check` 或 `vp lint --type-aware --type-check`
- 每个阶段在成功完成后只打印一行 `pass:`
- 仅当启用 `--type-check` 时，才在 lint 成功行中提及类型检查
- 失败时，先打印可读的 `error:` 行，然后输出原始诊断信息，再输出一个空行，最后给出一句最终的总结句
- 将 `vp check --no-fmt --no-lint` 视为错误，而不是静默成功

示例失败输出：

```text
error: 检测到格式问题
src/index.js
steps.json

在 2 个文件中发现格式问题（105ms，16 个线程）。运行 `vp check --fix` 进行修复。
```

```text
error: 检测到 lint 或类型问题
...diagnostics...

在 2 个文件中发现 3 个错误和 1 个警告（452ms，16 个线程）
```

## 决策

### 双模式：校验与修复

默认情况下，`vp check` 是一个**只读的验证命令**。它永远不会修改文件：

- `vp fmt --check` 报告未格式化的文件（不自动格式化）
- `vp lint --type-aware --type-check` 报告问题（不自动修复）

这让 `vp check` 对 CI 来说是安全的、对本地开发来说行为可预测。

当传入 `--fix` 时，`vp check` 切换到**自动修复**模式：

- `vp fmt` 会自动格式化文件
- `vp lint --fix --type-aware --type-check` 会自动修复 lint 问题

这用一条命令替代了手动工作流 `vp fmt && vp lint --fix`。

### 不运行测试

`vp check` **不会**运行 Vitest。区分是有意为之：

- `vp check` = 快速静态分析（秒级）
- `vp test` = 测试执行（分钟级）

## 实现架构

### Rust 全局 CLI

在 `crates/vite_global_cli/src/cli.rs` 的 `Commands` 枚举中添加 `Check` 变体：

```rust
#[command(disable_help_flag = true)]
Check {
    #[arg(trailing_var_arg = true, allow_hyphen_values = true)]
    args: Vec<String>,
},
```

通过委托路由：

```rust
Commands::Check { args } => commands::delegate::execute(cwd, "check", &args).await,
```

### NAPI 绑定

`Check` 变体在 `packages/cli/binding/src/cli.rs` 的 `SynthesizableSubcommand` 中定义。检查命令的编排逻辑位于独立模块 `packages/cli/binding/src/check/`，遵循与 `exec/` 相同的“每个命令一个目录”的模式：

- `check/mod.rs` — `execute_check()` 编排（顺序运行 fmt + lint，处理 `--fix` 重新格式化）
- `check/analysis.rs` — 输出分析类型（`CheckSummary`、`LintMessageKind` 等）、解析器与格式化辅助函数

检查模块会复用 `cli.rs` 中的 `SubcommandResolver` 和 `resolve_and_capture_output` 来解析并运行底层的 fmt/lint 命令。

### TypeScript 侧

不需要新增解析器——`vp check` 复用现有的 `resolve-lint.ts` 和 `resolve-fmt.ts`。

### 关键文件

1. `crates/vite_global_cli/src/cli.rs` — `Check` 命令变体与路由
2. `packages/cli/binding/src/cli.rs` — `SynthesizableSubcommand::Check` 定义，委托给 `check` 模块
3. `packages/cli/binding/src/check/mod.rs` — 检查命令编排（`execute_check`）
4. `packages/cli/binding/src/check/analysis.rs` — 输出解析与分析类型

## CLI 帮助输出

```
运行格式、lint 和类型检查

用法：vp check [OPTIONS]

选项：
      --fmt              运行格式校验 [default: true]
      --lint             运行 lint 校验 [default: true]
      --type-aware       启用类型感知的 lint [default: true]
      --type-check       启用 TypeScript 类型检查 [default: true]
      --no-error-on-unmatched-pattern  当没有文件匹配时不要以错误退出
  -h, --help             打印帮助
```

## 与现有命令的关系

| 命令                             | 用途                                          | 速度    |
| ----------------------------------- | ------------------------------------------------ | -------- |
| `vp fmt`                            | 格式化代码（自动修复）                           | 快速     |
| `vp fmt --check`                    | 校验格式                                | 快速     |
| `vp lint`                           | lint 代码                                        | 快速     |
| `vp lint --type-aware --type-check` | lint + 完整类型检查                        | 快速     |
| `vp test`                           | 运行测试套件                                   | 慢速     |
| `vp build`                          | 构建项目                                    | 慢速     |
| **`vp check`**                      | **fmt --check + lint --type-aware --type-check** | **快速** |
| **`vp check --fix`**                | **fmt + lint --fix --type-aware --type-check**   | **快速** |

使用 `vp check` 后，单体仓库模板的“ready”脚本将简化为：

```json
"ready": "vp check && vp run -r test && vp run -r build"
```

## 缓存

当 `vp check` 被用作 package.json 脚本（例如 `"check": "vp check"`）并通过 `vp run check` 执行时，它会像其他已合成的命令（`vp build`、`vp lint`、`vp fmt`）一样支持任务运行器缓存。

### 配置

在 `vite.config.ts` 中启用缓存：

```ts
export default {
  run: {
    cache: true,
  },
};
```

启用缓存后，第二次 `vp run check` 在输入未变化时会重放缓存输出：

```
$ vp check ◉ cache hit, replaying
pass: 所有 4 个文件都已正确格式化（105ms，16 个线程）
pass: 在 2 个文件中未发现警告或 lint 错误（452ms，16 个线程）
```

### 缓存键

检查命令的缓存指纹包含：

- **环境变量：** `OXLINT_TSGOLINT_PATH`（影响 lint 行为）
- **输入文件：** 通过 fspy 自动跟踪，排除：
  - `node_modules/.vite-temp/**` — 配置编译缓存（由 `vp` CLI 子进程读取+写入）
  - `node_modules/.vite/task-cache/**` — 每次运行后会变化的任务运行器状态文件

这些排除项由 `check_cache_inputs()` 在 `cli.rs` 中定义。

### 与 `vp fmt` / `vp lint` 的不同点

当 `vp fmt` 或 `vp lint` 出现在任务脚本中时，命令处理器会将它们解析为各自的底层二进制文件（例如 `node path/to/oxfmt.mjs`）。`vp check` 命令不同——它作为一个完整的 `vp check` 子进程运行，因为它是一个组合命令，会在内部编排 fmt 和 lint。 这意味着 fspy 会跟踪 `vp` CLI 进程本身，因此需要对 `.vite-temp` 和 `.vite/task-cache` 进行上述排除。

## 与其他工具的对比

| 工具              | 范围                              |
| ----------------- | ---------------------------------- |
| `cargo check`     | 仅进行类型检查                 |
| `cargo clippy`    | 仅进行 lint                          |
| **`biome check`** | **格式化 + lint（最接近的对应）** |
| `deno check`      | 仅进行类型检查                 |

## 快照测试（Snap Tests）

```
packages/cli/snap-tests/check-basic/
  package.json
  steps.json     # { "steps": [{ "command": "vp check" }] }
  src/index.ts   # 清理后的文件，能够通过所有检查
  snap.txt

packages/cli/snap-tests/check-fmt-fail/
  package.json
  steps.json     # { "steps": [{ "command": "vp check" }] }
  src/index.ts   # 格式不良的文件
  snap.txt       # 显示 fmt --check 失败；lint 不会运行（fail-fast）

packages/cli/snap-tests/check-no-fmt/
  package.json
  steps.json     # { "steps": [{ "command": "vp check --no-fmt" }] }
  snap.txt       # 仅运行 lint

packages/cli/snap-tests/check-cache-enabled/
  package.json   # { "scripts": { "check": "vp check" } }
  vite.config.ts # { run: { cache: true } }
  steps.json     # 运行两次 vp run check，期望第二次命中缓存
  src/index.js
  snap.txt
```
