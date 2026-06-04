# RFC: 全局 CLI Rust 二进制

## 状态

已实现

## 背景

目前，vite+ 全局 CLI（`packages/global` 中的 `vite-plus-cli`）使用 Node.js 作为入口点：

```
bin/vite (shell script) → src/index.ts (Node.js) → Rust bindings (NAPI)
```

这种架构要求用户在使用全局 CLI 之前必须预先安装 Node.js。虽然核心功能已经通过 NAPI 绑定在 Rust 中实现，但这个 Node.js 依赖会给想要尝试 vite+ 的新用户带来摩擦。

### 当前痛点

1. **安装前置条件**：用户必须先安装 Node.js 才能使用 vite+
2. **版本兼容性**：不同的 Node.js 版本可能会引发兼容性问题
3. **上手阻碍**：新用户不能简单地下载并运行 CLI
4. **分发复杂度**：需要同时管理 npm 包和原生绑定

### 机会

`vite_js_runtime` crate 已经提供了健壮的 Node.js 下载与管理能力：

- 自动解析并下载 Node.js 版本
- 多平台支持（Linux、macOS、Windows；x64、arm64）
- 具备 ETag 支持的智能缓存
- 通过哈希校验提升安全性
- 通过 `package.json` 中的 `devEngines.runtime` 实现按项目版本控制

通过将全局 CLI 变为 Rust 二进制入口：

1. **用户可以立即下载并运行**，无需预先安装 Node.js
2. **项目通过 `devEngines.runtime` 配置控制其 JS 运行时版本**
3. **跨团队保持一致的开发环境**——每个人都使用相同的运行时版本
4. **没有系统级 Node.js 冲突**——每个项目都可以指定所需版本

核心创新在于增强 JS 运行时管理，而不是消除 Node.js 的使用。CLI 将自动下载并管理 Node.js 来执行包管理器和 JS 脚本。

## 目标

1. **移除 Node.js 安装前置条件**：创建一个独立的 Rust 二进制，用户可以直接下载并运行，无需在系统上预先安装 Node.js
2. **增强 JS 运行时管理**：使用 `vite_js_runtime` 自动下载、缓存并管理 Node.js 版本，从而实现：
   - 为包管理器和 CLI 操作自动提供 Node.js
   - 通过 `package.json` 中的 `devEngines.runtime` 实现按项目的运行时版本控制
   - 在开发环境之间保持一致的运行时版本
3. **保持当前功能**：`packages/global` 中的所有命令都继续通过打包的 JS 脚本工作
4. **保持向后兼容**：现有命令行接口和行为保持不变
5. **跨平台分发**：通过平台特定二进制支持 Linux、macOS 和 Windows

## 非目标

1. 替换本地 CLI（`packages/cli`）——它仍然是一个 Node.js 包
2. 移除 NAPI 绑定——它们将与本地 CLI 使用场景共存
3. 更改命令语法或行为
4. 支持仅 JavaScript 执行模式（始终使用受管理运行时）

## 用户故事

### 故事 1：首次用户安装

```bash
# 之前（需要 Node.js）
npm install -g vite-plus-cli
vp create my-app

# 之后（不需要 Node.js）
curl -fsSL https://vite.plus | bash
# 或者
brew install vite-plus
# 或者直接下载二进制文件

vp create my-app  # 立即可用
```

### 故事 2：运行包管理器命令

```bash
# 用户运行 install 命令（系统上未预装 Node.js）
vp install lodash

# CLI 自动：
# 1. 检查受管 Node.js 是否已缓存
# 2. 若不存在则下载 Node.js 22.22.0
# 3. 检测工作区包管理器（pnpm/npm/yarn）
# 4. 如有需要则下载包管理器
# 5. 执行：node /path/to/pnpm install lodash
```

**注意：** 包管理器（pnpm、npm、yarn）本身就是 Node.js 程序，因此 CLI 使用受管 Node.js 来运行它们。关键收益在于用户无需预先安装 Node.js——CLI 会自动处理。

### 故事 3：需要 JavaScript 执行的命令

```bash
# 用户运行一个需要 JS 的命令
vp create --template create-vite my-app

# CLI 自动：
# 1. 检查受管 Node.js 是否已缓存
# 2. 若不存在则下载 Node.js 22.22.0
# 3. 使用受管 Node.js 执行 create-vite
```

## 技术设计

### 新的 Crate：`vite_global_cli`

创建一个新的 crate：`crates/vite_global_cli`，编译为独立二进制。

```
crates/
├── vite_global_cli/         # 新 crate
│   ├── Cargo.toml
│   └── src/
│       ├── main.rs          # 入口点
│       ├── cli.rs           # CLI 解析（clap）
│       ├── commands/        # 命令实现
│       │   ├── mod.rs
│       │   ├── pm.rs        # 包管理器命令
│       │   ├── new.rs       # 项目脚手架
│       │   ├── migrate.rs   # 迁移命令
│       │   └── ...
│       ├── js_executor.rs   # 通过 vite_js_runtime 执行 JS
│       └── workspace.rs     # 工作区检测（复用 vite_task）
├── vite_js_runtime/         # 已有 - Node.js 管理
├── vite_task/               # 已有 - 任务执行
└── ...
```

### 命令分类

根据当前全局 CLI 分析，命令分为四类：

#### 类别 A：包管理器命令（Rust CLI + 受管 Node.js）

这些命令封装现有包管理器（pnpm/npm/yarn），而它们本身就是 Node.js 程序。Rust CLI 负责参数解析和工作区检测，然后使用受管 Node.js 执行真实的包管理器：

