# RFC：JavaScript 运行时管理（`vite_js_runtime`）

## 背景

目前，vite-plus 依赖用户系统中已安装的 Node.js 运行时。这带来了几个挑战：

1. **版本不一致**：不同团队成员可能安装了不同版本的 Node.js，导致细微的 bug 和“在我机器上可以运行”问题
2. **CI/CD 复杂性**：构建流水线需要显式管理 Node.js 版本
3. **无法固定运行时版本**：项目无法指定并强制使用特定的 Node.js 版本
4. **未来可扩展性**：随着 Bun 和 Deno 等替代方案逐渐成熟，项目可能希望使用不同的运行时

`vite_install` 中的 PackageManager 实现已成功处理包管理器（pnpm、yarn、npm）的自动下载和缓存。我们可以将同样的模式应用到 JavaScript 运行时。

## 目标

1. **纯库设计**：一个库 crate，接收运行时名称和版本作为输入，下载并缓存运行时，然后返回安装路径
2. **跨平台支持**：使用合适的二进制文件处理 Windows、macOS 和 Linux
3. **一致的缓存**：使用与 PackageManager 相同的全局缓存目录模式
4. **可扩展设计**：初始支持 Node.js，并为 Bun 和 Deno 预留架构

## 非目标（初始版本）

- ~~配置自动检测（不读取 package.json、.nvmrc 等）~~ **现已通过 `.node-version`、`devEngines.runtime` 和 `engines.node` 支持**
- 同时管理多个运行时版本
- 提供版本管理器 CLI（如 nvm/fnm）
- 支持自定义/非官方的 Node.js 构建

## 输入格式

该库接受一个字符串参数形式的运行时规格：

```
<runtime>@<version>
```

### 示例

| 运行时        | 示例             |
| ------------- | ---------------- |
| Node.js       | `node@22.13.1`   |
| Bun（未来）   | `bun@1.2.0`      |
| Deno（未来）  | `deno@2.0.0`     |

同时支持精确版本和 semver 范围：

- 精确版本：`22.13.1`
- Caret 范围：`^22.0.0`（>=22.0.0 <23.0.0）
- Tilde 范围：`~22.13.0`（>=22.13.0 <22.14.0）
- 最新：省略版本以获取最新发布版本

## 架构

### crate 结构

```
crates/vite_js_runtime/
├── Cargo.toml
└── src/
    ├── lib.rs              # 公共 API 导出
    ├── dev_engines.rs      # 从 package.json 解析 devEngines.runtime
    ├── error.rs            # 错误类型
    ├── platform.rs         # 平台检测（Os、Arch、Platform）
    ├── provider.rs         # JsRuntimeProvider trait 和类型
    ├── providers/          # Provider 实现
    │   ├── mod.rs
    │   └── node.rs         # 带版本解析的 NodeProvider
    ├── download.rs         # 通用下载工具
    └── runtime.rs          # JsRuntime 结构体和下载编排
```

### 核心类型

```rust
/// 支持的 JavaScript 运行时类型
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum JsRuntimeType {
    Node,
    // 未来：Bun、Deno
}

/// 表示一个已下载的 JavaScript 运行时
pub struct JsRuntime {
    pub runtime_type: JsRuntimeType,
    pub version: Str,                   // 已解析的版本（例如 "22.13.1"）
    pub install_dir: AbsolutePathBuf,
    binary_relative_path: Str,          // 例如 "bin/node" 或 "node.exe"
    bin_dir_relative_path: Str,         // 例如 "bin" 或 ""
}

/// 运行时分发包的归档格式
pub enum ArchiveFormat {
    TarGz,  // .tar.gz（Linux、macOS）
    Zip,    // .zip（Windows）
}

/// 如何验证已下载归档的完整性
pub enum HashVerification {
    ShasumsFile {
        url: Str,                          // 明文 SHASUMS 文件
        signature: Option<ShasumsSignature>, // 当设置时，对已清签名的 SHASUMS 进行 PGP 验证
    },
    None,                                  // 不进行验证
}

/// SHASUMS 文件的 PGP 签名验证详情。
pub struct ShasumsSignature {
    pub url: Str,       // 已清签名的 SHASUMS256.txt.asc
    pub required: bool, // 官方源为强制；镜像则尽力而为
}

/// 下载运行时所需的信息
pub struct DownloadInfo {
    pub archive_url: Str,
    pub archive_filename: Str,
    pub archive_format: ArchiveFormat,
    pub hash_verification: HashVerification,
    pub extracted_dir_name: Str,
}
```

