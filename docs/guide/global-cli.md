<script setup lang="ts">
import { nextTick, onMounted, onUnmounted } from 'vue';

function openTarget() {
  let target: HTMLElement | null;
  try {
    target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  } catch {
    return;
  }
  if (!target?.closest('details')) return;

  for (let details = target.closest('details'); details; details = details.parentElement?.closest('details') ?? null) {
    details.open = true;
  }

  // VitePress cannot measure a heading inside closed details. Correct the scroll after revealing it.
  requestAnimationFrame(() => {
    if (!target.isConnected) return;
    target.scrollIntoView({ block: 'start' });
  });
}

function onAnchorClick(event: MouseEvent) {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const link = event.target instanceof Element ? event.target.closest('a') : null;
  // Clicking the current hash again does not emit hashchange.
  if (link?.href === location.href) openTarget();
}

onMounted(async () => {
  window.addEventListener('hashchange', openTarget);
  document.addEventListener('click', onAnchorClick);
  await nextTick();
  openTarget();
});

onUnmounted(() => {
  window.removeEventListener('hashchange', openTarget);
  document.removeEventListener('click', onAnchorClick);
});
</script>

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

macOS 和 Linux 的安装说明请参见 [Homebrew tap 指南](/guide/homebrew)。

安装器使用 Vite+ 仓库 [`.node-version`](https://github.com/voidzero-dev/vite-plus/blob/main/.node-version) 中固定的 Node.js 版本安装 JavaScript 依赖。每个 Vite+ 版本都会在构建时嵌入此版本。开发和 CI 也使用同一个文件，依赖升级工作流会持续更新它。CI 集成可以通过 [`VP_SETUP_NODE_VERSION`](#vp-setup-node-version) 选择其他兼容版本。

安装后，打开一个新的 shell 并运行：

```bash
vp help
```

安装期间启用环境管理后，Vite+ 会为 Node.js 以及 npm、pnpm、Yarn 和 Bun shim 记录托管模式。运行 `vp env off` 以优先使用系统工具，或通过 `vp env off node` 或 `vp env off pm` 限定更改范围。

::: details 环境变量和选项

Vite+ 安装器（`vp-setup.exe`、`install.ps1` 和 `install.sh`）以及 CLI 会使用以下环境变量配置安装、运行时和子工具。

### 安装变量 {#installation-variables}

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

#### `VP_SETUP_NODE_VERSION`

- **用途**：选择用于安装全局 CLI JavaScript 依赖的 Node.js 版本。`setup-vp` 等 CI 集成会设置此变量，以复用项目运行时。
- **值**：确切版本、版本范围或别名，例如 `22.23.1`、`22`、`^22.18.0`、`lts` 或 `latest`。安装器会将其解析为一个确切版本。
- **默认值**：未设置或为空（使用嵌入的 Node.js 默认版本）。项目文件、`VP_NODE_VERSION`、会话覆盖和用户级默认值不会改变此默认行为。
- **兼容性**：解析后的版本必须同时满足全局 CLI 和固定版本 `pnpm` 的 Node.js 要求。否则安装器会使用嵌入的默认版本。值无效或无法解析时会报错。
- **作用范围**：仅用于初次安装依赖。此变量不会设置项目固定版本、会话覆盖或全局默认值。[`vp upgrade`](/guide/upgrade#global-vp) 不使用此变量。

#### `VP_SETUP_NODE_VERSION_FILE`

- **用途**：供需要获取 `VP_SETUP_NODE_VERSION` 所解析确切版本的集成使用的可选输出文件。
- **内容**：成功安装依赖后写入解析出的版本，例如 `22.23.1`。如果安装时因兼容性要求改用嵌入的默认版本，文件仍会包含所请求版本解析出的值。
- **默认值**：未设置（不写入文件）。如果 `VP_SETUP_NODE_VERSION` 未设置或为空，或跳过依赖安装，安装器也不会写入文件。

`setup-vp` 会自动管理此文件。请使用它的 Node.js 输入配置 CI 作业。

#### `VP_SETUP_SKIP_INSTALL_LOCKFILE` {#vp-setup-skip-install-lockfile}

安装全局 CLI 或运行 `vp upgrade` 时遇到 lockfile 错误，可将此变量设为 `1` 进行恢复。未设置、为空或其他值时，仍会启用已发布的安装 lockfile。

安装器会打印警告，并在解析依赖时不读取或恢复安装 lockfile。请求安装的 CLI 版本仍保持固定，但其依赖版本可能与发行版 lockfile 不同。registry、认证和代理设置仍会生效。此选项不影响 `vp install` 等项目安装。

```bash
# Retry installation without the bundled lockfile.
curl -fsSL https://vite.plus | VP_SETUP_SKIP_INSTALL_LOCKFILE=1 bash

# Or retry an upgrade, including the currently installed version.
VP_SETUP_SKIP_INSTALL_LOCKFILE=1 vp upgrade --force
```

```powershell
$env:VP_SETUP_SKIP_INSTALL_LOCKFILE = "1"
try {
  irm https://vite.plus/ps1 | iex
} finally {
  Remove-Item Env:VP_SETUP_SKIP_INSTALL_LOCKFILE
}
```

请仅临时使用此覆盖。取消设置后，后续安装和升级会恢复使用已发布的 lockfile。若要使用 lockfile 重新安装受影响的版本，请取消设置此变量，然后运行 `vp upgrade <version> --force`。

#### `VP_HOME`

- **用途**：单根目录布局的可选固定路径。将其设置为绝对路径。之后，Vite+ 会将 bin、data、cache、config 和 state 放在该目录下。已安装的 CLI 也会读取相同的变量。参见[环境](/guide/env)。
- **默认值**：未设置。Vite+ 会在 Unix 上复用 `~/.vite-plus` 中的现有安装，或在 Windows 上复用 `%USERPROFILE%\.vite-plus` 中的现有安装。该目录必须包含一个 `current` 链接。否则，全新安装会使用下方所示的拆分平台布局。
- **示例**：

  ```bash
  # Unix
  curl -fsSL https://vite.plus | VP_HOME=/opt/vite-plus bash
  ```

  ```powershell
  # PowerShell
  $env:VP_HOME = "D:\vite-plus"; irm https://vite.plus/ps1 | iex
  ```

全新拆分目录布局的安装使用以下默认值：

| 目录      | macOS 和 Linux             | Windows                          |
| --------- | -------------------------- | -------------------------------- |
| 数据      | `~/.local/share/vite-plus` | `%LOCALAPPDATA%\vite-plus\data`  |
| 二进制文件 | `<DATA>/bin`               | `%LOCALAPPDATA%\vite-plus\bin`   |
| 缓存      | `~/.cache/vite-plus`       | `%LOCALAPPDATA%\vite-plus\cache` |
| 配置      | `~/.config/vite-plus`      | `%APPDATA%\vite-plus`            |
| 状态      | `~/.local/state/vite-plus` | `%LOCALAPPDATA%\vite-plus\state` |

在 macOS 和 Linux 上，绝对路径的 `XDG_DATA_HOME`、`XDG_CACHE_HOME`、`XDG_CONFIG_HOME` 和 `XDG_STATE_HOME` 值会覆盖对应的基础目录。二进制文件目录跟随数据目录。

低优先级的托管 shim 位于 `<DATA>/fallback-bin`，其中 `<DATA>` 是解析后的数据目录。

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
- **托管的软件包管理器**：当 Vite+ 下载固定版本的 npm、pnpm、Yarn 或 Bun 时，也会读取工作区根目录和用户的 `.npmrc`。软件包作用域 registry，以及 registry 作用域的 `_authToken`、`_auth` 或 `username`/`_password` 凭据都会生效。请将密钥保存在环境变量中，并在 `.npmrc` 中引用它们，例如：

  ```ini
  registry=https://npm.corp.example/repository/npm/
  //npm.corp.example/repository/npm/:_authToken=${NPM_TOKEN}
  ```

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

开发 Vite+ 本身时使用 `VP_LOCAL_TGZ` 和 `VP_LOCAL_BINARY`。`VP_LOCAL_TGZ` 指定本地 `vite-plus.tgz` 文件。`VP_LOCAL_BINARY` 指定本地 `vp` 二进制文件。安装器会使用这些文件进行本地构建。

### 运行时变量

这些变量用于配置已安装的 Vite+ CLI。`VP_HOME`（上文所述）在运行时同样适用。

#### `VP_NODE_DIST_MIRROR`

- **用途**：Node.js 分发镜像 URL
- **默认值**：`https://nodejs.org/dist`
- **详情**：[自定义 Node.js 镜像](/guide/env#custom-node-js-mirror)

#### `VP_NODE_VERSION`

- **用途**：覆盖 Node.js 版本
- **默认值**：无（自动检测）
- **作用范围**：运行时命令。安装器安装依赖时，请使用 [`VP_SETUP_NODE_VERSION`](#vp-setup-node-version)。
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
- **值**：设置此变量（包括将其设置为空字符串）会启用绕过模式。其值是一个类似 `PATH` 的附加目录列表，用于从搜索中排除这些目录。Vite+ bin 目录和 Vite+ shim 会自动跳过
- **默认值**：未设置
- **示例**：
  ```bash
  # Find a system Node.js on PATH, excluding /usr/local/bin.
  VP_BYPASS=/usr/local/bin node -v
  ```

#### 内部变量

Vite+ 会在 shim 分派和 shell 集成期间设置其他 `VP_*` 变量（递归保护、活动版本记录、包装器标志）；不要手动设置这些变量。

### 子进程变量

Vite+ 会为它启动的工具设置以下变量。

#### `VP_USER_AGENT`

`vp`、`vpr` 和 `vpx` 会为子进程设置 `VP_USER_AGENT=vp/<version>`。全局 CLI 和项目本地 `vite-plus` 软件包都适用。每次调用都会报告自己的版本；全局 CLI 委托给本地 CLI 时，由本地版本接管。

即使底层包管理器替换了 `npm_config_user_agent`，也可以用此变量识别 Vite+。请读取第一个以空格分隔的产品标记（`vp/<version>`），这样使用方可以兼容未来添加的字段。该值标识 CLI，不包含命令或参数。普通工具 shim（如 `node`、`npm` 和 `npx`）只会保留继承的值，不会自行创建此变量。

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

#### Nushell and XDG directories

If you customize `XDG_DATA_HOME` or `XDG_CONFIG_HOME`, set them **before starting Nushell**, through your terminal application, operating system, or parent shell. This is a [Nushell startup requirement](https://www.nushell.sh/book/configuration.html#changing-default-directories); setting them only in `config.nu` or `env.nu` does not configure the running session's startup directories.

Assignments in those files still affect child processes. The Vite+ installer starts a child Nushell to locate its vendor autoload directory, so it can write `vite-plus.nu` to a directory that normal new sessions do not read. Installation can succeed while `vp` remains unavailable in those sessions.

If this happens, open your Nushell configuration with `config nu` and add a `source` line pointing to the installed Vite+ `env.nu` file. For a default fresh macOS or Linux installation without a custom `XDG_CONFIG_HOME`, use:

```nu
source ~/.config/vite-plus/env.nu
```

For a custom `XDG_CONFIG_HOME`, use the absolute path to `<XDG_CONFIG_HOME>/vite-plus/env.nu` as resolved during installation. For an installation under `VP_HOME` or an existing `~/.vite-plus` installation, use `<VP_HOME>/env.nu` or `~/.vite-plus/env.nu` instead. Replace placeholders with actual paths and quote paths containing spaces. Open a new Nushell session and run `vp help` to verify the configuration.

#### Nushell 版本 {#nushell-version}

请使用 Nushell 0.112.1 或更高版本。在 Nushell 中，自定义命令或别名可以与内置命令同名，例如 `def update []`。Nushell 会在读取自身配置后再读取 Vite+ 的 `env.nu`。因此，`env.nu` 必须使用 [ `%` sigil](https://www.nushell.sh/lang-guide/chapters/custom_commands.html#calling-custom-commands) 调用内置命令，该语法由 Nushell 0.112.1 引入。

`vp env setup` 会检查 `PATH` 中的 `nu`。如果 Nushell 版本早于 0.112.1，生成的 `env.nu` 不会使用 sigil。该文件仍可运行，但若自定义命令与某个内置命令同名，Nushell 可能会在启动时以 `nu::parser::extra_positional` 或类似解析错误退出。升级 Nushell 后，请再次运行 `vp env setup`。

如果系统中安装了多个 Nushell，请确保运行 `vp env setup` 时 `PATH` 中的 `nu` 与实际启动的版本相同。早于 0.112.1 的 Nushell 无法解析为较新版本生成的 `env.nu`。

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

### Homebrew

官方 [Homebrew tap](/guide/homebrew) 安装原生 CLI。首次运行 `vp` 命令时，会在用户数据目录安装匹配的 JavaScript 依赖，并设置 shell、shim 和环境管理偏好。设置状态保存在用户目录中，不会写入 Homebrew 前缀。

只要已安装的二进制文件没有变化，后续命令就会复用该设置。当 Homebrew 替换版本时，生成的 shim 会跟随 Homebrew 对外提供的 `vp` 入口。替换期间，设置会保留已保存的管理偏好。

若要在首次运行时优先使用现有的 Node.js 和包管理器，请使用：

```bash
VP_NODE_MANAGER=no VP_PM_MANAGER=no vp help
```

设置完成后，使用 `vp env off` 更改此偏好。tap 仍会准备其固定的 Node.js 和 pnpm 来安装 CLI 依赖。缺少其他运行时或项目依赖时，相关命令也可以下载它们。

使用 Homebrew [升级](/guide/upgrade#homebrew)或[移除](/guide/implode#homebrew)其管理的软件包。

`vp env doctor` 会识别 Homebrew 来源、formula 名称和二进制文件路径，并分别检查 `vp` 命令和 `PATH` 中的用户 shim 目录。如果只有 shim 目录缺失，请按照其 shell 设置说明启用 shim。

registry 配置和迁移说明请参见[官方 tap 指南](/guide/homebrew)。

## 不使用本地软件包

全局安装足以支持运行时、软件包管理器和任务运行器工作流：

```bash
vp env pin lts       # 为此项目固定并安装 Node.js
vp install           # 使用项目声明的软件包管理器
vp run build         # 运行 package.json 脚本或配置的任务
vp dlx create-vite   # 下载并运行软件包二进制文件
```

运行现有的 `package.json` 脚本不需要本地 `vite-plus` 依赖。当你希望将前端工具链版本记录在项目的清单和锁文件中时，再添加[项目本地 CLI](/guide/local-cli)。

## 从其他目录运行命令

使用 `vp -C <dir> <command>` 从其他工作目录运行任意 `vp` 命令。有关示例和详细信息，请参阅[使用 `-C` 指定软件包](/guide/monorepo#targeting-a-package-with-c)。

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
- [软件包管理](/guide/package-management/)介绍 pnpm、npm、Yarn 和 Bun 工作流。
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