| 命令                  | 描述             | 实现方式                              |
| --------------------- | ---------------- | ------------------------------------- |
| `install [packages]`  | 安装依赖         | Rust CLI → 受管 Node.js → pnpm/npm/yarn |
| `add <packages>`      | 添加包           | Rust CLI → 受管 Node.js → pnpm/npm/yarn |
| `remove <packages>`   | 移除包           | Rust CLI → 受管 Node.js → pnpm/npm/yarn |
| `update [packages]`   | 更新包           | Rust CLI → 受管 Node.js → pnpm/npm/yarn |
| `outdated [packages]` | 检查过期         | Rust CLI → 受管 Node.js → pnpm/npm/yarn |
| `dedupe`              | 去重依赖         | Rust CLI → 受管 Node.js → pnpm/npm/yarn |
| `why <package>`       | 解释依赖         | Rust CLI → 受管 Node.js → pnpm/npm/yarn |
| `info <package>`      | 查看包信息       | Rust CLI → 受管 Node.js → pnpm/npm/yarn |
| `link [package]`      | 链接包           | Rust CLI → 受管 Node.js → pnpm/npm/yarn |
| `unlink [package]`    | 取消链接包       | Rust CLI → 受管 Node.js → pnpm/npm/yarn |
| `dlx <package>`       | 执行包           | Rust CLI → 受管 Node.js → pnpm/npm dlx  |
| `pm <subcommand>`     | 转发给包管理器   | Rust CLI → 受管 Node.js → pnpm/npm/yarn |

**注意：** 由于 pnpm、npm 和 yarn 都是 Node.js 程序，这些命令都需要 Node.js 执行。全局 CLI 会在运行任何 PM 命令时使用 `vite_js_runtime` 自动下载并管理 Node.js。

#### 类别 B：JS 脚本命令（Rust CLI + 受管 Node.js + JS 脚本）

这些命令执行随 CLI 打包的 JavaScript 脚本：

| 命令             | JS 依赖                                | 实现方式                         |
| ---------------- | -------------------------------------- | -------------------------------- |
| `new [template]` | 远程模板（create-vite 等）            | Rust CLI → 受管 Node.js → JS 脚本 |
| `migrate [path]` | 迁移规则与转换                        | Rust CLI → 受管 Node.js → JS 脚本 |
| `--version`      | 版本显示逻辑                          | Rust CLI → 受管 Node.js → JS 脚本 |

#### 类别 C：本地 CLI 委派（Rust CLI + 受管 Node.js + JS 入口点）

这些命令通过 JS 入口点（`dist/index.js`）委派给本地 `vite-plus` 包，该入口点负责检测/安装本地 vite-plus：

| 命令                                                          | 实现方式                                           |
| ------------------------------------------------------------- | -------------------------------------------------- |
| `dev`, `build`, `test`, `lint`, `fmt`, `run`, `preview`, `cache` | Rust CLI → 受管 Node.js → `dist/index.js` → 本地 CLI |

**注意：** 全局 CLI 使用 `vite_js_runtime` 确保 Node.js 可用，并从项目的 `devEngines.runtime` 配置中解析版本。JS 入口点负责检测 vite-plus 是否已在本地安装，并委派给本地 CLI 的 `dist/bin.js`。

#### 类别 D：纯 Rust 命令（不需要 Node.js）

只有这些命令可以在没有任何 Node.js 的情况下运行：

| 命令   | 描述   | 实现方式 |
| ------ | ------ | -------- |
| `help` | 显示帮助 | 纯 Rust（clap） |

**注意：** 即使是 `help`，如果用户运行 `vite help new` 并需要显示特定于 JS 的帮助，也可能触发 Node.js 下载。

### 架构

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        vite_global_cli（Rust 二进制）                        │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐   │
│  │   CLI 解析器     │  │ 工作区检测       │  │   VITE_GLOBAL_CLI_JS_SCRIPTS_DIR│   │
│  │   (clap)         │  │ (来自 vite_task) │  │   （打包脚本路径）         │   │
│  └────────┬─────────┘  └────────┬─────────┘  └────────────┬─────────────┘   │
│           │                     │                         │                 │
│  ┌────────▼─────────────────────▼─────────────────────────▼───────────────┐ │
│  │                          命令路由器                                     │ │
│  └───┬──────────────────┬──────────────────┬──────────────────┬───────────┘ │
│      │                  │                  │                  │             │
│  ┌───▼────────────┐ ┌───▼────────────┐ ┌───▼────────────┐ ┌───▼──────────┐ │
│  │ 类别 A         │ │ 类别 B         │ │ 类别 C         │ │ 类别 D       │ │
│  │ PM 命令        │ │ JS 脚本        │ │ 委派           │ │ 纯 Rust      │ │
│  │ - install      │ │ - new          │ │ - dev          │ │ - help       │ │
│  │ - add          │ │ - migrate      │ │ - build        │ │              │ │
│  │ - remove       │ │ - --version    │ │ - test         │ │              │ │
│  │ - update       │ │                │ │ - lint         │ │              │ │
│  │ - ...          │ │                │ │ - ...          │ │              │ │
│  └───────┬────────┘ └───────┬────────┘ └───────┬────────┘ └──────────────┘ │
│          │                  │                  │                           │
└──────────┼──────────────────┼──────────────────┼───────────────────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
┌─────────────────────────────────────┐    ┌────────────────────────────────┐
│    流程 1：CLI 运行时               │    │    流程 2：项目运行时          │
│    （类别 A & B）                   │    │    （类别 C）                 │
│                                     │    │                                │
│  download_runtime_for_project(      │    │  download_runtime_for_project( │
│    cli_package_json_dir             │    │    project_dir                 │
│  )                                  │    │  )                             │
│                                     │    │                                │
│  vite_js_runtime 读取：             │    │  vite_js_runtime 读取：        │
│  packages/global/package.json       │    │  <project>/package.json        │
│  └─> devEngines.runtime: "22.22.0"  │    │  └─> devEngines.runtime        │
│                                     │    │                                │
└─────────────┬───────────────────────┘    └─────────────┬──────────────────┘
              │                                          │
              ▼                                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          vite_js_runtime crate                              │
│                                                                             │
│  内置逻辑（两个流程相同）：                                                  │
│  1. 从提供的路径读取 package.json                                           │
│  2. 提取 devEngines.runtime.version                                         │
│  3. 如有需要则解析 semver 范围                                              │
│  4. 检查缓存（~/.vite-plus/js_runtime/node/{version}/）                   │
│  5. 若未缓存则下载 Node.js                                                 │
│  6. 返回带有二进制路径的 JsRuntime                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
              │                                          │
              ▼                                          ▼
