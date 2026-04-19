# RFC: 独立的 Windows `.exe` 安装器

## 状态

已实现

## 概要

新增一个独立的 `vp-setup.exe` Windows 安装器二进制，通过 GitHub Releases 分发，它会在不需要 PowerShell 的情况下安装 vp CLI。该方案补充了现有的基于脚本的安装器 `irm https://vite.plus/ps1 | iex`。实现方式参考 `rustup-init.exe`。

## 动机

### 问题

当前的 Windows 安装需要运行一个 PowerShell 命令：

```powershell
irm https://vite.plus/ps1 | iex
```

这带来了多种摩擦点：

1. **执行策略障碍**：许多企业/机构的 Windows 机器会限制 PowerShell 脚本执行（需要 `Set-ExecutionPolicy` 的更改）。
2. **不支持 cmd.exe**：在 `cmd.exe` 或 Git Bash 中的用户无法在不先打开 PowerShell 的情况下使用 `irm | iex` 这种用法。
3. **无法双击安装**：用户在遵循文档时，不能直接下载并运行安装器。
4. **CI 的摩擦**：在 Windows 上使用 `shell: cmd` 或 `shell: bash` 的 GitHub Actions 需要变通方式来调用 PowerShell。
5. **PowerShell 版本碎片化**：PowerShell 5.1（内置）和 PowerShell 7+（pwsh）存在细微差异，脚本必须处理这些差异。

### rustup 参考

rustup 提供 `rustup-init.exe` —— 一个单独的控制台二进制，用户可以从任意 shell 下载并运行，或通过双击运行。关键特性：

- 仅控制台（无 GUI），带编号菜单的交互式提示
- 通过 `-y` 标志在 CI 中实现静默模式
- 单一二进制既是安装器又是主要工具（通过 `argv[0]` 检测行为）
- 通过注册表修改 Windows 用户 PATH
- 在“添加/删除程序”中注册
- 针对从下载文件夹执行的 DLL 安全缓解措施

## 目标

1. 提供一个单独的 `.exe`，可在任意 Windows shell 中或双击安装
2. 支持 CI 环境下的静默/无人值守安装
3. 复用来自 `vp upgrade` 命令的现有安装逻辑
4. 保持安装器二进制较小（目标：3-5 MB）
5. 实现与 `install.ps1` 完全相同的安装结果

## 非目标

1. GUI 安装器（MSI、NSIS、Inno Setup）——仅控制台，类似 rustup
2. 跨平台安装器二进制（Linux/macOS 已有良好的 `install.sh` 支持）
3. winget/chocolatey/scoop 的提交（未来工作）
4. 代码签名（GA 需要，但不在本 RFC 范围内）

## 架构决策：单一二进制 vs. 单独的 Crate

### 选项 A：单一二进制（rustup 模式）

rustup 使用一个二进制解决一切——`rustup-init.exe` 会将自身复制到 `~/.cargo/bin/rustup.exe`，并根据 `argv[0]` 改变行为。之所以可行，是因为 rustup 是工具链管理器。

**不适用于 vp**，原因是：

- `vp.exe` 从 npm 注册表作为平台特定包下载
- 安装器不能把自身复制成 `vp.exe`——两者本质上是不同的二进制
- `vp.exe` 链接了 `vite_js_runtime`、`vite_workspace`、`oxc_resolver`（约 15-20 MB）——安装器不需要这些

### 选项 B：带共享库的独立 crate（推荐）

创建两个新的 crate：

```
crates/vite_setup/     — 共享安装逻辑（库）
crates/vite_installer/      — 独立的安装器二进制
```

`vite_setup` 提取可复用的安装逻辑，该逻辑当前位于 `vite_global_cli/src/commands/upgrade/`。`vp upgrade` 和 `vp-setup.exe` 都会调用 `vite_setup`。

**收益：**

- 安装器二进制保持小（3-5 MB）
- `vp upgrade` 与 `vp-setup.exe` 共享完全一致的安装逻辑——避免偏移
- 清晰的关注点分离

## 代码共享：`vite_setup` 库

