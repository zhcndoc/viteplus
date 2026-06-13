# RFC: `vp env` - 基于 Shim 的 Node 版本管理

## 摘要

本 RFC 提议新增 `vp env` 命令，通过基于 shim 的架构提供系统级、对 IDE 安全的 Node.js 版本管理。shims 会拦截 `node`、`npm` 和 `npx` 命令，并根据项目配置自动解析并执行正确的 Node.js 版本。

> **注意**：不包含 Corepack shim，因为 vite-plus 已集成包管理器功能。

## 动机

### 当前痛点

1. **IDE 集成问题**：通过图形界面启动的 IDE（如 VS Code、Cursor）通常看不到 shell 中配置的 Node 版本，因为它们继承的是系统环境中的 PATH，而不是 shell 的 rc 文件。

2. **版本管理器碎片化**：用户必须在 nvm、fnm、volta、asdf 或 mise 之间做选择——每个都有不同的安装要求和 shell 集成方式。

3. **行为不一致**：通过终端启动的应用与通过 GUI 启动的应用可能使用不同的 Node 版本，从而引发隐蔽的 bug。

4. **手动切换版本**：用户进入项目时必须记得执行 `nvm use` 或类似命令。

### 提议的解决方案

采用基于 shim 的方案，其中：

- 将 `VITE_PLUS_HOME/bin/` 目录加入 PATH（系统级，以确保 IDE 可靠）
- shims（`node`、`npm`、`npx`）是指向 `vp` 二进制文件的符号链接（Unix）或 trampoline `.exe` 文件（Windows）
- `vp` CLI 本身也位于 `VITE_PLUS_HOME/bin/` 中，因此用户只需要一个 PATH 条目
- 二进制通过 `argv[0]` 检测调用来源并进行相应分发
- 版本解析和安装复用现有的 `vite_js_runtime` 基础设施

## 命令用法

### 设置命令

```bash
# 初始设置 - 创建 shims 并显示 PATH 配置说明
vp env setup

# 强制刷新 shims（在 vp 二进制升级后）
vp env setup --refresh

# 设置全局默认 Node.js 版本（当不存在项目版本文件时使用）
vp env default 20.18.0
vp env default lts        # 使用最新的 LTS 版本
vp env default latest     # 使用最新版本（不推荐用于稳定性）

# 显示当前默认版本
vp env default

# 控制 shim 模式
vp env on             # 启用托管模式（shims 始终使用 vite-plus 的 Node.js）
vp env off            # 启用系统优先模式（shims 优先使用系统 Node.js）

# PowerShell 会话设置：对 `vp env setup` 生成的脚本进行 dot-source
. "$env:USERPROFILE\.vite-plus\env.ps1"
```

### 诊断命令

```bash
# 全面的系统诊断
vp env doctor

# 显示在当前目录下将会执行哪个 node 二进制
vp env which node
vp env which npm
vp env which pnpm

# 以 JSON 输出当前环境信息
vp env --current --json
# 输出包含 Node.js 解析结果；当 package.json#packageManager 存在时，还包含包管理器解析结果。

# 为当前会话输出 shell 片段（特殊环境的回退方案）
vp env --print
```

### 版本管理命令

```bash
# 在当前目录固定一个特定版本（创建 .node-version）
vp env pin 20.18.0

# 使用版本别名固定（解析为精确版本）
vp env pin lts        # 解析并固定当前 LTS（例如 22.13.0）
vp env pin latest     # 解析并固定最新版本

# 使用 semver 范围固定
vp env pin "^20.0.0"

# 显示当前固定版本
vp env pin

# 移除固定（删除 .node-version 文件）
vp env pin --unpin
vp env unpin          # 另一种语法

# 跳过预下载固定版本
vp env pin 20.18.0 --no-install

# 列出本地已安装的 Node.js 版本
vp env list
vp env ls             # 别名

# 列出注册表中可用的 Node.js 版本
vp env list-remote
vp env list-remote --lts     # 仅显示 LTS 版本
vp env list-remote 20        # 显示匹配模式的版本
```

### 会话版本覆盖

```bash
# 为当前 shell 会话使用特定 Node.js 版本
vp env use 24          # 切换到 Node 24.x
vp env use lts         # 切换到最新 LTS
vp env use             # 安装并激活项目配置的版本
vp env use --unset     # 移除会话覆盖

# 选项
vp env use --no-install           # 如果版本不存在则跳过自动安装
vp env use --silent-if-unchanged  # 如果版本已激活则抑制输出
```

**其工作方式：**

1. `~/.vite-plus/env` 包含一个 `vp()` shell 函数，用于拦截 `vp env use` 调用
2. wrapper 在调用 `command vp env use ...` 之前设置 `VITE_PLUS_ENV_USE_EVAL_ENABLE=1`
3. 当环境变量存在（wrapper 激活）时，`vp env use` 会将 shell 命令输出到 stdout 以便 eval
4. 当环境变量在 CI 中不存在时，`vp env use` 会改为写入一个会话文件（`~/.vite-plus/.session-node-version`）
5. shim 的分发会先检查 `VITE_PLUS_NODE_VERSION` 环境变量，然后再检查会话文件，作为解析链的一部分

在 Windows 交互式 shell 中，`vp env use` 需要将 PowerShell 设置脚本（`~/.vite-plus/env.ps1`，由 `vp env setup` 写入）在当前 shell 中进行 dot-source，这样所选版本才能保持会话作用域：

```powershell
. "$env:USERPROFILE\.vite-plus\env.ps1"
```

将该行添加到 PowerShell `$PROFILE` 末尾，以便在新的 shell 中自动生效：

```powershell
if (-not (Test-Path $PROFILE)) { New-Item $PROFILE -Force }
Invoke-Item $PROFILE
```

**自动会话文件（用于 CI）：**

当 `vp env use` 检测到 CI 环境且 shell eval wrapper 未激活（即未设置 `VITE_PLUS_ENV_USE_EVAL_ENABLE`）时，它会自动将解析出的版本写入 `~/.vite-plus/.session-node-version`。shims 直接从磁盘读取该文件，因此 CI 作业可以在无需 shell 设置的情况下继续使用 `vp env use`。当环境变量被设置时，它仍然具有优先级，因此 shell wrapper 的体验保持不变。

```bash
# GitHub Actions 示例（没有 shell wrapper，会自动写入会话文件）
- run: vp env use 20
- run: node --version   # 通过读取会话文件的 shim 使用 v20.x
- run: vp env use --unset  # 清理
```

**特定 shell 的输出：**

| Shell            | Set                                       | Unset                                        |
| ---------------- | ----------------------------------------- | -------------------------------------------- |
| POSIX (bash/zsh) | `export VITE_PLUS_NODE_VERSION=20.18.1`   | `unset VITE_PLUS_NODE_VERSION`               |
| Fish             | `set -gx VITE_PLUS_NODE_VERSION 20.18.1`  | `set -e VITE_PLUS_NODE_VERSION`              |
| PowerShell       | `$env:VITE_PLUS_NODE_VERSION = "20.18.1"` | `Remove-Item Env:VITE_PLUS_NODE_VERSION ...` |
| cmd.exe          | `set VITE_PLUS_NODE_VERSION=20.18.1`      | `set VITE_PLUS_NODE_VERSION=`                |

**shell 函数 wrapper** 包含在 `vp env setup` 创建的 env 文件中：

- `~/.vite-plus/env`（POSIX - bash/zsh）：`vp()` 函数
- `~/.vite-plus/env.fish`（fish）：`function vp`
- `~/.vite-plus/env.ps1`（PowerShell）：`function vp`
- `~/.vite-plus/bin/vp-use.cmd`（cmd.exe）：由于 cmd.exe 没有 shell 函数，因此使用专用 wrapper

### Node.js 版本管理

```bash
# 安装一个 Node.js 版本
vp env install 20.18.0
vp env install lts
vp env install latest

# 卸载一个 Node.js 版本
vp env uninstall 20.18.0
```

### 全局包命令

```bash
# 安装全局包
vp install -g typescript
vp install -g typescript@5.0.0

# 使用特定的 Node.js 版本安装
vp install -g --node 22 typescript
vp install -g --node lts typescript

# 强制安装（自动卸载冲突包）
vp install -g --force eslint-v9    # 如果 'eslint' 提供相同的二进制文件，则移除它

# 列出已安装的全局包
vp list -g
vp list -g --json

# 示例输出（带有彩色包名的表格格式）：
# Package            Node version   Binaries
# ---                ---            ---
# pnpm@10.28.2      22.22.0        pnpm, pnpx
# serve@14.2.5      22.22.0        serve
# typescript@5.9.3  22.22.0        tsc, tsserver

# 卸载全局包
vp remove -g typescript

# 更新全局包
vp update -g              # 更新所有全局包
vp update -g typescript   # 更新指定包
```

### 日常使用（设置后）

```bash
# 这些命令会被 shims 自动拦截
node -v           # 使用项目特定版本
npm install       # 当显式配置 packageManager npm@<version> 时使用该版本，否则使用 Node 内置的 npm
npx vitest        # 当显式配置 packageManager npm@<version> 时使用该版本，否则使用 Node 内置的 npx
```

包管理器 shim 仅在调用的命令与已配置的管理器或其生成的别名之一匹配时才使用 `packageManager`。例如，`packageManager: "npm@11.14.0"` 会让 `npm` 和 `npx` shims 运行 npm 11.14.0，而 `packageManager: "pnpm@10.19.0"` 不会把 `npm install` 变成 `pnpm install`；`npm` 会回退到已解析的 Node.js 运行时所提供的 npm。别名对遵循包管理器下载布局：`npm`/`npx`、`pnpm`/`pnpx`、`yarn`/`yarnpkg` 和 `bun`/`bunx`。

## 架构概览

### 单二进制多角色设计

`vp` 二进制会根据 `argv[0]` 承担双重职责：

```
argv[0] = "vp"        → 正常 CLI 模式（vp env, vp build 等）
argv[0] = "node"      → Shim 模式：解析版本，执行 node
argv[0] = "npm"       → Shim 模式：解析版本，执行 npm
argv[0] = "npx"       → Shim 模式：解析版本，执行 npx
```

