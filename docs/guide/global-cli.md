# Global CLI

Global CLI 是一个独立的 `vp` 二进制文件，用于机器级运行时和软件包管理。它包含 Vite+ 工具链，不要求预先安装 Node.js，也无需将 `vite-plus` 添加到项目中即可使用。

如果你希望通过一个命令在不同项目中执行以下任意组合的操作，请选择 Global CLI：

- 管理 Node.js 和软件包管理器版本
- 选择并下载软件包管理器
- 安装依赖并运行软件包二进制文件
- 运行 `package.json` 脚本和已缓存的工作区任务
- 使用 Vite+ 前端工具链，而无需在每个项目中固定其版本

安装 Global CLI 并不要求你采用项目本地软件包。如果你只需要运行时管理、软件包管理和任务运行器，也可以仅将其用于这些功能。

## 安装

::: code-group

```bash [macOS / Linux]
curl -fsSL https://vite.plus | bash
```

```powershell [Windows]
irm https://vite.plus/ps1 | iex
```

:::

在 Windows 上，你也可以下载并运行 [`vp-setup.exe`](https://setup.viteplus.dev)。

安装后，打开一个新的 shell 并运行：

```bash
vp help
```

安装期间启用环境管理后，Vite+ 会为 Node.js 以及 npm、pnpm、Yarn 和 Bun shim 记录托管模式。运行 `vp env off` 以优先使用系统工具，或通过 `vp env off node` 或 `vp env off pm` 限定更改范围。

::: details 安装器环境变量和选项

Vite+ 安装器（`vp-setup.exe`、`install.ps1` 和 `install.sh`）以及已安装的 `vp` CLI 会读取以下环境变量。

### 安装变量

这些变量控制安装器脚本和独立的 Windows 安装器（`vp-setup.exe`）。

#### `VP_VERSION`

- **用途**：要安装的版本
- **默认值**：`latest`
- **CLI 等效选项**：`--version`
- **注意**：Vite+ 0.2.x 及更早版本不支持拆分目录布局。安装器始终会将这些版本放入单体根目录（`VP_HOME` 或 `~/.vite-plus`）。此规则也适用于全新机器。安装器会检查下载的二进制文件并打印通知。
- **示例**：

  ```bash
  # Unix
  curl -fsSL https://vite.plus | VP_VERSION=1.2.3 bash
  ```

  ```powershell
  # PowerShell
  $env:VP_VERSION = "1.2.3"; irm https://vite.plus/ps1 | iex
  ```

#### `VP_HOME`

- **用途**：单根目录布局的可选固定路径。将其设置为绝对路径。之后，Vite+ 会将 bin、data、cache、config 和 state 放在该目录下。已安装的 CLI 也会读取相同的变量。参见[环境](/guide/env)。
- **默认值**：未设置。Vite+ 会在 Unix 上复用 `~/.vite-plus` 中的现有安装，或在 Windows 上复用 `%USERPROFILE%\.vite-plus` 中的现有安装。该目录必须包含一个 `current` 链接。否则，全新安装会使用拆分的平台布局。在 Unix 上，它使用 `~/.local/share/vite-plus` 及其由 Vite+ 所有的 `bin` 子目录。在 Windows 上，它使用 `%LOCALAPPDATA%\vite-plus\data` 和 `%LOCALAPPDATA%\vite-plus\bin`。
- **示例**：

  ```bash
  # Unix
  curl -fsSL https://vite.plus | VP_HOME=/opt/vite-plus bash
  ```

  ```powershell
  # PowerShell
  $env:VP_HOME = "D:\vite-plus"; irm https://vite.plus/ps1 | iex
  ```

#### `VP_BIN_DIR` / `VP_DATA_DIR` / `VP_CACHE_DIR`

- **用途**：用于必须固定拆分安装的集成的内部绝对目录覆盖设置。将三个变量一起设置。安装器会拒绝不完整的变量组。当设置了 `VP_HOME` 或复用现有的 `~/.vite-plus` 安装时，Vite+ 会忽略该变量组。
- **默认值**：未设置（XDG／平台默认值）
- **持久化**：生成的环境文件不会导出这些变量。使用它们的集成必须为每个 Vite+ 进程提供完整的变量组。
- **示例**：

  ```bash
  export VP_DATA_DIR=$HOME/vite-plus-data
  export VP_BIN_DIR=$VP_DATA_DIR/bin
  export VP_CACHE_DIR=$HOME/.cache/vite-plus
  curl -fsSL https://vite.plus | bash
  ```

#### `NPM_CONFIG_REGISTRY`

- **用途**：自定义 npm registry URL
- **默认值**：`https://registry.npmjs.org`
- **CLI 等效选项**：`--registry`
- **示例**：
  ```bash
  curl -fsSL https://vite.plus | NPM_CONFIG_REGISTRY=https://registry.npmmirror.com bash
  ```

#### `VP_NODE_MANAGER`

- **用途**：控制安装期间的 Node.js 版本管理器设置
- **值**：`yes` 或 `no`
- **默认值**：自动检测
- **CLI 等效选项**：`--no-node-manager`（反向选项）
- **示例**：
  ```bash
  # 在 CI 中跳过 Node.js 管理器设置
  curl -fsSL https://vite.plus | VP_NODE_MANAGER=no bash
  ```

#### `VP_PM_MANAGER`

- **用途**：设置 npm、pnpm、Yarn 和 Bun 四个软件包管理器系列的管理偏好
- **值**：`yes` 使用 Vite+ 管理；`no` 优先使用系统工具；系统工具不可用时使用托管工具作为后备
- **默认值**：未设置。安装器对 Node.js 和软件包管理器的组合选择仍作为默认值。对于脚本安装器，仅设置 `VP_NODE_MANAGER` 会保留现有的软件包管理器偏好。

#### `VP_NPM_MANAGER` / `VP_PNPM_MANAGER` / `VP_YARN_MANAGER` / `VP_BUN_MANAGER`

- **用途**：设置单个软件包管理器系列的管理偏好。每个变量都会覆盖该系列的 `VP_PM_MANAGER` 设置
- **值**：`yes` 或 `no`，含义与 `VP_PM_MANAGER` 相同
- **默认值**：未设置（使用 `VP_PM_MANAGER`，然后使用安装器的组合选择，或保留现有偏好）
- **示例**：

  ```bash
  # 保留系统 Node.js 和软件包管理器，但让 Vite+ 管理 pnpm。
  curl -fsSL https://vite.plus | VP_NODE_MANAGER=no VP_PM_MANAGER=no VP_PNPM_MANAGER=yes bash
  ```

这些管理变量是安装选项，会保存到 Vite+ 的配置中。交互式提示仍会同时控制 Node.js 和软件包管理器；显式的软件包管理器变量会覆盖该组合选择。独立的 `vp-setup` 安装器会将其现有的组合选项作为两个变量在交互式和静默安装中的默认值。就地升级会保留已保存的选择。无法识别的值会被忽略。这些变量选择的是管理行为，而不是软件包管理器版本，并且不会阻止安装器创建 shim。通过旧版安装器安装的旧版本会保留其原有行为。

#### `VP_PR_VERSION`

- **用途**：从拉取请求或提交 SHA 安装预览构建版本
- **值**：PR 编号或提交 SHA
- **默认值**：无
- **详情**：[Global `vp` 预览版](/guide/upgrade#global-vp-preview)

#### 开发变量

开发 Vite+ 本身时使用 `VP_LOCAL_TGZ` 和 `VP_LOCAL_BINARY`。`VP_LOCAL_TGZ` 指定本地 `vite-plus.tgz` 文件。`VP_LOCAL_BINARY` 指定本地 `vp` 二进制文件。安装器会使用这些文件进行本地构建。它们使用 `VP_DUMP_DIRS=1` 从所选二进制文件获取布局模式和全部五个 `EnvConfig` 类别根目录。它们不会解析目录变量。安装器会设置 `VP_INSTALL_STOP`；不要手动设置该变量。

### 运行时变量

这些变量用于配置已安装的 Vite+ CLI。`VP_HOME`（上文所述）在运行时同样适用。

#### `VP_NODE_DIST_MIRROR`

- **用途**：Node.js 分发镜像 URL
- **默认值**：`https://nodejs.org/dist`
- **详情**：[自定义 Node.js 镜像](/guide/env#custom-node-js-mirror)

#### `VP_NODE_VERSION`

- **用途**：覆盖 Node.js 版本
- **默认值**：无（自动检测）
- **示例**：
  ```bash
  # 使用指定的 Node.js 版本运行命令
  VP_NODE_VERSION=22 vp env exec node -v
  ```

#### `VP_PACKAGE_MANAGER`

- **用途**：覆盖所选的软件包管理器和版本
- **默认值**：无（从项目或全局默认值解析）
- **格式**：`npm|pnpm|yarn|bun@<version>`
- **示例**：
  ```bash
  VP_PACKAGE_MANAGER=pnpm@10.18.0 vp install
  ```

#### `VP_NODE_SKIP_SIGNATURE_VERIFY`

- **用途**：跳过 Node.js 下载文件的 PGP 签名验证
- **值**：任意非空值
- **默认值**：无（启用验证）
- **详情**：[Node.js 签名验证](/guide/env#node-js-signature-verification)

#### `VP_DOWNLOAD_TIMEOUT`

- **用途**：大型下载（例如 Node.js 运行时和软件包管理器 tarball）的每次请求超时时间，单位为秒
- **值**：正整数，最大为 `86400`（24 小时）；无效值会被忽略并显示警告
- **默认值**：`600`（10 分钟）
- **示例**：
  ```bash
  # 在网速较慢的连接上，允许每次下载最多持续 30 分钟
  VP_DOWNLOAD_TIMEOUT=1800 vp env install 22
  ```

#### `VP_SHELL`

- **用途**：指定当前 shell
- **默认值**：自动检测
- **示例**：
  ```bash
  VP_SHELL=bash vp env print
  ```

#### `VP_BYPASS`

- **用途**：绕过 Vite+ shim 并使用系统工具
- **值**：要绕过的目录列表，格式与 `PATH` 相同
- **默认值**：无
- **示例**：
  ```bash
  VP_BYPASS=/usr/local/bin node -v
  ```

#### 内部变量

Vite+ 会在 shim 分派和 shell 集成期间设置其他 `VP_*` 变量（递归保护、活动版本记录、包装器标志）；不要手动设置这些变量。

### TLS／CA 配置

#### `SSL_CERT_FILE` / `NODE_EXTRA_CA_CERTS`

- **用途**：额外 CA 证书 PEM 捆绑包的路径（`NODE_EXTRA_CA_CERTS` 是 Node.js 约定）
- **默认值**：系统信任存储
- **示例**：
  ```bash
  export SSL_CERT_FILE=/path/to/custom-ca.pem
  ```

#### `VP_INSECURE_TLS`

- **用途**：禁用 HTTPS 证书验证
- **值**：任意非空值（`1`、`true`、`yes`）
- **默认值**：无（启用验证）
- **警告**：仅用于诊断的应急选项；不要在生产环境中使用
- **示例**：
  ```bash
  VP_INSECURE_TLS=1 vp env install 22
  ```

### 日志和调试

#### `VP_LOG`

- **用途**：`tracing_subscriber` 的日志过滤字符串
- **安装器行为**：当 `CI=true` 时，`install.sh` 会隐藏 shell 文件错误。设置 `VP_LOG=trace` 可显示这些错误。
- **默认值**：无
- **示例**：
  ```bash
  VP_LOG=debug vp dev
  VP_LOG=vt=trace vp build
  ```

#### `VP_DEBUG_SHIM`

- **用途**：启用 shim 分派的调试输出
- **值**：任意非空值
- **默认值**：无
- **示例**：
  ```bash
  VP_DEBUG_SHIM=1 node -v
  ```

### 标准环境变量

Vite+ 还遵循以下标准环境变量：

#### `CI`

- **用途**：表示正在 CI 环境中运行
- **效果**：为安装器启用静默模式（`--yes`）

#### `NO_COLOR`

- **用途**：禁用彩色输出
- **效果**：禁用 ANSI 颜色代码

#### `HOME` / `USERPROFILE`

- **用途**：用户主目录
- **效果**：作为现有安装探测（`~/.vite-plus`）和拆分平台默认路径的基础目录

### 优先级

1. CLI 标志（最高优先级）
2. 环境变量
3. 默认值（最低优先级）

例如，`VP_VERSION=1.0.0 vp-setup.exe --version 2.0.0` 会安装 2.0.0 版本。

:::

## 不使用本地软件包

全局安装足以支持运行时、软件包管理器和任务运行器工作流：

```bash
vp env pin lts       # 为此项目固定并安装 Node.js
vp install           # 使用项目声明的软件包管理器
vp run build         # 运行 package.json 脚本或配置的任务
vp dlx create-vite   # 下载并运行软件包二进制文件
```

运行现有的 `package.json` 脚本不需要本地 `vite-plus` 依赖。当你希望将前端工具链版本记录在项目的清单和锁文件中时，再添加[项目本地 CLI](/guide/local-cli)。

## 同时使用两个 CLI

Global CLI 和项目本地的 `vite-plus` 软件包可以协同工作。你继续使用同一个 `vp` 命令，同时每个项目都可以选择自己的工具链版本。

对于 `vp dev`、`vp build`、`vp test` 和 `vp run` 等开发命令，Global CLI 会在项目已安装相应版本时委托给项目版本：

| 当前项目                         | `vp` 使用的工具链                 |
| -------------------------------- | --------------------------------- |
| 本地已安装 `vite-plus`           | 项目已安装的工具链                |
| 未安装 `vite-plus`               | 全局安装的工具链                  |

在 monorepo 中，本地安装可以在工作区根目录共享。无需在每个软件包中单独安装 `vite-plus`。

例如，如果项目安装了 Vite+ A 版本，而全局安装是 B 版本，`vp build` 会使用 A 版本的工具链。升级全局安装不会改变该项目已安装的工具链。

`vp install` 和 `vp add` 等软件包管理器命令使用 Global CLI。`vp env`、`vp upgrade` 和 `vp implode` 等用于管理环境或全局安装的命令也始终使用 Global CLI，不受项目版本影响。

要查看当前项目选择了哪个工具链，请运行 `vp toolchain`。使用 `vp toolchain --global` 检查全局安装。

## 后续步骤

- [环境](/guide/env)介绍 Node.js 和软件包管理器的选择、固定、shim 以及托管安装。
- [软件包管理](/guide/install)介绍 pnpm、npm、Yarn 和 Bun 工作流。
- [运行](/guide/run)介绍软件包脚本和已缓存的工作区任务。
- [升级 Vite+](/guide/upgrade)解释 Global CLI 的升级方式。有关项目本地升级，请参阅[更新 Vite+](/guide/upgrade-project)。
- [移除 Vite+](/guide/implode)会移除全局二进制文件及其托管数据。

::: details 平台支持

预构建二进制文件适用于：

- 使用 glibc 的 Linux x64 和 arm64
- Windows x64 和 arm64
- macOS x64 和 arm64
- 使用 musl 的 Linux x64 和 arm64

如果你的平台没有可用的预构建二进制文件，安装会失败并显示错误。在 Alpine Linux 上，使用托管的[非官方 Node.js 构建版本](https://unofficial-builds.nodejs.org/)前，请先安装 `libstdc++`：

```sh
apk add libstdc++
```

:::
