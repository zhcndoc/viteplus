# RFC：用于 Shims 的 Windows Trampoline `.exe`

## 状态

已实现

## 摘要

将 Windows 上的 `.cmd` 包装脚本替换为轻量级 trampoline `.exe` 二进制文件，适用于所有 shim 工具（`vp`、`node`、`npm`、`npx`、`corepack`、`vpx`、`vpr` 以及全局安装的包二进制文件）。这消除了用户按下 Ctrl+C 时出现的 `Terminate batch job (Y/N)?` 提示，并为直接调用 `.exe` 提供了同样干净的信号行为。

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
2. 直接运行 `~/.vite-plus/current/bin/vp.exe dev` **不会** 显示该提示
3. 运行 `npm.cmd run dev` 会显示该提示；运行 `npm.ps1 run dev` 则不会
4. 当 `.cmd` 包装器串联时（例如 `vp.cmd` → `npm.cmd`），该提示可能出现多次

### 为什么 `.ps1` 脚本不够用

PowerShell `.ps1` 脚本可以避免 Ctrl+C 问题，但有关键限制：

- `where.exe` 和 `which` 不会将 `.ps1` 文件识别为可执行文件
- 只能在 PowerShell 中工作，不能在 `cmd.exe`、Git Bash 或其他 shell 中工作
- 不能作为通用 shim 使用

## 架构

### Unix（基于符号链接 — 不变）

在 Unix 上，shims 是指向 `vp` 二进制文件的符号链接。二进制文件通过 `argv[0]` 检测工具名称：

```
~/.vite-plus/bin/
├── vp       → ../current/bin/vp     （符号链接）
├── node     → ../current/bin/vp     （符号链接）
├── npm      → ../current/bin/vp     （符号链接）
├── npx      → ../current/bin/vp     （符号链接）
├── corepack → ../current/bin/vp     （符号链接）
├── vpx      → ../current/bin/vp     （符号链接）
└── vpr      → ../current/bin/vp     （符号链接）
```

### Windows（Trampoline `.exe` 文件）

```
~/.vite-plus/bin/
├── vp.exe       # Trampoline → 启动 current\bin\vp.exe
├── node.exe     # Trampoline → 设置 VITE_PLUS_SHIM_TOOL=node，启动 vp.exe
├── npm.exe      # Trampoline → 设置 VITE_PLUS_SHIM_TOOL=npm，启动 vp.exe
├── npx.exe      # Trampoline → 设置 VITE_PLUS_SHIM_TOOL=npx，启动 vp.exe
├── corepack.exe # Trampoline → 设置 VITE_PLUS_SHIM_TOOL=corepack，启动 vp.exe
├── vpx.exe      # Trampoline → 设置 VITE_PLUS_SHIM_TOOL=vpx，启动 vp.exe
├── vpr.exe      # Trampoline → 设置 VITE_PLUS_SHIM_TOOL=vpr，启动 vp.exe
└── tsc.exe      # Trampoline → 设置 VITE_PLUS_SHIM_TOOL=tsc，启动 vp.exe（包 shim）
```

每个 trampoline 都是 `vp-shim.exe` 的副本（与 `vp.exe` 一起分发的模板二进制文件）。

**注意**：通过 `npm install -g` 安装的包仍然使用 `.cmd` 包装器，因为它们缺少 `PackageMetadata`，并且需要直接指向 npm 生成的脚本。

## 实现

### Crate 结构

```
crates/vite_trampoline/
├── Cargo.toml      # 零外部依赖
├── src/
│   └── main.rs     # ~90 行，单文件二进制
```

### Trampoline 二进制

该 trampoline **没有任何外部依赖**——Win32 FFI 调用（`SetConsoleCtrlHandler`）以内联方式声明，以避免引入庞大的 `windows`/`windows-core` crate。它还通过从不使用 `format!`、`eprintln!`、`println!` 或 `.unwrap()` 来避免 `core::fmt`（约 100KB 的开销）。

```rust
use std::{env, process::{self, Command}};

fn main() {
    // 1. 从自身文件名确定工具名称（例如，node.exe → "node"）
    let exe_path = env::current_exe().unwrap_or_else(|_| process::exit(1));
    let tool_name = exe_path.file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or_else(|| process::exit(1));

    // 2. 定位 ../current/bin/vp.exe
    let bin_dir = exe_path.parent().unwrap_or_else(|| process::exit(1));
    let vp_home = bin_dir.parent().unwrap_or_else(|| process::exit(1));
    let vp_exe = vp_home.join("current").join("bin").join("vp.exe");

    // 3. 安装 Ctrl+C 处理器（忽略信号；子进程处理它）
    install_ctrl_handler();

    // 4. 使用环境变量启动 vp.exe
    let mut cmd = Command::new(&vp_exe);
    cmd.args(env::args_os().skip(1));
    cmd.env("VITE_PLUS_HOME", vp_home);

    if tool_name != "vp" {
        cmd.env("VITE_PLUS_SHIM_TOOL", tool_name);
        cmd.env_remove("VITE_PLUS_TOOL_RECURSION");
    }

    // 5. 传播退出码（错误消息通过 write_all 输出，而不是 eprintln!）
    match cmd.status() {
        Ok(s) => process::exit(s.code().unwrap_or(1)),
        Err(_) => {
            use std::io::Write;
            let mut stderr = std::io::stderr().lock();
            let _ = stderr.write_all(b"vite-plus: failed to execute ");
            let _ = stderr.write_all(vp_exe.as_os_str().as_encoded_bytes());
            let _ = stderr.write_all(b"\n");
            process::exit(1);
        }
    }
}

fn install_ctrl_handler() {
    type HandlerRoutine = unsafe extern "system" fn(ctrl_type: u32) -> i32;
    unsafe extern "system" {
        fn SetConsoleCtrlHandler(handler: Option<HandlerRoutine>, add: i32) -> i32;
    }
    unsafe extern "system" fn handler(_ctrl_type: u32) -> i32 { 1 }
    unsafe { SetConsoleCtrlHandler(Some(handler), 1); }
}
```