### 提取内容

| `upgrade/` 中的原始位置 | 提取到 `vite_setup::` | 用途                                                                                                                              |
| ------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `platform.rs`                   | `platform`                  | OS/架构检测                                                                                                                    |
| `registry.rs`                   | `registry`                  | npm 注册表查询                                                                                                                 |
| `integrity.rs`                  | `integrity`                 | SHA-512 校验                                                                                                                 |
| `install.rs`（所有函数）    | `install`                   | Tarball 解压、package.json 生成、.npmrc 覆盖、依赖安装、symlink/junction 置换、版本清理、回滚支持 |

### `vite_global_cli` 中保留内容

- `vp upgrade` 的 CLI 参数解析
- 版本对比（当前 vs 可用）
- 回滚逻辑
- 特定于 upgrade 体验的输出格式化

### `vite_installer` 中新增内容

- 交互式安装提示（编号菜单）
- 通过注册表修改 Windows 用户 PATH
- Node.js 版本管理器设置提示
- Shell 环境文件创建
- 现有安装检测
- DLL 安全缓解措施（用于下载文件夹执行）

### 依赖图

```
vite_installer (二进制，~3-5 MB)
  ├── vite_setup (共享安装逻辑)
  ├── vite_install (HTTP 客户端)
  ├── vite_shared (home 目录解析)
  ├── vite_path (类型化路径封装)
  ├── clap (CLI 解析)
  ├── tokio (异步运行时)
  ├── indicatif (进度条)
  └── owo-colors (终端颜色)

vite_global_cli (现有)
  ├── vite_setup (替换内联 upgrade 代码)
  └── ...（所有现有依赖）
```

## 用户体验

### 交互模式（默认）

未带标志运行（双击或直接运行 `vp-setup.exe`）：

```
欢迎使用 Vite+ 安装器！

这将安装 vp CLI 和 monorepo 任务运行器。

    安装目录：C:\Users\alice\.vite-plus
    PATH 修改：C:\Users\alice\.vite-plus\bin → 用户 PATH
    版本：           最新
    Node.js 管理器：   已启用

  1) 继续安装（默认）
  2) 自定义安装
  3) 取消

  >
```

