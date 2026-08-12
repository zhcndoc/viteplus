# 安装程序环境变量

Vite+ 安装程序（`vp-setup.exe`、`install.ps1` 和 `install.sh`）以及已安装的 `vp` CLI 会读取此页面上的环境变量。

## 安装变量

这些变量控制安装脚本和独立的 Windows 安装程序（`vp-setup.exe`）。

### `VP_VERSION`

- **用途**：要安装的版本
- **默认值**：`latest`
- **CLI 等价参数**：`--version`
- **示例**：

  ```bash
  # Unix
  curl -fsSL https://vite.plus | VP_VERSION=1.2.3 bash
  ```

  ```powershell
  # PowerShell
  $env:VP_VERSION = "1.2.3"; irm https://vite.plus/ps1 | iex
  ```

### `VP_HOME`

- **用途**：安装目录；已安装的 CLI 与 Vite+ 主目录读取相同的变量（参见[环境](/guide/env)）
- **默认值**：`~/.vite-plus`（Unix）或 `%USERPROFILE%\.vite-plus`（Windows）
- **CLI 等价参数**：`--install-dir`
- **示例**：

  ```bash
  # Unix
  curl -fsSL https://vite.plus | VP_HOME=/opt/vite-plus bash
  ```

  ```powershell
  # PowerShell
  $env:VP_HOME = "D:\vite-plus"; irm https://vite.plus/ps1 | iex
  ```

### `NPM_CONFIG_REGISTRY`

- **用途**：自定义 npm registry URL
- **默认值**：`https://registry.npmjs.org`
- **CLI 等价参数**：`--registry`
- **示例**：
  ```bash
  curl -fsSL https://vite.plus | NPM_CONFIG_REGISTRY=https://registry.npmmirror.com bash
  ```

### `VP_NODE_MANAGER`

- **用途**：控制安装期间的 Node.js 版本管理器设置
- **取值**：`yes` 或 `no`
- **默认值**：自动检测
- **CLI 等价参数**：`--no-node-manager`（反向）
- **示例**：
  ```bash
  # 在 CI 中跳过 Node.js 管理器设置
  curl -fsSL https://vite.plus | VP_NODE_MANAGER=no bash
  ```

### `VP_PR_VERSION`

- **用途**：从拉取请求或提交 SHA 安装预览构建版本
- **取值**：PR 编号或提交 SHA
- **默认值**：无
- **详细信息**：[全局 `vp` 预览](/guide/upgrade#global-vp-preview)

### 开发变量

开发 Vite+ 本身时，`VP_LOCAL_TGZ`（本地 `vite-plus.tgz` 的路径）和 `VP_LOCAL_BINARY`（本地 `vp` 二进制文件的路径）会将本地构建版本提供给安装程序。安装程序还会自行设置 `VP_INSTALL_STOP`；请勿手动设置。

## 运行时变量

这些变量用于配置已安装的 Vite+ CLI。`VP_HOME`（上文所述）在运行时同样适用。

### `VP_NODE_DIST_MIRROR`

- **用途**：Node.js 分发镜像 URL
- **默认值**：`https://nodejs.org/dist`
- **详细信息**：[自定义 Node.js 镜像](/guide/env#custom-node-js-mirror)

### `VP_NODE_VERSION`

- **用途**：覆盖 Node.js 版本
- **默认值**：无（自动检测）
- **示例**：
  ```bash
  # 使用指定的 Node.js 版本运行命令
  VP_NODE_VERSION=22 vp env exec node -v
  ```

### `VP_NODE_SKIP_SIGNATURE_VERIFY`

- **用途**：跳过 Node.js 下载内容的 PGP 签名验证
- **取值**：任意非空值
- **默认值**：无（启用验证）
- **详细信息**：[Node.js 签名验证](/guide/env#node-js-signature-verification)

### `VP_DOWNLOAD_TIMEOUT`

- **用途**：Node.js 运行时和包管理器 tarball 等大型下载的单次请求超时时间，单位为秒
- **取值**：正整数，最大为 `86400`（24 小时）；无效值将被忽略，并显示警告
- **默认值**：`600`（10 分钟）
- **示例**：
  ```bash
  # Allow up to 30 minutes per download on a slow connection
  VP_DOWNLOAD_TIMEOUT=1800 vp env install 22
  ```

### `VP_SHELL`

- **用途**：指定当前 Shell
- **默认值**：自动检测
- **示例**：
  ```bash
  VP_SHELL=bash vp env print
  ```

### `VP_BYPASS`

- **用途**：绕过 Vite+ 垫片并使用系统工具
- **取值**：要绕过的目录列表，格式类似 `PATH`
- **默认值**：无
- **示例**：
  ```bash
  VP_BYPASS=/usr/local/bin node -v
  ```

### 内部变量

Vite+ 会在垫片调度和 Shell 集成期间设置其他 `VP_*` 变量（递归保护、活动版本记录、包装器标志）；请勿手动设置这些变量。

## TLS/CA 配置

### `SSL_CERT_FILE` / `NODE_EXTRA_CA_CERTS`

- **用途**：额外 CA 证书的 PEM 捆绑包路径（`NODE_EXTRA_CA_CERTS` 是 Node.js 的约定）
- **默认值**：系统信任存储
- **示例**：
  ```bash
  export SSL_CERT_FILE=/path/to/custom-ca.pem
  ```

### `VP_INSECURE_TLS`

- **用途**：禁用 HTTPS 证书验证
- **取值**：任意非空值（`1`、`true`、`yes`）
- **默认值**：无（启用验证）
- **警告**：仅用于诊断的应急选项；请勿在生产环境中使用
- **示例**：
  ```bash
  VP_INSECURE_TLS=1 vp env install 22
  ```

## 日志记录与调试

### `VP_LOG`

- **用途**：`tracing_subscriber` 的日志过滤字符串
- **默认值**：无
- **示例**：
  ```bash
  VP_LOG=debug vp dev
  VP_LOG=vt=trace vp build
  ```

### `VP_DEBUG_SHIM`

- **用途**：启用 shim 分发的调试输出
- **取值**：任意非空值
- **默认值**：无
- **示例**：
  ```bash
  VP_DEBUG_SHIM=1 node -v
  ```

## 标准环境变量

Vite+ 也支持以下标准环境变量：

### `CI`

- **用途**：指示正在 CI 环境中运行
- **作用**：为安装程序启用静默模式（`--yes`）

### `NO_COLOR`

- **用途**：禁用彩色输出
- **作用**：禁用 ANSI 颜色代码

### `HOME` / `USERPROFILE`

- **用途**：用户主目录
- **作用**：作为默认 `~/.vite-plus` 路径的基础路径

## 优先级

1. CLI 标志（最高优先级）
2. 环境变量
3. 默认值（最低优先级）

例如，`VP_VERSION=1.0.0 vp-setup.exe --version 2.0.0` 会安装 2.0.0 版本。
