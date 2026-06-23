# RFC：CLI 输出美化

## 状态

草案

## 执行摘要

Vite+ 封装了若干子工具（vite、vitest、oxlint、oxfmt），并且拥有原生 Rust 命令（upgrade、env、vpx、package manager commands）。目前每个子工具都有各自的品牌标识，并且在消息、前缀和状态指示符的格式上不一致。本文 RFC 提议将所有 CLI 输出统一到 “Vite+” 品牌之下，采用一致的消息格式；首先从 vite 开始（其源码已在本地克隆且可直接修改），然后扩展到 Rust 命令和其他子工具。

## 动机

### 现存痛点

**1. 分散的品牌会让用户困惑**

当用户运行 `vp dev` 时，横幅会显示：

```
  VITE v8.0.0-beta.13  ready in 312 ms
```

当他们运行 `vp build` 时，会显示：

```
  vite v8.0.0-beta.13 building client environment for production...
```

两者都没有将体验标识为 “Vite+”。安装了 `vite-plus` 的用户会看到 “VITE” 品牌，可能不理解它们之间的关系。

**2. Rust 命令中的消息前缀风格不一致**

| 文件             | 前缀                         | 示例                                           |
| ---------------- | ---------------------------- | ---------------------------------------------- |
| `upgrade/mod.rs` | `info: `（小写）             | `info: checking for updates...`                |
| `upgrade/mod.rs` | `warn: `（小写）             | `warn: Shim refresh failed (non-fatal): ...`   |
| `vpx.rs`         | `Error: `（Title case）      | `Error: vpx requires a command to run`        |
| `which.rs`       | `error:`（小写，粗体红色）    | `error: tool 'foo' not found`                 |
| `main.rs`        | `Error: `（Title case）      | `Error: Failed to get current directory`      |
| `pin.rs`         | `Warning: `（Title case）    | `Warning: Failed to download Node.js ...`     |
| `pin.rs`         | `Note: `                     | `Note: Version will be downloaded on first use.` |
| `dlx.rs`         | `Warning: `（Title case）    | `Warning: yarn dlx does not support shell mode` |
| `dlx.rs`         | `Note: `                     | `Note: yarn@1 does not have dlx command...`    |

**3. 状态指示符符号各不相同**

| 场景            | 成功                 | 失败               | 警告                  |
| --------------- | -------------------- | ------------------ | --------------------- |
| `doctor.rs`     | `✓` (`\u{2713}`) 绿色 | `✗` (`\u{2717}`) 红色 | `⚠` (`\u{26A0}`) 黄色 |
| `upgrade/mod.rs` | `✔` (`\u{2714}`) 绿色 | —                  | —                     |
| 任务运行器       | `✓`                  | `✗`                | —                     |

**4. 颜色库不同（但这是可以接受的）**

| 层级                | 库                         |
| ------------------- | -------------------------- |
| Rust（全局 CLI）    | `owo_colors`               |
| JS（vite-plus CLI） | `node:util styleText()`     |
| vite                | `picocolors`               |

**5. vite 中的 `[vite]` 日志前缀**

`vite/packages/vite/src/node/logger.ts` 中的日志器默认 `prefix = '[vite]'`，用于带时间戳的消息。这在开发服务器运行期间会显示为彩色的 `[vite]` 标签。

### 用户今天看到的内容

```bash
# 开发服务器 — 显示 “VITE” 品牌
$ vp dev
  VITE v8.0.0-beta.13  ready in 312 ms
  ➜  Local:   http://localhost:5173/

# 构建 — 显示小写 “vite” 品牌
$ vp build
  vite v8.0.0-beta.13 building client environment for production...

# 升级 — 使用 “info:” 前缀（小写）
$ vp upgrade --check
  info: checking for updates...
  info: found vite-plus@0.4.0 (current: 0.3.0)

# vpx — 使用 “Error:” 前缀（Title case）
$ vpx
  Error: vpx requires a command to run
```

## 目标

1. 建立统一的品牌格式，让 “VITE+” 成为用户看到的主要标识
2. 将所有命令的消息前缀格式标准化为单一约定
3. 将状态指示符符号标准化为单一集合
4. 将品牌变更应用到 vite 输出（开发横幅、构建横幅、日志前缀）
5. 定义一种可重复的方法：直接修改子工具源码以获得一致输出

## 非目标