### 架构图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PATH 配置                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  用户的 PATH（设置后）：                                                    │
│                                                                             │
│    PATH="~/.vite-plus/bin:/usr/local/bin:/usr/bin:..."                      │
│           ▲                                                                 │
│           │                                                                 │
│           └── PATH 中的第一项 = shims 拦截 node/npm/npx 命令               │
│                                                                             │
│  当用户运行 `node` 时：                                                     │
│                                                                             │
│    $ node app.js                                                            │
│        │                                                                    │
│        ▼                                                                    │
│    Shell 从左到右搜索 PATH：                                                │
│        1. ~/.vite-plus/bin/node  ✓ 找到！(shim)                            │
│        2. /usr/local/bin/node    (跳过)                                     │
│        3. /usr/bin/node          (跳过)                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           SHIM 分发流程                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  用户运行：  $ node app.js                                                  │
│                  │                                                          │
│                  ▼                                                          │
│  ┌──────────────────────────────┐                                           │
│  │  ~/.vite-plus/bin/node       │  ◄── 指向 vp 二进制的符号链接（通过 PATH）│
│  │  (shim 拦截命令)             │                                           │
│  └──────────────┬───────────────┘                                           │
│                 │                                                           │
│                 ▼                                                           │
│  ┌──────────────────────────────┐                                           │
│  │  argv[0] 检测                │                                           │
│  │  "node" → shim 模式         │                                           │
│  └──────────────┬───────────────┘                                           │
│                 │                                                           │
│                 ▼                                                           │
│  ┌──────────────────────────────┐     ┌─────────────────────────────┐       │
│  │  版本解析                    │────▶│  优先级顺序：               │       │
│  │  （向上遍历目录树）          │     │  0. VITE_PLUS_NODE_VERSION  │       │
│  └──────────────┬───────────────┘     │  1. .session-node-version   │       │
│                 │                     │  2. .node-version           │       │
│                 │                     │  3. package.json#devEngines │       │
│                 │                     │  4. package.json#engines    │       │
│                 │                     │  5. User default (config)   │       │
│                 │                     │  6. Latest LTS              │       │
│                 ▼                     └─────────────────────────────┘       │
│  ┌──────────────────────────────┐                                           │
│  │  确保已安装 Node.js          │                                           │
│  │  （必要时下载）              │                                           │
│  └──────────────┬───────────────┘                                           │
│                 │                                                           │
│                 ▼                                                           │
│  ┌──────────────────────────────┐                                           │
│  │  execve() 真实 node 二进制   │                                           │
│  │  ~/.vite-plus/.../node       │                                           │
│  └──────────────────────────────┘                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         目录结构                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ~/.vite-plus/                        (VITE_PLUS_HOME)                      │
│  ├── bin/                                                                   │
│  │   ├── vp   ──────────────────────  指向 ../current/bin/vp 的符号链接    │
│  │   ├── node ──────────────────────┐                                       │
│  │   ├── npm  ──────────────────────┼──▶ 指向 ../current/bin/vp 的符号链接 │
│  │   └── npx  ──────────────────────┘                                       │
│  ├── current/bin/vp                   实际的 vp CLI 二进制                  │
│  ├── js_runtime/node/                 Node.js 安装目录                      │
│  │   ├── 20.18.0/bin/node             已安装的 Node.js 版本                │
│  │   ├── 22.13.0/bin/node                                                   │
│  │   └── ...                                                                │
│  ├── .session-node-version              会话覆盖（由 vp env use 写入）     │
│  └── config.json                      用户设置（默认版本等）                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                      版本解析（walk_up=true）                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  /home/user/projects/app/src/         ◄── 当前目录                          │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐        │
│  │ 检查 /home/user/projects/app/src/                              │        │
│  │   ├── .node-version?     ✗ 未找到                              │        │
│  │   └── package.json?      ✗ 未找到                              │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│           │ 向上遍历                                                         │
│           ▼                                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐        │
│  │ 检查 /home/user/projects/app/                                  │        │
│  │   ├── .node-version?     ✗ 未找到                              │        │
│  │   └── package.json?      ✓ 找到！engines.node = "^20.0.0"      │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│           │                                                                 │
│           ▼                                                                 │
│  返回：version="^20.0.0", source="engines.node",                         │
│        project_root="/home/user/projects/app"                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### VITE_PLUS_HOME 目录布局

```
VITE_PLUS_HOME/                              # 默认：~/.vite-plus
├── bin/
│   ├── vp -> ../current/bin/vp       # 指向当前 vp 二进制的符号链接（Unix）
│   ├── node -> ../current/bin/vp     # 指向 vp 二进制的符号链接（Unix）
│   ├── npm -> ../current/bin/vp      # 指向 vp 二进制的符号链接（Unix）
│   ├── npx -> ../current/bin/vp      # 指向 vp 二进制的符号链接（Unix）
│   ├── tsc -> ../current/bin/vp      # 全局包的符号链接（Unix）
│   ├── vp.exe                        # 转发到 current\bin\vp.exe 的 trampoline（Windows）
│   ├── node.exe                      # node 的 trampoline shim（Windows）
│   ├── npm.exe                       # npm 的 trampoline shim（Windows）
│   ├── npx.exe                       # npx 的 trampoline shim（Windows）
│   └── tsc.exe                       # 全局包的 trampoline shim（Windows）
├── current/
│   └── bin/
│       ├── vp                        # 实际的 vp CLI 二进制（Unix）
│       └── vp.exe                    # 实际的 vp CLI 二进制（Windows）
├── js_runtime/
│   └── node/
│       ├── 20.18.0/                  # 已安装的 Node 版本
│       │   └── bin/
│       │       ├── node
│       │       ├── npm
│       │       └── npx
│       └── 22.13.0/
├── packages/                         # 全局包
│   ├── typescript/
│   │   └── lib/
│   │       └── node_modules/
│   │           └── typescript/
│   │               └── bin/
│   ├── typescript.json               # 包元数据
│   ├── eslint/
│   └── eslint.json
├── bins/                             # 每个二进制的配置文件（跟踪所有权）
│   ├── tsc.json                      # { "package": "typescript", ... }
│   ├── tsserver.json
│   └── eslint.json
├── shared/                           # NODE_PATH 符号链接
│   ├── typescript -> ../packages/typescript/lib/node_modules/typescript
│   └── eslint -> ../packages/eslint/lib/node_modules/eslint
├── cache/
│   └── resolve_cache.json            # 版本解析的 LRU 缓存
├── tmp/                              # 安装的暂存目录
│   └── packages/
├── .session-node-version             # 会话覆盖（由 `vp env use` 写入）
└── config.json                       # 用户配置（默认版本等）
```

**关键目录：**

| 目录              | 作用                                                               |
| ----------------- | ------------------------------------------------------------------ |
| `bin/`            | vp 符号链接以及所有 shims（node、npm、npx、全局包二进制）         |
| `current/bin/`    | 实际的 vp CLI 二进制（bin/ shims 指向这里）                        |
| `js_runtime/node/` | 已安装的 Node.js 版本                                              |
| `packages/`       | 带有元数据的已安装全局包                                            |
| `bins/`           | 每个二进制的配置文件（跟踪每个二进制由哪个包拥有）                 |
| `shared/`         | 用于 package require() 解析的 NODE_PATH 符号链接                  |
| `tmp/`            | 用于原子安装的暂存区                                               |
| `cache/`          | 解析缓存                                                         |

### config.json 格式

```json
// ~/.vite-plus/config.json

{
  // 当未找到项目版本文件时使用的默认 Node.js 版本
  // 通过以下命令设置：vp env default <version>
  "defaultNodeVersion": "20.18.0",

  // 也可以使用别名：
  // "defaultNodeVersion": "lts"     // 始终使用最新 LTS
  // "defaultNodeVersion": "latest"  // 始终使用最新版本（不推荐）

  // Node.js 模式：控制所有 vp 命令和 shims 如何解析 Node.js
  // 通过以下命令设置：vp env on（managed）或 vp env off（system_first）
  // - "managed"（默认）：所有 vp 命令和 shims 都使用 vite-plus 托管的 Node.js
  // - "system_first"：所有 vp 命令和 shims 优先使用系统 Node.js，若未找到则回退到托管版本
  "shimMode": "managed"
}
```

## 版本规范

本节文档说明了 `.node-version` 文件、`package.json` engines 和 CLI 命令支持的版本格式。

### 支持的版本格式

vite-plus 支持以下版本规范格式，兼容 nvm、fnm 和 actions/setup-node：

| 格式                 | 示例                              | 解析方式                       | 缓存过期时间       |
| -------------------- | --------------------------------- | ------------------------------ | ------------------ |
| **精确版本**         | `20.18.0`, `v20.18.0`             | 直接使用                       | 基于 mtime        |
| **部分版本**         | `20`, `20.18`                     | 取最高匹配（优先 LTS）         | 基于时间（1 小时） |
| **Semver 范围**      | `^20.0.0`, `~20.18.0`, `>=20 <22` | 取最高匹配（优先 LTS）         | 基于时间（1 小时） |
| **最新 LTS**         | `lts/*`                           | 最高 LTS 版本                 | 基于时间（1 小时） |
| **LTS 代号**         | `lts/iron`, `lts/jod`             | LTS 线上最高版本              | 基于时间（1 小时） |
| **LTS 偏移**         | `lts/-1`, `lts/-2`                | 第 n 高的 LTS 线              | 基于时间（1 小时） |
| **通配符**           | `*`                               | 取最高匹配（优先 LTS）         | 基于时间（1 小时） |
| **最新版本**         | `latest`                          | 绝对最新版本                  | 基于时间（1 小时） |

### 精确版本

精确的三段式版本会直接使用，不需要网络解析：

```
20.18.0      → 20.18.0
v20.18.0     → 20.18.0 (v 前缀被去除)
22.13.1      → 22.13.1
```

### 部分版本

部分版本（major 或 major.minor）会在运行时解析为最高匹配版本。LTS 版本优先于非 LTS 版本：

```
20           → 20.19.0 (最高的 20.x LTS)
20.18        → 20.18.3 (最高的 20.18.x)
22           → 22.13.0 (最高的 22.x LTS)
```

### Semver 范围

支持标准的 npm/node-semver 范围语法。匹配范围内会优先选择 LTS 版本：

```
^20.0.0      → 20.19.0 (最高的 20.x.x LTS)
~20.18.0     → 20.18.3 (最高的 20.18.x)
>=20 <22     → 20.19.0 (范围内最高，优先 LTS)
18 || 20     → 20.19.0 (任一范围内最高的 LTS)
18.x         → 18.20.5 (最高的 18.x)
```

### LTS 别名

LTS（长期支持）版本可以使用特殊别名来指定，遵循 nvm 和 actions/setup-node 的模式：

**`lts/*`** - 解析为最新（版本号最高）的 LTS 版本：

```
lts/*        → 22.13.0 (截至 2025 年的最新 LTS)
```

**`lts/<codename>`** - 解析为某条特定 LTS 线中的最高版本：

```
lts/iron     → 20.19.0 (最高的 v20.x)
lts/jod      → 22.13.0 (最高的 v22.x)
lts/hydrogen → 18.20.5 (最高的 v18.x)
lts/krypton  → 24.x.x (可用时)
```

代号不区分大小写（`lts/Iron` 和 `lts/iron` 都可以）。

**`lts/-n`** - 解析为第 n 高的 LTS 线（适合针对旧的受支持版本进行测试）：

```
lts/-1       → 20.19.0 (第二高的 LTS，当最新版本是 22.x 时)
lts/-2       → 18.20.5 (第三高的 LTS)
```

### LTS 代号参考

| 代号 | 主版本号 | LTS 状态                   |
| ---- | -------- | -------------------------- |
| Hydrogen | 18.x          | 维护到 2025-04-30 |
| Iron     | 20.x          | Active LTS until 2026-04-30  |
| Jod      | 22.x          | Active LTS until 2027-04-30  |
| Krypton  | 24.x          | Will be LTS starting 2025-10 |

新的 LTS 代号会根据 Node.js 发布计划动态添加。vite-plus 会从 nodejs.org 获取版本索引来解析代号，确保新 LTS 版本能够自动获得支持。

### 版本解析优先级

在解析应使用哪个 Node.js 版本时，vite-plus 会按以下顺序检查来源：

0. **`VITE_PLUS_NODE_VERSION` 环境变量**（会话覆盖，最高优先级）
   - 通过 `vp env use` 借助 shell wrapper eval 设置
   - 覆盖所有基于文件的解析