### Provider trait

`JsRuntimeProvider` trait 抽象了运行时特定逻辑，便于轻松添加新的运行时：

```rust
#[async_trait]
pub trait JsRuntimeProvider: Send + Sync {
    /// 获取此运行时的名称（例如 "node"、"bun"、"deno"）
    fn name(&self) -> &'static str;

    /// 获取下载 URL 中使用的平台字符串
    fn platform_string(&self, platform: Platform) -> Str;

    /// 获取特定版本和平台的下载信息
    fn get_download_info(&self, version: &str, platform: Platform) -> DownloadInfo;

    /// 获取从安装目录到运行时二进制文件的相对路径
    fn binary_relative_path(&self, platform: Platform) -> Str;

    /// 获取从安装目录到 bin 目录的相对路径
    fn bin_dir_relative_path(&self, platform: Platform) -> Str;

    /// 解析 SHASUMS 文件，提取特定文件名对应的哈希值
    fn parse_shasums(&self, shasums_content: &str, filename: &str) -> Result<Str, Error>;
}
```

### 添加新的运行时

要添加对新运行时的支持（例如 Bun）：

1. 创建 `src/providers/bun.rs`，实现 `JsRuntimeProvider`
2. 在 `JsRuntimeType` 枚举中添加 `Bun` 变体
3. 在 `download_runtime()` 中添加 match 分支以使用新的 provider
4. 从 `src/providers/mod.rs` 导出该 provider

### 公共 API

```rust
/// 按精确版本下载并缓存 JavaScript 运行时
pub async fn download_runtime(
    runtime_type: JsRuntimeType,
    version: &str,           // 精确版本（例如 "22.13.1"）
) -> Result<JsRuntime, Error>;

/// 基于项目的版本配置下载运行时
/// 按优先级顺序读取 .node-version、devEngines.runtime 或 engines.node
/// 解析 semver 范围，下载匹配的版本
pub async fn download_runtime_for_project(
    project_path: &AbsolutePath,
) -> Result<JsRuntime, Error>;

impl JsRuntime {
    /// 获取运行时二进制文件路径（例如 node、bun）
    pub fn get_binary_path(&self) -> AbsolutePathBuf;

    /// 获取包含运行时的 bin 目录
    pub fn get_bin_prefix(&self) -> AbsolutePathBuf;

    /// 获取运行时类型
    pub fn runtime_type(&self) -> JsRuntimeType;

    /// 获取已解析的版本字符串（始终为精确版本，例如 "22.13.1"）
    pub fn version(&self) -> &str;
}

impl NodeProvider {
    /// 从 nodejs.org/dist/index.json 获取版本索引（带 HTTP 缓存）
    pub async fn fetch_version_index(&self) -> Result<Vec<NodeVersionEntry>, Error>;

    /// 将版本要求（例如 "^24.4.0"）解析为精确版本
    pub async fn resolve_version(&self, version_req: &str) -> Result<Str, Error>;

    /// 获取最新 LTS 版本
    pub async fn resolve_latest_version(&self) -> Result<Str, Error>;

    /// 获取绝对最新版本（包括非 LTS）
    pub async fn resolve_absolute_latest_version(&self) -> Result<Str, Error>;
}
```

### 使用示例

**直接下载指定版本：**

```rust
use vite_js_runtime::{JsRuntimeType, download_runtime};

let runtime = download_runtime(JsRuntimeType::Node, "22.13.1").await?;
println!("Node.js 已安装到: {}", runtime.get_binary_path());
println!("版本: {}", runtime.version()); // "22.13.1"
```

**基于项目下载（读取 .node-version、devEngines.runtime 或 engines.node）：**

```rust
use vite_js_runtime::download_runtime_for_project;
use vite_path::AbsolutePathBuf;

let project_path = AbsolutePathBuf::new("/path/to/project".into()).unwrap();
let runtime = download_runtime_for_project(&project_path).await?;
// 版本按 .node-version > devEngines.runtime > engines.node 的顺序解析
```

## 缓存目录结构

遵循 PackageManager 模式：

```
$VITE_PLUS_HOME/js_runtime/{runtime}/{version}/
```

示例：

