# RFC：`vpx` 命令

## 摘要

添加 `vpx` 命令，用于从本地、全局安装的或远程的 npm 包中运行命令（类似 `npx`），并在回退到远程下载之前使用多步骤解析链。

现有的 `vp dlx` 命令保持不变——它始终从注册表下载，而不会检查本地包（类似 `pnpm dlx`）。

## 动机

目前，`vp dlx` 总是从远程注册表下载包，即使所需的二进制文件已经存在于 `node_modules/.bin` 中。现在还没有办法在本地安装的包二进制可用时自动回退到远程，来运行它。

每个主流包管理器都提供了这种能力：

```bash
# npm - 检查本地，回退到远程
npx eslint .

# pnpm - 仅本地（不回退到远程）
pnpm exec eslint .

# bun - 检查本地，回退到远程
bunx eslint .
```

### 当前痛点

```bash
# 开发者本地已经安装了 eslint，但 vp dlx 仍然会再次下载它
vp dlx eslint .                     # 从注册表下载（慢、浪费）

# 要运行本地二进制文件，开发者必须使用完整路径
./node_modules/.bin/eslint .        # 冗长，不便移植

# 或者使用底层包管理器
pnpm exec eslint .                  # 背离了 vp 的目的
```

### 提议的解决方案

```bash
# 如果已安装则使用本地 eslint，否则下载
vpx eslint .

# 始终从注册表下载（不变）
vp dlx eslint .
```

## 命令语法

```bash
vpx <pkg>[@<version>] [args...]
vpx --package=<pkg>[@<version>] <cmd> [args...]
vpx -c '<cmd> [args...]'
```

所有标志必须放在位置参数之前（类似 `npx`）。

**选项：**

- `--package, -p <name>`：指定如果本地未找到时要安装的包。可以多次指定。
- `--shell-mode, -c`：在 shell 环境中执行命令（UNIX 上为 `/bin/sh`，Windows 上为 `cmd.exe`）。
- `--silent, -s`：抑制除所执行命令输出之外的所有输出。

### 使用示例

```bash
# 运行本地安装的二进制文件（如果未找到则下载）
vpx eslint .

# 运行特定版本（始终远程 — 如果版本与本地不匹配）
vpx typescript@5.5.4 tsc --version

# 分离包名和命令（当二进制名称与包名不同）
vpx --package @pnpm/meta-updater meta-updater --help

# 多个包
vpx --package yo --package generator-webapp yo webapp

# Shell 模式（管道命令）
vpx -p cowsay -p lolcatjs -c 'echo "hi vp" | cowsay | lolcatjs'

# 静默模式
vpx -s create-vue my-app
```

## 查找顺序

当 `vpx` 被调用时：

1. **从 cwd 开始向上查找** `node_modules/.bin/<cmd>`
   - 检查 `./node_modules/.bin/<cmd>`
   - 检查 `../node_modules/.bin/<cmd>`
   - 一直继续，直到到达文件系统根目录
2. **检查 vp 全局包**（通过 `vp install -g` 安装）
   - 使用 `BinConfig` 以 O(1) 查询哪个包提供该二进制文件
   - 使用安装时所用的 Node.js 版本执行
3. **检查系统 PATH**（排除 vite-plus bin 目录）
   - 过滤掉 `~/.vite-plus/bin/`，以避免找到 vite-plus 的 shim
   - 在不下载的情况下查找 `git`、`cargo` 等命令
4. **通过 `vp dlx` 的行为回退到远程下载**（通过检测到的包管理器进行远程下载）

在执行任何找到的二进制文件之前，`vpx` 会将所有 `node_modules/.bin` 目录（从 cwd 向上）前置到 PATH，以便子进程也优先解析本地二进制文件。

### 特殊情况

- 当指定了版本时（例如 `vpx eslint@9`），会跳过本地/全局/PATH 查找——始终使用远程
- 当只指定包名而未指定版本时（例如 `vpx eslint`），如果本地可用则优先使用本地
- Shell 模式（`-c`）会跳过本地/全局/PATH 查找，并直接委派给 `vp dlx`
- `--package` 标志会跳过本地/全局/PATH 查找，并直接委派给 `vp dlx`

## 命令之间的关系

| 命令  | 本地查找 | 全局查找 | PATH 查找 | 远程下载 | 使用场景                                          |
| -------- | ------------ | ------------- | ----------- | --------------- | ------------------------------------------------- |
| `vpx`    | 是（第 1）    | 是（第 2）     | 是（第 3）   | 是（回退）      | 运行本地、全局、PATH 或远程包二进制文件 |
| `vp dlx` | 否           | 否            | 否          | 始终          | 始终从注册表获取最新版本                 |