1. 更改 `VITE_` 环境变量前缀（这是面向用户的 API，不是 CLI 输出）
2. 更改内部构建标记（`__VITE_ASSET__`、`__VITE_PRELOAD__` 等）
3. 更改 `vite.config.ts` 文件名或配置 API 命名
4. 更改每个组件使用的颜色库（各自保持不变）
5. 第一阶段不重塑 vitest 或 oxlint 品牌（推迟到后续阶段）

## 提议的解决方案

### 概览：直接修改源码

由于 vite-plus 会克隆子工具源码仓库（vite 在 `vite/`，rolldown 在 `rolldown/`），我们直接修改源码。这种方式简单、透明，并且可以通过 `git diff` 轻松审计。在同步上游时，品牌补丁会重新基线或重新应用——一组小而明确的改动。

其他子工具（vitest、oxlint、oxfmt）在其源码被克隆或 fork 后，也可以采用相同模式。

### 第一阶段：重塑 vite 输出

#### 1.1 开发服务器横幅

**文件：** `vite/packages/vite/src/node/cli.ts`（第 256 行）

**当前：**

```javascript
info(
  `\n  ${colors.green(
    `${colors.bold('VITE')} v${VERSION}`,
  )}${modeString}  ${startupDurationString}\n`,
  { clear: !hasExistingLogs },
);
```

**输出：** `VITE v8.0.0-beta.13  ready in 312 ms`

**建议改动：**

```javascript
info(
  `\n  ${colors.green(
    `${colors.bold('VITE+')} v${VITE_PLUS_VERSION}`,
  )}${modeString}  ${startupDurationString}\n`,
  { clear: !hasExistingLogs },
);
```

**输出：** `VITE+ v0.3.0  ready in 312 ms`

其中 `VITE_PLUS_VERSION` 是 vite-plus 包版本，通过以下方式注入：

- 在 `vite/packages/vite/src/node/constants.ts` 中新增常量，或
- 读取 Rust CLI 在启动 vite 前设置的环境变量（例如 `VITE_PLUS_VERSION`）

**推荐方案：** 环境变量注入。`packages/cli/binding/src/cli.rs` 中的 Rust NAPI 绑定在通过 `merge_resolved_envs()` 启动子工具时，已经会合并环境变量。我们向 env map 中添加 `VITE_PLUS_VERSION`，然后在 vite 中读取它：

```javascript
const VITE_PLUS_VERSION = process.env.VITE_PLUS_VERSION || VERSION;
```

这样很干净：vite 源码改动很小（读取一个带回退值的环境变量），而版本注入则发生在本就负责这项工作的 Rust 层。

#### 1.2 构建横幅

**文件：** `vite/packages/vite/src/node/build.ts`（第 789 行）

**当前：**

```javascript
logger.info(
  colors.blue(
    `vite v${VERSION} ${colors.green(
      `building ${environment.name} environment for ${environment.config.mode}...`,
    )}`,
  ),
);
```

**输出：** `vite v8.0.0-beta.13 building client environment for production...`

**建议改动：**

```javascript
logger.info(
  colors.blue(
    `vite+ v${VITE_PLUS_VERSION} ${colors.green(
      `building ${environment.name} environment for ${environment.config.mode}...`,
    )}`,
  ),
);
```

**输出：** `vite+ v0.3.0 building client environment for production...`

#### 1.3 日志器前缀

**文件：** `vite/packages/vite/src/node/logger.ts`（第 78 行）

**当前：**

```javascript
prefix = '[vite]',
```

**建议：**

```javascript
prefix = '[vite+]',
```

#### 1.4 其他可见字符串审计

对 vite 源码中面向用户可见的 “vite” 字符串进行全面审计：

| 位置                         | 字符串                                                                       | 处理                                                 |
| ---------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------- |
| `cli.ts:256`                 | 横幅中的 `'VITE'`                                                           | 改为 `'VITE+'`                                       |
| `build.ts:789`               | `` `vite v${VERSION}` ``                                                     | 改为 `` `vite+ v${VITE_PLUS_VERSION}` ``             |
| `logger.ts:78`               | `'[vite]'`                                                                   | 改为 `'[vite+]'`                                     |
| `build.ts:674`               | `"This is deprecated and will override all Vite.js default output options."` | 保留 —— 指的是 Vite 项目名称，不是品牌标识           |
| `build.ts:680`               | `"Vite does not support..."`                                                 | 保留 —— 项目名称引用                                 |
| `build.ts:1079`              | `"[vite]: Rolldown failed to resolve..."`                                    | 改为 `"[vite+]: ..."`                                |
| 配置错误消息                 | `"Vite requires Node.js..."`                                                 | 保留 —— 项目名称引用                                 |
| `vite:*` 插件名后缀         | `'vite:esbuild-banner-footer-compat'` 等                                      | 保留 —— 内部插件 ID，不面向用户                       |
| `VITE_*` 环境变量检测        | `import.meta.env.VITE_*`                                                     | 保留 —— 用户 API，不是品牌                            |

