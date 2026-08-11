# RFC：`vp exec` 命令

## 摘要

添加 `vp exec` 作为一个子命令，它会将 `./node_modules/.bin` 追加到 PATH 前面并执行一个命令。这相当于 `pnpm exec`，或者使用 `bun` 直接执行。

该命令与现有命令一起完善了执行流程：

| 命令          | 行为                                                         | 类比                        |
| ------------- | ------------------------------------------------------------ | --------------------------- |
| `vp dlx`      | 始终从远程下载                                              | `pnpm dlx` / `bun x`        |
| `vpx`         | 本地 → 全局 → PATH → 远程回退                                | `npx`                       |
| **`vp exec`** | **将 `node_modules/.bin` 追加到 PATH 前面，然后正常执行** | **`pnpm exec`** / **`bun`** |

**注意：** bun 会原生从本地 `node_modules/.bin` 解析二进制文件，因此 `bun <cmd>` 或 `bun x <cmd>` 可以起到与 `vp exec` 类似的作用。

## 动机

目前，要在 PATH 中包含 `node_modules/.bin` 的情况下运行命令，开发者必须使用 `vpx`（它具有全局/远程回退）或者直接调用 `./node_modules/.bin/<cmd>`。没有一种简单的方法可以将本地 bin 目录预先添加到 PATH 并执行命令——这正是 `pnpm exec` 提供的行为。

### 为什么需要 `vp exec`

1. **没有远程回退**：与 `vpx` 不同，`vp exec` 从不从注册表下载——命令仅通过 `node_modules/.bin` + 现有 PATH 进行解析
2. **工作区迭代**：`pnpm exec --recursive` 会在每个工作区包中运行命令——`vpx` 不支持这一点
3. **与 pnpm exec 对齐**：从 pnpm 迁移的项目期望存在 `exec` 作为子命令
4. **意图明确**：`vp exec` 表示“使用本地 bin 并将其放入 PATH 中运行”，而 `vpx` 表示“在任何地方查找，必要时下载”

### 当前痛点

```bash
# 开发者希望在 PATH 中包含 node_modules/.bin 运行，不要远程回退
vpx eslint .                           # 有远程回退——可能会意外下载
./node_modules/.bin/eslint .           # 冗长，不够便携

# 开发者希望在每个工作区包中运行命令
pnpm exec --recursive -- eslint .      # 在 pnpm 中可用
# 目前没有 vp 对应命令
```

### 提议的解决方案

```bash
# 使用 node_modules/.bin 运行（无远程回退）
vp exec eslint .

# 在每个工作区包中运行
vp exec --recursive -- eslint .

# Shell 模式
vp exec -c 'echo $PATH'
```

## 命令语法

```bash
vp exec [OPTIONS] [--] <command> [args...]
```

前面的 `--` 是可选的，为了向后兼容会被去除（与 pnpm exec 行为一致）。

**选项：**

- `--shell-mode, -c` — 在 shell 环境中执行（UNIX 上为 `/bin/sh`，Windows 上为 `cmd.exe`）
- `--recursive, -r` — 在每个工作区包中运行（仅限本地 CLI）
- `--workspace-root, -w` — 仅在工作区根包中运行（仅限本地 CLI）
- `--filter, -F <selector>` — 按名称模式或相对路径筛选包（仅限本地 CLI）；也接受 `--filter=<selector>` 形式
- `--parallel` — 并发运行，不进行拓扑排序（仅限本地 CLI）
- `--reverse` — 反向拓扑顺序（仅限本地 CLI）
- `--resume-from <pkg>` — 从指定包继续执行（仅限本地 CLI）；也接受 `--resume-from=<pkg>` 形式
- `--report-summary` — 将结果保存到 `vp-exec-summary.json`（仅限本地 CLI）

### 使用示例