### 何时使用哪一个

- **`vpx eslint .`** — “运行 eslint，优先使用我的本地版本”
- **`vp dlx create-vue my-app`** — “从注册表下载并运行 create-vue”
- **`vpx create-vue my-app`** — 实际上与 `vp dlx` 相同，因为 `create-vue` 从未安装到本地。

## 二进制实现

### 符号链接方案

`vpx` 作为指向 `vp` 的符号链接分发，并通过 `argv[0]` 检测：

```
~/.vite-plus/bin/vpx → ~/.vite-plus/bin/vp   (symlink)
```

这遵循了 `node`、`npm` 和 `npx` shim 已经使用的相同模式。

### 检测

在 `shim/mod.rs` 中，当 `argv[0]` 解析为 `vpx` 时：

```rust
let argv0_tool = extract_tool_name(argv0);
if argv0_tool == "vpx" {
    return Some("vpx".to_string());
}
```

在 `shim/dispatch.rs` 中，`vpx` 会被提前处理并委托给 `commands/vpx.rs`：

```rust
if tool == "vpx" {
    return crate::commands::vpx::execute_vpx(args, &cwd).await;
}
```

### Windows

在 Windows 上，`vpx.exe` 是一个跳板可执行文件（与现有的 `node.exe`、`npm.exe`、`npx.exe` shim 保持一致）。它从自身文件名（`vpx`）检测工具名，设置 `VP_SHIM_TOOL=vpx`，并启动 `vp.exe`。参见 [RFC: 用于 Shims 的跳板 EXE](./trampoline-exe-for-shims.md)。

### 设置

`vp env setup` 命令会在现有 shim 旁创建 `vpx` 符号链接/包装器：

```
~/.vite-plus/bin/
├── vp          → ../current/bin/vp
├── vpx         → vp                   ← 新增
├── node        → vp
├── npm         → vp
└── npx         → vp
```

## 与 npx 的比较

| 行为                | `npx`                                      | `vpx`                                              |
| ------------------- | ------------------------------------------ | -------------------------------------------------- |
| 本地查找            | 向上查找 `node_modules/.bin`                | 向上查找 `node_modules/.bin`                        |
| 全局查找            | 检查 npm 全局安装                           | 检查 vp 全局包（`vp install -g`）                   |
| PATH 查找           | 检查系统 PATH                              | 检查系统 PATH（不包括 `~/.vite-plus/bin/`）         |
| 远程回退            | 下载到 npm 缓存                             | 委托给 `vp dlx`（使用检测到的包管理器）             |
| 确认提示            | 安装未知包前提示用户                        | 自动确认（类似带 `--yes` 的 `vp dlx`）              |
| `--package` 标志    | 指定额外包                                 | 相同                                               |
| Shell 模式（`-c`）  | 在 shell 中运行，包可在 PATH 中使用          | 相同                                               |
| 缓存                | npm 缓存                                    | 包管理器的缓存（通过 `vp dlx`）                    |

### 主要区别：自动确认

`npx` 会在下载未知包之前提示用户。`vpx` 始终自动确认（与 `vp dlx` 的行为以及 pnpm 的做法一致）。这避免了不同包管理器之间出现不一致的行为。

## 设计决策

### 1. 为什么向上遍历目录

**决策**：从 cwd 开始一路向上遍历到文件系统根目录，查找 `node_modules/.bin`，行为类似 `npx`。

**理由**：

- 在 monorepo 中，命令可能安装在工作区根目录，而不是当前包下
- `npx` 会向上遍历目录——这种行为符合开发者预期
- `pnpm exec` 只查找 `./node_modules/.bin`——对 monorepo 来说过于受限

### 2. 为什么 `vpx` 要与 `vp dlx` 分开

**决策**：将 `vpx`（优先本地）和 `vp dlx`（仅远程）作为两个独立命令保留。

**理由**：

- 心智模型不同：“运行我已有的” vs “下载并运行”
- `vp dlx` 已经存在，并且具有明确的仅远程行为——更改它会破坏用户预期
- 显式优于隐式——开发者应当自行选择意图

### 3. 为什么 `vpx` 是符号链接

**决策**：`vpx` 是指向 `vp` 的符号链接，而不是单独的二进制文件。

**理由**：