### 大小优化

| 技术                                                                             | 节省                      | 状态 |
| -------------------------------------------------------------------------------- | ------------------------- | ---- |
| 零外部依赖（原始 FFI）                                                           | ~20KB（相较 `windows` crate） | 完成 |
| 不直接使用 `core::fmt`（避免 `eprintln!`/`format!`/`.unwrap()`）                 | 轻微                      | 完成 |
| 工作区配置：`lto="fat"`、`codegen-units=1`、`strip="symbols"`、`panic="abort"` | 继承                      | 完成 |
| 按包设置 `opt-level="z"`（优化体积）                                              | ~5-10%                    | 完成 |

**二进制大小**：Windows 上约 200KB。下限由 `std::process::Command` 决定，因为它在内部会无论我们的代码是否使用，都会拉入用于错误格式化的 `core::fmt`。若要进一步缩小到约 40-50KB（与 uv-trampoline 相当），需要用原始 `CreateProcessW` 替换 `Command` 并使用 nightly Rust（参见未来优化）。

### 环境变量

在启动 `vp.exe` 之前，trampoline 会设置三个环境变量：

| 变量                       | 何时                     | 作用                                                               |
| -------------------------- | ------------------------ | ------------------------------------------------------------------ |
| `VITE_PLUS_HOME`           | 始终                     | 告诉 vp.exe 安装目录（从 `bin_dir.parent()` 推导）                |
| `VITE_PLUS_SHIM_TOOL`      | 仅工具 shims（不包括 "vp"） | 告诉 vp.exe 以指定工具名进入 shim 分发模式                         |
| `VITE_PLUS_TOOL_RECURSION` | 对工具 shims 移除         | 清除递归标记，以便在嵌套调用中进行新的版本解析                    |

### Ctrl+C 处理

trampoline 安装一个返回 `TRUE`（1）的控制台控制处理器：

1. 当按下 Ctrl+C 时，Windows 会向**同一控制台组中的所有进程**发送 `CTRL_C_EVENT`
2. trampoline 的处理器返回 1（TRUE）→ trampoline 保持存活
3. 子进程（`vp.exe` → Node.js）接收到**同样的**事件
4. 子进程决定如何处理它（通常会优雅退出）
5. trampoline 检测到子进程退出并传播其退出码

**不会出现 “Terminate batch job?” 提示**，因为这里没有使用批处理文件。

### 与 Shim 检测的集成

`shim/mod.rs` 中的 `detect_shim_tool()` 会在 `argv[0]` 之前检查 `VITE_PLUS_SHIM_TOOL` 环境变量：

```
Trampoline (node.exe)
  → 设置 VITE_PLUS_SHIM_TOOL=node、VITE_PLUS_HOME=...，移除 VITE_PLUS_TOOL_RECURSION
  → 使用原始参数启动 current/bin/vp.exe
    → detect_shim_tool() 读取环境变量 → "node"
    → dispatch("node", args)
    → 解析 Node.js 版本，执行真实的 node
```

### 运行中的 exe 覆盖

当通过 trampoline（`~/.vite-plus/bin/vp.exe`）执行 `vp env setup --refresh` 时，trampoline 仍在运行。Windows 不允许覆盖正在运行的 `.exe`。解决方案：

1. 将现有的 `vp.exe` 重命名为 `vp.exe.<unix_timestamp>.old`
2. 将新的 trampoline 复制为 `vp.exe`
3. 尽力清理 bin 目录中所有 `*.old` 文件

### 升级刷新

在 `vp upgrade` 期间，在 `current` 链接切换到新版本后，会调用 `vp env setup --refresh` 来重新生成所有 trampoline `.exe` 文件。这样可确保当版本之间的 trampoline 二进制文件（`vp-shim.exe`）发生变化时，所有 shims 都能获取到新版本：

1. **核心 shims**（`vp.exe`、`node.exe`、`npm.exe`、`npx.exe`、`corepack.exe`、`vpx.exe`、`vpr.exe`）通过标准的 `--refresh` 逻辑刷新。
2. **包 shims**（例如 `tsc.exe`、`eslint.exe`，通过 `vp install -g` 安装）会通过扫描 `~/.vite-plus/bins/` 中 `source: Vp` 的 `BinConfig` 条目进行发现，并将每个 `.exe` 替换为新的 trampoline。