┌─────────────────────────────────────┐    ┌────────────────────────────────┐
│    受管 Node.js                     │    │    受管 Node.js                │
│    （CLI 的版本：22.22.0）          │    │    （项目的版本）              │
│                                     │    │                                │
│  ┌─────────────┐  ┌──────────────┐  │    │  ┌──────────────────────────┐  │
│  │ pnpm/npm/   │  │ 打包的      │  │    │  │ dist/index.js            │  │
│  │ yarn        │  │ JS 脚本     │  │    │  │ → 检测/安装本地           │  │
│  │ (类 A)      │  │ (类 B)      │  │    │  │ → 委派给本地 CLI         │  │
│  └─────────────┘  └──────────────┘  │    │  └──────────────────────────┘  │
└─────────────────────────────────────┘    └────────────────────────────────┘

图例：
- 两条流程都使用 download_runtime_for_project()，只是目录路径不同
- vite_js_runtime 在内部处理所有 devEngines.runtime 逻辑
- 类别 C 通过 dist/index.js 委派，而它负责本地 CLI 检测
- 类别 D：不需要 Node.js（纯 Rust）
```

### JS 执行器模块

当需要执行 JavaScript 时，执行器会使用 `download_runtime_for_project()`，但传入不同的目录路径：

```rust
// crates/vite_global_cli/src/js_executor.rs

use vite_js_runtime::download_runtime_for_project;
use std::process::Command;

pub struct JsExecutor {
    cli_runtime: Option<JsRuntime>,      // 为 CLI 命令缓存的运行时
    project_runtime: Option<JsRuntime>,  // 为项目委派缓存的运行时
    scripts_dir: PathBuf,                // 来自 VITE_GLOBAL_CLI_JS_SCRIPTS_DIR
}

impl JsExecutor {
    pub fn new(scripts_dir: PathBuf) -> Self {
        Self {
            cli_runtime: None,
            project_runtime: None,
            scripts_dir,
        }
    }

    /// 获取 CLI 自身 package.json 的目录（scripts_dir 的父目录）
    fn get_cli_package_dir(&self) -> PathBuf {
        self.scripts_dir.parent().unwrap().to_path_buf()
    }

    /// 获取 CLI 自身命令的运行时（类别 A & B）
    /// 使用 CLI 的 package.json 中的 devEngines.runtime（例如 "22.22.0"）
    pub async fn ensure_cli_runtime(&mut self) -> Result<&JsRuntime, Error> {
        if self.cli_runtime.is_none() {
            // download_runtime_for_project 会从
            // 给定目录中的 package.json 读取 devEngines.runtime
            let cli_dir = self.get_cli_package_dir();
            let runtime = download_runtime_for_project(&cli_dir).await?;
            self.cli_runtime = Some(runtime);
        }
        Ok(self.cli_runtime.as_ref().unwrap())
    }

    /// 获取项目委派所需的运行时（类别 C）
    /// 使用项目 package.json 中的 devEngines.runtime
    pub async fn ensure_project_runtime(&mut self, project_path: &Path) -> Result<&JsRuntime, Error> {
        if self.project_runtime.is_none() {
            // download_runtime_for_project 会从
            // 项目的 package.json 中读取 devEngines.runtime
            let runtime = download_runtime_for_project(project_path).await?;
            self.project_runtime = Some(runtime);
        }
        Ok(self.project_runtime.as_ref().unwrap())
    }

    /// 执行 CLI 打包的 JS 脚本（类别 A & B）
    pub async fn execute_cli_script(&mut self, script_name: &str, args: &[&str]) -> Result<ExitStatus, Error> {
        let runtime = self.ensure_cli_runtime().await?;
        let script_path = self.scripts_dir.join(script_name);
        let status = Command::new(runtime.get_binary_path())
            .arg(&script_path)
            .args(args)
            .status()?;
        Ok(status)
    }

    /// 执行包管理器命令（类别 A）
    pub async fn execute_pm_command(&mut self, pm: &str, args: &[&str]) -> Result<ExitStatus, Error> {
        let runtime = self.ensure_cli_runtime().await?;
        // PM 二进制文件与 node 位于同一 bin 目录
        let pm_path = runtime.get_bin_prefix().join(pm);
        let status = Command::new(runtime.get_binary_path())
            .arg(&pm_path)
            .args(args)
            .status()?;
        Ok(status)
    }