- 不会增加额外的二进制体积
- 与 `node`/`npm`/`npx` 的 shim 使用相同模式——这是经过验证的方法
- `argv[0]` 检测已在 `shim/mod.rs` 中实现
- 升级时只需更新一个二进制文件

### 4. 为什么不添加 `vp exec` 子命令

**决策**：目前只提供独立的 `vpx` 命令，不提供 `vp exec` 子命令。

**理由**：

- `vpx` 已覆盖主要用例——快速执行本地/远程二进制文件
- 添加 `vp exec` 会引入复杂性（带 `--` 分隔符的参数解析，可能与 `vp env exec` 混淆）
- 如果需要，之后可以作为后续功能再添加 `vp exec`
- 保持初始实现简单且聚焦。

## 边缘情况

### Monorepo 子包

当从 `packages/app/` 运行 `vpx eslint` 时：

```
monorepo/
├── node_modules/.bin/eslint    ← 在这里找到（工作区根目录）
├── packages/
│   └── app/
│       └── node_modules/.bin/  ← 先检查这里（为空）
└── package.json
```

查找器会从 cwd 继续向上查找，直到找到二进制文件或到达文件系统根目录。

### 原生二进制与 JS 二进制

`node_modules/.bin` 中的原生（已编译）二进制和 JS 二进制都受支持。查找过程只检查文件是否存在以及是否可执行，不检查文件类型。

对于全局安装的包，元数据会跟踪某个二进制是否为 JavaScript（`PackageMetadata` 中的 `js_bins` 字段）。JS 二进制通过 `node <path>` 执行，而原生二进制则直接执行。

### 平台差异

- **Unix**：`node_modules/.bin/<cmd>` 通常是指向包的 bin 脚本的符号链接
- **Windows**：`node_modules/.bin/<cmd>.cmd` 包装脚本 —— 查找时会检查 `.cmd` 扩展名

### 版本不匹配

```bash
# 本地 eslint 是 v8，但用户想要 v9
vpx eslint@9 .
# → 已指定版本，因此跳过本地/全局/PATH 查找 → 委托给 vp dlx
```

当在包规范中显式指定了版本时，命令会跳过所有本地解析，并始终使用远程下载。

## 实现架构

### 1. Shim 检测

**文件**: `crates/vp_global_cli/src/shim/mod.rs`

在 `detect_shim_tool()` 中添加对 `vpx` 的识别：

```rust
let argv0_tool = extract_tool_name(argv0);
if argv0_tool == "vp" {
    return None;
}
if argv0_tool == "vpx" {
    return Some("vpx".to_string());
}
```

### 2. 分发处理器

**文件**: `crates/vp_global_cli/src/shim/dispatch.rs`

在分发逻辑中处理 `vpx`（委托给 `commands/vpx.rs`）：

```rust
if tool == "vpx" {
    return crate::commands::vpx::execute_vpx(args, &cwd).await;
}
```

分发模块还将以下辅助函数暴露为 `pub(crate)`，供 vpx 复用：

- `find_package_for_binary()` — 查找哪个全局安装的包提供了某个二进制文件
- `locate_package_binary()` — 在包内定位实际的二进制路径
- `ensure_installed()` — 确保已下载 Node.js 版本
- `locate_tool()` — 在 Node.js 安装中定位工具二进制文件

### 3. 二进制解析（`commands/vpx.rs`）

**文件**: `crates/vp_global_cli/src/commands/vpx.rs`

解析顺序（当没有版本规格、没有 `--package` 标志且不是 shell 模式时）：

```rust
// 1. 本地 node_modules/.bin — 从 cwd 向上遍历
if let Some(local_bin) = find_local_binary(cwd, &cmd_name) { ... }

// 2. 全局 vp 包 — 使用 dispatch::find_package_for_binary()
if let Some(global_bin) = find_global_binary(&cmd_name).await { ... }

// 3. 系统 PATH — 使用经过过滤的 PATH 调用 which::which_in()
if let Some(path_bin) = find_on_path(&cmd_name) { ... }

// 4. 远程下载 — 委托给 DlxCommand
```

在执行任何找到的二进制文件之前，`prepend_node_modules_bin_to_path()` 会从 cwd 向上遍历，并将所有已存在的 `node_modules/.bin` 目录追加到 PATH 前面。

### 4. 设置

**文件**: `crates/vp_global_cli/src/commands/env/setup.rs`

在创建 shim 时添加 `vpx`：

```rust
// 在创建 vp 符号链接后，同时创建 vpx
create_symlink(&bin_dir.join("vpx"), &bin_dir.join("vp")).await?;
```

### 5. 复用现有的 `DlxCommand`