1. **`.session-node-version`** 文件（会话覆盖）
   - 由 `vp env use` 写入 CI 中的 `~/.vite-plus/.session-node-version`
   - 在不使用 wrapper 的 CI 场景中保持行为一致，同时不会将 Windows 交互式 shell 设为全局
   - 通过 `vp env use --unset` 删除

2. **`.node-version`** 文件
   - 先检查当前目录，再检查父目录
   - 简单格式：每个文件一行一个版本

3. **`package.json#devEngines.runtime`**
   - 在当前目录检查，然后检查父目录
   - 开发环境需求字段（见 [RFC: devEngines Support](./dev-engines.md)）

4. **`package.json#engines.node`**
   - 在当前目录检查，然后检查父目录
   - 面向消费者的 npm 约束字段

5. **用户默认值**（`~/.vite-plus/config.json`）
   - 通过 `vp env default <version>` 设置

6. **系统默认值**（最新 LTS）
   - 当找不到任何版本来源时作为回退

### 缓存行为

版本解析结果会被缓存以提升性能：

- **精确版本**：缓存直到源文件的 mtime 变化
- **范围版本**（部分版本、semver、LTS 别名）：缓存 1 小时，之后重新解析以获取新发布版本

这可以确保：

- 精确版本锁定快速且可预测
- 范围规格可以获取新发布版本（例如 `20` 会使用新发布的 `20.20.0`）
- LTS 别名会自动使用更新的补丁版本

### 文件格式兼容性

`.node-version` 文件格式刻意保持简单，并兼容其他工具：

```
# 支持的内容（每个文件一项）：
20.18.0
v20.18.0
20
lts/*
lts/iron
^20.0.0

# 不支持注释
# 会裁剪首尾空白字符
# 只使用第一行
```

**兼容性矩阵：**

| 工具               | `.node-version` | `.nvmrc` | LTS 别名 | Semver 范围 |
| ------------------ | --------------- | -------- | ----------- | ------------- |
| vite-plus          | ✅              | ✅       | ✅          | ✅            |
| nvm                | ❌              | ✅       | ✅          | ✅            |
| fnm                | ✅              | ✅       | ✅          | ✅            |
| volta              | ✅              | ❌       | ❌          | ❌            |
| actions/setup-node | ✅              | ✅       | ✅          | ✅            |
| asdf               | ✅              | ❌       | ❌          | ❌            |

**注意**：Node.js 二进制文件存储在 VITE_PLUS_HOME 中：

- Linux/macOS：`~/.vite-plus/js_runtime/node/{version}/`
- Windows：`%USERPROFILE%\.vite-plus\js_runtime\node\{version}\`

## 实现架构

### 文件结构

```
crates/vite_global_cli/
├── src/
│   ├── main.rs                       # 带有 shim 检测的入口点
│   ├── cli.rs                        # 添加 Env 命令
│   ├── shim/
│   │   ├── mod.rs                    # Shim 模块根
│   │   ├── dispatch.rs               # 主 shim 分发逻辑
│   │   ├── exec.rs                   # 平台相关执行
│   │   └── cache.rs                  # 解析缓存
│   └── commands/
│       └── env/
│           ├── mod.rs                # Env 命令模块
│           ├── config.rs             # 配置和版本解析
│           ├── setup.rs              # setup 子命令实现
│           ├── doctor.rs             # doctor 子命令实现
│           ├── which.rs              # which 子命令实现
│           ├── current.rs            # --current 实现
│           ├── default.rs            # default 子命令实现
│           ├── on.rs                 # on 子命令实现
│           ├── off.rs                # off 子命令实现
│           ├── pin.rs                # pin 子命令实现
│           ├── unpin.rs              # unpin 子命令实现
│           ├── list.rs               # list 子命令实现
│           └── use.rs                # use 子命令实现
```

### Shim 分发流程

1. 检查 `VITE_PLUS_BYPASS` 环境变量 → 旁路到系统工具（从 PATH 中过滤掉所有列出的目录）
2. 检查 `VITE_PLUS_TOOL_RECURSION` → 如果已设置，则使用透传模式
3. 检查配置中的 shim 模式：
   - 如果是 `system_first`：先尝试系统工具，失败后回退到受管理工具；在 exec 之前会把自身的 bin 目录追加到 `VITE_PLUS_BYPASS`，以防止多安装环境中的循环
   - 如果是 `managed`：使用 vite-plus 管理的 Node.js
4. 解析版本（使用基于 mtime 的缓存）
5. 确保已安装 Node.js（如有需要则下载）
6. 在已安装的 Node.js 中定位工具二进制文件
7. 将真实的 node bin 目录前置到子进程的 PATH 中
8. 设置 `VITE_PLUS_TOOL_RECURSION=1` 以防止递归
9. 执行工具（Unix：`execve`，Windows：spawn）

### Shim 递归防护

为防止 shim 调用其他 shim 时发生无限循环，vite-plus 使用环境变量标记：

**环境变量**：`VITE_PLUS_TOOL_RECURSION`

**机制：**

1. 当 shim 执行真实二进制文件时，会设置 `VITE_PLUS_TOOL_RECURSION=1`
2. 后续的 shim 调用会检查该变量
3. 如果已设置，shim 会使用**透传模式**（跳过版本解析，使用当前 PATH）
4. `vp env exec` 会显式**移除**该变量以强制重新评估

**环境变量**：`VITE_PLUS_BYPASS`（PATH 风格列表）

**SystemFirst 循环防止：**

当 PATH 中存在多个 vite-plus 安装，并且启用了 `system_first` 模式时，每个安装都可能把另一个安装的 shim 误认为“系统工具”，从而导致无限 exec 循环。为防止这种情况：

1. 在 `system_first` 模式下，在 exec 找到的系统工具之前，当前安装会把自己的 bin 目录追加到 `VITE_PLUS_BYPASS`
2. 下一个安装会看到 `VITE_PLUS_BYPASS` 已设置，并通过 `find_system_tool()` 进入旁路模式
3. `find_system_tool()` 会从 PATH 中过滤掉 `VITE_PLUS_BYPASS` 中列出的所有目录（以及它自己的 bin 目录）
4. 这确保搜索会跳过所有已知的 vite-plus bin 目录，并找到真实的系统二进制文件（或者干净地报错）
5. `VITE_PLUS_BYPASS` 会在 `vp env exec` 过程中被保留，从而保持循环保护处于激活状态

**流程图：**

```
用户运行：node app.js
    │
    ▼
Shim 检查 VITE_PLUS_TOOL_RECURSION
    │
    ├── 未设置 → 解析版本，设置 RECURSION=1，exec 真实 node
    │
    └── 已设置 → 透传模式（使用当前 PATH）
```

**代码示例：**

```rust
const RECURSION_ENV_VAR: &str = "VITE_PLUS_TOOL_RECURSION";

fn execute_shim() {
    if env::var(RECURSION_ENV_VAR).is_ok() {
        // 透传：上下文已经完成评估
        execute_with_current_path();
    } else {
        // 首次调用：解析版本并设置标记
        let version = resolve_version();
        let path = build_path_for_version(version);

        env::set_var(RECURSION_ENV_VAR, "1");
        execute_with_path(path);
    }
}

fn execute_run_command() {
    // 清除标记以强制重新评估
    env::remove_var(RECURSION_ENV_VAR);

    let version = parse_version_from_args();
    execute_with_version(version);
}
```

**这很重要的原因：**

- 防止 Node 脚本启动其他 Node 进程时发生无限循环
- 允许 `vp env exec` 在执行过程中覆盖版本
- 确保在复杂的进程树中行为一致

## 设计决策

### 1. 使用单一二进制并通过 argv[0] 检测

**决策**：使用一个单一的 `vp` 二进制，通过 `argv[0]` 检测 shim 模式。

**理由**：

- 简化升级流程（更新一个二进制，刷新 shims）
- 与分别维护多个二进制相比，减少磁盘占用
- 所有工具行为保持一致
- 已被验证的模式（fnm、volta 都在使用）

### 2. 在 Unix 上为 Shims 使用符号链接

**决策**：在 Unix 上所有 shims 都使用指向 vp 二进制的符号链接。

**理由**：

- 符号链接会保留 argv[0] - 执行符号链接时，argv[0] 会被设置为符号链接路径，而不是目标路径
- Volta 已成功验证的模式
- 只需维护一个二进制 - 更新 `current/bin/vp` 即可让所有 shims 生效
- 不会产生二进制堆积问题（符号链接只是文件系统指针）
- 相对符号链接（例如 `../current/bin/vp`）可在同一目录树内正常工作

### 3. 在 Windows 上使用 Trampoline 可执行文件

**决策**：在 Windows 上使用轻量级的 trampoline `.exe` 文件，而不是 `.cmd` 包装器。每个 trampoline 会从自己的文件名中检测工具名称，设置 `VITE_PLUS_SHIM_TOOL`，并启动 `vp.exe`。参见 [RFC: 用于 Shims 的 Trampoline EXE](./trampoline-exe-for-shims.md)。

**理由**：

- `.cmd` 包装器在 Ctrl+C 时会出现“Terminate batch job (Y/N)?” 提示
- `.exe` 文件可在所有 shell 中使用（cmd.exe、PowerShell、Git Bash），无需单独的包装器
- 单个 trampoline 二进制（约 100-150KB）按工具复制——无需 `.cmd` + shell 脚本配对
- 通过 `SetConsoleCtrlHandler` 可干净地处理 Ctrl+C

### 4. Unix 使用 execve，Windows 使用 spawn

**决策**：在 Unix 上使用 `execve`（进程替换），在 Windows 上使用 `spawn`。

**理由**：

- `execve` 在 Unix 上会保留 PID、信号和进程层级关系
- Windows 不支持 `execve` 风格的进程替换
- 在 Windows 上使用 `spawn` 并正确传递退出码是标准做法

### 5. 将 VITE_PLUS_HOME 与 Cache 分离

**决策**：保持 VITE_PLUS_HOME（bin、config）与缓存（Node 二进制）分离。

**理由**：

- 缓存使用 XDG/平台标准位置（已实现）
- VITE_PLUS_HOME 需要用户可访问，以便进行 PATH 配置
- 允许清理缓存而不破坏 shim 设置

### 6. 基于 mtime 的缓存失效

**决策**：当版本文件的 mtime 变化时，使解析缓存失效。

**理由**：

- 快速的 O(1) 校验（stat 调用）
- 无需在每次调用时重新解析文件
- 内容变更会触发 mtime 更新
- 简单且可靠

## 错误处理

### 未找到版本文件（默认回退）

当未找到版本文件时，vite-plus 会使用配置的默认版本：

```bash
$ node -v
v20.18.0  # 使用用户配置的默认版本（通过 'vp env default 20.18.0' 设置）

# 如果未配置默认版本，则使用最新 LTS
$ node -v
v22.13.0  # 回退到最新 LTS
```

解析顺序如下：

1. `VITE_PLUS_NODE_VERSION` 环境变量（会话覆盖）
2. `.session-node-version` 文件（会话覆盖）
3. 当前目录或父目录中的 `.node-version`
4. 当前目录或父目录中的 `package.json#devEngines.runtime`
5. 当前目录或父目录中的 `package.json#engines.node`
6. **用户默认值**：通过 `vp env default <version>` 配置（存储在 `~/.vite-plus/config.json` 中）
7. **系统默认值**：最新 LTS 版本

### 安装失败

