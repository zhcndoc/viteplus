# RFC：自更新命令

## 状态

草案

## 背景

Vite+ 通过 bash 安装脚本（`curl -fsSL https://vite.plus | bash`）作为独立的 Rust 二进制文件分发。目前，用户必须重新运行完整的安装脚本才能更新到新版本。这种方式摩擦较大，而且对于期望内置更新机制的用户来说也不够熟悉（例如 `rustup update`、`volta fetch` 或 `brew upgrade`）。

一个原生的 `vp upgrade` 命令将允许用户通过单个命令原地更新 CLI，显著改善升级体验。

### 当前安装结构

```
~/.vite-plus/
├── bin/
│   ├── vp → ../current/bin/vp       # 稳定的符号链接（在 PATH 中）
│   ├── node → ../current/bin/node   # Shim 符号链接
│   ├── npm → ../current/bin/npm
│   └── npx → ../current/bin/npx
├── current → 0.1.0/                 # 指向活动版本的符号链接
├── 0.1.0/                           # 版本目录
│   ├── bin/vp                       # 实际二进制文件
│   ├── dist/                        # JS bundles + .node 文件
│   ├── package.json
│   └── node_modules/
├── 0.0.9/                           # 上一个版本（保留用于回滚）
├── env                              # POSIX shell 环境（由 shell 配置加载）
├── env.fish                         # Fish shell 环境
└── env.ps1                          # PowerShell 环境
```

关键不变式：`~/.vite-plus/bin/vp` 是指向 `../current/bin/vp` 的符号链接（Unix），或者是转发到 `current\bin\vp.exe` 的 trampoline `.exe`（Windows），而 `current` 是一个符号链接（Unix）或 junction（Windows），指向活动版本目录。升级时只需切换 `current` 链接——在 Unix 上是原子的，在 Windows 上也几乎是瞬时完成的。

## 目标

1. 提供一个快速、可靠的 `vp upgrade` 命令，将 CLI 升级到最新版本（或指定版本）
2. 复用相同的基于 npm 的分发渠道（不引入新基础设施）
3. 支持具备自动回滚能力的原子升级
4. 保留最近 3 个版本以便手动回滚
5. 支持版本固定和通道选择（latest、test）

## 非目标

1. 每次命令调用时自动更新（这可能是未来增强）
2. Windows PowerShell 安装路径（由 `install.ps1` 覆盖）
3. 从 npm 分发渠道迁移走
4. 更新 Node.js 版本（已由 `vp env` 负责）

## 用户故事

### 故事 1：快速更新到最新版本

某开发者发现 Vite+ 有新版本可用，希望进行更新。

```bash
$ vp upgrade
info: checking for updates...
info: found vite-plus-cli@0.2.0 (current: 0.1.0)
info: downloading vite-plus-cli@0.2.0 for darwin-arm64...
info: installing...

✔ Updated vite-plus from 0.1.0 → 0.2.0

  Release notes: https://github.com/voidzero-dev/vite-plus/releases/tag/v0.2.0
```

### 故事 2：已经是最新版本

```bash
$ vp upgrade
info: checking for updates...

✔ Already up to date (0.2.0)
```

### 故事 3：更新到指定版本

```bash
$ vp upgrade 0.1.5
info: checking for updates...
info: found vite-plus-cli@0.1.5 (current: 0.2.0)
info: downloading vite-plus-cli@0.1.5 for darwin-arm64...
info: installing...

✔ Updated vite-plus from 0.2.0 → 0.1.5
```

### 故事 4：安装测试通道构建

```bash
$ vp upgrade --tag test
info: checking for updates...
info: found vite-plus-cli@0.3.0-beta.1 (current: 0.2.0)
info: downloading vite-plus-cli@0.3.0-beta.1 for darwin-arm64...
info: installing...

✔ Updated vite-plus from 0.2.0 → 0.3.0-beta.1
```

### 故事 5：回滚到上一个版本