```bash
# 基本用法：运行本地安装的二进制文件
vp exec eslint .

# 带参数
vp exec tsc --noEmit

# Shell 模式（管道命令、展开变量）
vp exec -c 'echo $PATH'
vp exec -c 'eslint . && prettier --check .'

# 在每个工作区包中运行
vp exec -r -- eslint .

# 筛选特定包
vp exec --filter 'app...' -- tsc --noEmit

# 按相对路径筛选
vp exec --filter ./packages/app-a -- tsc --noEmit

# 带依赖遍历的大括号路径筛选
vp exec --filter '{./packages/app-a}...' -- tsc --noEmit

# 并行运行（不进行拓扑排序）
vp exec -r --parallel -- eslint .

# 从指定包恢复执行（失败后）
vp exec -r --resume-from @my/app -- tsc --noEmit

# 仅在工作区根目录运行
vp exec -w -- node -e "console.log(process.env.VP_PACKAGE_NAME)"

# 保存执行摘要
vp exec -r --report-summary -- vitest run
```

## 过滤选择器语法

`--filter` 标志支持与 pnpm 兼容的选择器：

**名称模式：**

- `app-a` — 精确包名
- `app-*` — 匹配包名的 glob 模式
- `@myorg/*` — 带作用域的包 glob

**路径选择器**（通过前导 `.` 或 `..` 检测）：

- `./packages/app-a` — 匹配目录位于此路径或其下方的包
- `../other-pkg` — 相对于 cwd 的相对路径

**带花括号的路径选择器**（pnpm 兼容语法）：

- `{./packages/app-a}` — 等同于 `./packages/app-a`
- `{./packages/app-a}...` — 带依赖遍历的路径
- `...{./packages/app-a}` — 带依赖方遍历的路径
- `app-*{./packages}` — 组合名称模式 + 路径过滤（先按路径匹配，再按名称过滤）

**修饰符：**

- `<selector>...` — 包含该包及其所有传递依赖
- `...<selector>` — 包含该包及所有依赖它的包
- `<selector>^...` — 仅依赖项，不包括被匹配的包本身
- `...^<selector>` — 仅依赖方，不包括被匹配的包本身
- `!<selector>` — 从结果集中排除匹配的包

修饰符可与名称模式（例如 `app-a...`）和带花括号的路径选择器（例如 `{./packages/app-a}...`）一起使用。不带花括号的路径选择器（例如 `./packages/app-a`）不支持遍历修饰符。

**空白拆分**：`--filter "a b"` 等同于 `--filter a --filter b`（pnpm 兼容）。每个 `--filter` 值都会按空白拆分为单独的过滤标记。

**未匹配过滤器警告**：当包含性过滤器未匹配到任何包时，会向 stderr 发出警告（例如，`WARN No packages matched the filter 'nonexistent'`）。

**仅排除过滤器**：当所有选择器都仅用于排除时（例如，`--filter '!app-b'`），结果将是所有非根工作区包减去被排除的包。这与 pnpm 行为一致——在没有显式包含条件时进行排除，意味着“从全部开始”。

**`-w --filter` 交互**：`-w`（工作区根）与 `--filter` 组合时是累加的——工作区根会与被过滤的包一起包含。这与 pnpm 行为一致。

**工作区根包含规则**：

- `-r`（递归）会包含工作区根以及所有工作区包
- `-w`（工作区根）仅在工作区根包上运行
- `--filter '*'` 会包含工作区根，因为 `*` 会按名称匹配所有包，包括根包。

## 核心行为

基于 pnpm exec 行为（参考：`exec/plugin-commands-script-runners/src/exec.ts`）：

1. **在 `PATH` 前追加 `./node_modules/.bin`**（以及来自包管理器的额外 bin 路径）
2. **为向后兼容移除命令开头的 `--`**
3. **通过进程 spawn 执行命令，使用 `stdio: inherit`** —— 命令会通过修改后的 PATH 解析（先本地 bin，再系统 PATH）
4. **Shell 模式**：当指定 `-c` 时，向子进程传递 `shell: true`
5. **设置 `VP_PACKAGE_NAME`** 环境变量为当前包名（类似于 pnpm 的 `PNPM_PACKAGE_NAME`）
6. **如果没有命令则报错**：`'vp exec' requires a command to run`