- Linux x64：`~/.vite-plus/js_runtime/node/22.13.1/`
- macOS ARM：`~/.vite-plus/js_runtime/node/22.13.1/`
- Windows x64：`%USERPROFILE%\.vite-plus\js_runtime\node\22.13.1\`

### 版本索引缓存

Node.js 版本索引会被本地缓存，以避免重复网络请求：

```
$VITE_PLUS_HOME/js_runtime/node/index_cache.json
```

缓存结构：

```json
{
  "expires_at": 1706400000,
  "etag": null,
  "versions": [
    {"version": "v25.5.0", "lts": false},
    {"version": "v24.4.0", "lts": "Jod"},
    ...
  ]
}
```

- 默认 TTL：1 小时（3600 秒）
- 缓存过期时会刷新
- 若缓存损坏，则回退为完整获取

### 平台检测

| 操作系统 | 架构        | 平台字符串      |
| ------- | ----------- | --------------- |
| Linux   | x64         | `linux-x64`     |
| Linux   | ARM64       | `linux-arm64`   |
| macOS   | x64         | `darwin-x64`    |
| macOS   | ARM64       | `darwin-arm64`  |
| Windows | x64         | `win-x64`       |
| Windows | ARM64       | `win-arm64`     |

## 版本来源优先级

`download_runtime_for_project` 函数从多个来源读取 Node.js 版本，优先级如下：

| 优先级      | 来源                 | 文件            | 示例                                  | 被谁使用                       |
| ----------- | -------------------- | --------------- | ------------------------------------- | ----------------------------- |
| 1（最高）   | `.node-version`      | `.node-version` | `22.13.1`                             | fnm、nvm、Netlify、Cloudflare |
| 2           | `devEngines.runtime` | `package.json`  | `{"name":"node","version":"^24.4.0"}` | npm、pnpm                     |
| 3（最低）   | `engines.node`       | `package.json`  | `">=20.0.0"`                          | Vercel、npm                   |

`devEngines.runtime` 的优先级高于 `engines.node`，因为它声明的是开发环境要求，而 `engines.node` 是面向使用者的支持范围。参见 [RFC: devEngines 支持](./dev-engines.md)。

### `.node-version` 文件格式

参考：https://github.com/shadowspawn/node-version-usage

**支持的格式：**

| 格式               | 示例        | 支持级别                         |
| ------------------ | ----------- | -------------------------------- |
| 三段式版本         | `20.5.0`    | 通用                             |
| 带 `v` 前缀        | `v20.5.0`   | 通用                             |
| 两段式版本         | `20.5`      | 支持（视为 `^20.5.0`）            |
| 单段式版本         | `20`        | 支持（视为 `^20.0.0`）            |

**格式规则：**

1. 单行，使用 Unix 换行符（`\n`）
2. 去除首尾空白字符
3. 可选 `v` 前缀 - 会被去除并归一化
4. 不允许注释 - 整行即为版本

### `engines.node` 格式

package.json 中标准的 npm `engines` 字段：

```json
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### `devEngines.runtime` 格式

