# RFC：用于 Shims 的 Windows 跳板 `.exe`

## 状态

已实现。

## 摘要

将所有 shim 工具（`vp`、`node`、`npm`、`npx`、`vpx`、`vpr` 以及全局安装的软件包二进制文件）的 Windows `.cmd` 包装器脚本替换为轻量级的跳板 `.exe` 二进制文件。这消除了用户按下 Ctrl+C 时出现的 `Terminate batch job (Y/N)?` 提示，并提供与直接调用 `.exe` 相同的干净信号行为。

## 动机

### 问题

在 Windows 上，vite-plus CLI 之前通过 `.cmd` 批处理包装文件暴露工具：

```
~/.vite-plus/bin/
├── vp.cmd          → 调用 current\bin\vp.exe
├── node.cmd        → 调用 vp.exe env exec node
├── npm.cmd         → 调用 vp.exe env exec npm
├── npx.cmd         → 调用 vp.exe env exec npx
└── ...
```

当用户在通过 `.cmd` 包装器运行的命令执行期间按下 Ctrl+C 时，`cmd.exe` 会拦截该信号并显示：

```
Terminate batch job (Y/N)?
```

这是 Windows 上批处理文件执行的一个根本限制。该提示：

- 打断了用户期望的正常 Ctrl+C 工作流
- 可能出现多次（链中的每个 `.cmd` 都会出现一次）
- 与 Unix 行为不同，Unix 中 Ctrl+C 会干净地终止进程
- 无法在批处理文件内部被抑制

### 已确认的行为