## 命令之间的关系

| 行为             | `vp exec`                        | `vpx`                       | `vp dlx`       |
| ---------------- | -------------------------------- | --------------------------- | -------------- |
| 追加到 PATH 前面   | `./node_modules/.bin`（仅当前工作目录） | 向上查找 `node_modules/.bin` | 否             |
| 全局 vp 包查找     | 否                               | 是                           | 否             |
| 系统 PATH         | 是（在 `node_modules/.bin` 之后） | 是                           | 否             |
| 远程下载          | 否                               | 是（回退）                   | 始终           |
| 工作区迭代        | 是（`-r`, `--filter`）           | 否                           | 否             |
| Shell 模式        | 是（`-c`）                       | 是（`-c`）                  | 是（`-c`）     |
| 使用场景          | 使用本地 bin 运行，并包含在 PATH 中 | 运行任意工具并自动查找       | 下载并运行      |

### 与 vpx 的主要区别

- `vp exec` 只会将当前目录中的 `./node_modules/.bin` 放在 PATH 前面——**不会**向上遍历父目录。如果需要使用 monorepo 根目录中的二进制文件，请使用 `vpx`。
- 选定 Vite+ CLI 后，`vp exec` 永远不会回退到全局安装的可执行包或远程下载——命令只会通过 `node_modules/.bin` 和系统 PATH 进行解析。

## 实现架构

### 全局 CLI

**文件**: `crates/vp_global_cli/src/cli.rs`

`Commands` 枚举中的 `Exec` 变体（Category C）无条件委托给本地 CLI：

```rust
// Category C：本地 CLI 委托
/// 从本地 node_modules/.bin 执行命令
#[command(disable_help_flag = true)]
Exec {
    /// 额外参数
    #[arg(trailing_var_arg = true, allow_hyphen_values = true)]
    args: Vec<String>,
},
```

`execute_command()` 中的路由：

```rust
Commands::Exec { args } => commands::delegate::execute(cwd, "exec", &args).await,
```

全局 CLI 始终将 `exec` 委托给 JavaScript CLI。委托会优先解析项目本地的 `vite-plus`；当本地 CLI 不可用时，则回退到全局安装的 `vite-plus`。当该回退发生在项目内部时，如果项目未将 `vite-plus` 声明为依赖项，`vp` 会建议进行迁移；如果已声明但不可用，则会建议安装依赖项。Rust 全局 CLI 不包含直接的 `exec` 实现。

### 本地 CLI

**模块**: `packages/cli/binding/src/exec/`

本地 CLI 通过全局 CLI 的委托接收 `exec` 命令（与 `run`、`build` 等相同机制）。exec 逻辑被组织在一个专用模块中，并包含子模块：

```
packages/cli/binding/src/exec/
├── mod.rs       — 入口点（execute），委托到 workspace.rs
├── args.rs      — ExecArgs（带有 #[clap(flatten)] PackageQueryArgs 的 clap 派生结构体）
└── workspace.rs — execute_exec_workspace(), topological_sort_packages()
```

单包和多包执行共用一条代码路径。`mod.rs` 会验证命令非空，并委托给 `execute_exec_workspace()`。当未提供任何 workspace 标志（`--recursive`、`--filter` 等）时，`PackageQueryArgs::into_package_query()` 会返回一个 `ContainingPackage(cwd)` 选择器，它只会解析到当前包——因此 workspace 路径可以自然地处理单包场景。

包过滤委托给 `vt_workspace` 的可复用 API：`PackageQueryArgs`（通过 `#[clap(flatten)]` 嵌入的 CLI 参数结构体）→ `PackageQuery`（通过 `into_package_query()` 获取）→ `IndexedPackageGraph::resolve_query()` → `FilterResolution`（包含 `package_subgraph` 和 `unmatched_selectors`）。这遵循了 `vp run` 通过 `RunFlags` 使用的相同模式。