```bash
$ vp upgrade --rollback
info: rolling back to previous version...
info: switching from 0.2.0 → 0.1.0

✔ Rolled back to 0.1.0
```

### 故事 6：仅检查更新，不安装

```bash
$ vp upgrade --check
info: checking for updates...
Update available: 0.2.0 → 0.3.0
Run `vp upgrade` to update.
```

### 故事 7：CI 环境——非交互式

```bash
# 在 CI 中，静默更新即可
$ vp upgrade --silent
```

## 技术设计

### 命令接口

```
vp upgrade [VERSION] [OPTIONS]
vp upgrade [VERSION] [OPTIONS]       # 别名

Arguments:
  [VERSION]    Target version (e.g., "0.2.0"). Defaults to "latest"

Options:
  --tag <TAG>      npm dist-tag to install (default: "latest", also: "test")
  --check          Check for updates without installing
  --rollback       Revert to the previously active version
  --force          Force reinstall even if already on the target version
  --silent         Suppress output (useful in CI)
  --registry <URL> Custom npm registry URL (overrides NPM_CONFIG_REGISTRY)
```

### 架构

升级命令完全在 `vite_global_cli` crate 内使用 Rust 实现，逻辑与 `install.sh` 保持一致，但作为原生子进程工作流运行。

```
┌─────────────────────────────────────────────────┐
│                vp upgrade                   │
├─────────────────────────────────────────────────┤
│  1. Resolve version (npm registry query)        │
│  2. Check if already installed                  │
│  3. Download platform binary (.tgz)             │
│  4. Download main JS bundle (.tgz)              │
│  5. Extract to ~/.vite-plus/{version}/          │
│  6. Install production dependencies             │
│  7. Atomic swap: current → {version}            │
│  8. Refresh shims (non-fatal)                   │
│  9. Cleanup old versions (non-fatal, keep 3)    │
└─────────────────────────────────────────────────┘
```

### 实现流程

#### 步骤 1：版本解析

向 npm registry 查询目标版本：

```
GET {registry}/vite-plus-cli/{version_or_tag}
```

- 如果提供了 `VERSION` 参数，则直接使用它
- 如果提供了 `--tag`，则解析该 dist-tag（例如 `latest`、`test`）
- 默认使用 `latest`

解析 JSON 响应以提取：

- `version`：解析后的 semver 版本
- `optionalDependencies`：用于查找平台特定包名

#### 步骤 2：版本比较

将解析出的版本与当前运行二进制的版本（`env!("CARGO_PKG_VERSION")`）进行比较。

- 如果版本相同且未设置 `--force`：打印“已是最新”并退出
- 如果目标版本更旧：继续执行（允许有意降级）

#### 步骤 3：下载与校验

从 npm registry 下载两个 tarball：

1. **平台二进制**：`{registry}/@voidzero-dev/vite-plus-cli-{platform_suffix}/-/vite-plus-cli-{suffix}-{version}.tgz`
   - 包含：`vp` 二进制 + `.node` NAPI 文件
2. **主包**：`{registry}/vite-plus-cli/-/vite-plus-cli-{version}.tgz`
   - 包含：`dist/`（JS bundles）、`package.json`、`templates/`、`rules/`、`AGENTS.md`