    /// 委派给本地 vite-plus CLI（类别 C）
    ///
    /// 通过 `dist/index.js` 传递命令，它会处理：
    /// - 检测 vite-plus 是否已在本地安装
    /// - 如果它是依赖但尚未安装，则自动安装
    /// - 如果未找到则提示用户添加
    /// - 委派给本地 CLI 的 `dist/bin.js`
    pub async fn delegate_to_local_cli(
        &mut self,
        project_path: &Path,
        args: &[&str]
    ) -> Result<ExitStatus, Error> {
        // 通过 download_runtime_for_project 使用项目的运行时版本
        let runtime = self.ensure_project_runtime(project_path).await?;

        // 获取 JS 入口点（dist/index.js）
        let entry_point = self.scripts_dir.join("index.js");

        // 使用命令和参数执行 dist/index.js
        // JS 层负责检测/安装本地 vite-plus
        let status = Command::new(runtime.get_binary_path())
            .arg(&entry_point)
            .args(args)
            .current_dir(project_path)
            .status()?;
        Ok(status)
    }
}
```

**关键点：**

- 两条流程都使用 `download_runtime_for_project()`——唯一差异只是目录路径
- `vite_js_runtime` 在内部处理所有 `devEngines.runtime` 逻辑（读取 package.json、解析版本、缓存）
- CLI 命令使用 CLI 自己的 package.json 目录（例如 `packages/global/`）
- 项目委派通过 `dist/index.js` 进行，后者负责本地 CLI 检测
- JS 入口点负责本地 CLI 检测与委派

### 实施阶段

#### 阶段 1：基础设施与所有包管理器命令

**范围：**

- 搭建 `vite_global_cli` crate 结构
- 使用 clap 实现 CLI 解析
- 实现工作区检测（复用 `vite_task`）
- 实现包管理器检测与封装
- 实现所有包管理器命令：
  - `install [packages]` / `i` - 安装依赖或添加包
  - `add <packages>` - 向依赖中添加包
  - `remove <packages>` / `rm`, `un`, `uninstall` - 移除包
  - `update [packages]` / `up` - 更新包
  - `outdated [packages]` - 检查过期包
  - `dedupe` - 依赖去重
  - `why <package>` / `explain` - 解释某个包为何被安装
  - `info <package>` / `view`, `show` - 从 registry 查看包信息
  - `link [package|dir]` / `ln` - 链接包
  - `unlink [package|dir]` - 取消链接包
  - `dlx <package>` - 无需安装即可执行包
  - `pm <subcommand>` - 转发给包管理器（list、prune、pack）

**要创建的文件：**

- `crates/vite_global_cli/Cargo.toml`
- `crates/vite_global_cli/src/main.rs`
- `crates/vite_global_cli/src/cli.rs` # 顶层 clap 解析器；为所有 PM 子命令展平 `vite_pm_cli::PackageManagerCommand`，并拦截 `--global` 以进行受管安装
- `crates/vite_global_cli/src/commands/mod.rs`
- `crates/vite_global_cli/src/commands/new.rs` # 项目脚手架
- `crates/vite_global_cli/src/commands/migrate.rs` # 迁移命令
- `crates/vite_global_cli/src/commands/delegate.rs` # 本地 CLI 委派
- `crates/vite_global_cli/src/commands/version.rs` # 版本显示
- `crates/vite_global_cli/src/js_executor.rs`
- `crates/vite_global_cli/src/error.rs`

> **注意：** PM 命令的 clap 定义和分发（`add`、`install`、`remove`、`update`、`dedupe`、`outdated`、`why`、`info`、`link`、`unlink`、`dlx`、`pm <subcmd>`）位于共享的 `crates/vite_pm_cli/` crate 中，因此它们可以被 `vite_global_cli` 和本地 CLI 的 NAPI 绑定（`packages/cli/binding/`）复用。之前位于 `crates/vite_global_cli/src/commands/` 下的逐个命令模块（`add.rs`、`install.rs`、`remove.rs`、…）已被移除，改为使用 `vite_pm_cli::dispatch`。

**成功标准：**

- [x] 所有 PM 命令都可在未预装 Node.js 的情况下运行（使用受管 Node.js）
- [x] 首次运行 PM 命令时会自动下载受管 Node.js
- [x] 自动在项目中检测 pnpm/npm/yarn
- [x] 如果包管理器不可用，则通过受管 Node.js 下载
- [x] 所有 PM 命令与当前 Node.js CLI 的行为一致
- [x] `--help` 文档与当前 CLI 匹配
- [x] 命令别名工作正常（i、rm、up 等）

#### 阶段 2：项目脚手架

**范围：**

- 为内置模板实现 `new` 命令（vite:monorepo 等）
- 为远程模板实现 JS 执行器
- 与 `vite_js_runtime` 集成以下载 Node.js

**成功标准：**

- [x] `vp create vite:monorepo` 在没有 Node.js 的情况下可用
- [x] `vp create create-vite` 会下载 Node.js 并正确执行

#### 阶段 3：迁移与其余命令

**范围：**

- 实现 `migrate` 命令
- 实现本地 CLI 委派
- 实现 `--version` 和帮助系统

**成功标准：**

- [x] `vp migrate` 正常工作
- [x] 本地命令正确委派
- [x] 与 Node.js CLI 完全功能对等

#### 阶段 4：分发与测试

**范围：**

- 搭建跨平台构建（Linux、macOS、Windows）
- 创建安装脚本
- 添加到 Homebrew、cargo install 等
- 全面测试

**成功标准：**

- [x] 二进制可通过多种渠道获取
- [x] 安装脚本在所有平台上正常工作
- [x] 所有 snap 测试通过

### 依赖变更

**`vite_global_cli` 的新依赖：**

```toml
[dependencies]
vite_js_runtime = { path = "../vite_js_runtime" }
vite_shared = { path = "../vite_shared" }  # 用于缓存目录等
vite_path = { path = "../vite_path" }