遵循 [npm devEngines RFC](https://github.com/npm/rfcs/blob/main/accepted/0048-devEngines.md)：

**单个运行时：**

```json
{
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "^24.4.0",
      "onFail": "download"
    }
  }
}
```

**多个运行时（数组）：**

```json
{
  "devEngines": {
    "runtime": [
      {
        "name": "node",
        "version": "^24.4.0",
        "onFail": "download"
      },
      {
        "name": "deno",
        "version": "^2.4.3",
        "onFail": "download"
      }
    ]
  }
}
```

**注意：** 目前仅支持 `"node"` 运行时。其他运行时会被忽略。

### 版本验证

在使用来自任何来源的版本字符串之前，都会先进行归一化和验证：

1. **去除空白字符**：删除首尾空白字符
2. **按 semver 验证**：版本必须是以下之一：
   - 精确版本（例如 `20.18.0`、`v20.18.0`）
   - 有效的 semver 范围（例如 `^20.0.0`、`>=18 <21`、`20.x`、`*`）
3. **无效版本会被忽略**：如果验证失败，会打印警告并跳过该来源

**警告示例：**

```
warning: invalid version 'latest' in .node-version, ignoring
```

这样当高优先级来源包含无效版本时，可以继续回退到低优先级来源。

### 版本解析

版本解析经过优化，以尽量减少网络请求：

| 指定版本           | 本地缓存 | 网络请求 | 结果                       |
| ------------------ | -------- | -------- | -------------------------- |
| 精确版本 (`20.18.0`)  | -        | **否**   | 直接使用精确版本           |
| 范围 (`^20.18.0`)     | 找到匹配 | **否**   | 使用缓存版本               |
| 范围 (`^20.18.0`)     | 未找到   | **是**   | 从网络解析                 |
| 空/None           | 找到匹配 | **否**   | 使用最新缓存版本           |
| 空/None           | 未找到   | **是**   | 获取最新 LTS 版本          |

**精确版本**（例如 `20.18.0`、`v20.18.0`）使用 `node_semver::Version::parse()` 检测，并直接使用，无需网络验证。`v` 前缀会被归一化（去除），因为下载 URL 已经会添加它。

**部分版本** 如 `20` 或 `20.18` 会被 `node-semver` crate 视为范围。

**semver 范围**（例如 `^24.4.0`）会触发版本解析：

1. 首先检查本地缓存的 Node.js 安装，查找满足该范围的版本
2. 如果存在匹配的缓存版本，则使用最高版本（无需网络请求）
3. 否则，从 `https://nodejs.org/dist/index.json` 获取版本索引
4. 将索引本地缓存，TTL 为 1 小时（支持基于 ETag 的条件请求）
5. 使用 `node-semver` crate 进行与 npm 兼容的范围匹配
6. 返回满足该范围的最高版本

### 不匹配检测

当来自最高优先级来源的解析版本不满足低优先级来源的约束时，会发出警告。

| .node-version | engines.node | devEngines | 已解析              | 警告？                          |
| ------------- | ------------ | ---------- | -------------------- | ------------------------------- |
| `22.13.1`     | `>=20.0.0`   | -          | `22.13.1`            | 否（22.13.1 满足 >=20）         |
| `22.13.1`     | `>=24.0.0`   | -          | `22.13.1`            | **是**（22.13.1 < 24）          |
| -             | `>=20.0.0`   | `^24.4.0`  | latest matching >=20 | 否（如果解析结果 >= 24）         |
| `20.18.0`     | -            | `^24.4.0`  | `20.18.0`            | **是**（20 不满足 ^24）         |

### 回退行为

当不存在任何版本来源时：

1. 检查本地缓存中已安装的 Node.js 版本
2. 使用**最新已安装版本**（如果存在）
3. 如果没有缓存版本，则从网络获取并使用最新 LTS

这优化了以下方面：

- 避免不必要的网络请求
- 使用用户已经安装的版本

**注意：** `.node-version` 仅通过 `vp env pin` 显式写入。

## 下载源

### Node.js

来自 nodejs.org 的官方发行版：

```
https://nodejs.org/dist/v{version}/node-v{version}-{platform}.{ext}
```

| 平台     | 压缩包格式 | 示例                                  |
| -------- | ---------- | ------------------------------------- |
| Linux    | `.tar.gz`  | `node-v22.13.1-linux-x64.tar.gz`      |
| macOS    | `.tar.gz`  | `node-v22.13.1-darwin-arm64.tar.gz`   |
| Windows  | `.zip`     | `node-v22.13.1-win-x64.zip`           |

### 自定义镜像支持

可以使用 `VP_NODE_DIST_MIRROR` 环境变量覆盖发行版 URL。这对于企业环境或 nodejs.org 可能较慢或被屏蔽的地区非常有用。

```bash
VP_NODE_DIST_MIRROR=https://example.com/mirrors/node vp build
```

镜像 URL 应与官方发行版具有相同的目录结构。末尾斜杠会被自动去除。

### 完整性与真实性验证

Node.js 会为每个发布版本提供 `SHASUMS256.txt` 和一个 PGP clear-signed 的 `SHASUMS256.txt.asc`
（由 Node.js 发布者签名）：

```
https://nodejs.org/dist/v{version}/SHASUMS256.txt
https://nodejs.org/dist/v{version}/SHASUMS256.txt.asc
```

实现会自动验证真实性和完整性：

1. 下载 clear-signed 的 `SHASUMS256.txt.asc`，并使用内嵌的 Node.js 发布密钥副本验证其 PGP 签名，然后解析
   已验证的明文（见 [verify-node-shasums-signature.md](./verify-node-shasums-signature.md)）
2. 提取目标压缩包文件名对应的 SHA256 哈希
3. 下载压缩包后，根据预期哈希进行验证
4. 如果签名无效或哈希不匹配，则返回错误

对官方 `nodejs.org` 源，签名验证是强制性的。非官方的 musl 构建和只提供 `SHASUMS256.txt`
的自定义镜像会回退到仅哈希验证（`signature: None`，或者在 `.asc` 不存在时尽力而为）。

SHASUMS256.txt 内容示例：

```
a1b2c3d4...  node-v22.13.1-darwin-arm64.tar.gz
e5f6g7h8...  node-v22.13.1-darwin-x64.tar.gz
i9j0k1l2...  node-v22.13.1-linux-arm64.tar.gz
...
```

## 实现细节

### 下载流程

```
1. 接收运行时类型和精确版本作为输入

2. 选择合适的 JsRuntimeProvider
   └── 例如，JsRuntimeType::Node 对应 NodeProvider

3. 从 provider 获取下载信息
   ├── 平台字符串（例如 "linux-x64"、"win-x64"）
   ├── 压缩包 URL 和文件名
   ├── 哈希校验方法
   └── 解压后的目录名

4. 检查缓存中是否已有安装
   └── 如果存在：返回缓存路径
   └── 如果不存在：继续下载

5. 使用原子操作下载
   ├── 创建临时目录
   ├── 下载 SHASUMS（在可用时对签名的 .asc 进行 PGP 验证）并解析预期哈希
   ├── 使用重试逻辑下载压缩包
   ├── 验证压缩包哈希
   ├── 解压压缩包（根据格式为 tar.gz 或 zip）
   ├── 获取文件锁（防止并发安装）
   └── 原子重命名到最终位置

6. 返回包含安装路径和相对路径的 JsRuntime
```

### 并发下载保护

与 PackageManager 使用相同模式：

- 使用 tempfile 进行原子操作
- 基于文件的锁，防止竞态条件
- 获取锁后再次检查缓存（另一个进程可能已经完成）

## 与 vite_install 的集成

`vite_install` crate 可以使用 `vite_js_runtime` 来：

1. 在运行包管理器命令前确保正确的 Node.js 版本
2. 使用受管理的 Node.js 执行包管理器二进制文件

```rust
// vite_install 中的集成示例
use vite_js_runtime::{JsRuntimeType, download_runtime};

async fn run_with_managed_node(
    node_version: &str,
    args: &[&str],
) -> Result<(), Error> {
    // 下载/缓存运行时
    let runtime = download_runtime(JsRuntimeType::Node, node_version).await?;

    // 使用受管理的 Node.js 二进制文件
    let node_path = runtime.get_binary_path();

    // 使用受管理的 Node.js 执行命令
    Command::new(node_path)
        .args(args)
        .spawn()?
        .wait()?;

    Ok(())
}
```

## 错误处理

`vite_js_runtime::Error` 中的错误变体：

```rust
pub enum Error {
    /// 在官方发布版本中未找到该版本
    VersionNotFound { runtime: Str, version: Str },

    /// 该运行时不支持此平台
    UnsupportedPlatform { platform: Str, runtime: Str },

    /// 多次重试后下载失败
    DownloadFailed { url: Str, reason: Str },

    /// 哈希校验失败（下载损坏）
    HashMismatch { filename: Str, expected: Str, actual: Str },

    /// 压缩包解压失败
    ExtractionFailed { reason: Str },

    /// SHASUMS 文件解析失败
    ShasumsParseFailed { reason: Str },

    /// 在 SHASUMS 文件中未找到哈希
    HashNotFound { filename: Str },

    /// 解析版本索引失败
    VersionIndexParseFailed { reason: Str },

    /// 未找到与要求匹配的版本
    NoMatchingVersion { version_req: Str },

    /// IO、HTTP、JSON 和 semver 错误
    Io(std::io::Error),
    Reqwest(reqwest::Error),
    JoinError(tokio::task::JoinError),
    Json(serde_json::Error),
    SemverRange(node_semver::SemverError),
}
```

## 测试策略

### 单元测试

1. **平台检测**
   - 测试所有受支持的平台/架构组合
   - 测试映射到 Node.js 分发名称

2. **缓存路径生成**
   - 验证正确的目录结构

### 集成测试

1. **下载与缓存**
   - 下载特定版本的 Node.js
   - 验证二进制文件存在且可执行
   - 验证第二次调用时复用缓存

2. **完整性验证**
   - 测试基于 SHASUMS256.txt 的成功校验
   - 测试压缩包损坏时的失败情况（哈希不匹配）

3. **并发下载**
   - 模拟多个进程下载同一版本
   - 验证不会出现损坏或冲突

## 设计决策

### 1. 纯库 vs. 感知配置

**决策**：使用一个纯库，接收运行时名称和版本作为输入。

**理由**：

- 最大灵活性——由调用方决定如何获取运行时规范
- 不与特定配置格式（package.json、.nvmrc 等）耦合
- 更容易独立测试
- 职责单一清晰：下载并缓存运行时

### 2. 独立 Crate vs. 扩展 vite_install

**决策**：创建一个新的 `vite_js_runtime` crate。

**理由**：

- 职责分离清晰（运行时 vs. 包管理器）
- 可被其他 crate 复用，而无需引入包管理器逻辑
- 更易维护和独立测试
- 遵循现有的 crate 组织模式

### 3. 版本规范格式

**决策**：同时支持精确版本和 semver 范围。

**理由**：

- 与既定的 `packageManager` 精确版本格式保持一致
- semver 范围在约束内提供自动更新的灵活性
- 版本索引在本地缓存（1 小时 TTL）以减少网络请求
- 使用 `node-semver` crate 解析与 npm 兼容的范围
- `download_runtime()` 接受精确版本；`download_runtime_for_project()` 负责处理范围解析

### 4. 初始仅支持 Node.js

**决策**：初始版本仅支持 Node.js。

**理由**：

- Node.js 是最广泛使用的运行时
- 便于实现专注且经过充分测试的方案
- 基于 trait 的架构（`JsRuntimeProvider`）使后续添加 Bun/Deno 变得直接
- 降低初始复杂度和范围

### 5. 基于 Trait 的 Provider 架构

**决策**：使用 `JsRuntimeProvider` trait 来抽象运行时特定逻辑。

**理由**：

- 将通用下载逻辑与运行时特定细节清晰分离
- 每个 provider 封装：平台字符串、URL 构造、哈希验证、二进制路径
- 添加新运行时只需实现该 trait
- 通用下载工具可在所有 provider 之间复用

## 未来增强

1. ✅ **版本别名**：支持 `latest` 别名，并使用缓存的版本索引
2. **Bun 支持**：创建实现 `JsRuntimeProvider` 的 `BunProvider`
3. **Deno 支持**：创建实现 `JsRuntimeProvider` 的 `DenoProvider`
4. ✅ **版本范围**：支持如 `node@^22.0.0` 这样的 semver 范围
5. **离线模式**：完整离线支持（部分：范围会优先检查本地缓存）
6. **LTS 别名**：支持 `lts` 别名以下载最新 LTS 版本

## 成功标准

1. ✅ 可按精确版本规格下载并缓存 Node.js
2. ✅ 可在 Linux、macOS 和 Windows（x64 和 ARM64）上运行
3. ✅ 验证下载的真实性和完整性（PGP 签名的 SHASUMS256.txt）
4. ✅ 安全处理并发下载
5. ✅ 返回版本和二进制路径
6. ✅ 全面的测试覆盖
7. ✅ 通过 `VP_NODE_DIST_MIRROR` 环境变量支持自定义镜像
8. ✅ 支持来自 package.json 的 `devEngines.runtime`
9. ✅ 支持 semver 范围（^、~ 等）及版本解析
10. ✅ 版本索引缓存，TTL 为 1 小时
11. ✅ 在 devEngines 中支持单个运行时和运行时数组
12. ~~将解析后的版本写入 `.node-version` 文件~~（已移除——`.node-version` 仅由 `vp env pin` 写入）
13. ✅ 优化版本解析（精确版本跳过网络，范围优先检查本地缓存）
14. ✅ 多源版本读取，优先级：`.node-version` > `engines.node` > `devEngines.runtime`
15. ✅ 支持 `.node-version` 文件格式（带/不带 v 前缀，部分版本）
16. ✅ 支持 package.json 中的 `engines.node`
17. ✅ 当解析出的版本与较低优先级来源的约束冲突时发出警告
18. ✅ 在未指定来源时使用最新缓存版本（避免网络请求）
19. ✅ 无效版本字符串会被忽略并发出警告，继续回退到更低优先级来源

## 参考资料

- [Node.js 发布版本](https://nodejs.org/en/download/releases/)
- [Node.js 分发索引](https://nodejs.org/dist/index.json)
- [.node-version 文件用法](https://github.com/shadowspawn/node-version-usage)
- [npm devEngines RFC](https://github.com/npm/rfcs/blob/main/accepted/0048-devEngines.md)
- [Corepack（Node.js 包管理器管理器）](https://nodejs.org/api/corepack.html)
- [fnm（Fast Node Manager）](https://github.com/Schniz/fnm)
- [volta（JavaScript 工具管理器）](https://volta.sh/)