```bash
$ node -v
vp: 安装 Node 20.18.0 失败：网络错误：连接被拒绝
vp: 请检查你的网络连接并重试
vp: 或设置 VITE_PLUS_BYPASS=1 以使用系统 node
```

### 未找到工具

```bash
$ npx vitest
vp: 在 Node 14.0.0 安装中未找到工具 'npx'
vp: npx 在 Node 5.2.0+ 中可用
```

### PATH 配置错误

```bash
$ vp env doctor
Installation
  ✓ VITE_PLUS_HOME    ~/.vite-plus
  ✓ Bin directory     exists
  ✓ Shims             node, npm, npx

Configuration
  ✓ Node.js mode      managed

PATH
  ✗ vp                不在 PATH 中
                      期望值： ~/.vite-plus/bin

    将以下内容添加到你的 shell 配置文件（~/.zshrc、~/.bashrc 等）：

      . "$HOME/.vite-plus/env"

    然后重新启动你的终端。

...

✗ 发现一些问题。请运行建议的命令进行修复。
```

## 用户体验

### 通过安装脚本进行首次设置

**关于目录结构的说明：**

- 所有二进制文件（vp CLI 和 shims）：`~/.vite-plus/bin/`

全局 CLI 安装脚本（`packages/global/install.sh`）将更新为：

1. 将 `vp` 二进制安装到 `~/.vite-plus/current/bin/vp`
2. 创建符号链接 `~/.vite-plus/bin/vp` → `../current/bin/vp`
3. 配置 shell PATH，将 `~/.vite-plus/bin` 包含进去
4. 根据环境设置 Node.js 版本管理器：
   - **CI 环境**：自动启用（无提示）
   - **没有系统 Node.js**：自动启用（无提示）
   - **交互式且存在系统 Node.js**：提示用户“是否要让 Vite+ 管理 Node.js 版本？”
5. 如果已经配置过，则静默跳过

```bash
$ curl -fsSL https://vite.plus | sh

正在设置 VITE+...

是否要让 Vite+ 管理 Node.js 版本？
按 Enter 接受（Y/n）：

✔ VITE+ 安装成功！

  面向 Web 的统一工具链。

  快速开始：
    vp create       创建新项目
    vp env          管理 Node.js 版本
    vp install      安装依赖
    vp dev          启动开发服务器

  Node.js 现在由 Vite+ 管理（通过 vp env）。
  运行 vp env doctor 验证你的设置。

  运行 vp help 获取更多信息。

  注意：请运行 `source ~/.zshrc` 或重启终端。
```

### 手动设置

如果用户拒绝或需要重新配置：

```bash
$ vp env setup

正在设置 vite-plus 环境...

已创建 shims：
  /Users/user/.vite-plus/bin/node
  /Users/user/.vite-plus/bin/npm
  /Users/user/.vite-plus/bin/npx

将以下内容添加到你的 shell 配置文件（~/.zshrc、~/.bashrc 等）：

  export PATH="/Users/user/.vite-plus/bin:$PATH"

如需 IDE 支持（VS Code、Cursor），请确保 bin 目录在系统 PATH 中：
  - macOS：添加到 ~/.profile 或使用 launchd
  - Linux：添加到 ~/.profile，以便与显示管理器集成
  - Windows：系统属性 → 环境变量 → Path

重启你的终端和 IDE，然后运行 'vp env doctor' 进行验证。
```

### Doctor 输出（健康）

```bash
$ vp env doctor
Installation
  ✓ VITE_PLUS_HOME    ~/.vite-plus
  ✓ Bin directory     exists
  ✓ Shims             node, npm, npx

Configuration
  ✓ Node.js mode      managed
  ✓ IDE integration   env sourced in ~/.zshenv

PATH
  ✓ vp                first in PATH
  ✓ node              ~/.vite-plus/bin/node (vp shim)
  ✓ npm               ~/.vite-plus/bin/npm (vp shim)
  ✓ npx               ~/.vite-plus/bin/npx (vp shim)

Version Resolution
    Directory         /Users/user/projects/my-app
    Source            .node-version
    Version           20.18.0
  ✓ Node binary       installed

✓ All checks passed
```

**带会话覆盖的 Doctor 输出：**

```bash
$ vp env doctor
...

Configuration
  ✓ Node.js mode      managed
  ✓ IDE integration   env sourced in ~/.zshenv
  ⚠ 会话覆盖         VITE_PLUS_NODE_VERSION=20.18.0
                      覆盖所有基于文件的解析。
                      运行 'vp env use --unset' 以移除。
  ⚠ 会话覆盖（文件）  .session-node-version=20.18.0
                      由 'vp env use' 写入。运行 'vp env use --unset' 以移除。

...
```

**系统优先模式下的 Doctor 输出：**

```bash
$ vp env doctor
...

Configuration
  ✓ Node.js mode      system-first
    系统 Node.js      /usr/local/bin/node
  ✓ IDE integration   env sourced in ~/.zshenv

...

Version Resolution
    Directory         /Users/user/projects/my-app
    Source            system PATH
    Version           v22.22.0
  ✓ Node binary       /usr/local/bin/node

...
```

**系统优先模式下的 Doctor 输出（无系统 Node）：**

```bash
$ vp env doctor
...

Configuration
  ✓ Node.js mode      system-first
  ⚠ 系统 Node.js      not found (will fall back to managed)

...
```

**Doctor 输出（异常）：**

```bash
$ vp env doctor
Installation
  ✓ VITE_PLUS_HOME    ~/.vite-plus
  ✗ Bin directory     does not exist
  ✗ Missing shims     node, npm, npx
                      Run 'vp env setup' to create bin directory and shims.

Configuration
  ✓ Node.js mode      managed

PATH
  ✗ vp                not in PATH
                      Expected: ~/.vite-plus/bin

    Add to your shell profile (~/.zshrc, ~/.bashrc, etc.):

      . "$HOME/.vite-plus/env"

    For fish shell, add to ~/.config/fish/config.fish:

      source "$HOME/.vite-plus/env.fish"

    Then restart your terminal.

  node                not found
  npm                 not found
  npx                 not found

Version Resolution
    Directory         /Users/user/projects/my-app
    Source            .node-version
    Version           20.18.0
  ⚠ Node binary       not installed
                      Version will be downloaded on first use.

Conflicts
  ⚠ nvm               detected (NVM_DIR is set)
                      Consider removing other version managers from your PATH
                      to avoid version conflicts.

IDE Setup
  ⚠ GUI applications may not see shell PATH changes.

    macOS:
      Add to ~/.zshenv or ~/.profile:
        . "$HOME/.vite-plus/env"
      Then restart your IDE to apply changes.

✗ 发现一些问题。运行建议的命令来修复它们。
```

## Shell 配置参考

本节记录用于 PATH 设置和故障排查的 shell 配置文件行为。

### Zsh 配置文件

| 文件         | 加载时机                                                             | 使用场景                     |
| ------------ | -------------------------------------------------------------------- | ---------------------------- |
| `.zshenv`    | **始终** - 每个 zsh 实例（登录、交互式、脚本、子 shell）            | PATH 和环境变量              |
| `.zprofile`  | 仅登录 shell                                                        | 登录时初始化                 |
| `.zshrc`     | 仅交互式 shell                                                      | 别名、函数、提示符           |
| `.zlogin`    | 登录 shell，且在 `.zshrc` 之后                                      | 完整初始化后的命令           |

**加载顺序（登录交互式 shell）：**

```
1. /etc/zshenv     → 系统环境
2. ~/.zshenv       → 用户环境（始终加载）
3. /etc/zprofile   → 系统登录设置
4. ~/.zprofile     → 用户登录设置
5. /etc/zshrc      → 系统交互式设置
6. ~/.zshrc        → 用户交互式设置
7. /etc/zlogin     → 系统登录收尾
8. ~/.zlogin       → 用户登录收尾
```

**关键点：** `.zshenv` 是进行 PATH 配置的**最可靠**位置，因为：

- 对所有 zsh 实例都会加载，包括 IDE 启动的进程
- 即使是非交互式脚本和子 shell 也会加载

### Bash 配置文件

| 文件            | 加载时机                     | 使用场景                                        |
| --------------- | ---------------------------- | ----------------------------------------------- |
| `.bash_profile` | 仅登录 shell                | macOS Terminal、SSH 会话                        |
| `.bash_login`   | 仅登录 shell（回退）         | 当 `.bash_profile` 不存在时使用                  |
| `.profile`      | 仅登录 shell（回退）         | 如果前者都不存在则使用；`sh` 也会读取           |
| `.bashrc`       | 交互式非登录 shell          | Linux 终端模拟器、子 shell                      |

**加载顺序（登录 shell）：**

```
1. /etc/profile           → 系统配置文件
2. 首先找到的以下之一：     → 用户配置文件（只加载其中一个）
   - ~/.bash_profile
   - ~/.bash_login
   - ~/.profile
3. ~/.bashrc              → 仅当上面显式 source 时才会加载
```

**关键行为：**

- Bash 只读取找到的**第一个**配置文件（`.bash_profile` > `.bash_login` > `.profile`）
- 登录 shell 中**不会自动**加载 `.bashrc` - 必须由配置文件手动 source
- 标准模式：`.bash_profile` 应包含 `source ~/.bashrc`

### Fish 配置文件

Fish shell 的配置模型比 bash/zsh 更简单。

| 文件                              | 加载时机                                                    | 使用场景                         |
| --------------------------------- | ----------------------------------------------------------- | -------------------------------- |
| `~/.config/fish/config.fish`      | **始终** - 每个 fish 实例（登录、交互式、脚本）           | 包括 PATH 在内的所有配置         |
| `~/.config/fish/conf.d/*.fish`    | **始终** - 在 config.fish 之前                              | 模块化配置片段                   |
| `~/.config/fish/functions/*.fish` | 按需加载，在函数被调用时                                     | 自动加载的函数定义              |

**关键点：**

- Fish 对配置没有登录 shell 与非登录 shell 的区分
- `config.fish` 总是会加载，类似于 zsh 的 `.zshenv`
- 这使得 Fish 在 IDE 集成方面比 bash 更可靠
- 全局变量（`set -U`）可在会话间持久化，无需配置文件

**PATH 语法：**

```fish
# Fish 使用的语法与 bash/zsh 不同
set -gx PATH $HOME/.vite-plus/bin $PATH
```

### 配置文件可能不会加载的情况

| 场景                     | Zsh 行为        | Bash 行为                         | Fish 行为            |
| ------------------------ | --------------- | --------------------------------- | -------------------- |
| 非交互式脚本            | 仅 `.zshenv`    | **什么都不加载**（除非设置 `BASH_ENV`） | 加载 `config.fish`   |
| IDE 启动的进程          | 仅 `.zshenv`    | **什么都不加载**（关键缺口）      | 加载 `config.fish`   |
| SSH 会话                | 所有登录文件    | 仅 `.bash_profile`               | 加载 `config.fish`   |
| 子 shell                | 仅 `.zshenv`    | `.bashrc`（交互式）或什么都不加载 | 加载 `config.fish`   |
| macOS Terminal.app      | 所有登录文件    | `.bash_profile` → `.bashrc`      | 加载 `config.fish`   |
| Linux 终端模拟器        | `.zshrc`        | 仅 `.bashrc`                      | 加载 `config.fish`   |

### IDE 集成挑战

GUI 启动的 IDE（VS Code、Cursor、JetBrains）在 PATH 继承方面有特殊问题：