clap = { version = "4", features = ["derive"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
anyhow = "1"
thiserror = "1"
```

### 配置

全局 CLI 将使用与当前 CLI 相同的配置位置：

- **主目录**：`~/.vite-plus/`（通过 `vite_shared::get_vite_plus_home`）
- **Node.js 运行时**：`~/.vite-plus/js_runtime/node/{version}/`
- **包管理器**：根据 lockfile 或 package.json 自动检测

### JS 运行时版本管理

根据命令类别，有 **两种不同的运行时解析策略**：

#### 策略 1：全局 CLI 命令（类别 A & B）

对于包管理器命令、`new`、`migrate` 和 `--version`，运行时版本来自 **全局 CLI 自身的 package.json**（`packages/global/package.json`）：

```json
{
  "name": "vite-plus-cli",
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "22.22.0"
    }
  }
}
```

**理由：**

- 这些命令属于全局 CLI 的功能
- 它们应使用一致、经过测试的 Node.js 版本
- 版本可以随 CLI 发布而更新
- 用户不需要项目也能运行 `vp create` 或 `vp install`

#### 策略 2：本地 CLI 委派（类别 C）

对于委派给本地 `vite-plus` 的命令（`dev`、`build`、`test`、`lint` 等），运行时版本来自 **当前项目的 package.json**：

```json
{
  "name": "my-project",
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "^20.18.0"
    }
  }
}
```

**类别 C 的解析顺序：**

1. 项目的 `devEngines.runtime`（如果存在）
2. 回退到 CLI 的默认版本（来自 `packages/global/package.json`）

**理由：**

- 项目在构建时可能需要特定的 Node.js 版本
- 团队成员需要一致的运行时版本以保证可复现性
- 不同项目可以使用不同的 Node.js 版本

#### 汇总表

| 命令类别        | 运行时来源                         | 示例命令                    |
| --------------- | ---------------------------------- | --------------------------- |
| A：PM 命令      | CLI 的 package.json                | install、add、remove、update |
| B：JS 脚本      | CLI 的 package.json                | new、migrate、--version      |
| C：委派         | 项目的 package.json → CLI 回退     | dev、build、test、lint       |
| D：纯 Rust      | 无                                 | help                         |

**收益：**

- **职责分离**：CLI 命令使用 CLI 的运行时，项目命令使用项目的运行时
- **按项目控制**：每个项目都能为构建指定所需的运行时版本
- **团队一致性**：所有开发者在同一项目中使用相同的运行时版本
- **无系统冲突**：不同项目可以使用不同的 Node.js 版本
- **自动供给**：如果未缓存，运行时会自动下载

这与现有 `vite_js_runtime` crate 的能力集成（参见 [js-runtime RFC](./js-runtime.md)）。

### 打包与分发策略

由于 `new` 和 `migrate` 命令仍然通过 JS 脚本实现，我们需要一种混合分发策略，同时提供 Rust 二进制和 JS 脚本。

#### 平台特定的 npm 包

创建仅包含原生二进制的平台特定 npm 包：

| 包名                                      | 平台     | 架构                |
| ----------------------------------------- | -------- | ------------------- |
| `@voidzero-dev/vite-plus-cli-darwin-arm64` | macOS    | ARM64（Apple Silicon） |
| `@voidzero-dev/vite-plus-cli-darwin-x64`   | macOS    | Intel x64           |
| `@voidzero-dev/vite-plus-cli-linux-arm64`  | Linux    | ARM64               |
| `@voidzero-dev/vite-plus-cli-linux-x64`    | Linux    | Intel x64           |
| `@voidzero-dev/vite-plus-cli-win32-arm64`  | Windows  | ARM64               |
| `@voidzero-dev/vite-plus-cli-win32-x64`    | Windows  | Intel x64           |

**包结构：**

```
@voidzero-dev/vite-plus-cli-darwin-arm64/
├── package.json
└── vite                    # 原生二进制（Unix 上无扩展名）

@voidzero-dev/vite-plus-cli-win32-x64/
├── package.json
└── vite.exe                # 原生二进制（Windows）
```

**平台 package.json：**

```json
{
  "name": "@voidzero-dev/vite-plus-cli-darwin-arm64",
  "version": "1.0.0",
  "os": ["darwin"],
  "cpu": ["arm64"],
  "main": "vite",
  "files": ["vite"]
}
```

#### 主 npm 包（vite-plus-cli）

主 `vite-plus-cli` 包使用 `optionalDependencies` 来安装正确的平台二进制：

```json
{
  "name": "vite-plus-cli",
  "version": "1.0.0",
  "bin": {
    "vite": "./bin/vite"
  },
  "optionalDependencies": {
    "@voidzero-dev/vite-plus-cli-darwin-arm64": "1.0.0",
    "@voidzero-dev/vite-plus-cli-darwin-x64": "1.0.0",
    "@voidzero-dev/vite-plus-cli-linux-arm64": "1.0.0",
    "@voidzero-dev/vite-plus-cli-linux-x64": "1.0.0",
    "@voidzero-dev/vite-plus-cli-win32-arm64": "1.0.0",
    "@voidzero-dev/vite-plus-cli-win32-x64": "1.0.0"
  }
}
```

**二进制解析（`bin/vite`）：**

`bin/vite` 脚本需要重构，以便从 `optionalDependencies` 中找到并执行 Rust 二进制：

```javascript
#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// 平台到包的映射
const PLATFORMS = {
  'darwin-arm64': '@voidzero-dev/vite-plus-cli-darwin-arm64',
  'darwin-x64': '@voidzero-dev/vite-plus-cli-darwin-x64',
  'linux-arm64': '@voidzero-dev/vite-plus-cli-linux-arm64',
  'linux-x64': '@voidzero-dev/vite-plus-cli-linux-x64',
  'win32-arm64': '@voidzero-dev/vite-plus-cli-win32-arm64',
  'win32-x64': '@voidzero-dev/vite-plus-cli-win32-x64',
};

function getBinaryPath() {
  const binaryName = process.platform === 'win32' ? 'vp.exe' : 'vp';

  // 1. 先检查同目录下的本地二进制（本地开发）
  const localBinaryPath = join(__dirname, binaryName);
  if (existsSync(localBinaryPath)) {
    return localBinaryPath;
  }

  // 2. 从平台特定的 optionalDependency 中查找二进制
  const platform = `${process.platform}-${process.arch}`;
  const packageName = PLATFORMS[platform];

  if (!packageName) {
    throw new Error(`不支持的平台：${platform}`);
  }

  // 尝试在 node_modules 中查找二进制
  const binaryPath = join(__dirname, '..', 'node_modules', packageName, binaryName);

  if (existsSync(binaryPath)) {
    return binaryPath;
  }

  // 回退：尝试 require.resolve
  const packagePath = require.resolve(`${packageName}/package.json`);
  return join(dirname(packagePath), binaryName);
}

const binaryPath = getBinaryPath();
// 设置 VITE_GLOBAL_CLI_JS_SCRIPTS_DIR 指向 dist/index.js 所在位置
const jsScriptsDir = join(__dirname, '..');

execFileSync(binaryPath, process.argv.slice(2), {
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_GLOBAL_CLI_JS_SCRIPTS_DIR: jsScriptsDir,
  },
});
```

**工作方式：**

1. `bin/vite` 从平台特定的可选依赖中找到 Rust 二进制（`vp`）
2. 设置 `VITE_GLOBAL_CLI_JS_SCRIPTS_DIR`，指向包根目录（`dist/index.js` 所在处）
3. 使用所有参数执行 Rust 二进制
4. Rust 二进制使用 `$VITE_GLOBAL_CLI_JS_SCRIPTS_DIR/dist/index.js` 处的 JS 入口点

这确保了 npm 安装的工作方式与独立安装相同。

#### 独立安装（install.sh）

对于更喜欢不依赖 npm 的独立安装的用户：

```bash
#!/bin/bash
# https://vite.plus
#
# 环境变量：
#   VITE_PLUS_VERSION - 要安装的版本（默认：latest）
#   VITE_PLUS_INSTALL_DIR - 安装目录（默认：~/.vite-plus）
#   NPM_CONFIG_REGISTRY - 自定义 npm registry URL（默认：https://registry.npmjs.org）