通过 npm 拦截安装的包 shims（`source: Npm`）使用的是 `.cmd` 包装器，而不是 trampoline `.exe` 文件，因此不受此刷新影响。

此外，重新安装全局包（`vp install -g <pkg>`）时总会重新复制当前 trampoline，因此即使没有完整升级，shim 也能保持最新。

### 分发

trampoline 二进制文件（`vp-shim.exe`）与 `vp.exe` 一起分发：

```
~/.vite-plus/current/bin/
├── vp.exe          # 主 CLI 二进制文件
└── vp-shim.exe     # trampoline 模板（作为 shims 复制）
```

包含于：

- 平台 npm 包（`@voidzero-dev/vite-plus-cli-win32-x64-msvc`）
- 发布工件（`.github/workflows/release.yml`）
- `install.ps1` 和 `install.sh`（本地开发与下载路径均包括）
- 升级路径中的 `extract_platform_package()`

### 旧版回退

在安装一个不含 trampoline 的旧版本（包中没有 `vp-shim.exe`）时：

- `install.ps1` 会回退为创建 `.cmd` + shell 脚本包装器
- 会移除较新安装中残留的 trampoline `.exe` shims（在 Windows PATH 上，`.exe` 优先于 `.cmd`）

## 与 uv-trampoline 的比较

| 方面              | uv-trampoline                            | vite-plus trampoline                 |
| ----------------- | ---------------------------------------- | ------------------------------------ |
| **用途**           | 启动带内嵌脚本的 Python                  | 转发到 `vp.exe`                      |
| **复杂度**         | 高（PE 资源、zipimport）                 | 低（文件名 + spawn）                 |
| **数据嵌入**       | PE 资源（kind、path、script ZIP）        | 无（使用文件名 + 相对路径）          |
| **依赖**           | `windows` crate（unsafe、无 CRT）        | 零（原始 FFI 声明）                  |
| **工具链**         | Nightly Rust（`panic="immediate-abort"`） | Stable Rust                          |
| **二进制大小**     | 39-47 KB                                 | ~200 KB                              |
| **入口点**         | `#![no_main]` + `mainCRTStartup`         | 标准 `fn main()`                 |
| **错误输出**       | `ufmt`（无 `core::fmt`）                 | `write_all`（无 `core::fmt`）         |
| **Ctrl+C 处理**    | `SetConsoleCtrlHandler` → 忽略           | 相同方法                             |
| **退出码**         | `GetExitCodeProcess` → `exit()`          | `Command::status()` → `exit()`       |

vite-plus trampoline 之所以显著更简单，是因为它不需要将数据嵌入到 PE 资源中——它只读取自身文件名，在固定的相对路径下找到 `vp.exe`，然后启动它。与 uv-trampoline 相比，约 150KB 的大小差异来自 `std::process::Command`（其内部会引入 `core::fmt`）与使用 nightly-only 的 `#![no_main]` 配合原始 `CreateProcessW` 之间的区别。

## 备选方案

### 1. NTFS 硬链接（已拒绝）

硬链接解析到物理文件 inode，而不是通过目录联接。`vp` 升级后重新指向 `current` 时，`bin/` 中的硬链接仍然会引用旧二进制。

### 2. Windows 符号链接（已拒绝）

需要管理员权限或开发者模式。对所有用户都不可靠。

### 3. PowerShell `.ps1` 脚本（已拒绝）

`where.exe` 和 `which` 无法找到 `.ps1` 文件。只在 PowerShell 中可用。

### 4. 将 `vp.exe` 复制为每个 shim（已拒绝）

每份副本约 5-10MB。Trampoline 能以约 100KB 达到相同结果。

### 5. 用 `windows` crate 做 FFI（已拒绝）

仅为一次 `SetConsoleCtrlHandler` 调用就会让二进制增加约 100KB。原始 FFI 声明已经足够。

## 未来优化

如果需要进一步缩小约 100KB 的二进制大小：

1. **切换到 nightly Rust**，使用 `panic="immediate-abort"` 和 `#![no_main]` + `mainCRTStartup`（可节省约 50KB）
2. **使用原始 Win32 `CreateProcessW`**，而不是 `std::process::Command`（可消除大部分 std 的进程机制）
3. **预构建并提交** trampoline 二进制（像 uv 那样），以将 trampoline 构建与工作区工具链解耦

这些做法可以将二进制体积降到约 40-50KB，与 uv-trampoline 持平，但代价是需要 nightly 工具链和更多 unsafe 代码。

## 参考

- [Issue #835](https://github.com/voidzero-dev/vite-plus/issues/835)：带视频复现的原始功能请求
- [uv-trampoline](https://github.com/astral-sh/uv/tree/main/crates/uv-trampoline)：astral-sh 的参考实现（使用 nightly Rust，约 40KB）
- [RFC: env-command](./env-command.md)：shim 架构文档
- [RFC: upgrade-command](./upgrade-command.md)：升级/回滚流程