**macOS：**

- GUI 应用继承自 `launchd` 的环境，而不是 shell rc 文件
- IDE 终端可能会启动登录或非登录 shell（取决于 IDE 设置）
- 解决方案：zsh 使用 `.zshenv`；bash 需要同时配置 `.bash_profile` 和 `.bashrc`

**Linux：**

- GUI 应用继承自显示管理器会话
- `~/.profile` 往往会被显示管理器（GDM、SDDM 等）source
- 非登录终端只读取 `.bashrc`

**Windows：**

- PATH 是系统/用户环境变量
- 没有 shell rc 文件的复杂性

### 安装脚本的 Shell 配置

`install.sh` 脚本会在多个 shell 文件中配置 PATH，以获得最大兼容性：

**对于 Zsh（`$SHELL` 以 `/zsh` 结尾）：**

- 添加到 `~/.zshenv` - 确保所有 zsh 实例都能看到 PATH
- 添加到 `~/.zshrc` - 确保交互式 shell 中 PATH 位于最前

**对于 Bash（`$SHELL` 以 `/bash` 结尾）：**

- 添加到 `~/.bash_profile` - 供登录 shell 使用（macOS 默认）
- 添加到 `~/.bashrc` - 供交互式非登录 shell 使用（Linux 默认）
- 添加到 `~/.profile` - 作为没有 `.bash_profile` 的系统的回退

**对于 Fish（`$SHELL` 以 `/fish` 结尾）：**

- 添加到 `~/.config/fish/config.fish`

**重要说明：**

1. 只修改**已存在**的文件 - 不会创建新的 rc 文件
2. 检查是否已存在 PATH 条目以避免重复
3. 追加时带注释标记：`# Vite+ bin (https://viteplus.dev)`

### PATH 问题排查

**症状：安装后找不到 `vp`**

1. 检查你正在使用哪个 shell：

   ```bash
   echo $SHELL
   ```

2. 验证是否已添加 PATH 条目：

   ```bash
   # 对于 zsh
   grep "vite-plus" ~/.zshenv ~/.zshrc

   # 对于 bash
   grep "vite-plus" ~/.bash_profile ~/.bashrc ~/.profile

   # 对于 fish
   grep "vite-plus" ~/.config/fish/config.fish
   ```

3. 如果没有找到条目，手动添加到对应文件：

   ```bash
   # 对于 zsh/bash - 添加这一行：
   export PATH="$HOME/.vite-plus/bin:$PATH"

   # 对于 fish - 添加这一行：
   set -gx PATH $HOME/.vite-plus/bin $PATH
   ```

4. source 该文件或重启终端：
   ```bash
   source ~/.zshrc  # 或 ~/.bashrc
   # 对于 fish：source ~/.config/fish/config.fish
   ```

**症状：IDE 终端看不到 `vp` 或 `node`**

1. 对于 VS Code，检查终端配置文件设置（建议使用登录 shell）
2. 确保 `~/.zshenv` 包含 PATH 条目（对 zsh 最可靠）
3. 对于 bash 用户：可能需要配置 IDE 使用登录 shell（`bash -l`）
4. Fish 用户：`config.fish` 总会加载，因此 PATH 在 IDE 中应当有效
5. 运行 `vp env doctor` 诊断 PATH 配置

**症状：Shell 脚本找不到 `node`**

对于 bash 脚本，非交互式执行不会加载 rc 文件。可选方案：

- 使用 `#!/usr/bin/env bash` 并设置 `BASH_ENV`
- 显式 source rc 文件：`source ~/.bashrc`
- 使用完整路径：`~/.vite-plus/bin/node`

注意：Fish 脚本（`#!/usr/bin/env fish`）总是会加载 `config.fish`，因此不适用此问题。

### 默认版本命令

```bash
# 显示当前默认版本
$ vp env default
默认 Node.js 版本：20.18.0
  设置来源：~/.vite-plus/config.json

# 将特定版本设为默认
$ vp env default 22.13.0
✓ 默认 Node.js 版本已设为 22.13.0

# 设置为最新 LTS
$ vp env default lts
✓ 默认 Node.js 版本已设为 lts（当前为 22.13.0）

# 未配置默认值时
$ vp env default
未配置默认版本。正在使用最新 LTS（22.13.0）。
  运行 'vp env default <version>' 来设置默认值。
```

### Node.js 模式命令

Node.js 模式控制所有 vp 命令和 shims 如何解析 Node.js：

| 模式                | 描述                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `managed`（默认）   | 所有 vp 命令和 shims 使用 vite-plus 管理的 Node.js                                |
| `system_first`      | 所有 vp 命令和 shims 优先使用系统 Node.js，若未找到则回退到 managed                |

```bash
# 启用 managed 模式（始终使用 vite-plus 的 Node.js）
$ vp env on
✓ Node.js 管理已设为 managed。

所有 vp 命令和 shims 现在都会始终使用 Vite+ 管理的 Node.js。
如需优先使用系统 Node.js，请运行 'vp env off'。

# 启用 system-first 模式（优先使用系统 Node.js）
$ vp env off
✓ Node.js 管理已设为 system-first。

所有 vp 命令和 shims 现在都会优先使用系统 Node.js，若未找到则回退到 managed。
如需始终使用 Vite+ 管理的 Node.js，请运行 'vp env on'。

# 如果已经处于请求的模式
$ vp env on
Node.js 管理已是 managed。
所有 vp 命令和 shims 将始终使用 Vite+ 管理的 Node.js。
```

**system-first 模式（`vp env off`）的使用场景**：

- NixOS / GNU Guix：下载的二进制通常是动态链接的，可能无法运行
- 无法联网下载 Node.js 的隔离环境
- 已经安装好 Node.js 的容器镜像
- 使用其他工具管理 Node.js 的用户（mise、nvm、fnm 等）
- 通过对比系统 Node.js 与 managed Node.js 来调试版本相关问题

### Which 命令

显示将要执行的工具二进制路径。第一行始终是裸路径（便于管道处理和复制粘贴）。

**核心工具** - 显示解析后的 Node.js 二进制路径，以及版本和解析来源：

```bash
$ vp env which node
/Users/user/.vite-plus/js_runtime/node/20.18.0/bin/node
  Version:    20.18.0
  Source:     /Users/user/projects/my-app/.node-version

$ vp env which npm
/Users/user/.vite-plus/js_runtime/node/20.18.0/bin/npm
  Version:    20.18.0
  Source:     /Users/user/projects/my-app/.node-version
```

使用会话覆盖时：

```bash
$ vp env which node
/Users/user/.vite-plus/js_runtime/node/18.20.0/bin/node
  Version:    18.20.0
  Source:     VITE_PLUS_NODE_VERSION (session)
```

**全局包** - 显示二进制路径以及包元数据：

```bash
$ vp env which tsc
/Users/user/.vite-plus/packages/typescript/lib/node_modules/typescript/bin/tsc
  Package:    typescript@5.7.0
  Binaries:   tsc, tsserver
  Node:       20.18.0
  Installed:  2024-01-15

$ vp env which eslint
/Users/user/.vite-plus/packages/eslint/lib/node_modules/eslint/bin/eslint.js
  Package:    eslint@9.0.0
  Binaries:   eslint
  Node:       22.13.0
  Installed:  2024-02-20
```

| 工具类型         | 解析方式                          | 输出                                                         |
| ---------------- | ----------------------------------- | ------------------------------------------------------------ |
| 核心工具         | 来自项目配置的 Node.js 版本        | 二进制路径 + 版本 + 来源                                    |
| 包管理器         | 匹配 `packageManager` 字段         | 二进制路径 + 包版本 + 来源                                  |
| 全局包           | 包元数据查询                      | 二进制路径 + 包版本 + Node.js 版本 + 安装日期               |

**错误情况：**

```bash
# 未知工具（既不是核心工具，也不属于任何全局包）
$ vp env which unknown-tool
error: tool 'unknown-tool' not found
Not a core tool (node, npm, npx) or installed global package.
Run 'vp list -g' to see installed packages.

# Node.js 版本未安装
$ vp env which node
error: node not found
Node.js 20.18.0 is not installed.
Run 'vp env install 20.18.0' to install it.

# 全局包二进制缺失
$ vp env which tsc
error: binary 'tsc' not found
Package typescript may need to be reinstalled.
Run 'vp install -g typescript' to reinstall.
```

## Pin 命令

`vp env pin` 命令提供按目录的 Node.js 版本固定功能。写入目标遵循来自 [RFC: devEngines Support](./dev-engines.md) 的兼容性优先规则：如果已存在 `.node-version`，则继续更新它；否则会将固定写入 `package.json#devEngines.runtime`（当缺少时会创建 `node` 条目，并设置 `onFail: "download"`）；只有当目录没有 `package.json` 时，才会创建 `.node-version`。显式的 `--target node-version` / `--target dev-engines` 标志会覆盖默认选择。

### 行为

**固定一个版本：**

```bash
$ vp env pin 20.18.0
✓ 已将 Node.js 版本固定为 20.18.0
  在 /Users/user/projects/my-app 中创建了 .node-version
✓ Node.js 20.18.0 已安装
```

**使用别名固定：**

别名（`lts`、`latest`）会在固定时解析为确切版本，以保证可复现性：

```bash
$ vp env pin lts
✓ 已将 Node.js 版本固定为 22.13.0（由 lts 解析）
  在 /Users/user/projects/my-app 中创建了 .node-version
✓ Node.js 22.13.0 已安装
```

**显示当前固定版本：**

```bash
$ vp env pin
固定的版本：20.18.0
  来源：/Users/user/projects/my-app/.node-version

# 通过当前目录 package.json 中的 devEngines.runtime 固定
$ vp env pin
固定的版本：24.1.0
  来源：/Users/user/projects/my-app/package.json（devEngines.runtime）

# 如果当前目录没有固定，但在父级目录中找到了（.node-version 或
# devEngines.runtime，按每个目录的解析顺序检查）
$ vp env pin
当前目录未固定版本。
  继承自：/Users/user/projects/.node-version 的 22.13.0

$ vp env pin
当前目录未固定版本。
  继承自：/Users/user/projects/package.json（devEngines.runtime）中的 ^24.0.0

# 如果任何地方都没有固定
$ vp env pin
未固定版本。
  使用默认值：20.18.0（来自 ~/.vite-plus/config.json）
```

**移除固定：**

```bash
$ vp env pin --unpin
✓ 已从 /Users/user/projects/my-app 移除 .node-version

# 另一种语法
$ vp env unpin
✓ 已从 /Users/user/projects/my-app 移除 .node-version
```

`vp env unpin` 会从 `vp env pin` 原本会写入的同一来源中移除固定：如果存在 `.node-version` 就删除它，否则会从 `package.json#devEngines.runtime` 中移除 `node` 条目。

### 版本格式支持

| 输入      | 写入目标的内容       | 行为                                         |
| --------- | -------------------- | -------------------------------------------- |
| `20.18.0` | `20.18.0`            | 精确版本（会对注册表进行验证）               |
| `20.18`   | 例如 `20.18.3`       | 在固定时解析为精确版本                       |
| `20`      | 例如 `20.19.0`       | 在固定时解析为精确版本                       |
| `lts`     | 例如 `22.13.0`       | 在固定时解析为精确版本                       |
| `latest`  | 例如 `24.0.0`        | 在固定时解析为精确版本                       |
| `^20.0.0` | 例如 `20.19.0`       | 在固定时解析为精确版本                       |