**原则：** 修改终端输出中出现的品牌文案。错误描述中把 “Vite” 当作项目/软件名称的引用应保留，所有内部标识符也应保留。

### 第二阶段：标准化 Rust CLI 输出

#### 2.1 创建共享输出模块

在共享位置添加格式化函数。这可以是一个新的 `vite_output` crate，也可以是现有共享 crate 中的一个模块。

```rust
use owo_colors::OwoColorize;

// 标准状态符号
pub const CHECK: &str = "\u{2713}";   // ✓ — 成功
pub const CROSS: &str = "\u{2717}";   // ✗ — 失败
pub const WARN_SIGN: &str = "\u{26A0}"; // ⚠ — 警告
pub const ARROW: &str = "\u{2192}";   // → — 过渡

/// 将信息消息打印到 stderr。
pub fn info(msg: &str) {
    eprintln!("{} {}", "info:".bright_blue().bold(), msg);
}

/// 将警告消息打印到 stderr。
pub fn warn(msg: &str) {
    eprintln!("{} {}", "warn:".yellow().bold(), msg);
}

/// 将错误消息打印到 stderr。
pub fn error(msg: &str) {
    eprintln!("{} {}", "error:".red().bold(), msg);
}

/// 将备注消息打印到 stderr（补充信息）。
pub fn note(msg: &str) {
    eprintln!("{} {}", "note:".dimmed().bold(), msg);
}

/// 将带有对勾的成功行打印到 stdout。
pub fn success(msg: &str) {
    println!("{} {}", CHECK.green(), msg);
}
```

**设计选择——小写前缀：** 与 Rust 编译器约定一致（`error[E0308]:`、`warning:`、`note:`）。由于 vite-plus 有 Rust 核心，与 Rust 生态对齐会更自然，也比 Title case 更简洁。

#### 2.2 标准化符号

在所有地方统一采用一组符号：

| 符号             | Unicode       | 用途             | 颜色   |
| ---------------- | ------------- | ---------------- | ------ |
| `✓` (`\u{2713}`) | 对勾           | 成功             | 绿色   |
| `✗` (`\u{2717}`) | 叉号           | 失败             | 红色   |
| `⚠` (`\u{26A0}`) | 警告符号       | 警告/注意        | 黄色   |
| `→` (`\u{2192}`) | 右箭头         | 过渡             | 无     |

**变更：** 将 `upgrade/mod.rs` 中的 `\u{2714}`（粗体对勾 ✔）替换为 `\u{2713}`（对勾 ✓），以便与 `doctor.rs` 和任务运行器保持一致。

#### 2.3 迁移目标

需要更新的命令（代表性，不是穷尽）：

| 文件                  | 当前                                  | 新写法                             |
| --------------------- | ------------------------------------- | ---------------------------------- |
| `upgrade/mod.rs:58`   | `eprintln!("info: checking...")`      | `output::info("checking...")`      |
| `upgrade/mod.rs:69`   | `eprintln!("info: found...")`         | `output::info("found...")`         |
| `upgrade/mod.rs:173`  | `eprintln!("warn: Shim refresh...")`  | `output::warn("Shim refresh...")`  |
| `upgrade/mod.rs:75`   | `"\u{2714}".green()`                  | `output::CHECK.green()`            |
| `main.rs:75`          | `eprintln!("Error: Failed...")`       | `output::error("Failed...")`       |
| `main.rs:121`         | `eprintln!("Error: {e}")`             | `output::error(...)`               |
| `vpx.rs:72`           | `eprintln!("Error: vpx requires...")`  | `output::error("vpx requires...")` |
| `which.rs:40`         | `"error:".red().bold()`               | `output::error(...)`               |
| `pin.rs:142`          | `println!("  Note: Version...")`      | `output::note("Version...")`       |
| `pin.rs:155`          | `eprintln!("Warning: Failed...")`     | `output::warn("Failed...")`        |
| `dlx.rs:167`          | `eprintln!("Warning: yarn dlx...")`   | `output::warn("yarn dlx...")`      |
| `dlx.rs:184`          | `eprintln!("Note: yarn@1...")`        | `output::note("yarn@1...")`        |