本地 CLI 具备完整的 workspace 感知能力，并可以处理：

- `--recursive` — 使用拓扑排序遍历 workspace 包
- `--filter, -F` — 按选择器过滤包
- `--parallel` — 并发运行
- `--reverse` — 反转拓扑顺序
- `--resume-from` — 从指定包继续执行
- `--report-summary` — 保存结果 JSON

对于本地 CLI，exec 会使用 workspace 包图来遍历各个包，在该包目录中启动命令之前，将每个包的 `node_modules/.bin` 追加到 PATH 前面。

当只选择了单个包时（无论是默认情况还是通过 `--filter`），输出中的 `pkg_name$ cmd` 前缀都会被省略；如果命令未找到，则会生成一条用户友好的错误消息，并提示运行 `vp install` 或使用 `vpx`。

### 可复用代码

以下现有代码被复用：

| 模块           | 函数                               | 用途                                           |
| -------------- | ---------------------------------- | ---------------------------------------------- |
| `vp_command`   | `resolve_bin()`                    | 通过 PATH 查找解析二进制文件路径               |
| `vp_command`   | `build_command()`                  | 为二进制文件构建 `tokio::process::Command`    |
| `vp_command`   | `build_shell_command()`            | 为 `-c` 模式构建 shell 命令                    |
| `vp_pm_cli`    | `PackageManager::get_bin_prefix()` | 获取用于 PATH 的包管理器 bin 目录              |
| `vt_workspace` | `find_workspace_root()`            | 从 cwd 定位 workspace 根目录                   |
| `vt_workspace` | `load_package_graph()`             | 加载 workspace 包及其依赖图                    |
| `vt_workspace` | `PackageQueryArgs`                 | 用于选择包的 CLI 参数结构体                    |
| `vt_workspace` | `IndexedPackageGraph`              | 提供 `resolve_query()` 的索引图                |
| `vt_workspace` | `FilterResolution`                 | 解析结果：子图及未匹配的选择器                 |

## 设计决策

### 1. 本地优先委托与全局 CLI 回退

**决策**：全局 CLI 在可用时将 `exec` 委托给项目本地的 `vite-plus`。否则，它会在项目内提供迁移或安装指导，并继续使用全局安装的 `vite-plus` CLI。

**理由**：

- 简化全局 CLI——无需直接执行代码路径
- 与所有 C 类命令的分发方式保持一致
- 被委托的 CLI 具备处理 `--recursive`、`--filter` 等选项所需的全部工作区感知能力
- 警告会指导项目迁移或安装其声明的依赖，同时不会使全局回退机制失效

### 2. 不向上遍历目录（不同于 vpx）

**决策**：`vp exec` 只检查当前目录下的 `./node_modules/.bin`，不检查父目录。

**理由**：

- 与 `pnpm exec` 的行为一致——严格的本地作用域
- 在工作区迭代（`-r`）中，每个包都应使用自己的 `node_modules/.bin`
- 向上遍历会模糊包级二进制文件与工作区级二进制文件之间的边界
- 如果你想要向上遍历的行为，请使用 `vpx`

### 3. 工作区功能使用被委托的 CLI

**决策**：`--recursive`、`--workspace-root`、`--filter`、`--parallel`、`--reverse`、`--resume-from` 和 `--report-summary` 均由解析出的 `vite-plus` CLI 处理，无论它是项目本地版本还是全局回退版本。

**理由**：

- 这些功能需要 vite-task 基础设施提供工作区感知能力
- 项目本地和全局安装的 CLI 使用相同的工作区感知实现
- 这与 `vp run` 处理工作区功能的方式一致

### 4. 相同的环境变量约定

**决策**：在工作区包中执行时，设置 `VP_PACKAGE_NAME` 环境变量。

**理由**：