set -e

VITE_PLUS_VERSION="${VITE_PLUS_VERSION:-latest}"
INSTALL_DIR="${VITE_PLUS_INSTALL_DIR:-$HOME/.vite-plus}"
NPM_REGISTRY="${NPM_CONFIG_REGISTRY:-https://registry.npmjs.org}"
NPM_REGISTRY="${NPM_REGISTRY%/}"

# 检测平台并获取版本...
# （为简洁起见省略平台检测代码）

# 设置按版本区分的目录
VERSION_DIR="$INSTALL_DIR/$VITE_PLUS_VERSION"
BIN_DIR="$VERSION_DIR/bin"
DIST_DIR="$VERSION_DIR/dist"
CURRENT_LINK="$INSTALL_DIR/current"

# 创建目录
mkdir -p "$BIN_DIR" "$DIST_DIR"

# 下载平台包（二进制 + .node 文件）
platform_url="${NPM_REGISTRY}/${package_name}/-/vite-plus-cli-${package_suffix}-${VITE_PLUS_VERSION}.tgz"
# 解压到临时目录，复制二进制到 BIN_DIR，复制 .node 文件到 DIST_DIR

# 下载主包（JS 脚本 + package.json）
main_url="${NPM_REGISTRY}/vite-plus-cli/-/vite-plus-cli-${VITE_PLUS_VERSION}.tgz"
# 解压 dist/* 到 DIST_DIR，将 package.json 复制到 VERSION_DIR

# 创建/更新 current 符号链接
ln -sfn "$VITE_PLUS_VERSION" "$CURRENT_LINK"

# Cleanup old versions (keep max 3)
cleanup_old_versions

# 将 ~/.vite-plus/current/bin 添加到 PATH
# （省略 shell 配置更新代码）
```

完整实现见 [`packages/global/install.sh`](../packages/global/install.sh)。

#### Windows 安装（install.ps1）

对于 Windows 用户，提供一个 PowerShell 脚本：

```powershell
# https://vite.plus/ps1
#
# 环境变量：
#   VITE_PLUS_VERSION - 要安装的版本（默认：latest）
#   VITE_PLUS_INSTALL_DIR - 安装目录（默认：$env:USERPROFILE\.vite-plus）
#   NPM_CONFIG_REGISTRY - 自定义 npm registry URL（默认：https://registry.npmjs.org）

$ErrorActionPreference = "Stop"

$ViteVersion = if ($env:VITE_PLUS_VERSION) { $env:VITE_PLUS_VERSION } else { "latest" }
$InstallDir = if ($env:VITE_PLUS_INSTALL_DIR) { $env:VITE_PLUS_INSTALL_DIR } else { "$env:USERPROFILE\.vite-plus" }
$NpmRegistry = if ($env:NPM_CONFIG_REGISTRY) { $env:NPM_CONFIG_REGISTRY.TrimEnd('/') } else { "https://registry.npmjs.org" }

# 检测架构并获取版本...
# （为简洁起见省略检测代码）

# 设置按版本区分的目录
$VersionDir = "$InstallDir\$ViteVersion"
$BinDir = "$VersionDir\bin"
$DistDir = "$VersionDir\dist"
$CurrentLink = "$InstallDir\current"

# 创建目录
New-Item -ItemType Directory -Force -Path $BinDir | Out-Null
New-Item -ItemType Directory -Force -Path $DistDir | Out-Null

# 下载平台包（二进制 + .node 文件）
# 将二进制解压到 BinDir，将 .node 文件解压到 DistDir

# 下载主包（JS 脚本 + package.json）
# 将 dist/* 解压到 DistDir，将 package.json 解压到 VersionDir

# 创建/更新 current junction（Windows 的符号链接等价物）
if (Test-Path $CurrentLink) {
    cmd /c rmdir "$CurrentLink" 2>$null
}
cmd /c mklink /J "$CurrentLink" "$VersionDir" | Out-Null

# Cleanup old versions (keep max 3)
Cleanup-OldVersions -InstallDir $InstallDir