`vite_install` crate 也在多个命令文件中包含 `Warning:` 和 `Note:` 消息（`list.rs`、`why.rs`、`outdated.rs`、`pack.rs`、`publish.rs`、`cache.rs`、`config.rs`、`audit.rs`、`dlx.rs`、`unlink.rs`、`update.rs`、`rebuild.rs`、`whoami.rs`）。这些都应迁移。

### 第三阶段：重塑 vitest 输出

> **注意：** 此阶段已经回滚。`@voidzero-dev/vite-plus-test` 这个捆绑包装器已被移除，转而直接消费上游 `vitest`，因为 `vite` → `@voidzero-dev/vite-plus-core` 的包管理器覆盖已经处理了依赖重定向。Vitest 输出不再重塑。

历史背景（已不再适用）：Vitest 是通过 `@voidzero-dev/vite-plus-test` 以捆绑方式提供的（而不是克隆源码）。其构建脚本（`packages/test/build.ts`）会复制并重写 vitest 的 dist 文件。我们在构建过程中对捆绑的 cac chunk 做了补丁，以重塑 CLI 输出。

#### 3.1 方法：在构建时补丁捆绑的 cac chunk

在 `bundleVitest()` 把 vitest 文件复制到 `dist/` 之后，会执行 `brandVitest()` 步骤，对 cac chunk（`dist/chunks/cac.*.js`）进行字符串替换：

1. `cac("vitest")` → `cac("vp test")` — 横幅和帮助输出中显示的 CLI 名称
2. `var version = "<semver>"` → `var version = process.env.VITE_PLUS_VERSION || "<semver>"` — 通过 env 进行运行时版本注入
3. `/^vitest\/\d+\.\d+\.\d+$/` 正则 → `/^vp test\/[\d.]+$/` — 这样 help 回调仍能找到横幅行
4. `$ vitest --help --expand-help` → `$ vp test --help --expand-help` — 硬编码帮助文本

Rust NAPI 绑定会注入 `VITE_PLUS_VERSION` 环境变量（与 vite 的 build/dev/preview 命令使用同一机制），因此 `vp test -h` 会显示 `vp test/<vite-plus-version>`。

#### 3.3 CLI 输出中剩余的 `vite` → `vp` 品牌替换

仍有若干面向用户的字符串显示 `vite` 而不是 `vp`：

1. **本地 CLI help 用法行**（`packages/cli/binding/src/cli.rs`）：`Usage: vite <COMMAND>` → `Usage: vp <COMMAND>`
2. **Pack CLI cac 名称**（`packages/cli/src/pack-bin.ts`）：`cac('vp pack')` → `cac('vp pack')`
3. **迁移消息**（`packages/cli/src/migration/bin.ts`）：`vp install` → `vp install`

这些都只是源码中的直接字符串替换，并已通过快照测试更新验证。

#### 3.4 未来：oxlint、oxfmt

对于 oxlint 和 oxfmt，在其源码/ dist 被捆绑之后，可以采用相同模式进行预启动横幅或构建时补丁。

### 第 3.5 阶段：重塑 tsdown 输出

tsdown 通过 `@voidzero-dev/vite-plus-core` 捆绑。其构建脚本（`packages/core/build.ts`）通过 rolldown 打包 tsdown 的 dist 文件。

#### 3.5.1 方法：在构建时补丁捆绑的 build chunk

在 `bundleTsdown()` 重新构建 tsdown 之后，会执行 `brandTsdown()` 步骤，对构建 chunk（`dist/tsdown/build-*.js`）进行字符串替换：

1. `"tsdown <your-file>"` → `"vp pack <your-file>"` — 当找不到输入文件时的错误消息

内部标识符保持不变：调试命名空间（`tsdown:*`）、插件名（`tsdown:external`）、配置前缀（`tsdown.config`）、临时目录（`tsdown-pack-`）。

### 第四阶段：JS 侧输出一致性

`packages/cli/src/utils/terminal.ts` 中的 JS 代码已经有 `accent()`、`headline()`、`muted()`、`success()`、`error()` 函数。可将其扩展为与 Rust 约定一致的前缀函数：