如 [issue #835](https://github.com/voidzero-dev/vite-plus/issues/835) 所示：

1. 运行 `vp dev`（通过 `vp.cmd`）时，按下 Ctrl+C 会显示 `Terminate batch job (Y/N)?`
2. 直接运行 `<DATA>/current/bin/vp.exe dev` 时**不会**显示该提示
3. 运行 `npm.cmd run dev` 时会显示该提示；运行 `npm.ps1 run dev` 时不会
4. 当 `.cmd` 包装器相互链式调用时（例如 `vp.cmd` → `npm.cmd`），该提示可能出现多次

### 为什么 `.ps1` 脚本不够用

PowerShell `.ps1` 脚本可以避免 Ctrl+C 问题，但有关键限制：

- `where.exe` 和 `which` 不会将 `.ps1` 文件识别为可执行文件
- 只能在 PowerShell 中工作，不能在 `cmd.exe`、Git Bash 或其他 shell 中工作
- 不能作为通用 shim 使用

## 架构

本 RFC 使用[目录布局 RFC](./directory-layout.md)中的 `<BIN>`、`<DATA>` 和 `<CACHE>` 根目录。

### Unix（基于符号链接——不变）

在 Unix 上，shims 是指向 `vp` 二进制文件的符号链接。二进制文件通过 `argv[0]` 检测工具名称：

```
<BIN>/
├── vp       → <DATA>/current/bin/vp     (symlink)
├── node     → <DATA>/current/bin/vp     (symlink)
├── npm      → <DATA>/current/bin/vp     (symlink)
├── npx      → <DATA>/current/bin/vp     (symlink)
├── vpx      → <DATA>/current/bin/vp     (symlink)
└── vpr      → <DATA>/current/bin/vp     (symlink)
```

### Windows（跳板 `.exe` 文件）

```
<BIN>/
├── vp.exe       # Trampoline executable
├── vp.shim      # Directory-layout sidecar for vp.exe
├── node.exe     # Trampoline executable
├── node.shim    # Directory-layout sidecar for node.exe
├── npm.exe      # Trampoline executable
├── npm.shim     # Directory-layout sidecar for npm.exe
└── ...

<DATA>/current/bin/
├── vp.exe       # Main CLI binary
└── vp-shim.exe  # Trampoline template
```

每个跳板都是 `vp-shim.exe` 的副本。每个副本都有一个与其文件主名相同的 sidecar。例如，`node.exe` 会读取 `node.shim`。工具名称不会存储在 sidecar 中。

拆分布局的 sidecar 格式如下：

```text
vite-plus-shim-v1
layout=split
data=C:\Users\alice\AppData\Local\vite-plus\data
cache=C:\Users\alice\AppData\Local\vite-plus\cache
```

使用 `VP_HOME=C:\Tools\vite-plus` 的安装采用单根布局：

```text
vite-plus-shim-v1
layout=single-root
data=C:\Tools\vite-plus
cache=C:\Tools\vite-plus\cache
```

必须使用准确的 `vite-plus-shim-v1` 标头。跳板和所有权检查会拒绝未版本化的 sidecar。sidecar 是布局的事实来源，同时也记录相邻的可执行文件由 Vite+ 所有。

**注意**：通过 `npm install -g` 安装的包仍然使用 `.cmd` 包装器，因为它们缺少 `PackageMetadata`，并且需要直接指向 npm 生成的脚本。

## 实现

### Crate 结构

```
crates/vp_trampoline/
├── Cargo.toml           # Package settings and release profile
├── Cargo.lock           # Lockfile for this standalone crate
├── .cargo/
│   └── config.toml      # build-std and artifact directory settings
├── src/
│   ├── main.rs          # Entry points and portable implementation
│   ├── win.rs           # Raw Win32 code for the no_main entry point
│   └── cmdline.rs       # Portable parsers and tests
```

根目录的 `Cargo.toml` 会将此 crate 排除在工作区之外。由于以下两个原因，该 crate 必须位于工作区之外：

- 发布配置将 `panic` 设置为 `"immediate-abort"`。Cargo 会忽略按软件包设置的配置覆盖中的 `panic`。因此，该 crate 需要单独的配置。
- 该 crate 本地的 `.cargo/config.toml` 启用了 build-std。Cargo 只有在从 crate 目录运行时才会读取此文件。

在仓库根目录中运行：

```bash
node packages/tools/src/build-trampoline.ts --release [--target <triple>]
```

crate 配置会将构建产物存储在仓库的 `target/` 目录中。它设置 `target-dir = "../../target"`。CI 和 `install-global-cli` 会在与工作区二进制文件相同的目录中查找 `vp-shim.exe`。构建使用固定版本的 nightly 工具链和 `rust-src` 组件。仓库的 `rust-toolchain.toml` 提供这两项内容。

### 跳板二进制文件

跳板没有外部依赖。它将所有 Win32 调用声明为来自 KERNEL32 的原始 `extern "system"` 函数。因此，它不使用 `windows` 或 `windows-core` crate。它也不使用 `core::fmt`。诊断信息使用 `WriteFile` 和一个小型十进制格式化器。

在 Windows 上，二进制文件使用 `#![no_main]` 并导出 `mainCRTStartup`。因此，CRT 启动过程和 `std` 运行时不会初始化。`src/win.rs` 使用以下流程：

1. `GetModuleFileNameW` 返回 shim 路径和工具名称。代码将 `.exe` 扩展名替换为 `.shim`，以查找 sidecar。
2. `CreateFileW` 和 `ReadFile` 读取 UTF-8 sidecar。`GetFullPathNameW` 将长路径转换为绝对路径。随后代码添加 `\\?\` 驱动器前缀或 `\\?\UNC\` 网络前缀。解析器要求存在版本化标头，并接受 `single-root` 和 `split` 布局。
3. `SetEnvironmentVariableW` 设置目录布局。单根指针会设置 `VP_HOME`。拆分指针会移除 `VP_HOME`。代码会设置 `VP_DATA_DIR`、`VP_BIN_DIR` 和 `VP_CACHE_DIR`。工具 shim 还会设置 `VP_SHIM_TOOL`。它们会保留 `VP_PATH_INJECTED_TOOLS`，以便复用特定工具的 PATH。
4. 子命令行以 `"<DATA>\current\bin\vp.exe"` 开始。代码会将原始的 `GetCommandLineW` 文本追加到程序参数之后。它使用 MSVC 的 `argv[0]` 规则。引号会开始或结束引用模式。反斜杠不会转义字符。这样可以保留调用方传入的完整 UTF-16 参数文本。
5. `SetConsoleCtrlHandler` 安装一个忽略 Ctrl+C 和 Ctrl+Break 的处理器。子进程会处理这些事件。
6. `CreateProcessW` 使用继承的句柄和启动信息启动子进程。负载和 sidecar 路径使用相同的扩展长度规范化。如果父进程重定向标准 I/O，代码会使标准句柄可继承。它会在 `CreateProcessW` 之前执行此操作，与 uv-trampoline 和 distlib 的做法一致。
7. `WaitForSingleObject` 等待子进程。`GetExitCodeProcess` 读取其退出码。`ExitProcess` 原样返回该退出码。

对于关键的启动失败，跳板会报告失败的操作和适用的路径。如果 Windows 提供了错误代码，它也会包含该错误代码。如果缺少 `vp.exe`，它会提示用户重新安装 Vite+ 或运行 `vp env setup`。

非 Windows 实现使用 `std::process::Command`。可移植测试使用相同的 sidecar 解析器。Unix shims 是符号链接，不使用此二进制文件。解析器会拒绝缺失、格式错误和未版本化的 sidecar。它不会根据目录路径推断布局。

### 大小优化

| 技术                                                                    | 状态 |
| ----------------------------------------------------------------------- | ---- |
| 零外部依赖（原始 FFI，不使用 `windows` crate）                           | 完成 |
| 不使用 `core::fmt`（通过 `WriteFile` + 手动十进制格式化器输出诊断信息） | 完成 |
| 独立配置：`opt-level="z"`、`lto="fat"`、`codegen-units=1`、`strip`     | 完成 |
| build-std：使用此配置重新编译 `std`（`-Zbuild-std`）                   | 完成 |
| `panic = "immediate-abort"`（无 panic 格式化、展开和回溯）              | 完成 |
| `#![no_main]` + `mainCRTStartup`（无 CRT 启动和 `std` 运行时初始化）    | 完成 |
| 使用原始 `CreateProcessW`，而不是 `std::process::Command`                | 完成 |

**二进制大小**：在 x86_64-pc-windows-msvc 和 aarch64-pc-windows-msvc 上均为 14,336 B。此大小包含 sidecar 解析器和诊断信息。x86_64 上的 `std::process::Command` 实现大小为 221,696 B。所有测量结果请参阅“大小测量和构建限制”。该可执行文件只导入 KERNEL32。

### 环境变量

sidecar 控制由 `vp.exe` 继承的目录环境：

| 变量                     | 适用情况               | 跳板操作                                         |
| ------------------------ | ---------------------- | ------------------------------------------------ |
| `VP_HOME`                | 单根布局               | 从 sidecar 数据根目录设置所有 Vite+ 目录         |
| `VP_HOME`                | 拆分布局               | 移除该值，使其无法覆盖单独的根目录               |
| `VP_DATA_DIR`            | 拆分布局               | 设置负载和状态根目录                             |
| `VP_BIN_DIR`             | 拆分布局               | 设置包含 shim 的目录                             |
| `VP_CACHE_DIR`           | 拆分布局               | 设置缓存根目录                                   |
| `VP_SHIM_TOOL`           | 工具 shim，`vp` 除外   | 选择用于 shim 分派的指定工具                     |
| `VP_PATH_INJECTED_TOOLS` | 工具 shim               | 保留已经注入 PATH 的工具                         |

### Ctrl+C 处理

trampoline 安装一个返回 `TRUE`（1）的控制台控制处理器：

1. 当按下 Ctrl+C 时，Windows 会向**同一控制台组中的所有进程**发送 `CTRL_C_EVENT`
2. trampoline 的处理器返回 1（TRUE）→ trampoline 保持存活
3. 子进程（`vp.exe` → Node.js）接收到**同样的**事件
4. 子进程决定如何处理它（通常会优雅退出）
5. trampoline 检测到子进程退出并传播其退出码

**不会出现 “Terminate batch job?” 提示**，因为这里没有使用批处理文件。

### 与 Shim 检测的集成

`shim/mod.rs` 中的 `detect_shim_tool()` 会先检查 `VP_SHIM_TOOL`，然后才检查 `argv[0]`：

```
Trampoline (node.exe + node.shim)
  → loads the recorded directory layout
  → sets VP_SHIM_TOOL=node and the directory variables
  → preserves VP_PATH_INJECTED_TOOLS
  → spawns <DATA>/current/bin/vp.exe with the original argument tail
    → detect_shim_tool() reads env var → "node"
    → dispatch("node", args)
    → 解析 Node.js 版本，执行真实的 node
```

### 运行中的 exe 覆盖

当通过 trampoline（`<BIN>/vp.exe`）调用 `vp env setup --refresh` 时，trampoline 仍在运行。Windows 不允许覆盖正在运行的 `.exe`。解决方案：

1. 将现有的 `vp.exe` 重命名为 `vp.exe.<unix_timestamp>.old`
2. 将新的 trampoline 复制为 `vp.exe`
3. 尽力清理 bin 目录中所有 `*.old` 文件

### 升级刷新

在 `vp upgrade` 期间，在 `current` 链接切换到新版本后，会调用 `vp env setup --refresh` 来重新生成所有 trampoline `.exe` 文件。这样可确保当版本之间的 trampoline 二进制文件（`vp-shim.exe`）发生变化时，所有 shims 都能获取到新版本：

1. **Core shims**（`vp.exe`、`node.exe`、`npm.exe`、`npx.exe`、`vpx.exe`、`vpr.exe`）由标准的 `--refresh` 逻辑刷新。
2. **Package shims**（例如通过 `vp install -g` 安装的 `tsc.exe`、`eslint.exe`）会通过扫描 `<DATA>/bins/`，查找 `source: Vp` 的 `BinConfig` 条目来发现，并将每个 `.exe` 替换为新的 trampoline。

通过 npm 拦截安装的包 shims（`source: Npm`）使用的是 `.cmd` 包装器，而不是 trampoline `.exe` 文件，因此不受此刷新影响。

此外，重新安装全局包（`vp install -g <pkg>`）时总会重新复制当前 trampoline，因此即使没有完整升级，shim 也能保持最新。

### 分发

trampoline 二进制文件（`vp-shim.exe`）与 `vp.exe` 一起分发：

```
<DATA>/current/bin/
├── vp.exe          # Main CLI binary
└── vp-shim.exe     # Trampoline template (copied as shims)
```

包含于：

- 平台 npm 包（`@voidzero-dev/vite-plus-cli-win32-x64-msvc`）
- 发布工件（`.github/workflows/release.yml`）
- `install.ps1` 和 `install.sh`（本地开发与下载路径均包括）
- 升级路径中的 `extract_platform_package()`

### Pre-Trampoline Release Fallback

在安装一个不含 trampoline 的旧版本（包中没有 `vp-shim.exe`）时：

- `install.ps1` 会回退为创建 `.cmd` + shell 脚本包装器
- 会移除较新安装中残留的 trampoline `.exe` shims（在 Windows PATH 上，`.exe` 优先于 `.cmd`）

## 与 uv-trampoline 的比较

| 方面               | uv-trampoline                            | vite-plus trampoline                 |
| ------------------ | ---------------------------------------- | ------------------------------------ |
| **用途**           | 使用嵌入式脚本启动 Python                 | 转发到 `vp.exe`                      |
| **复杂度**         | 高（PE 资源、zipimport）                 | 低（文件名 + spawn）                 |
| **数据嵌入**       | PE 资源（类型、路径、脚本 ZIP）           | 相邻的目录布局 sidecar               |
| **依赖**           | `windows` crate（不安全、无 CRT）         | 无（原始 FFI 声明）                  |
| **工具链**         | Nightly Rust（`panic="immediate-abort"`） | Nightly Rust（相同技术）             |
| **二进制大小**     | 39-47 KiB                                | 14 KiB                               |
| **入口点**         | `#![no_main]` + `mainCRTStartup`         | `#![no_main]` + `mainCRTStartup`     |
| **错误输出**       | `ufmt`（无 `core::fmt`）                 | `WriteFile` + Win32 错误代码         |
| **Ctrl+C 处理**    | `SetConsoleCtrlHandler` → ignore         | `SetConsoleCtrlHandler` → ignore     |
| **退出码**         | `GetExitCodeProcess` → `exit()`          | `GetExitCodeProcess` → `ExitProcess` |

Vite+ trampoline 更小，因为它不嵌入 PE 资源。它只规范化较长的 sidecar 和负载路径。它不需要作业对象或 GUI 子系统支持。它会读取文件旁边的小型 sidecar，在记录的数据根目录下查找 `vp.exe` 并启动它。两个项目使用相同的构建方法和入口点结构。

## 备选方案

### 1. NTFS 硬链接（已拒绝）

硬链接解析到物理文件 inode，而不是通过目录联接。`vp` 升级后重新指向 `current` 时，`bin/` 中的硬链接仍然会引用旧二进制。

### 2. Windows 符号链接（已拒绝）

需要管理员权限或开发者模式。对所有用户都不可靠。

### 3. PowerShell `.ps1` 脚本（已拒绝）

`where.exe` 和 `which` 无法找到 `.ps1` 文件。只在 PowerShell 中可用。

### 4. 将 `vp.exe` 复制为每个 shim（已拒绝）

每个副本约 5-10MB。trampoline 只用 14 KiB 就能实现相同结果。

### 5. 用 `windows` crate 做 FFI（已拒绝）

仅为一次 `SetConsoleCtrlHandler` 调用就会让二进制增加约 100KB。原始 FFI 声明已经足够。

## 大小测量和构建限制

我们使用 cargo-xwin 构建了以下每个变体。每个变体均在 x86_64-pc-windows-msvc 上测量。前两行使用支持 sidecar 的 `std` 实现。接下来的五行展示了早期的固定布局实验。最后一行展示当前支持 sidecar 的原始实现。

| 变体                                                                      | 工具链  | 大小      |
| ------------------------------------------------------------------------- | ------- | --------- |
| 支持 Sidecar 的 `std::process::Command`，预编译 `std`                    | stable  | 221,696 B |
| 相同源码 + build-std + `panic="immediate-abort"`                         | nightly | 82,432 B  |
| 固定布局 `std` 源码 + `#![no_main]` + `mainCRTStartup` + `atexit` 存根   | nightly | 69,632 B  |
| 原始 Win32 重写、普通 `main`、stable、不使用 build-std                   | stable  | 105,984 B |
| 原始 Win32 重写、普通 `main` + build-std                                | nightly | 13,824 B  |
| 原始 Win32 重写 + `#![no_main]`，无诊断信息                              | nightly | 6,656 B   |
| 固定布局原始 Win32 + `#![no_main]` + 完整诊断信息                        | nightly | 8,192 B   |
| 支持 Sidecar 的原始 Win32 + `#![no_main]` + 完整诊断信息（已发布）       | nightly | 14,336 B  |

作为比较，uv-trampoline x64 控制台二进制文件为 45,056 B。默认的 Scoop kiennq shim 为 136,192 B，并使用静态链接的 MSVC C。Scoop 还曾添加后又移除了一个 317,952 B 的 Rust shim。

### 构建限制

1. **`atexit` 链接失败**：当前的 nightly 工具链通过 C `atexit` 注册 TLS 清理。使用 `#![no_main]` 时，该符号会链接 `msvcrt.lib(utility.obj)`。随后链接会因未定义的 `__vcrt_*` 和 `__acrt_*` CRT 初始化符号而失败。导出以下无操作函数：

   ```rust
   extern "C" fn atexit(...) -> i32 { 0 }
   ```

   请参阅 `src/win.rs`。trampoline 不会在进程退出时运行 TLS 析构函数。文档中的 `rustc-link-lib=ucrt` 解决方法无法修复此链接问题。请参阅 rust-lang/rust#143172。uv 使用的较旧 nightly 工具链不会注册 `atexit`。

2. **子系统**：`#![no_main]` 需要 `#![windows_subsystem = "console"]`。没有此属性时，lld 会报告未定义子系统。
3. **静态 CRT**：不要使用 `+crt-static`。它会链接静态 CRT，并使二进制大小增加到约 115 KiB。
4. **开发配置**：使用 `opt-level = 1` 和 LTO。在 `opt-level = 0` 下，编译器可能会引用 MSVC 辅助函数 `__CxxFrameHandler3`。即使使用 `panic = "immediate-abort"`，这也会导致链接失败。uv 使用相同的配置。

### 剩余选项

- 使用带有 `JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE` 的作业对象分配子进程。uv 使用此选项。它会使 Windows 在停止 shim 时停止子进程，但会使二进制大小增加几 KiB。
- 提交可复现的 trampoline 二进制文件。uv 提交经过 `/Brepro` 规范化的可执行文件，并在 CI 中逐字节比较。此选项可以将 shim 与工具链变化隔离开来。

## 参考

- [Issue #835](https://github.com/voidzero-dev/vite-plus/issues/835)：包含视频复现的原始功能请求
- [uv-trampoline](https://github.com/astral-sh/uv/tree/main/crates/uv-trampoline)：由 astral-sh 提供的参考实现。它使用工作区排除、build-std、`panic="immediate-abort"`、cargo-xwin、`#![no_main]` 和原始 Win32。其 CI 会拒绝 `core::fmt` 和 `std::panicking` 符号。
- [Scoop shims](https://github.com/ScoopInstaller/Scoop/tree/master/supporting/shims)：来自 kiennq/scoop-better-shimexe 的原生 C shim 和 C# .NET shim。C shim 为 136 KiB。C# shim 为 9.7 KiB。相邻的 `.shim` 文件指定启动目标。
- [RFC：env-command](./env-command.md)：Shim 架构文档
- [RFC：upgrade-command](./upgrade-command.md)：升级／回滚流程