远程回退路径将完全委托给现有的 `DlxCommand`，它负责包管理器检测、命令解析和执行。`vp dlx` 的行为无需更改。

## CLI 帮助输出

```bash
$ vpx --help
从本地或远程 npm 包中执行命令

用法: vpx [OPTIONS] <pkg[@version]> [args...]

参数:
  <pkg[@version]>  要执行的包二进制文件
  [args...]        传递给命令的参数

选项:
  -p, --package <NAME>  如果本地未找到则安装的包
  -c, --shell-mode      在 shell 环境中执行命令
  -s, --silent          除命令输出外，抑制所有输出
  -h, --help            打印帮助信息

示例:
  vpx eslint .                                           # 运行本地 eslint（或下载）
  vpx create-vue my-app                                  # 下载并运行 create-vue
  vpx typescript@5.5.4 tsc --version                     # 运行特定版本
  vpx -p cowsay -c 'echo "hi" | cowsay'                  # 带包的 shell 模式
```

## 错误处理

### 缺少命令

```bash
$ vpx
错误：vpx 需要一个要运行的命令

用法：vpx <pkg[@version]> [args...]

示例：
  vpx eslint .
  vpx create-vue my-app
```

### 本地或全局未找到（回退到远程）

```bash
$ vpx some-tool --version
# 在 node_modules/.bin、全局包或 PATH 中未找到
# 通过 vp dlx 回退到远程下载
正在运行：pnpm dlx some-tool --version
some-tool v1.2.3
```

### 没有 package.json

```bash
$ cd /tmp
$ vpx cowsay hello
# 没有 package.json — vpx 委托给 vp dlx，而 vp dlx 在无法检测到包管理器时会回退到 npx
 _______
< hello >
 -------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

`vpx` 能在没有 `package.json` 的目录中工作，因为当无法检测到包管理器时，`vp dlx` 会回退到 `npx`。

### 远程包未找到

```bash
$ vpx non-existent-package-xyz
# 任何地方都未找到，远程下载也失败
正在运行：pnpm dlx non-existent-package-xyz
 ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND  未找到 package.json
退出代码：1
```

## 安全注意事项

1. **优先使用本地更安全**：`vpx` 优先使用本地二进制文件，这降低了对已经作为项目依赖的包运行意外远程代码的风险。

2. **全局包是可信的**：通过 `vp install -g` 全局安装的包是用户明确安装的，因此执行它们是安全的。

3. **PATH 查找会排除 vite-plus shim**：PATH 搜索会过滤掉 `~/.vite-plus/bin/`，以防止 `vpx` 找到它自己或其他受管理的 shim。

4. **远程时自动确认**：在回退到远程下载时，`vpx` 会自动确认（类似 `vp dlx`）。这意味着未知包会在不提示的情况下被下载——这与 `vp dlx` 的行为一致。

5. **版本锁定**：指定明确版本（例如 `vpx eslint@9`）会绕过所有本地解析，并始终从 registry 下载，确保使用的是请求的确切版本。

## 向后兼容性

这是一个没有破坏性变更的新功能：

- `vp dlx` 的行为完全没有变化
- `vpx` 二进制文件是由 `vp env setup` 创建的新符号链接
- 现有的 `node`/`npm`/`npx` shim 不受影响
- 配置格式没有任何变化。

## 未来增强

### 1. `vp exec` 子命令

添加 `vp exec` 作为一种从 `vp` 内部调用 `vpx` 的替代方式，并使用 `--` 分隔符进行参数解析（类似 `npm exec`）。

### 2. 感知工作区的查找

```bash
vpx --workspace=app eslint .    # 先查找 app 的 node_modules
```

### 3. 仅本地 / 仅远程 模式

```bash
vpx --prefer-local eslint .     # 只使用本地，从不下载
vpx --prefer-remote eslint .    # 始终下载，忽略本地
```

## 结论

本 RFC 提议添加 `vpx`，以完善 Vite+ 中的包执行故事：

- `vp dlx` — 始终远程（类似 `pnpm dlx`）
- `vpx` — 先本地优先，再回退到全局和 PATH，最后远程（类似 `npx`）

该设计：

- 遵循已建立的 `npx` 约定，提供熟悉的开发者体验
- 复用现有的 `vp dlx` 基础设施来处理远程回退路径
- 使用经过验证的符号链接 + `argv[0]` 检测模式进行分发
- 保持本地优先（`vpx`）与仅远程（`vp dlx`）之间清晰的职责分离
- 仅为新增功能，不会破坏现有行为。