```typescript
export function info(msg: string) {
  console.error(styleText(['blue', 'bold'], 'info:'), msg);
}

export function warn(msg: string) {
  console.error(styleText(['yellow', 'bold'], 'warn:'), msg);
}

export function errorMsg(msg: string) {
  console.error(styleText(['red', 'bold'], 'error:'), msg);
}

export function note(msg: string) {
  console.error(styleText(['gray', 'bold'], 'note:'), msg);
}
```

将 JS 侧代码（`migration/bin.ts`、`create/bin.ts`）迁移为使用这些共享函数，而不是当前的临时格式化方式。

## 设计决策

### D1：直接修改源代码，而不是在构建时转换

**决策：** 直接修改 vite 的源文件。

**理由：** 用户已经在本地克隆了源代码。直接修改是透明的——任何人都可以通过 `git diff vite/` 精确查看改动内容。品牌相关改动的范围很小且界定清晰（3-5 个文件），因此在同步上游时进行 rebase 是可控的。构建时转换（例如 `packages/core/build.ts` 中的 Rolldown 插件）是另一种可避免合并冲突的方案，但它不够直观，而且当上游更改了要匹配的字符串时，可能会静默失效。

### D2：只显示 vite-plus 版本，不显示底层 vite 版本

**决策：** 横幅显示 `VITE+ v0.3.0`，而不是 `VITE+ v0.3.0 (vite 8.0.0-beta.13)`。

**理由：** 输出更简洁。底层 vite 版本仍可通过 `vp --version` 查看，它会显示更详细的版本表。横幅应传达身份，而不是调试信息。

### D3：通过环境变量注入版本

**决策：** Rust CLI 在启动 vite 之前设置 `VITE_PLUS_VERSION` 环境变量。修改后的 vite 源码读取该变量，并提供回退值。

**理由：** 这避免了在 vite 源码中硬编码版本号（否则每次发布都要更新）。Rust CLI 已经通过 `merge_resolved_envs()` 管理子工具启动时的环境变量。使用环境变量是对 vite 的最小改动方案。

### D4：使用小写前缀（`info:` 而不是 `Info:`）

**决策：** 所有前缀都使用小写并加粗着色：`info:`、`warn:`、`error:`、`note:`。

**理由：** 这符合 Rust 编译器的惯例。简洁且一致。当前代码库在小写（`upgrade.rs` 中的 `info:`）和首字母大写（`vpx.rs` 中的 `Warning:`）之间不统一——选择一种规范可以消除这种不一致。

### D5：对我们无法控制的子工具，在启动前打印横幅

**决策：** 在启动 vitest/oxlint/oxfmt 之前，先打印一行 `vite+ v0.3.0 — <command>`。

**理由：** 解析或包装子工具的 stdout/stderr 很脆弱，可能破坏 ANSI 颜色、进度指示器和交互式输出。只打印一行前置文本影响最小。长期来看，一旦这些子工具的源码也被克隆，应该直接修改它们的源码。

### D6：保留每一层自己的颜色库

**决策：** Rust 保留 `owo_colors`，JS 保留 `node:util styleText()`，vite 保留 `picocolors`。

**理由：** 更换颜色库风险高、收益低。共享的格式化模块会抽象掉库的选择，因此无论底层使用哪种库，输出约定都能保持一致。

## vite 修改范围

### 需要更改的字符串

这些是出现在终端输出中的、用户可见的品牌字符串：

1. **`cli.ts:256`** — 开发服务器横幅：`'VITE'` → `'VITE+'`，`VERSION` → `VITE_PLUS_VERSION`
2. **`build.ts:789`** — 构建横幅：`` `vite v${VERSION}` `` → `` `vite+ v${VITE_PLUS_VERSION}` ``
3. **`logger.ts:78`** — 日志前缀：`'[vite]'` → `'[vite+]'`
4. **`build.ts:1079`** — 错误消息前缀：`'[vite]:'` → `'[vite+]:'`

### 保持不变的字符串

这些是内部标识符、API 引用，或项目名称引用：