Node.js 管理器的值会在展示菜单前通过自动检测预先计算（参见 [Node.js Manager 自动检测](#nodejs-manager-auto-detection)）。用户可以在进入执行安装前的自定义子菜单中覆盖它。

自定义子菜单：

```
  自定义安装：

    1) 版本：         [latest]
    2) npm 注册表：    [(default)]
    3) Node.js 管理器： [enabled]
    4) 修改 PATH：     [yes]

  输入选项编号以更改，或按 Enter 返回：
  >
```

### 静默模式（CI）

安装器会自动检测 CI 环境（`CI=true`），并跳过交互式提示，因此在 CI 中不需要使用 `-y`：

```bash
# CI 环境会自动变为非交互
vp-setup.exe

# 显式静默模式（CI 之外）
vp-setup.exe -y

# 自定义
vp-setup.exe --version 0.3.0 --no-node-manager --registry https://registry.npmmirror.com
```

### CLI 标志

| 标志                   | 描述                   | 默认                      |
| ---------------------- | ----------------------------- | ---------------------------- |
| `-y` / `--yes`         | 接受默认值，无提示   | 交互式                  |
| `-q` / `--quiet`       | 除错误外抑制输出 | false                        |
| `--version <VER>`      | 安装指定版本      | latest                       |
| `--tag <TAG>`          | npm dist-tag                  | latest                       |
| `--install-dir <PATH>` | 安装目录        | `%USERPROFILE%\.vite-plus`   |
| `--registry <URL>`     | npm 注册表 URL              | `https://registry.npmjs.org` |
| `--no-node-manager`    | 跳过 Node.js 管理器设置    | 自动检测                  |
| `--no-modify-path`     | 不修改用户 PATH        | 修改                       |

### 环境变量（与 `install.ps1` 兼容）

| 变量                  | 映射到             |
| ------------------------- | ------------------- |
| `VP_VERSION`              | `--version`         |
| `VP_HOME`                 | `--install-dir`     |
| `NPM_CONFIG_REGISTRY`     | `--registry`        |
| `VP_NODE_MANAGER=yes\|no` | `--no-node-manager` |

CLI 标志的优先级高于环境变量。

## 安装流程

安装器会复现与 `install.ps1` 相同的结果，该流程使用 Rust 通过 `vite_setup` 实现。

```
┌─────────────────────────────────────────────────────────────┐
│                      RESOLVE                                │
│                                                             │
│  ┌─ detect platform ──────── win32-x64-msvc                 │
│  │                           win32-arm64-msvc                │
│  │                                                          │
│  ├─ check existing ──────── read %VP_HOME%\current           │
│  │                                                          │
│  └─ resolve version ──────── resolve_version_string()        │
│                              1 HTTP call: "latest" → "0.3.0" │
│                              same version? → skip to         │
│                              CONFIGURE (repair path)         │
└─────────────────────────────────────────────────────────────┘
                              │
                   （仅当版本不同）
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DOWNLOAD & VERIFY                      │
│                                                             │
│  ┌─ resolve platform pkg ── resolve_platform_package()       │
│  │                          2nd HTTP call: tarball URL + SRI │
│  │                                                          │
│  ├─ download tarball ─────── GET tarball URL from registry   │
│  │                           indicatif progress spinner  │
│  │                                                          │
│  └─ verify integrity ─────── SHA-512 SRI hash comparison     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      INSTALL                                │
│                                                             │
│  ┌─ extract binary ──────── %VP_HOME%\{version}\bin\         │
│  │                          vp.exe + vp-shim.exe             │
│  │                                                          │
│  ├─ generate package.json ─ wrapper with vite-plus dep       │
│  │                          pins pnpm@10.33.0                │
│  │                                                          │
│  ├─ write .npmrc ────────── minimum-release-age=0            │
│  │                                                          │
│  └─ install deps ────────── spawn: vp install --silent       │
│                              installs vite-plus + transitive │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     ACTIVATE              ◄── no return point │
│                                               return         │
│  ┌─ save previous version ── .previous-version (rollback)    │
│  │                          （仅当升级已有安装）     │
│  │                                                          │
│  ├─ swap current ────────── mklink /J current → {version}    │
│  │                          （Windows 上的 junction，            │
│  │                           Unix 上的原子 symlink）         │
│  │                                                          │
│  └─ cleanup old versions ── keep last 5 by creation time     │
│                              protects new + previous version │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│       CONFIGURE         （尽力执行，总是运行，           │
│                          即使同版本也用于修复）        │
│                                                             │
│  ┌─ create bin shims ────── copy vp-shim.exe → bin\vp.exe   │
│  │                          （如果正在运行则重命名为 .old）      │
│  │                                                          │
│  ├─ Node.js manager ────── if enabled (pre-computed):        │
│  │                            spawn: vp env setup --refresh  │
│  │                          if disabled:                     │
│  │                            spawn: vp env setup --env-only │
│  │                                                          │
│  └─ modify User PATH ────── if --no-modify-path not set:     │
│                              HKCU\Environment\Path           │
│                              prepend %VP_HOME%\bin           │
│                              broadcast WM_SETTINGCHANGE      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                        ✔ 打印成功
```

每个阶段都映射到 `vite_setup` 库函数，这些函数与 `vp upgrade` 共享：

| 阶段             | 关键函数                               | Crate            |
| ----------------- | ------------------------------------------ | ---------------- |
| Resolve           | `platform::detect_platform_suffix()`       | `vite_setup`     |
| Resolve           | `install::read_current_version()`          | `vite_setup`     |
| Resolve           | `registry::resolve_version_string()`       | `vite_setup`     |
| Download & Verify | `registry::resolve_platform_package()`     | `vite_setup`     |
| Download & Verify | `HttpClient::get_bytes()`                  | `vite_install`   |
| Download & Verify | `integrity::verify_integrity()`            | `vite_setup`     |
| Install           | `install::extract_platform_package()`      | `vite_setup`     |
| Install           | `install::generate_wrapper_package_json()` | `vite_setup`     |
| Install           | `install::write_release_age_overrides()`   | `vite_setup`     |
| Install           | `install::install_production_deps()`       | `vite_setup`     |
| Activate          | `install::save_previous_version()`         | `vite_setup`     |
| Activate          | `install::swap_current_link()`             | `vite_setup`     |
| Activate          | `install::cleanup_old_versions()`          | `vite_setup`     |
| Configure         | `install::refresh_shims()`                 | `vite_setup`     |
| Configure         | `windows_path::add_to_user_path()`         | `vite_installer` |

**同版本修复**：当解析出的版本与已安装版本匹配时，DOWNLOAD/INSTALL/ACTIVATE 阶段会被完全跳过（节省 1 次 HTTP 请求以及所有 I/O）。CONFIGURE 阶段会始终运行，用于修复 shim、环境文件以及在需要时修复 PATH。

**失败恢复**：在 **Activate** 阶段之前，失败会清理版本目录，并保持现有安装不受影响。在 **Activate** 之后，所有 CONFIGURE 步骤都是尽力而为——失败会记录警告，但不会导致退出码为 1。重新运行安装器会始终重试 CONFIGURE。

## Node.js 管理器自动检测

Node.js 管理器的决策（`enabled`/`disabled`）会在展示交互式菜单之前预先计算完成，因此用户看到的是已解析的值，并可通过“自定义（customize）”子菜单进行覆盖。在安装阶段不会出现任何提示。

自动检测逻辑与 `install.ps1`/`install.sh` 一致：

| 优先级 | 条件                                 | 结果   |
| -------- | ----------------------------------------- | -------- |
| 1        | `--no-node-manager` CLI 标志              | disabled |
| 2        | `VP_NODE_MANAGER=yes`                     | enabled  |
| 3        | `VP_NODE_MANAGER=no`                      | disabled |
| 4        | `bin/node.exe` shim 已存在        | enabled  |
| 5        | CI / Codespaces / DevContainer / DevPod   | enabled  |
| 6        | 未找到系统 `node`                     | enabled  |
| 7        | 系统 `node` 存在，交互模式   | enabled  |
| 8        | 系统 `node` 存在，静默模式（`-y`） | disabled |

在交互模式下（规则 7），默认值与 `install.ps1` 的 Y/n 提示一致：按下 Enter 会启用它。用户可以在安装开始前，于“自定义（customize）”菜单中将其禁用。在静默模式下（规则 8），除非明确请求，否则不会创建 shim，从而避免在不知不觉中接管现有的 Node 工具链。

## Windows 专项细节

### 通过注册表修改 PATH

与 rustup 和 `install.ps1` 相同的方法，使用 `winreg` crate 进行注册表访问：

```rust
let hkcu = RegKey::predef(HKEY_CURRENT_USER);
let env = hkcu.open_subkey_with_flags("Environment", KEY_READ | KEY_WRITE)?;
let current: String = env.get_value("Path").unwrap_or_default();
// ... 检查是否已存在（不区分大小写，处理尾随反斜杠）
// ... 预置 bin_dir，写回为 REG_EXPAND_SZ
// ... 通过 SendMessageTimeoutW 广播 WM_SETTINGCHANGE（原始 FFI，单次调用）
```

完整实现请查看 `crates/vite_installer/src/windows_path.rs`。

### DLL 安全性（用于下载文件夹执行）

遵循 rustup 的做法——当 `.exe` 被下载到 `Downloads/` 并双击运行时，可能会加载同一文件夹中的恶意 DLL。两种缓解措施，均使用原始 FFI（不使用 `windows-sys` crate）：

```rust
// build.rs — 链接时：在加载时限制 DLL 搜索
#[cfg(windows)]
println!("cargo:rustc-link-arg=/DEPENDENTLOADFLAG:0x800");

// main.rs — 运行时：通过 Win32 API 限制 DLL 搜索
#[cfg(windows)]
fn init_dll_security() {
    unsafe extern "system" {
        fn SetDefaultDllDirectories(directory_flags: u32) -> i32;
    }
    const LOAD_LIBRARY_SEARCH_SYSTEM32: u32 = 0x0000_0800;
    unsafe { SetDefaultDllDirectories(LOAD_LIBRARY_SEARCH_SYSTEM32); }
}
```

### 控制台分配

该二进制使用控制台子系统（这是 Windows 上 Rust 二进制的默认行为）。当双击运行时，Windows 会自动分配一个控制台窗口。不需要特殊处理。

### 现有安装处理

| 场景                                  | 行为                                                     |
| ----------------------------------------- | ------------------------------------------------------------ |
| 没有现有安装                       | 全新安装                                                |
| 安装相同版本                   | 跳过下载，重新执行 CONFIGURE 阶段（修复 shim/PATH/env） |
| 安装不同版本               | 升级到目标版本                                    |
| 损坏/部分安装（断开的 junction） | 重新创建目录结构                                 |
| 在 bin/ 中运行 `vp.exe`                  | 重命名为 `.old`，复制新文件（与 trampoline 模式相同）      |

## 添加/移除程序注册

**阶段 1：跳过。** `vp implode` 已经处理完整的卸载。

**阶段 2：注册。** 写入 `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\VitePlus`：

```
DisplayName     = "Vite+"
UninstallString = "C:\Users\alice\.vite-plus\current\bin\vp.exe implode --yes"
DisplayVersion  = "0.3.0"
Publisher       = "VoidZero"
InstallLocation = "C:\Users\alice\.vite-plus"
```

## 分发

### 阶段 1：GitHub Releases

将安装器二进制文件挂载到每个 GitHub Release：

- `vp-setup-x86_64-pc-windows-msvc.exe`
- `vp-setup-aarch64-pc-windows-msvc.exe`

发布流程已经会创建 GitHub Releases。为初始化二进制添加构建 + 上传步骤。

### 阶段 2：直接下载 URL（已完成）

`https://viteplus.dev/vp-setup` 通过 `netlify.toml` 中的 Netlify 重定向（302）跳转到 `https://setup.viteplus.dev`。安装文档链接到面向用户的 `viteplus.dev` URL。

### 阶段 3：包管理器

提交到 winget、chocolatey、scoop。每个都有各自的清单格式和审核流程。

## CI/构建变更

### 发布流程新增

在 `build-upstream/action.yml` 中，与 CLI 一起构建并缓存安装器二进制：

```yaml
- name: Build installer binary (Windows only)
  if: contains(inputs.target, 'windows')
  run: cargo build --release --target ${{ inputs.target }} -p vite_installer
```

在 `release.yml` 中，按目标上传安装器制品，将其按目标三元组重命名，并附加到 GitHub Release：

```yaml
- name: Upload installer binary artifact (Windows only)
  if: contains(matrix.settings.target, 'windows')
  uses: actions/upload-artifact@v4
  with:
    name: vp-setup-${{ matrix.settings.target }}
    path: ./target/${{ matrix.settings.target }}/release/vp-setup.exe
```

### 测试流程

`test-standalone-install.yml` 包含一个 `test-vp-setup-exe` 任务：从源代码构建安装器，通过 pwsh 安装，并在全部三个 shell（pwsh、cmd、bash）中验证：

```yaml
test-vp-setup-exe:
  name: Test vp-setup.exe (pwsh)
  runs-on: windows-latest
  steps:
    - uses: actions/checkout@v4
    - uses: oxc-project/setup-rust@v1
    - name: Build vp-setup.exe
      run: cargo build --release -p vite_installer
    - name: Install via vp-setup.exe (silent)
      shell: pwsh
      run: ./target/release/vp-setup.exe
      env:
        VP_VERSION: alpha
    - name: Verify installation (pwsh/cmd/bash)
      # verifies from all three shells after a single install
```

工作流在对 `crates/vite_installer/**` 和 `crates/vite_setup/**` 的变更时触发。

## 代码签名

Windows Defender SmartScreen 会对从互联网下载但未签名的可执行文件发出警告。这是“下载并运行安装器”的重大 UX 问题。

**建议**：在 GA 发布之前获取 EV（Extended Validation，扩展验证）代码签名证书。EV 证书会立即移除 SmartScreen 警告（不需要建立信誉期）。

这是一个组织层面的决策（成本：约 $300-500/年），不在实现范围内，但对用户体验至关重要。

## 二进制大小预算

目标：3-5 MB（发布版，去符号，LTO）。

关键依赖及其大致贡献：

| 依赖项                        | 用途                | 大小影响 |
| --------------------------------- | ---------------------- | ----------- |
| `reqwest` + `native-tls-vendored` | HTTP + TLS             | ~1.5 MB     |
| `flate2` + `tar`                  | Tarball 解压     | ~200 KB     |
| `clap`                            | CLI 解析            | ~300 KB     |
| `tokio` (minimal features)        | 异步运行时          | ~400 KB     |
| `indicatif`                       | 进度条          | ~100 KB     |
| `sha2`                            | 完整性校验 | ~50 KB      |
| `serde_json`                      | 注册表 JSON 解析  | ~200 KB     |
| `winreg` + `windows-sys`          | Windows 注册表       | ~50-100 KB  |
| Rust std + 额外开销               |                        | ~500 KB     |

在 package profile override 中使用 `opt-level = "z"`（针对体积优化），与 trampoline 的做法一致。

## 已考虑的替代方案

### 1. MSI/NSIS/Inno Setup 安装器（拒绝）

传统的 Windows 安装器提供 GUI、添加/移除程序和开始菜单集成。但：

- 构建时依赖外部工具（WiX、NSIS）
- 对开发者 CLI 工具来说不需要 GUI
- MSI 的作者编写要求很复杂
- rustup 选择了仅控制台，并且对开发者受众效果很好

### 2. 用 Init 模式扩展 `vp.exe`（拒绝）

类似 rustup，让 `vp.exe` 检测当以 `vp-setup.exe` 方式调用时切换到安装器模式。

- 会将安装器膨胀到 ~15-20 MB（包含 vp 的所有依赖）
- `vp.exe` 是从安装器下载来的——循环依赖
- 安装负载（vp.exe）与安装器本质上不同

### 3. 在 .exe 中静态链接 PowerShell（拒绝）

把 PowerShell 脚本嵌入到自解压 exe 中。脆弱，且仍需要 PowerShell 运行时。

### 4. PATH 用 `winreg` Crate vs 原始 FFI（决策：`winreg`）

- `winreg` crate：更高级的安全 API，经过 LTO 后约 ~50-100 KB，并且代码量显著更少（约 80 行 vs ~225 行）
- 原始 Win32 FFI：无依赖，但需要 225 行不安全代码，并手动处理 UTF-16 编码与注册表编排
- PowerShell 子进程：在 `install.ps1` 中已验证可行，但会增加进程生成开销并依赖 PowerShell
- 决策：用于注册表访问时使用 `winreg`——零依赖模式适合 `vite_trampoline`（作为 shim 复制 5-10 次），但不适合单个可下载安装器：可读性更重要。`WM_SETTINGCHANGE` 广播仍然使用一次原始 FFI 调用，因为 `winreg` 不会封装它。

## 实现阶段

### 阶段 1：提取 `vite_setup` 库（已完成）

- 创建 `crates/vite_setup/`，包含 `platform`、`registry`、`integrity`、`install` 模块
- 将 `vite_global_cli/src/commands/upgrade/` 中的共享代码迁移到 `vite_setup`
- 更新 `vite_global_cli` 以从 `vite_setup` 导入
- 所有 353 个现有测试均通过

### 阶段 2：创建 `vite_installer` 二进制（已完成）

- 创建 `crates/vite_installer/`，并设置 `[[bin]] name = "vp-setup"`
- 使用 clap 实现 CLI 参数解析（并支持环境变量合并）
- 实现安装流程：调用 `vite_setup`，并在同版本情况下走相同的修复路径
- 使用 `winreg` crate 实现 Windows PATH 修改
- 使用带自定义子菜单的交互式提示
- 实现 Node.js 管理器自动检测（预计算，无安装中途提示）
- 为下载添加进度旋转指示器
- 添加 DLL 安全性缓解措施（build.rs 链接标志 + 运行时 `SetDefaultDllDirectories`）
- 激活后的步骤采用尽力而为（出错不致命）

### 阶段 3：CI 集成（已完成）

- 在 `build-upstream/action.yml` 中添加安装器二进制构建（仅 Windows targets）
- 在 `release.yml` 中添加制品上传与 GitHub Release 附件
- 在 `test-standalone-install.yml` 中添加 `test-vp-setup-exe` 任务（cmd、pwsh、bash）
- 在 release 正文中更新了 `vp-setup.exe` 下载提及

### 阶段 4：文档与分发（已完成）

- 更新网站上的安装文档（`docs/guide/index.md`）
- 通过 Netlify（`netlify.toml`）添加 `viteplus.dev/vp-setup.exe` 重定向
- winget、chocolatey、scoop 的提交推迟到未来工作

## 代码签名

Windows Defender SmartScreen 会对从互联网下载但未签名的可执行文件发出警告。这是“下载并运行安装器”的重大 UX 问题。

**建议**：在 GA 发布之前获取 EV（Extended Validation，扩展验证）代码签名证书。EV 证书会立即移除 SmartScreen 警告（不需要建立信誉期）。

这是一个组织层面的决策（成本：约 $300-500/年），不在实现范围内，但对用户体验至关重要。

## 二进制大小预算

目标：3-5 MB（发布版，去符号，LTO）。

关键依赖及其大致贡献：

| 依赖项                        | 用途                | 大小影响 |
| --------------------------------- | ---------------------- | ----------- |
| `reqwest` + `native-tls-vendored` | HTTP + TLS             | ~1.5 MB     |
| `flate2` + `tar`                  | Tarball 解压     | ~200 KB     |
| `clap`                            | CLI 解析            | ~300 KB     |
| `tokio` (minimal features)        | 异步运行时          | ~400 KB     |
| `indicatif`                       | 进度条          | ~100 KB     |
| `sha2`                            | 完整性校验 | ~50 KB      |
| `serde_json`                      | 注册表 JSON 解析  | ~200 KB     |
| `winreg` + `windows-sys`          | Windows 注册表       | ~50-100 KB  |
| Rust std + 额外开销               |                        | ~500 KB     |

在 package profile override 中使用 `opt-level = "z"`（针对体积优化），与 trampoline 的做法一致。

## 已考虑的替代方案

### 1. MSI/NSIS/Inno Setup 安装器（拒绝）

传统的 Windows 安装器提供 GUI、添加/移除程序和开始菜单集成。但：

- 构建时依赖外部工具（WiX、NSIS）
- 对开发者 CLI 工具来说不需要 GUI
- MSI 的作者编写要求很复杂
- rustup 选择了仅控制台，并且对开发者受众效果很好

### 2. 用 Init 模式扩展 `vp.exe`（拒绝）

类似 rustup，让 `vp.exe` 检测当以 `vp-setup.exe` 方式调用时切换到安装器模式。

- 会将安装器膨胀到 ~15-20 MB（包含 vp 的所有依赖）
- `vp.exe` 是从安装器下载来的——循环依赖
- 安装负载（vp.exe）与安装器本质上不同

### 3. 在 .exe 中静态链接 PowerShell（拒绝）

把 PowerShell 脚本嵌入到自解压 exe 中。脆弱，且仍需要 PowerShell 运行时。

### 4. PATH 用 `winreg` Crate vs 原始 FFI（决策：`winreg`）

- `winreg` crate：更高级的安全 API，经过 LTO 后约 ~50-100 KB，并且代码量显著更少（约 80 行 vs ~225 行）
- 原始 Win32 FFI：无依赖，但需要 225 行不安全代码，并手动处理 UTF-16 编码与注册表编排
- PowerShell 子进程：在 `install.ps1` 中已验证可行，但会增加进程生成开销并依赖 PowerShell
- 决策：用于注册表访问时使用 `winreg`——零依赖模式适合 `vite_trampoline`（作为 shim 复制 5-10 次），但不适合单个可下载安装器：可读性更重要。`WM_SETTINGCHANGE` 广播仍然使用一次原始 FFI 调用，因为 `winreg` 不会封装它。

## 实现阶段

### 阶段 1：提取 `vite_setup` 库（已完成）

- 创建 `crates/vite_setup/`，包含 `platform`、`registry`、`integrity`、`install` 模块
- 将 `vite_global_cli/src/commands/upgrade/` 中的共享代码迁移到 `vite_setup`
- 更新 `vite_global_cli` 以从 `vite_setup` 导入
- 所有 353 个现有测试均通过

### 阶段 2：创建 `vite_installer` 二进制（已完成）

- 创建 `crates/vite_installer/`，并设置 `[[bin]] name = "vp-setup"`
- 使用 clap 实现 CLI 参数解析（并支持环境变量合并）
- 实现安装流程：调用 `vite_setup`，并在同版本情况下走相同的修复路径
- 使用 `winreg` crate 实现 Windows PATH 修改
- 使用带自定义子菜单的交互式提示
- 实现 Node.js 管理器自动检测（预计算，无安装中途提示）
- 为下载添加进度旋转指示器
- 添加 DLL 安全性缓解措施（build.rs 链接标志 + 运行时 `SetDefaultDllDirectories`）
- 激活后的步骤采用尽力而为（出错不致命）

### 阶段 3：CI 集成（已完成）

- 在 `build-upstream/action.yml` 中添加安装器二进制构建（仅 Windows targets）
- 在 `release.yml` 中添加制品上传与 GitHub Release 附件
- 在 `test-standalone-install.yml` 中添加 `test-vp-setup-exe` 任务（cmd、pwsh、bash）
- 在 release 正文中更新了 `vp-setup.exe` 下载提及

### 阶段 4：文档与分发（已完成）

- 更新网站上的安装文档（`docs/guide/index.md`）
- 通过 Netlify（`netlify.toml`）添加 `viteplus.dev/vp-setup.exe` 重定向
- winget、chocolatey、scoop 的提交推迟到未来工作

## 测试策略

### 单元测试

- 平台检测（模拟不同架构）
- PATH 修改逻辑（注册表读取/写入）
- 版本比较与现有安装检测

### 集成测试（CI）

- 从 `cmd.exe`、PowerShell、Git Bash 进行全新安装
- 静默模式（`-y`）安装
- 自定义注册表、自定义安装目录
- 对现有安装进行升级
- 确认安装后 `vp --version` 可正常工作
- 确认 PATH 被正确修改

### 手动测试

- 从下载文件夹双击运行
- SmartScreen 行为（已签名 vs 未签名）
- Windows Defender 扫描行为
- ARM64 Windows（如有可用）

## 决策

- **二进制名称**：`vp-setup.exe`
- **卸载**：依赖 `vp implode` — 安装器中不提供 `--uninstall` 标志
- **最低 Windows 版本**：Windows 10 版本 1809（2018 年 10 月更新）或更高版本，和 [Rust 的 `x86_64-pc-windows-msvc` 目标要求](https://doc.rust-lang.org/rustc/platform-support.html) 一致

## 参考资料

- [rustup-init.exe 源码](https://github.com/rust-lang/rustup/blob/master/src/bin/rustup-init.rs) — 单二进制安装器模型
- [rustup self_update.rs](https://github.com/rust-lang/rustup/blob/master/src/cli/self_update.rs) — 安装流程
- [rustup windows.rs](https://github.com/rust-lang/rustup/blob/master/src/cli/self_update/windows.rs) — Windows PATH/注册表处理
- [RFC: Windows Trampoline](./trampoline-exe-for-shims.md) — 现有的 Windows .exe shim 方案
- [RFC: Self-Update Command](./upgrade-command.md) — 现有的升级逻辑以便复用