两种写入目标都会获得相同的、已解析出的精确版本；devEngines 规范只允许在 `devEngines.runtime.version` 中使用 semver 范围语法，而精确版本也满足该要求。参见 [RFC: devEngines Support](./dev-engines.md)。

### 标志

| Flag                                   | Description                                                                      |
| -------------------------------------- | -------------------------------------------------------------------------------- |
| `--unpin`                              | Remove the pin from its current source (`.node-version` or `devEngines.runtime`) |
| `--no-install`                         | Skip pre-downloading the pinned version                                          |
| `--force`                              | Overwrite an existing pin without confirmation                                   |
| `--target <node-version\|dev-engines>` | Explicitly choose the write target (overrides the default selection)             |

### 预下载行为

默认情况下，`vp env pin` 会在固定后立即下载 Node.js 版本。使用 `--no-install` 可跳过：

```bash
$ vp env pin 20.18.0 --no-install
✓ 已将 Node.js 版本固定为 20.18.0
  在 /Users/user/projects/my-app 中创建了 .node-version
  注意：该版本将在首次使用时下载。
```

### 覆盖确认

当 `.node-version` 文件已存在时：

```bash
$ vp env pin 22.13.0
.node-version 已存在，当前版本为 20.18.0
是否用 22.13.0 覆盖？（y/n）：y
✓ 已将 Node.js 版本固定为 22.13.0
```

使用 `--force` 可跳过确认：

```bash
$ vp env pin 22.13.0 --force
✓ 已将 Node.js 版本固定为 22.13.0
```

当目标已经固定为相同版本时，命令不会执行任何操作（无论是否带 `--force`）：

```bash
$ vp env pin 22.13.0
已固定到 22.13.0
```

### 错误处理

```bash
# 无效的版本格式
$ vp env pin invalid
错误：无效的 Node.js 版本：invalid
  请使用精确版本（20.18.0）、部分版本（20）或 semver 范围（^20.0.0）

# 版本不存在
$ vp env pin 99.0.0
错误：Node.js 版本 99.0.0 不存在
  运行 'vp env list-remote' 查看可用版本

# 别名解析期间发生网络错误
$ vp env pin lts
错误：解析 'lts' 失败：网络错误
  请检查网络连接后重试
```

## 全局包管理

vite-plus 提供跨 Node 版本的全局包管理，通过 `vp install -g`、`vp remove -g` 和 `vp update -g` 实现。与 `npm install -g` 不同，后者会安装到特定 Node 版本的目录中，而 vite-plus 会独立管理全局包，使其在 Node.js 版本切换后仍然保留。

注意：`npm install -g` 会透传给真实的 npm（与 Node 版本相关）。请使用 `vp install -g` 来管理 vite-plus 的全局包。

### 工作方式

当你运行 `vp install -g typescript` 时，vite-plus 会：

1. 解析 Node.js 版本（来自 `--node` 标志或当前目录）
2. 将包安装到 `~/.vite-plus/packages/typescript/`
3. 记录元数据（包版本、所用 Node 版本、二进制文件）
4. 为包提供的每个二进制文件创建 shim（`tsc`、`tsserver`）

### 安装流程

```
vp install -g typescript
    │
    ▼
解析全局标志 → 路由到受管理的全局安装
    │
    ▼
创建暂存区：~/.vite-plus/tmp/packages/typescript/
    │
    ▼
设置 npm_config_prefix → 暂存目录
    │
    ▼
使用修改后的环境执行 npm
    │
    ▼
成功后：
├── 移动到：~/.vite-plus/packages/typescript/
├── 写入配置：~/.vite-plus/packages/typescript.json
├── 创建 shims：~/.vite-plus/bin/tsc, tsserver
└── 更新共享 NODE_PATH 链接
```

### 包配置文件

`~/.vite-plus/packages/typescript.json`：

```json
{
  "name": "typescript",
  "version": "5.7.0",
  "platform": {
    "node": "20.18.0",
    "npm": "10.8.0"
  },
  "bins": ["tsc", "tsserver"],
  "manager": "npm",
  "installedAt": "2024-01-15T10:30:00Z"
}
```

### 二进制执行

运行 `tsc` 时：

1. shim 读取 `~/.vite-plus/packages/typescript.json`
2. 加载固定的平台（Node 20.18.0）
3. 使用该 Node 版本的 bin 目录构造 PATH
4. 设置 NODE_PATH 以包含共享包
5. 执行 `~/.vite-plus/packages/typescript/lib/node_modules/.bin/tsc`

### 使用指定 Node.js 版本安装

```bash
# 安装全局包（使用当前目录中的 Node.js 版本）
vp install -g typescript

# 使用特定的 Node.js 版本安装
vp install -g --node 22 typescript
vp install -g --node 20.18.0 typescript
vp install -g --node lts typescript

# 安装多个包
vp install -g typescript eslint prettier
```

`--node` 标志允许你指定用于安装的 Node.js 版本。如果未提供，则会从当前目录解析版本（与 shim 行为相同）。

### 升级与卸载

```bash
# 升级会替换现有包
vp update -g typescript
vp install -g typescript@latest

# 更新所有全局包
vp update -g

# 卸载会移除包和 shims
vp remove -g typescript
```

### 二进制冲突处理

当两个包提供相同的二进制名称时（例如 `eslint` 和 `eslint-v9` 都提供 `eslint` 二进制），vite-plus 采用 **Volta 风格的硬失败** 方式：

#### 冲突检测

每个二进制都有一个按二进制划分的配置文件，用于跟踪哪个包拥有它：

```
~/.vite-plus/
  packages/
    typescript.json      # 包元数据
    eslint.json
  bins/                  # 按二进制划分的配置文件
    tsc.json             # { "package": "typescript", ... }
    tsserver.json
    eslint.json          # { "package": "eslint", ... }
```

**二进制配置格式**（`~/.vite-plus/bins/tsc.json`）：

```json
{
  "name": "tsc",
  "package": "typescript",
  "version": "5.7.0",
  "nodeVersion": "20.18.0"
}
```

#### 默认行为：硬失败

当安装一个提供已被其他包拥有的二进制的包时，安装会**失败并给出清晰的错误**：

```bash
$ vp install -g eslint-v9
正在全局安装 eslint-v9...

error: 可执行文件 'eslint' 已被 eslint 安装

请先移除 eslint，再安装 eslint-v9，或使用 --force 自动替换
```

这种方式：

- 防止二进制被静默遮蔽
- 让冲突显式且可见
- 需要用户有意采取操作来解决

#### 强制模式：自动卸载

`--force` 标志会在安装新包之前自动卸载冲突包：

```bash
$ vp install -g --force eslint-v9
正在全局安装 eslint-v9...
正在卸载 eslint（与 eslint-v9 冲突）...
已卸载 eslint
已安装 eslint-v9 v9.0.0
二进制：eslint
```

**重要**：`--force` 会完全移除冲突包（不仅仅是二进制）。这确保了没有孤立文件的干净状态。

#### 两阶段卸载

卸载使用一种更稳健的两阶段方案（受 Volta 启发）：

1. **阶段 1**：尝试使用 `PackageMetadata` 获取二进制名称
2. **阶段 2**：如果元数据缺失，则扫描 `bins/` 目录中的孤立二进制配置

即使包元数据损坏或被手动删除，也能恢复。

```bash
# 正常卸载
$ vp remove -g typescript
正在卸载 typescript...
已卸载 typescript

# 恢复模式（如果 typescript.json 缺失）
$ vp remove -g typescript
正在卸载 typescript...
注意：未找到包元数据，正在扫描孤立二进制...
已卸载 typescript
```

#### 确定性的二进制解析

二进制执行使用按二进制划分的配置进行确定性查找：

1. 检查 `~/.vite-plus/bins/{binary}.json` 以获取拥有者包
2. 加载包元数据以获取 Node.js 版本和二进制路径
3. 如果未找到，则说明该二进制未安装（不进行回退扫描）

这消除了文件系统迭代顺序带来的非确定性行为。

### npm 全局安装指引

当 npm shim 检测到 `npm install -g <packages>` 时，它会正常运行真实的 npm，但使用 `spawn+wait`（而不是 `exec`），以便在安装后执行检查。npm 成功完成后，它会检查已安装的二进制是否可从 `$PATH` 访问，并在不可访问时打印提示。

#### 为什么需要这样

```
~/.vite-plus/
├── bin/                          ← 在 $PATH 上（只有这个目录）
│   ├── node → ../current/bin/vp  (shim)
│   ├── npm → ../current/bin/vp   (shim)
│   └── npx → ../current/bin/vp   (shim)
└── js_runtime/node/20.18.0/bin/  ← 不在 $PATH 上
    ├── node
    ├── npm
    ├── npx
    └── codex                     ← 由 `npm i -g` 安装，但无法访问
```

用户通常会运行 `npm install -g codex`，这会安装到受管理 Node 的 bin 目录中——但它不在 `$PATH` 上。这个二进制会悄悄变得不可访问。

#### 调用流程：`npm install -g codex`（带安装后提示）

```
用户运行：npm install -g codex
         │
         ▼
┌─────────────────────────┐
│  ~/.vite-plus/bin/npm   │  （指向 vp 二进制的符号链接）
│  argv[0] = "npm"        │
└────────────┬────────────┘
             │
             ▼
┌───────────────────────────────────────────────────────────┐
│  dispatch("npm", ["install", "-g", "codex"])               │
│  (crates/vite_global_cli/src/shim/dispatch.rs)             │
│                                                             │
│  1–5. vpx / recursion / bypass / shim / core checks        │
│  6. 解析版本         → 20.18.0                             │
│  7. 确保已安装       → ok                                  │
│  8. 定位 npm 二进制   → ~/.vite-plus/js_runtime/          │
│                           node/20.18.0/bin/npm              │
│  9. 保存 original_path = $PATH                             │
│  10. 将 node bin 目录前置到 PATH                           │
│  11. 设置递归标记                                          │
│                                                             │
│  ┌─── npm 全局安装检测 ─────────────────────────────────┐  │
│  │                                                       │  │
│  │  parse_npm_global_install(args)                       │  │
│  │    → 检测到 "install" + "-g"                         │  │
│  │    → 提取包：["codex"]                               │  │
│  │    → 返回 Some(NpmGlobalInstall)                    │  │
│  │                                                       │  │
│  │  spawn_tool(npm_path, args)    ← 不是 exec！         │  │
│  │    → 运行真实的 npm install -g codex                 │  │
│  │    → 等待完成，exit_code = 0                         │  │
│  │                                                       │  │
│  │  check_npm_global_install_result(                     │  │
│  │      pkgs, ver, orig_path, npm_path)                  │  │
│  │                                                       │  │
│  │    ┌─ 确定实际的 npm 全局前缀 ─────────────────────┐ │  │
│  │    │  运行 `npm config get prefix` → 例如 /usr/local│ │  │
│  │    │  npm_bin_dir = <prefix>/bin/                    │ │  │
│  │    │  （回退：如果 npm 失败则使用 node_dir）         │ │  │
│  │    └────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │    ┌─ npm_bin_dir 是否在 original_path 中？ ────────┐ │  │
│  │    │  YES → 返回（二进制已在 PATH 上）             │ │  │
│  │    │  NO  → 继续进行按二进制检查                    │ │  │
│  │    └────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │    → for each binary in package:                      │  │
│  │        skip core shims (node/npm/npx/vp)              │  │
│  │        if already exists in ~/.vite-plus/bin/:         │  │
│  │          if BinConfig exists → managed_conflicts       │  │
│  │          skip (don't overwrite)                        │  │
│  │        check source exists in npm_bin_dir             │  │
│  │        add to missing_bins list                       │  │
│  │    → warn about managed conflicts                     │  │
│  │    → interactive? prompt to create links              │  │
│  │      non-interactive? create links directly           │  │
│  │                                                       │  │
│  │  return exit_code (0)                                 │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**与 `vp install -g` shims 的冲突**：如果某个二进制已经存在于 `~/.vite-plus/bin/` 中，并且有一个 BinConfig 文件（`~/.vite-plus/bins/{name}.json`），则它由 `vp install -g` 管理。shim 会向用户发出警告，而不是静默跳过：

```
'codex' 已由 `vp install -g` 管理。请先运行 `vp uninstall -g` 再进行替换。
```

**交互模式**（stdin 是 TTY）：

```
'codex' 在你的 PATH 中不可用。
要创建一个链接到 ~/.vite-plus/bin/ 以使其可用吗？[Y/n]
```

如果用户确认（Y 或回车）：

- 创建符号链接：`~/.vite-plus/bin/codex` → `~/.vite-plus/js_runtime/node/20.18.0/bin/codex`
- 打印：`已将 'codex' 链接到 ~/.vite-plus/bin/codex`

**Non-interactive mode** (piped/CI):

- 直接创建符号链接（无需提示）
- 打印：`已将 'codex' 链接到 ~/.vite-plus/bin/codex`
- 打印相同的提示

#### 调用流程：普通 `npm install react` — 不受影响

```
用户运行：npm install react
         │
         ▼