# 将 $InstallDir\current\bin 添加到用户 PATH
```

完整实现见 [`packages/global/install.ps1`](../packages/global/install.ps1)。

**Windows 安装选项：**

1. **PowerShell 一行命令：**

   ```powershell
   irm https://vite.plus/ps1 | iex
   ```

2. **npm（如果已安装 Node.js）：**

   ```cmd
   npm install -g vite-plus-cli
   ```

3. **Scoop（未来支持）：**
   ```cmd
   scoop install vite-plus
   ```

#### 独立安装的目录布局

安装器支持多个版本并通过符号链接实现版本切换，而无需修改 PATH：

```
~/.vite-plus/
├── current -> 0.0.0-abc123     # 指向当前活动版本的符号链接
├── 0.0.0-abc123/               # 版本目录
│   ├── bin/
│   │   └── vp                  # 原生 Rust 二进制
│   ├── dist/
│   │   ├── index.js            # 打包后的 JS 入口点
│   │   └── *.node              # NAPI 绑定
│   └── package.json            # 用于 devEngines.runtime 配置
├── 0.0.0-def456/               # 另一个版本
│   └── ...
└── ...
```

**关键特性：**

- PATH points to `~/.vite-plus/current/bin` (stable location)
- Installing a new version updates the `current` symlink
- Old versions are automatically cleaned up (keeps max 3 versions)

#### Rust 二进制如何使用 JS 脚本

当 Rust 二进制需要执行 JS（用于 `new`、`migrate`、`--version` 或 PM 命令）时：

1. 检查 `VITE_GLOBAL_CLI_JS_SCRIPTS_DIR` 环境变量（可选）
2. 如果未设置，则通过查找相对于二进制的 `dist/index.js` 自动检测
3. 如果未缓存，则通过 `vite_js_runtime` 下载 Node.js（版本来自 `package.json` 中的 `devEngines.runtime`）
4. 使用受管 Node.js 执行 JS 入口点，并传入命令和参数

**自动检测逻辑：**

- 对于 npm 安装：二进制位于 `node_modules/vite-plus-cli/bin/`，JS 入口点位于 `node_modules/vite-plus-cli/dist/index.js`
- 对于独立安装：二进制位于 `~/.vite-plus/current/bin/`，JS 入口点位于 `~/.vite-plus/current/dist/index.js`
- 对于本地开发：二进制位于 `packages/global/bin/`，JS 入口点位于 `packages/global/dist/index.js`

**独立安装内容：**

- `bin/vp` - 原生 Rust 二进制
- `dist/index.js` - 打包后的 JS 入口点
- `dist/*.node` - 用于 JS 脚本的 NAPI 绑定
- `package.json` - 包含 devEngines.runtime 配置

```rust
// 在 Rust 二进制中
fn get_js_scripts_dir() -> Result<PathBuf, Error> {
    // 1. 先检查环境变量
    if let Ok(dir) = std::env::var("VITE_GLOBAL_CLI_JS_SCRIPTS_DIR") {
        return Ok(PathBuf::from(dir));
    }

    // 2. 基于二进制位置自动检测
    // 二进制位于 ~/.vite-plus/current/bin/vp
    // 脚本位于 ~/.vite-plus/current/dist/
    let exe_path = std::env::current_exe()?;
    let exe_dir = exe_path.parent().ok_or(Error::JsEntryPointNotFound)?;

    // JS 脚本目录始终位于 bin/ 的 ../dist
    let scripts_dir = exe_dir.join("../dist");

    if scripts_dir.exists() {
        return Ok(scripts_dir.canonicalize()?);
    }

    Err(Error::JsEntryPointNotFound)
}

async fn run_js_command(&self, command: &str, args: &[&str]) -> Result<(), Error> {
    let scripts_dir = get_js_scripts_dir()?;
    let entry_point = scripts_dir.join("index.js");

    // 确保 Node.js 可用（版本来自 package.json 中的 devEngines.runtime）
    let runtime = self.js_executor.ensure_cli_runtime().await?;

    // 使用命令和参数执行 JS 入口点
    // JS 入口点负责路由到对应的处理器
    let status = Command::new(runtime.get_binary_path())
        .arg(&entry_point)
        .arg(command)  // 例如："new"、"migrate"、"--version"
        .args(args)
        .status()?;

    Ok(())
}
```

#### 构建与发布工作流

现有的 `packages/global/publish-native-addons.ts` 脚本已经使用 `@napi-rs/cli` 发布平台特定包。我们只需要修改它，使其也包含 Rust 二进制。

**当前产物结构**（参见 [unpkg 上的 @voidzero-dev/vite-plus-cli-darwin-arm64](https://app.unpkg.com/@voidzero-dev/vite-plus-cli-darwin-arm64)）：

```
@voidzero-dev/vite-plus-cli-darwin-arm64/
├── package.json
├── vite-plus-cli.darwin-arm64.node  # NAPI 绑定（现有）
└── vp                                # Rust 二进制（待添加）
```

**对 `publish-native-addons.ts` 的更改：**

1. 在发布前，将编译好的 Rust 二进制复制到每个平台目录
2. 将二进制添加到包的 `files` 数组
3. 按照常规流程发布

```typescript
// packages/global/publish-native-addons.ts

// ... 现有代码 ...

// 新增：在发布前将 Rust 二进制复制到平台包中
const rustBinaryName = platform === 'win32' ? 'vp.exe' : 'vp';
const rustBinarySource = `../../target/${rustTarget}/release/${rustBinaryName}`;
const rustBinaryDest = `npm/${platform}-${arch}/${rustBinaryName}`;

if (fs.existsSync(rustBinarySource)) {
  fs.copyFileSync(rustBinarySource, rustBinaryDest);
  console.log(`已将 Rust 二进制复制到 ${rustBinaryDest}`);
}

// ... 现有发布代码 ...
```

**Rust 二进制目标：**

| 平台包         | Rust 目标                   |
| -------------- | --------------------------- |
| darwin-arm64   | `aarch64-apple-darwin`      |
| darwin-x64     | `x86_64-apple-darwin`       |
| linux-arm64    | `aarch64-unknown-linux-gnu` |
| linux-x64      | `x86_64-unknown-linux-gnu`  |
| win32-arm64    | `aarch64-pc-windows-msvc`   |
| win32-x64      | `x86_64-pc-windows-msvc`    |

**CI/CD 集成：**

现有的 CI 工作流已经为所有平台构建 NAPI 绑定。我们需要再增加一步来构建 Rust 二进制：

```yaml
# 在现有 CI 工作流中
- name: Build Rust CLI
  run: cargo build --release --target ${{ matrix.target }} -p vite_global_cli
```

### 错误处理

```rust
#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("未检测到包管理器。请在项目目录中运行。")]
    NoPackageManager,

    #[error("下载 Node.js 运行时失败：{0}")]
    RuntimeDownload(#[from] vite_js_runtime::Error),

    #[error("命令执行失败：{0}")]
    CommandExecution(std::io::Error),

    // ... 更多变体
}
```

**注意：** 本地 CLI 检测错误由 JS 层（`dist/index.js`）处理，它会提供更友好的用户提示。

### 本地开发

在本地开发期间，Rust 二进制需要与 `packages/global/` 中的 JS 脚本并存。

**安装脚本：**

`packages/tools/src/install-global-cli.ts` 负责将编译好的 Rust 二进制复制到正确位置：

```
packages/global/
├── bin/
│   └── vp              # 由 install-global-cli.ts 复制到这里的 Rust 二进制
├── src/
│   ├── new/
│   ├── migration/
│   ├── version.ts
│   └── ...
└── package.json        # 包含 devEngines.runtime: "22.22.0"
```

**开发流程：**

1. 构建 Rust 二进制：`cargo build -p vite_global_cli`
2. 构建 JS：`pnpm -F vite-plus-cli build`
3. 运行安装脚本：`pnpm bootstrap-cli`（内部会运行 `install-global-cli.ts`）
4. 脚本将二进制复制到 `packages/global/bin/vp`
5. 本地开发和 snap 测试可以保持不变

**设置后的目录结构：**

```
packages/global/
├── bin/
│   └── vp              # 复制到这里的 Rust 二进制
├── dist/
│   └── index.js        # 打包后的 JS 入口点
└── package.json        # 包含 devEngines.runtime: "22.22.0"
```

**收益：**

- 与生产环境体验一致
- snap 测试针对真实的 Rust 二进制运行
- 自动检测可根据二进制位置找到 `dist/index.js`
- 无需包装脚本或环境变量

### 测试策略

**单元测试：**

- CLI 参数解析
- 工作区检测
- 命令路由

**集成测试：**

- 在测试夹具中进行完整命令执行
- 跨平台行为
- 带真实 Node.js 下载的 JS 执行器

**Snap 测试：**

- 复用现有 snap 测试基础设施
- 为 Rust 二进制行为添加新测试
- 测试针对 `packages/global/bin/vp` 中的 Rust 二进制运行

```rust
#[test]
fn test_install_command_parsing() {
    let args = cli::parse(&["vite", "install", "lodash", "--save-dev"]);
    assert!(matches!(args.command, Command::Install { .. }));
}

#[tokio::test]
async fn test_js_executor_downloads_node() {
    let mut executor = JsExecutor::new();
    let runtime = executor.ensure_runtime().await.unwrap();
    assert!(runtime.get_binary_path().exists());
}
```

## 设计决策

### 1. 为什么默认使用 Node.js 22.22.0？

Node.js 22 是当前的 LTS 版本线，提供长期支持。选择 22.22.0 作为一个稳定的补丁版本。

**配置方式：**

- 默认版本通过 `packages/global/package.json` 中的 `devEngines.runtime` 进行配置
- 可以在未来版本中更新，而无需重新构建 Rust 二进制文件
- 项目可以通过自己的 `devEngines.runtime` 配置进行覆盖

**版本解析优先级：**

1. 项目的 `devEngines.runtime`（如果存在）
2. CLI 从打包的 `package.json` 中获取的默认值

### 2. 为什么不捆绑 Node.js？

捆绑 Node.js 会显著增加二进制文件体积（约 100MB+）。相反，按需下载：

- 保持初始下载体积较小（约 20MB）
- 允许版本灵活切换
- 利用现有的 `vite_js_runtime` 缓存

### 3. 为什么包装包管理器，而不是重新实现？

重新实现 pnpm/npm/yarn 将是一项巨大的工程，并且容易出现细微的兼容性问题。包装现有包管理器可以：

- 确保兼容性
- 降低维护负担
- 允许用户使用自己偏好的包管理器

### 4. 为什么保留 NAPI 绑定？

NAPI 绑定服务于本地 CLI（`vite-plus` 包）的使用场景，此时 Node.js 已经可用。这使得同一份 Rust 代码可以同时用于：

- 独立二进制文件（用于全局 CLI）
- Node.js 插件（用于本地 CLI 性能）

### 5. 为什么使用平台特定的 npm 包？

这种方式（被 esbuild、swc、rolldown 等采用）提供了多个好处：

- **npm 兼容性**：用户仍然可以 `npm install -g vite-plus-cli`
- **自动平台检测**：npm 会处理安装正确的二进制文件
- **双用途分发**：同一套二进制文件既可用于 npm 安装，也可用于独立安装
- **主包中不包含二进制文件**：主包保持精简，只下载平台特定的二进制文件
- **CDN 分发**：Unpkg/jsdelivr 可以直接提供二进制文件

### 6. 为什么为 `new` 和 `migrate` 保留 JS 脚本？

这些命令涉及：

- 带有用户提示的复杂模板渲染（@clack/prompts）
- 远程模板下载与执行（create-vite 等）
- 可能频繁变化的代码转换规则
- 与现有 vite-plus 生态系统的集成

将这些重写为 Rust 需要投入大量精力，但收益有限。相反：

- JS 脚本继续按原样工作
- Rust 二进制文件通过受管的 Node.js 运行时调用它们
- 模板/迁移的更新不需要重新构建二进制文件

## 迁移路径

### 对于现有用户

1. 通过 npm 使用 `vite-plus-cli` 的用户将继续正常工作
2. 新的安装方式将变得可用（brew、curl、cargo）
3. 最终会弃用基于 npm 的全局 CLI（并提供充足的警告期）

### 对于 CI/CD

```yaml
# 之前
- run: npm install -g vite-plus-cli

# 之后（推荐）
- run: curl -fsSL https://vite.plus | bash
# 或者
- uses: voidzero-dev/setup-vite-plus-action@v1
```

## 未来增强

- [ ] 支持 Bun/Deno 作为替代 JS 运行时
- [ ] 自更新命令（`vp upgrade`）
- [ ] 用于自定义命令的插件系统
- [ ] Shell 补全生成
- [ ] 带缓存模板的离线模式

## 成功标准

1. [x] 二进制文件可在 Linux、macOS 和 Windows 上运行，无需预先安装 Node.js
2. [x] 需要时会自动下载受管的 Node.js（包管理器命令、new、migrate）
3. [x] 所有当前命令都能与现有 Node.js CLI 完全一致地工作
4. [x] 冷启动时间 < 100ms（不包括 Node.js/包管理器下载）
5. [x] 二进制文件大小 < 30MB
6. [x] 现有的 snap 测试通过
7. [x] 已发布并可安装平台特定的 npm 包
8. [x] `npm install -g vite-plus-cli` 可在所有受支持的平台上工作
9. [x] 可通过 `curl | bash` 进行独立安装
10. [x] `new` 和 `migrate` 的 JS 脚本已正确打包并执行

## 参考资料

- [vite_js_runtime RFC](./js-runtime.md)
- [split-global-cli RFC](./split-global-cli.md)
- [install-command RFC](./install-command.md)
- [Node.js Releases](https://nodejs.org/en/about/releases/)