- 遵循 pnpm 的 `PNPM_PACKAGE_NAME` 约定
- 让脚本知道自己正在运行于哪个包中
- 与 vite-plus 品牌保持一致的命名

### 5. 去除开头的 `--`

**决策**：自动去除命令参数开头的 `--`。

**理由**：

- 与 pnpm exec 的向后兼容行为一致
- `vp exec -- eslint .` 和 `vp exec eslint .` 应该表现一致
- 降低来自 pnpm 用户的迁移摩擦

### 6. 执行顺序

**决策**：当使用 `--recursive` 或 `--filter` 时，包按拓扑顺序执行（依赖优先）。拓扑排序使用 `FilterResolution.package_subgraph` 上的 `petgraph::algo::toposort`（而不是原始的完整图），这使得未来支持 `--filter-prod` 成为可能，因为在子图构建时会排除 dev 依赖边。

**理由**：

- **默认按拓扑顺序**：像 `tsc --noEmit` 或 `build` 这样的命令需要依赖先完成，才能执行依赖它们的包。按依赖顺序运行可确保正确性，而无需用户显式指定 `--topological`。
- **不进行按字母顺序的平局裁决**：彼此之间没有顺序约束的包（例如两个互不相关的叶子包）将按照 petgraph 的内部遍历顺序排序。这与 pnpm 的行为一致。
- **`--parallel` 跳过排序**：在并行模式下，所有包都会同时启动——拓扑顺序只影响输出收集的顺序。
- **`--reverse`**：反转拓扑顺序（先依赖者，后依赖）。适用于清理操作。
- **循环依赖处理**：当存在环时，`toposort()` 会返回错误。回退方案使用 `petgraph::algo::tarjan_scc`，它会以收缩后的 DAG 的逆拓扑顺序返回强连通分量（SCC）。即使存在环，这也能保留非循环依赖的正确顺序——环外的节点会根据其依赖关系被正确地放在环之前或之后。

  **示例 —— 正常依赖链（无环）：**

  ```
  a → b → c → d → e    （a 依赖于 b，b 依赖于 c，依此类推）

  toposort 产生依赖优先的顺序：
  结果：[e, d, c, b, a]
  ```

  **示例 —— 简单环（2 个节点）：**

  ```
  a ←→ b    （相互依赖）

  toposort 返回 Err(Cycle)。
  tarjan_scc 返回 [{a, b}] —— 一个同时包含两个节点的 SCC。
  结果：[a, b] 或 [b, a]  （SCC 内部顺序是任意的）
  ```

  **示例 —— 3 节点环：**

  ```
  a → b → c → a    （a 依赖于 b，b 依赖于 c，c 依赖于 a）

  toposort 返回 Err(Cycle)。
  tarjan_scc 返回 [{a, b, c}] —— 三者构成一个 SCC。
  结果：[a, b, c] 的任意排列  （SCC 内部顺序是任意的）
  ```

  **示例 —— 带有非循环依赖的环：**

  ```
  a ←→ b, a → c    （a↔b 为环，a 依赖于非循环的 c）

  toposort 返回 Err(Cycle)。
  tarjan_scc 返回 [{c}, {a, b}] —— c 作为单独的 SCC 先返回，然后是
  a↔b 环。依赖优先的顺序得以保留。
  结果：[c, a, b] 或 [c, b, a]  （c 始终在环之前）
  ```

  **示例 —— 带有非循环依赖者的环：**

  ```
  a ←→ b ← aa    （a↔b 为环，aa 依赖于 b）

  toposort 返回 Err(Cycle)。
  tarjan_scc 返回 [{a, b}, {aa}] —— 先返回该环的 SCC，然后是 aa。
  结果：[a, b, aa] 或 [b, a, aa]  （环始终在 aa 之前）
  ```

- **平台安全的 PATH 构造**：PATH 环境变量使用 `std::env::join_paths()` 构造，而不是硬编码 `:` 分隔符，从而确保在 Unix（`:`）和 Windows（`;`）上都能正确工作。

## CLI 帮助输出