- `VITE_` 环境变量前缀及其检测逻辑
- `VITE_PACKAGE_DIR`、`CLIENT_ENTRY`、`ENV_ENTRY` 常量名
- `__VITE_ASSET__`、`__VITE_PRELOAD__` 内部构建标记
- `vite:*` 插件名称前缀（如 `vite:esbuild-banner-footer-compat` 等）
- `vite.config.ts`、`vite.config.js` 文件检测
- 作为项目名称引用的错误消息中的 “Vite”（例如 `"Vite does not support..."`）
- `import.meta.env.VITE_*` 文档和检测
- `.vite/` 缓存目录名称

## 实施计划

### 阶段 1：vite 品牌重塑

1. 在 `packages/cli/binding/src/cli.rs` 中为 vite 命令（build、dev、preview）注入 `VITE_PLUS_VERSION` 环境变量
2. 修改 `vite/packages/vite/src/node/cli.ts` — 读取环境变量，修改横幅文本
3. 修改 `vite/packages/vite/src/node/build.ts` — 修改构建横幅文本
4. 修改 `vite/packages/vite/src/node/logger.ts` — 修改默认前缀
5. 修改 `vite/packages/vite/src/node/build.ts:1079` — 修改错误前缀
6. 使用 `pnpm bootstrap-cli` 重新构建并验证输出
7. 更新受影响的 snap 测试

### 阶段 2：Rust CLI 输出标准化

1. 创建共享输出模块，提供 `info()`、`warn()`、`error()`、`note()`、`success()` 和符号常量
2. 将其添加为 `vite_global_cli` 和 `vite_install` 的依赖
3. 迁移 `upgrade/mod.rs`（6 处消息）
4. 迁移 `main.rs` 错误处理（3 处）
5. 迁移 `vpx.rs`（4 处）
6. 迁移 `env/which.rs`（3 处）
7. 迁移 `env/pin.rs`（3 处）
8. 迁移 `vite_install/src/commands/*.rs` 中的 Warning/Note 消息
9. 更新 snap 测试

### 阶段 2.5：tsdown 品牌重塑

1. 在 `bundleTsdown()` 之后的 `packages/core/build.ts` 中添加 `brandTsdown()`
2. 通过字符串替换补丁 `dist/tsdown/build-*.js`：`"tsdown <your-file>"` → `"vp pack <your-file>"`
3. 更新 snap 测试

### 阶段 3：子工具横幅

1. 在 `packages/cli/binding/src/cli.rs` 中为 vitest、oxlint、oxfmt 添加 `print_banner()`
2. 通过 TTY 检查进行控制（在管道输出中跳过）
3. 更新 snap 测试

### 阶段 4：JS 输出一致性

1. 在 `packages/cli/src/utils/terminal.ts` 中添加前缀函数
2. 将 `migration/bin.ts` 和 `create/bin.ts` 迁移为使用共享函数
3. 更新 snap 测试

## 测试策略

### Snap 测试

由于前缀和品牌变更，许多现有 snap 测试都需要更新：

- `snap-tests-global/command-upgrade-check/snap.txt` — `info:` 前缀格式
- `snap-tests-global/command-upgrade-rollback/snap.txt` — success 格式
- `snap-tests-global/command-env-which/snap.txt` — error 格式
- `snap-tests/command-dev-*/snap.txt` — vite 横幅变更
- `snap-tests/command-build-*/snap.txt` — 构建横幅变更
- 所有 global snap 测试中的 `Warning:`/`Note:` 输出
- `snap-tests/command-pack-no-input/snap.txt` — tsdown 错误消息品牌

**流程：** 在每个阶段后运行 `pnpm -F vite-plus snap-test`，检查 `snap.txt` 文件的 `git diff`，并验证新格式是否符合预期。

### 手动验证

- `vp dev` 显示 `VITE+ v<version>  ready in X ms`
- `vp build` 显示 `vite+ v<version> building ...`
- `vp upgrade --check` 显示 `info: checking for updates...`
- `vp env doctor` 显示一致的 ✓/✗/⚠ 符号
- `vpx`（无参数）显示 `error: vpx requires a command to run`
- 管道输出（`vp dev | cat`）不会显示子工具横幅

### CI

- 所有现有 `cargo test` 和 snap 测试在更新后的预期下通过
- vite 自身的测试套件无回归

## 未来增强

- 为 `vp lint` / `vp fmt` 品牌重塑克隆 oxlint/oxfmt 源码（或应用构建时补丁）
- 在长时间运行的操作中统一进度指示器样式（spinner、进度条）
- 提供结构化 JSON 输出模式（`--json`），用于所有命令的机器可读输出