┌───────────────────────────────────────────────────┐
│  dispatch("npm", ["install", "react"])              │
│                                                     │
│  ... 版本解析、PATH 设置 ...                        │
│                                                     │
│  parse_npm_global_install(args)                      │
│    → 没有 "-g" 或 "--global" 标志                   │
│    → 返回 None                                      │
│                                                     │
│  （继续执行普通的 exec_tool）                       │
│    → exec_tool(npm_path, args)                      │
│       └─ 用真实的 npm 替换进程（Unix exec）         │
└───────────────────────────────────────────────────┘
```

#### `npm uninstall -g` 链接清理

当检测到 `npm uninstall -g` 时，shim 会使用 `spawn_tool()`（与 install 类似）以便在 npm 完成后继续保留控制权。在运行 npm 之前，它会从包的 `package.json` 中收集二进制名称（这些文件将被 npm 删除）。在成功卸载后，它会从 `~/.vite-plus/bin/` 中移除对应的符号链接。

**通过 BinConfig 进行链接跟踪**：当 `npm install -g` 在 `~/.vite-plus/bin/` 中创建链接时，会写入一个 `source: "npm"` 的 BinConfig 到 `~/.vite-plus/bins/{name}.json`。这用于区分 npm 创建的链接、`vp install -g` 管理的 shims（`source: "vp"`）以及用户拥有的二进制（没有 BinConfig）。

**安全的卸载清理**：`npm uninstall -g` 只会移除那些具有 `source: "npm"` 的 BinConfig，并且其 `package` 字段与正在卸载的包匹配的链接。这样可以防止删除后来被另一个提供相同 bin 名称的包覆盖的链接。用户拥有的二进制和 `vp install -g` 管理的 shims 永远不会被触碰。

**`--prefix` 支持**：当 `npm install -g` 或 `npm uninstall -g` 传入 `--prefix <dir>` 时，shim 会使用该前缀进行 package.json 查找和 bin 目录解析，而不是运行 `npm config get prefix`。同时支持绝对路径和相对路径——相对路径（例如 `./custom`、`../foo`）会相对于当前工作目录解析。

**Windows 本地路径支持**：`resolve_package_name()` 会将带驱动器字母的路径（`C:\...`）视为本地路径。

#### 设计决策：spawn vs exec

在 Unix 上，`exec_tool()` 使用 `exec()`，它会替换当前进程——之后不会再执行任何代码。对于 `npm install -g` 和 `npm uninstall -g`，我们特意使用 `spawn_tool()`（spawn + wait）来在 npm 完成后保留控制权，从而实现安装后提示和卸载后的链接清理。其他所有 npm 命令仍然使用 `exec_tool()`，以获得零额外开销。

## Exec Command

`vp env exec` 命令使用特定的 Node.js 版本执行一个命令。它有两种模式：

1. **显式版本模式**：当提供 `--node` 时，使用指定版本运行
2. **Shim 模式**：当未提供 `--node` 且命令是 shim 工具（node/npm/npx 或全局包）时，使用与 Unix 符号链接相同的版本解析方式

这适用于：

- 在不同的 Node 版本下测试代码
- 无需更改项目配置即可运行一次性命令
- 需要显式版本控制的 CI/CD 脚本
- 旧版 Windows `.cmd` 包装器（已弃用，改用 trampoline `.exe` shims）

### 使用方法

```bash
# Shim 模式：版本自动解析（与 Unix 符号链接相同）
vp env exec node --version        # 核心工具 - 从 .node-version/package.json 解析
vp env exec npm install           # 核心工具
vp env exec npx vitest            # 核心工具
vp env exec tsc --version         # 全局包 - 使用安装时的 Node.js

# 显式版本模式：使用特定 Node 版本运行
vp env exec --node 20.18.0 node app.js

# 使用特定 Node 和 npm 版本运行
vp env exec --node 22.13.0 --npm 10.8.0 npm install

# 版本可以是 semver 范围（运行时解析）
vp env exec --node "^20.0.0" node -v

# 运行 npm 脚本
vp env exec --node 18.20.0 npm test

# 向命令传递参数
vp env exec --node 20 -- node --inspect app.js

# 错误：非 shim 命令且未提供 --node
vp env exec python --version      # 失败：非 shim 工具需要 --node
```

### 标志

| 标志               | 描述                                                                       |
| ------------------ | -------------------------------------------------------------------------- |
| `--node <version>` | 要使用的 Node.js 版本（对 shim 工具可选，对其他命令必需）                   |
| `--npm <version>`  | 要使用的 npm 版本（尚未实现，使用内置 npm）                                 |

### Shim 模式行为

当未提供 `--node` 且第一个命令是 shim 工具时：

- **核心工具（node、npm、npx）**：版本从 `.node-version`、`package.json#engines.node` 或默认值中解析
- **匹配的包管理器工具（npm/npx、pnpm/pnpx、yarn/yarnpkg、bun/bunx）**：如果 `packageManager` 明确声明了同一工具家族，shim 会下载/运行该包管理器版本，同时将项目解析出的 Node.js 运行时保留在 PATH 上。不匹配的工具不会被翻译。
- **全局包（tsc、eslint 等）**：使用 `vp install -g` 时所使用的 Node.js 版本

两者都使用与 Unix 符号链接完全相同的代码路径（`shim::dispatch()`），确保跨平台行为一致。在 Windows 上，trampoline `.exe` shims 会设置 `VITE_PLUS_SHIM_TOOL` 以进入 shim 分发模式。

**重要**：在分发前会清除 `VITE_PLUS_TOOL_RECURSION` 环境变量，以确保重新进行版本解析，即使是在该变量已经被设置的上下文中调用（例如 pnpm 通过 vite-plus shim 运行时）。

### 显式版本模式行为

当提供 `--node` 时：

1. **版本解析**：将指定版本解析为精确版本
2. **自动安装**：如果该版本未安装，会自动下载
3. **PATH 构建**：使用指定版本的 bin 目录构建 PATH
4. **递归重置**：清除 `VITE_PLUS_TOOL_RECURSION` 以强制重新评估上下文

### 示例

```bash
# Shim 模式：与 Unix 符号链接相同行为
vp env exec node -v               # 使用项目配置中的版本
vp env exec npm install           # 使用相同版本
vp env exec tsc --version         # 全局包

# 在 CI 中测试多个 Node 版本
for version in 18 20 22; do
  vp env exec --node $version npm test
done

# 使用精确版本运行
vp env exec --node 20.18.0 node -e "console.log(process.version)"
# 输出: v20.18.0

# 使用特定 Node 版本进行调试
vp env exec --node 22 -- node --inspect-brk app.js
```

### 在脚本中使用

```bash
#!/bin/bash
# test-matrix.sh

VERSIONS="18.20.0 20.18.0 22.13.0"

for v in $VERSIONS; do
  echo "Testing with Node $v..."
  vp env exec --node "$v" npm test || exit 1
done

echo "All tests passed!"
```

## List Command (Local)

`vp env list`（别名 `ls`）命令显示本地已安装的 Node.js 版本。

### 使用方法

```bash
$ vp env list
* v18.20.0
* v20.18.0 default
* v22.13.0 current
```

- 当前版本所在行以蓝色高亮显示
- `current` 和 `default` 标记以变暗文本显示

### 标志

| 标志     | 描述    |
| -------- | ------- |
| `--json` | 以 JSON 输出 |

### JSON 输出

```bash
$ vp env list --json
[
  {"version": "18.20.0", "current": false, "default": false},
  {"version": "20.18.0", "current": false, "default": true},
  {"version": "22.13.0", "current": true, "default": false}
]
```

### 空状态

```bash
$ vp env list
未安装任何 Node.js 版本。

使用以下命令安装版本：vp env install <version>
```

## List-Remote Command

`vp env list-remote`（别名 `ls-remote`）命令显示注册表中可用的 Node.js 版本。

### 使用方法

```bash
# 列出最近的版本（默认：最近 10 个 major 版本，升序）
$ vp env list-remote
v20.0.0
v20.1.0
...
v20.18.0 (Iron)
v22.0.0
...
v22.13.0 (Jod)
v24.0.0

# 仅列出 LTS 版本
$ vp env list-remote --lts

# 按 major 版本过滤
$ vp env list-remote 20

# 显示所有版本
$ vp env list-remote --all

# 按最新优先排序
$ vp env list-remote --sort desc
```

### 标志

| 标志                 | 描述                         |
| -------------------- | ---------------------------- |
| `--lts`              | 仅显示 LTS 版本              |
| `--all`              | 显示所有版本（不只是最近的） |
| `--json`             | 以 JSON 输出                 |
| `--sort <asc\|desc>` | 排序顺序（默认：asc）        |

### JSON 输出

```bash
$ vp env list-remote --json
{
  "versions": [
    {"version": "24.0.0", "lts": false, "latest": true},
    {"version": "22.13.0", "lts": "Jod", "latest_lts": true},
    {"version": "22.12.0", "lts": "Jod", "latest_lts": false},
    ...
  ]
}
```

### Current Command (JSON)

```bash
$ vp env --current --json
{
  "version": "20.18.0",
  "source": ".node-version",
  "project_root": "/Users/user/projects/my-app",
  "node_path": "/Users/user/.cache/vite-plus/js_runtime/node/20.18.0/bin/node",
  "tool_paths": {
    "node": "/Users/user/.cache/vite-plus/js_runtime/node/20.18.0/bin/node",
    "npm": "/Users/user/.cache/vite-plus/js_runtime/node/20.18.0/bin/npm",
    "npx": "/Users/user/.cache/vite-plus/js_runtime/node/20.18.0/bin/npx"
  },
  "package_manager": {
    "name": "npm",
    "version": "11.14.0",
    "source": "packageManager",
    "source_path": "/Users/user/projects/my-app/package.json",
    "project_root": "/Users/user/projects/my-app",
    "bin_path": "/Users/user/.vite-plus/package_manager/npm/11.14.0/npm/bin/npm"
  }
}
```