**完整性校验**：每个 tarball 都会使用 npm registry 元数据中的 `integrity` 字段进行校验。npm registry 以 [Subresource Integrity](https://w3c.github.io/webappsec-subresource-integrity/) 格式提供 SHA-512 哈希：

```json
{
  "dist": {
    "tarball": "https://registry.npmjs.org/vite-plus-cli/-/vite-plus-cli-0.0.0-xxx.tgz",
    "integrity": "sha512-Z3se9k/NTRf8s5eSmuSoMOFFB/TUGBHIoeWDU5VoHV...",
    "shasum": "3399579218148ae410011bde8934e12209743ef3"
  }
}
```

校验流程：

1. 将 tarball 下载到临时文件
2. 计算下载文件的 SHA-512 哈希
3. Base64 编码并与 `integrity` 字段比较（格式：`sha512-{base64}`）
4. 如果不匹配：删除临时文件，报告错误，中止更新

```rust
use sha2::{Sha512, Digest};
use base64::{Engine as _, engine::general_purpose::STANDARD};

fn verify_integrity(data: &[u8], expected: &str) -> Result<(), Error> {
    // 解析 "sha512-{base64}" 格式
    let expected_hash = expected.strip_prefix("sha512-")
        .ok_or(Error::UnsupportedIntegrity(expected.into()))?;

    let mut hasher = Sha512::new();
    hasher.update(data);
    let actual_hash = STANDARD.encode(hasher.finalize());

    if actual_hash != expected_hash {
        return Err(Error::IntegrityMismatch {
            expected: expected.into(),
            actual: format!("sha512-{}", actual_hash),
        });
    }
    Ok(())
}
```

要获取平台包的 `integrity` 字段，需要单独查询其元数据：

- 主包元数据：`{registry}/vite-plus-cli/{version}` → 包含 `dist.integrity`
- 平台包元数据：`{registry}/@voidzero-dev/vite-plus-cli-{suffix}/{version}` → 包含 `dist.integrity`

平台检测复用 `vite_js_runtime` 中已有的逻辑，或镜像 bash 脚本的做法：

- `uname -s` → os（darwin、linux）
- `uname -m` → arch（x64、arm64）
- Linux：检测 gnu vs musl libc

#### 步骤 4：解压并安装

1. 创建 `~/.vite-plus/{version}/`，包含 `bin/` 和 `dist/` 子目录
2. 将平台二进制解压到 `{version}/bin/vp`，并设置可执行权限
3. 将 `.node` 文件解压到 `{version}/dist/`
4. 将 JS bundle、templates、rules、package.json 解压到 `{version}/`
5. 从 package.json 中移除 `devDependencies` 和 `optionalDependencies`
6. 在版本目录中运行 `vp install --silent` 以安装生产依赖

#### 步骤 5：版本切换

**Unix（macOS/Linux）** —— 原子符号链接切换：

```rust
// 使用 rename 进行原子符号链接切换
let temp_link = install_dir.join("current.new");
std::os::unix::fs::symlink(version, &temp_link)?;
std::fs::rename(&temp_link, install_dir.join("current"))?;
```

这在 POSIX 系统上是原子的，因为对符号链接执行 `rename()` 是一个原子操作。

**Windows** —— junction 切换（非原子，与 `install.ps1` 保持一致）：

```rust
// Windows 使用 junctions（mklink /J）—— 不需要管理员权限
let current_link = install_dir.join("current");

// 删除现有 junction
if current_link.exists() {
    junction::delete(&current_link)?;
}

// 创建指向版本目录的新 junction
junction::create(version_dir, &current_link)?;
```

Windows 上的关键差异：

- 使用 **junctions**（`mklink /J`）而不是符号链接——junction 不需要管理员权限
- junction 只能用于目录（`current` 正是目录），并且内部使用绝对路径
- 切换 **不是原子操作**——会有一个很短的窗口（约毫秒级）使得 `current` 不存在
- `bin/vp.exe` 是 trampoline（不是符号链接），它通过 `current` 解析，因此升级期间无需更新
- 这与现有的 `install.ps1` 行为完全一致

#### 步骤 6：更新后处理（非致命）

在符号链接切换之后（**不可回头点**），后续更新操作都视为非致命。错误会打印到 stderr 作为警告，但不会触发外层错误处理器（否则会删除现在已生效的版本目录）。

1. **刷新 shim**：运行等价于 `vp env setup --refresh` 的操作，确保 node/npm/npx/corepack shim 指向新版本。如果失败，用户可以手动运行它。
2. **清理旧版本**：移除旧版本目录，按**创建时间**保留最近 3 个版本（与 `install.sh` 行为一致）。新版本和上一个版本始终受保护，不会被清理，即使它们不在前 3 名之内（例如通过 `--rollback` 降级之后）。

#### 步骤 7：正在运行的二进制考虑

当前运行的 `vp` 进程**不是**正在被替换的二进制。流程如下：

```
# Unix
~/.vite-plus/bin/vp  →  ../current/bin/vp  →  {old_version}/bin/vp

# Windows
~/.vite-plus/bin/vp.exe (trampoline)  →  current\bin\vp.exe  →  {old_version}\bin\vp.exe
```

在 `current` 链接切换之后，任何**新的** `vp` 调用都会使用新二进制。当前正在运行的进程会继续执行磁盘上旧版本的二进制文件：

- **Unix**：旧二进制仍然有效，因为 Unix 不会在所有文件描述符关闭之前删除打开的文件
- **Windows**：运行中的旧 `.exe` 文件会被锁定，但由于我们安装到的是**新版本目录**（而不是原地覆盖），因此不会发生冲突。旧版本目录会被保留（在“最近 5 个”清理策略中保留）

### 回滚设计

`--rollback` 标志会将 `current` 符号链接切换到之前活动的版本。

为了跟踪上一个版本，可以：

1. 在更新前读取 `current` 符号链接目标
2. 更新后，将上一个版本写入 `~/.vite-plus/.previous-version`

对于 `--rollback`：

1. 读取 `~/.vite-plus/.previous-version`
2. 验证该版本目录仍然存在
3. 切换 `current` 符号链接使其指向该目录
4. 更新 `.previous-version`，使其指向我们刚刚回滚离开的版本

### 错误处理

| 错误                           | 恢复方式                                                      |
| ----------------------------- | ------------------------------------------------------------- |
| 下载期间网络失败              | 清理未完成的临时文件，以有帮助的消息退出                      |
| 完整性不匹配（SHA-512）       | 删除已下载文件，报告预期与实际哈希，中止                     |
| tarball 损坏                  | 验证解压是否成功，若部分完成则清理版本目录                    |
| `vp install` 失败             | 删除版本目录，保持当前版本不变                                |
| 磁盘空间不足                  | 检测并报告，清理部分状态                                      |
| 权限被拒绝                    | 报告并建议检查目录所有权                                      |
| registry 返回错误             | 解析 npm 错误 JSON，显示人类可读的消息                        |

核心原则：**只有在所有切换前步骤成功后，才会交换 `current` 符号链接。** 如果任何切换前步骤失败，现有安装不会受到影响。切换后的操作（shim 刷新、旧版本清理）都是非致命的——它们的错误只会作为警告打印到 stderr，不会回滚更新。

### 文件结构

```
crates/vite_global_cli/
├── src/
│   ├── commands/
│   │   ├── upgrade/
│   │   │   ├── mod.rs        # 模块根，公开 execute() 函数
│   │   │   ├── registry.rs   # npm registry 客户端（版本解析、tarball URL）
│   │   │   ├── platform.rs   # 平台检测（os、arch、libc）
│   │   │   ├── download.rs   # HTTP 下载 + tarball 解压
│   │   │   └── install.rs    # 解压、依赖安装、符号链接切换、清理
│   │   ├── mod.rs            # 添加 upgrade 模块
│   │   └── ...
│   └── cli.rs                # 添加 Upgrade 命令变体
```

### 平台检测

```rust
fn detect_platform() -> Result<String, Error> {
    let os = std::env::consts::OS;       // "macos", "linux", "windows"
    let arch = std::env::consts::ARCH;   // "x86_64", "aarch64"

    let os_name = match os {
        "macos" => "darwin",
        "linux" => "linux",
        "windows" => "win32",
        _ => return Err(Error::UnsupportedPlatform(os.into())),
    };

    let arch_name = match arch {
        "x86_64" => "x64",
        "aarch64" => "arm64",
        _ => return Err(Error::UnsupportedArch(arch.into())),
    };

    if os_name == "linux" {
        let libc = detect_libc(); // "gnu" or "musl"
        Ok(format!("{os_name}-{arch_name}-{libc}"))
    } else if os_name == "win32" {
        Ok(format!("{os_name}-{arch_name}-msvc"))
    } else {
        Ok(format!("{os_name}-{arch_name}"))
    }
}
```

### Registry 客户端

使用 `reqwest`（已通过 `vite_js_runtime` 成为依赖）进行 HTTP 请求：

```rust
async fn resolve_version(registry: &str, version_or_tag: &str) -> Result<PackageMetadata, Error> {
    let url = format!("{}/vite-plus-cli/{}", registry, version_or_tag);
    let response = reqwest::get(&url).await?.json::<PackageMetadata>().await?;
    Ok(response)
}
```

### CLI 集成

在 `cli.rs` 中向 `Commands` 枚举添加 `Upgrade`：

```rust
/// 将 vp 本身更新到最新版本
#[command(name = "upgrade", visible_alias = "upgrade")]
Upgrade {
    /// 目标版本（默认：latest）
    version: Option<String>,

    /// npm dist-tag（默认：latest）
    #[arg(long, default_value = "latest")]
    tag: String,

    /// 仅检查更新，不安装
    #[arg(long)]
    check: bool,

    /// 回退到上一个版本
    #[arg(long)]
    rollback: bool,

    /// 即使已是最新也强制重装
    #[arg(long)]
    force: bool,

    /// 抑制输出
    #[arg(long)]
    silent: bool,

    /// 自定义 npm registry URL
    #[arg(long)]
    registry: Option<String>,
},
```

## 设计决策

### 1. 命令名称：`upgrade`

**决策**：使用 `vp upgrade`（带连字符）。

**考虑过的替代方案**：

- `vp upgrade` — 被 Deno、Bun、proto 使用；更短，但与 `vp update`（包）容易混淆
- `vp self upgrade` — 被 rustup 使用（`rustup self update`）；需要子命令分组

**理由**：

- 符合 pnpm（`pnpm upgrade`）和 mise（`mise upgrade`）的约定
- 与 `vp update`（用于更新 npm 包）完全没有歧义
- 连字符与 `vp env` 中的 `list-remote` 保持一致
- 没有 upgrade 命令的工具（fnm、volta、nvm）需要重新运行安装脚本 —— 用户体验更差
- `upgrade` 被注册为一个可见别名，因此 `vp upgrade` 也能工作（符合 Deno/Bun/proto 用户的预期）

### 2. 纯 Rust 实现（不重新执行 Shell 脚本）

**决策**：完全使用 Rust 实现更新逻辑。

**理由**：

- 不依赖已安装的 bash 或 curl
- 更好的错误处理和进度报告
- 跨平台行为一致
- `install.sh` 脚本仅保留用于首次安装

### 3. 复用 npm 分发渠道

**决策**：从 `install.sh` 使用的同一个 npm 注册表下载 tarball。

**理由**：

- 不需要新的基础设施
- 相同的发布流水线，相同的制品
- 通过 `--registry` 或 `NPM_CONFIG_REGISTRY` 支持自定义注册表和镜像
- 企业代理后的用户通常已经配置好了 npm 注册表访问

### 4. 不自动检查更新

**决策**：不要在每次调用 `vp` 时检查更新。

**理由**：

- 避免意外的网络请求拖慢命令执行
- 避免隐私问题（每次运行都“回传”）
- 如果用户愿意，可以通过自己的 cron/launchd 选择启用定期检查
- 未来可以在适当的用户主动选择机制下重新考虑作为增强功能

### 5. 保留 3 个版本以便回滚

**决策**：保持与 `install.sh` 相同的清理策略（按创建时间保留最近 3 个版本，并带有受保护版本）。

**理由**：

- 与现有 `install.sh` 行为一致（按创建时间排序，而不是 semver）
- 在不无限制占用磁盘空间的前提下提供回滚安全保障
- 每个版本约为 ~20-30MB，因此 3 个版本总计约为 ~60-90MB
- 当前活动版本和上一个版本始终受到清理保护，防止降级后被意外删除

## 实现阶段

### 阶段 0（P0）：核心自更新

**范围：**

- `vp upgrade` — 下载并安装最新版本
- `vp upgrade <version>` — 安装指定版本
- `--tag`、`--force`、`--silent` 标志
- 平台检测、npm 注册表查询、下载、解压、符号链接切换
- 版本清理（保留 3 个）
- 带有干净回滚的错误处理

**需要创建/修改的文件：**

- `crates/vite_global_cli/src/commands/upgrade/mod.rs`（新建）
- `crates/vite_global_cli/src/commands/upgrade/registry.rs`（新建）
- `crates/vite_global_cli/src/commands/upgrade/platform.rs`（新建）
- `crates/vite_global_cli/src/commands/upgrade/download.rs`（新建）
- `crates/vite_global_cli/src/commands/upgrade/install.rs`（新建）
- `crates/vite_global_cli/src/commands/mod.rs`（添加模块）
- `crates/vite_global_cli/src/cli.rs`（添加命令变体 + 路由）

**成功标准：**

- [ ] `vp upgrade` 能下载并安装最新版本
- [ ] `vp upgrade 0.x.y` 能安装指定版本
- [ ] 下载的 tarball 会根据 npm 注册表中的 `integrity`（SHA-512）进行校验
- [ ] 运行中的二进制文件在更新期间不受影响
- [ ] 更新失败时保持当前安装不变
- [ ] 旧版本会被清理（最多保留 3 个）
- [ ] 可在 macOS、Linux 和 Windows 上运行

### 阶段 1（P1）：回滚与检查

**范围：**

- 带有 `.previous-version` 跟踪的 `--rollback` 标志
- 用于检查更新可用性的 `--check` 标志

**成功标准：**

- [ ] `vp upgrade --rollback` 可回退到上一个版本
- [ ] `vp upgrade --check` 可显示可用更新而不进行安装

### 阶段 2（P2）：增强用户体验

**范围：**

- 下载进度条（使用 `indicatif` 或类似工具）
- 更新成功消息中显示发布说明 URL
- 用于自定义 npm 注册表的 `--registry` 标志

**成功标准：**

- [ ] 大型二进制文件的下载进度可见
- [ ] 成功更新后会显示发布说明链接

## 测试策略

### 单元测试

- 版本比较逻辑（semver 解析、相等性、排序）
- 平台检测（mock `std::env::consts`）
- 注册表 URL 构造
- 符号链接切换的原子性

### 集成测试

- 从测试 npm tag 下载并解压一个真实包
- 验证安装后的版本目录结构
- 验证 `current` 符号链接指向新版本
- 验证旧版本清理

### 快照测试

```bash
# 测试：upgrade 检查（mock 注册表响应）
pnpm -F vite-plus-cli snap-test upgrade-check

# 测试：升级到指定版本
pnpm -F vite-plus-cli snap-test upgrade-version
```

### 手动测试

```bash
# 构建并安装当前版本
pnpm bootstrap-cli

# 运行 upgrade 到最新已发布版本
vp upgrade

# 验证版本已变更
vp -V

# 测试回滚
vp upgrade --rollback
vp -V
```

## 未来增强

- **自动检查更新**：带有用户主动选择通知的周期性后台检查（例如每天一次，缓存结果）
- **更新通道**：允许通过配置文件固定到某个通道（stable、beta、nightly）
- **增量更新**：只下载变更的文件，而不是完整 tarball
- **Windows 支持**：为 Windows 原生安装扩展基于 PowerShell 的更新机制

## 参考资料

- [RFC：全局 CLI（Rust 二进制）](./global-cli-rust-binary.md)
- [RFC：拆分全局 CLI](./split-global-cli.md)
- [RFC：Env 命令](./env-command.md)
- [安装脚本](../packages/cli/install.sh)
- [发布工作流](../.github/workflows/release.yml)