```bash
$ vp exec --help
从本地 node_modules/.bin 执行命令

用法: vp exec [OPTIONS] [--] <command> [args...]

参数:
  <command>  从 node_modules/.bin 执行的命令
  [args...]  传递给该命令的参数

选项:
  -c, --shell-mode              在 shell 环境中执行命令
  -r, --recursive               在每个工作区包中运行
  -w, --workspace-root          仅在工作区根包中运行
  -F, --filter <PATTERN>        过滤包（可多次使用）
      --parallel                并发运行，不进行拓扑排序
      --reverse                 反向执行顺序
      --resume-from <PACKAGE>   从指定包恢复
      --report-summary          将结果保存到 vp-exec-summary.json
  -h, --help                    打印帮助

示例:
  vp exec eslint .                            # 运行本地 eslint
  vp exec tsc --noEmit                        # 运行本地 TypeScript 编译器
  vp exec -c 'eslint . && prettier --check .' # shell 模式
  vp exec -r -- eslint .                      # 在所有工作区包中运行
  vp exec --filter 'app...' -- tsc            # 在过滤后的包中运行
```

## 错误处理

### 缺少命令

```bash
$ vp exec
错误：'vp exec' 需要指定要运行的命令

用法：vp exec [--] <command> [args...]

示例：
  vp exec eslint .
  vp exec tsc --noEmit
```

### 未找到命令

```bash
$ vp exec nonexistent-cmd
错误：未找到命令 'nonexistent-cmd'

提示：运行 'vp install' 以安装依赖，或使用 'vpx' 作为远程回退。
```

## Snap 测试

### 全局 CLI 测试：`command-exec-pnpm10`

**位置**：`packages/cli/snap-tests-global/command-exec-pnpm10/`

```
command-exec-pnpm10/
├── package.json
├── steps.json
└── snap.txt          # 自动生成
```

**`package.json`**：

```json
{
  "name": "command-exec-pnpm10",
  "version": "1.0.0",
  "packageManager": "pnpm@10.19.0"
}
```

**`steps.json`**：

```json
{
  "commands": [
    "vp exec echo hello # 基本 exec，无 vite-plus 依赖（由全局 CLI 直接处理）",
    "vp exec node -e \"console.log('hi')\" # 带参数透传的 exec",
    "vp exec nonexistent-cmd # 命令未找到错误",
    "vp exec -c 'echo hello from shell' # shell 模式"
  ]
}
```

**测试用例**：

1. `vp exec echo hello` — 基本执行，在 `node_modules/.bin` 前置后于 PATH 中找到的命令
2. `vp exec node -e "console.log('hi')"` — 将参数透传给带多个参数的命令
3. `vp exec nonexistent-cmd` — 命令未找到错误消息
4. `vp exec -c 'echo hello from shell'` — shell 模式执行

### 本地 CLI 测试：`command-exec`

**位置**：`packages/cli/snap-tests/command-exec/`

```
command-exec/
├── package.json
├── steps.json
└── snap.txt          # 自动生成
```

**`package.json`**：

```json
{
  "name": "command-exec",
  "version": "1.0.0",
  "packageManager": "pnpm@10.19.0",
  "devDependencies": {
    "vite-plus": "workspace:*",
    "cowsay": "^1.6.0"
  }
}
```

**`steps.json`**：

```json
{
  "commands": [
    "vp exec cowsay hello # 使用已安装的二进制文件执行",
    "vp exec -c 'echo $PATH' # 验证 PATH 包含 node_modules/.bin"
  ]
}
```

**测试用例**：

1. `vp exec cowsay hello` — 通过本地 CLI 委托执行本地安装的二进制文件
2. `vp exec -c 'echo $PATH'` — 验证 `node_modules/.bin` 已前置到 PATH。

## 边缘情况

### 去除前导 `--`

```bash
# 两者等价
vp exec -- eslint .
vp exec eslint .
```

### 复杂命令下的 Shell 模式