## 环境变量

| 变量                           | 描述                                                                                         | 默认值         |
| ------------------------------ | -------------------------------------------------------------------------------------------- | -------------- |
| `VITE_PLUS_HOME`                | bin 和配置的基础目录                                                                         | `~/.vite-plus` |
| `VITE_PLUS_NODE_VERSION`        | Node.js 版本的会话级覆盖（由 `vp env use` 设置）                                             | 未设置         |
| `VITE_PLUS_LOG`                 | 日志级别：debug, info, warn, error                                                            | `warn`         |
| `VITE_PLUS_DEBUG_SHIM`          | 启用额外的 shim 诊断                                                                         | 未设置         |
| `VITE_PLUS_BYPASS`              | 查找系统工具时跳过的 bin 目录列表（PATH 风格）；设置为 `=1` 可完全绕过 shim                 | 未设置         |
| `VITE_PLUS_TOOL_RECURSION`      | **内部**：防止 shim 递归                                                                     | 未设置         |
| `VITE_PLUS_ENV_USE_EVAL_ENABLE` | **内部**：由 shell 包装器设置，表示 `vp env use` 的输出将被 eval                           | 未设置         |

## Unix 特定注意事项

### Shim 结构

```
VITE_PLUS_HOME/
├── bin/
│   ├── vp -> ../current/bin/vp      # 指向实际二进制文件的符号链接
│   ├── node -> ../current/bin/vp    # 指向同一个二进制文件的符号链接
│   ├── npm -> ../current/bin/vp     # 指向同一个二进制文件的符号链接
│   ├── npx -> ../current/bin/vp     # 指向同一个二进制文件的符号链接
│   └── tsc -> ../current/bin/vp     # 全局包的符号链接
└── current/
    └── bin/
        └── vp                        # 实际的 vp CLI 二进制文件
```

### argv[0] 检测如何工作

当用户运行 `node` 时：

1. Shell 在 PATH 中找到 `~/.vite-plus/bin/node`
2. 这是一个指向 `../current/bin/vp` 的符号链接
3. 内核解析符号链接并执行 `vp` 二进制文件
4. `argv[0]` 被设置为调用路径：`node`（或完整路径）
5. `vp` 二进制文件从 `argv[0]` 中提取工具名（得到 "node"）
6. 进入 node 的 shim 逻辑分发

**关键洞察**：符号链接会保留 argv[0]。这与 Volta 成功采用的模式相同。

### 符号链接创建

所有 shims 都使用相对符号链接：

```bash
# 核心工具
ln -sf ../current/bin/vp ~/.vite-plus/bin/node
ln -sf ../current/bin/vp ~/.vite-plus/bin/npm
ln -sf ../current/bin/vp ~/.vite-plus/bin/npx

# 全局包二进制
ln -sf ../current/bin/vp ~/.vite-plus/bin/tsc
```

## Windows 特定注意事项

### Shim 结构

```
VITE_PLUS_HOME\
├── bin\
│   ├── vp.exe       # 转接到 current\bin\vp.exe 的 trampoline
│   ├── node.exe     # Trampoline shim（设置 VITE_PLUS_SHIM_TOOL=node）
│   ├── npm.exe      # Trampoline shim（设置 VITE_PLUS_SHIM_TOOL=npm）
│   ├── npx.exe      # Trampoline shim（设置 VITE_PLUS_SHIM_TOOL=npx）
│   └── tsc.exe      # 全局包的 trampoline shim
└── current\
    └── bin\
        ├── vp.exe       # 实际的 vp CLI 二进制文件
        └── vp-shim.exe  # trampoline 模板（作为 shims 复制）
```

### Trampoline 可执行文件

Windows shims 使用轻量级的 trampoline `.exe` 文件（参见 [RFC: Trampoline EXE for Shims](./trampoline-exe-for-shims.md)）。每个 trampoline 都会从自己的文件名中检测工具名，设置 `VITE_PLUS_SHIM_TOOL`，并启动 `vp.exe`。这避免了 `.cmd` 包装器带来的“Terminate batch job (Y/N)?” 提示，并且可在所有 shell（cmd.exe、PowerShell、Git Bash）中工作，无需单独的包装格式。

#### 为什么不使用符号链接？

在 Unix 上，shims 是指向 vp 二进制文件的符号链接，这保留了用于工具检测的 argv[0]。在 Windows 上，我们改为显式调用 `vp env exec <tool>`，而不是使用符号链接，因为：

1. **需要管理员权限**：Windows 符号链接需要管理员权限或开发者模式
2. **Git Bash 支持不稳定**：符号链接模拟因 Git for Windows 版本而异

因此，使用 trampoline `.exe` 文件。完整设计请参见 [RFC: Trampoline EXE for Shims](./trampoline-exe-for-shims.md)。

**工作方式**：

1. 用户运行 `npm install`
2. Windows 在 PATH 中找到 `~/.vite-plus/bin/npm.exe`
3. Trampoline 设置 `VITE_PLUS_SHIM_TOOL=npm` 并启动 `vp.exe`
4. `vp env exec` 命令处理版本解析和执行

**这种方法的好处**：

- 只需更新 `current\bin\` 中的单个 `vp.exe` 二进制文件
- 所有 shims 都是简单的 `.cmd` 文本文件和 shell 脚本（没有二进制拷贝）
- 与 Volta 的 Windows 方案一致
- 包装脚本清晰易读
- 可在 cmd.exe/PowerShell 和 Git Bash 中工作

### Windows 安装（install.ps1）

Windows 安装程序（`install.ps1`）遵循以下流程：

1. 下载并安装 `vp.exe` 和 `vp-shim.exe` 到 `~/.vite-plus/current/bin/`
2. 创建 `~/.vite-plus/bin/vp.exe` trampoline（`vp-shim.exe` 的副本）
3. 创建 shim trampolines：`node.exe`、`npm.exe`、`npx.exe`（通过 `vp env setup`）
4. 配置 User PATH 以包含 `~/.vite-plus/bin`

## 测试策略

### 单元测试

- 从 argv[0] 提取工具名称
- 基于 mtime 的缓存失效
- PATH 操作
- shim 模式加载

### 集成测试

- 带版本解析的 shim 分发
- 并发安装处理
- doctor 诊断输出

### Snap 测试

在 `packages/global/snap-tests/` 中添加 snap 测试：

```
env-setup/
├── package.json
├── steps.json      # [{"command": "vp env setup"}]
└── snap.txt

env-doctor/
├── package.json
├── .node-version   # "20.18.0"
├── steps.json      # [{"command": "vp env doctor"}]
└── snap.txt
```

### CI 矩阵

- ubuntu-latest：完整集成测试
- macos-latest：完整集成测试
- windows-latest：带 trampoline `.exe` shim 验证的完整集成测试

## 安全考虑

1. **路径验证**：确认执行的二进制文件位于 VITE_PLUS_HOME/cache 路径下
2. **禁止路径穿越**：在构建路径前清理版本字符串
3. **原子安装**：使用临时目录 + 重命名模式（已实现）
4. **日志清理**：不要记录敏感环境变量

## 实现计划

### 第一阶段：核心基础设施（P0）

1. 在 CLI 中添加 `vp env` 命令结构
2. 在 main.rs 中实现 argv[0] 检测
3. 为 `node` 实现 shim 分发逻辑
4. 实现 `vp env setup`（Unix 符号链接、Windows trampoline `.exe` shims）
5. 实现 `vp env doctor` 基础诊断
6. 添加解析缓存（跨升级持久化，并带版本字段）
7. 实现 `vp env default [version]`，用于设置/显示全局默认 Node.js 版本
8. 实现 `vp env on` 和 `vp env off`，用于控制 shim 模式
9. 实现 `vp env pin [version]`，用于按目录固定版本
10. 实现 `vp env unpin`，作为 `pin --unpin` 的别名
11. 实现 `vp env list`（本地）和 `vp env list-remote`（远程）以显示版本
12. 实现递归防护（`VITE_PLUS_TOOL_RECURSION`）
13. 实现 `vp env exec --node <version>` 命令

### 第二阶段：完整工具支持（P1）

1. 为 `npm`、`npx` 添加 shims
2. 实现 `vp env which`
3. 实现 `vp env --current --json`
4. 增强 doctor，加入冲突检测
5. 为受管全局包实现 `vp install -g` / `vp remove -g` / `vp update -g`
6. 实现包元数据存储
7. 实现按包二进制文件的 shims
8. 实现 `vp list -g` / `vp pm list -g` 来列出已安装的全局包
9. 实现 `vp env install <VERSION>` 以安装 Node.js 版本
10. 实现 `vp env uninstall <VERSION>` 以卸载 Node.js 版本
11. 实现按二进制文件的配置文件（`bins/`）用于冲突检测
12. 实现二进制冲突检测（默认直接失败）
13. 实现 `--force` 标志，用于在冲突时自动卸载
14. 实现带孤儿恢复的两阶段卸载

### 第三阶段：完善体验（P2）

1. 实现 `vp env --print`，用于仅对当前会话生效的环境变量
2. 添加 VITE_PLUS_BYPASS 逃生开关
3. 改进错误信息
4. 添加 IDE 特定的设置指南
5. 文档

### 第四阶段：未来增强（P3）

1. 为共享包解析设置 NODE_PATH

## 向后兼容性

这是一个新功能，不会影响现有功能。直接调用时，`vp` 二进制文件仍可正常工作。

## 未来增强

1. **多运行时支持**：将 shim 架构扩展到其他运行时（Bun、Deno）
2. **SQLite 缓存**：用 SQLite 替换 JSON 缓存，以便在大规模场景下获得更好性能
3. **Shell 集成**：提供 shell hooks，用于在提示符中显示版本

## 设计决策摘要

已做出以下决策：

1. **VITE_PLUS_HOME 默认位置**：`~/.vite-plus` - 简单、易记的路径，方便用户查找和配置。

2. **Windows Shim 策略**：使用 trampoline `.exe` 文件设置 `VITE_PLUS_SHIM_TOOL` 并启动 `vp.exe` - 避免 “Terminate batch job?” 提示，可在所有 shell 中工作。参见 [RFC: Trampoline EXE for Shims](./trampoline-exe-for-shims.md)。

3. **Corepack 处理**：不包含 - vite-plus 已集成包管理器功能，因此不需要 corepack shims。

4. **缓存持久化**：跨升级持久化 - 更好的性能，并通过缓存格式版本化保证兼容性。

## 结论

`vp env` 命令提供：

- ✅ 通过 shims 进行系统范围的 Node 版本管理
- ✅ IDE 安全运行（适用于 GUI 启动的应用）
- ✅ 零日常摩擦（自动版本切换）
- ✅ 跨平台支持（Windows、macOS、Linux）
- ✅ 完整诊断（`doctor`）
- ✅ 灵活的 shim 模式控制（`on`/`off`，用于受管优先与系统优先）
- ✅ 轻松的按项目版本固定（`pin`/`unpin`）
- ✅ 使用 `list` 命令进行版本发现
- ✅ 利用现有的版本解析和安装基础设施