```bash
# 管道和重定向需要 shell 模式
vp exec -c 'eslint . 2>&1 | tee lint-output.txt'

# 环境变量展开
vp exec -c 'echo $NODE_ENV'
```

### 递归执行时的失败

递归运行时，某个包中的失败会停止执行（除非使用 `--parallel`，在这种情况下所有包都会运行，并收集失败结果）：

```bash
$ vp exec -r -- tsc --noEmit
@my/utils: tsc --noEmit ... ok
@my/app: tsc --noEmit ... FAILED (exit code 1)
Error: 1 of 5 packages failed
```

### `--` 后为空参数

```bash
$ vp exec --
Error: 'vp exec' requires a command to run
```

## 安全注意事项

1. **无远程回退**：与 `vpx` 不同，`vp exec` 从不从注册表下载，从而消除了因意外远程执行带来的供应链风险
2. **PATH 行为**：命令通过 `./node_modules/.bin`（前置）+ 系统 PATH 进行解析。这与 `pnpm exec` 的行为一致——像 `echo`、`node` 等系统命令仍然可访问
3. **Shell 模式风险**：Shell 模式（`-c`）允许执行任意 shell 命令——与 pnpm exec 的注意事项相同

## 向后兼容性

这是一个没有破坏性变更的新功能：

- 现有的 `vp dlx` 和 `vpx` 行为保持不变
- 新增的 `exec` 子命令只是纯粹的功能扩展
- 配置格式没有任何变化
- 遵循既有的委派模式（类似 `vp run`）。

## 与 pnpm exec 的比较

| 行为                 | `pnpm exec`                              | `vp exec`                                |
| -------------------- | ---------------------------------------- | ---------------------------------------- |
| PATH 修改            | 前置 `./node_modules/.bin`               | 前置 `./node_modules/.bin`               |
| 命令解析             | 修改后的 PATH（本地 bin + 系统 PATH）    | 修改后的 PATH（本地 bin + 系统 PATH）    |
| 向上查找             | 否                                       | 否                                       |
| Shell 模式（`-c`）   | 是                                       | 是                                       |
| 递归（`-r`）         | 是（工作区迭代）                         | 是（通过本地 CLI）                       |
| 工作区根目录（`-w`） | 是（仅根目录）                           | 是（仅根目录）                           |
| 过滤                 | `--filter`                               | `--filter`                               |
| 基于路径的过滤       | `--filter ./packages/app`                | `--filter ./packages/app`                |
| 带花括号的路径过滤   | `--filter {./packages/app}`              | `--filter {./packages/app}`              |
| 名称 + 路径过滤      | `--filter 'app-*{./packages}'`           | `--filter 'app-*{./packages}'`           |
| 并行                 | `--parallel`                             | `--parallel`                             |
| 汇总报告             | `--report-summary`                       | `--report-summary`                       |
| 包名环境变量         | `PNPM_PACKAGE_NAME`                      | `VP_PACKAGE_NAME`                        |
| 去除前导 `--`        | 是                                       | 是                                       |

## 未来增强

### 1. `--if-present` 标志

```bash
# 跳过不存在该命令的包（与 -r 一起使用时很有用）
vp exec -r --if-present -- eslint .
```

## 结论

本 RFC 提议添加 `vp exec`，以完善 Vite+ 中的执行命令三件套：

- `vp dlx` — 始终远程（类似 `pnpm dlx`）
- `vpx` — 以本地优先，并带有回退链（类似 `npx`）
- `vp exec` — 将本地 bin 目录前置到 PATH，不进行远程回退（类似 `pnpm exec`）

该设计：

- 与 `pnpm exec` 语义一致，带来熟悉的开发者体验
- 遵循已确立的全局/本地 CLI 路由的无条件委派模式
- 复用现有基础设施（`vpx.rs` 辅助函数、委派、PATH 操作）
- 通过本地 CLI 支持工作区特性（recursive、filter、parallel）
- 仅为新增功能，不会带来破坏性变更。
