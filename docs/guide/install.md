# 安装依赖

`vp install` 使用当前工作区的包管理器来安装依赖。

## 概述

使用 Vite+ 来管理 pnpm、npm、Yarn 和 Bun 之间的依赖关系。无需在 `pnpm install`、`npm install`、`yarn install` 和 `bun install` 之间切换，你可以继续使用 `vp install`、`vp add`、`vp remove` 以及其余的 Vite+ 包管理命令。

Vite+ 按照以下顺序检测包管理器：

1. `package.json` 中的 `packageManager`
2. `pnpm-workspace.yaml`
3. `pnpm-lock.yaml`
4. `yarn.lock` 或 `.yarnrc.yml`
5. `package-lock.json`
6. `bun.lock` 或 `bun.lockb`
7. `.pnpmfile.cjs` 或 `pnpmfile.cjs`
8. `bunfig.toml`
9. `yarn.config.cjs`

如果以上文件都不存在，Vite+ 默认回退到 `pnpm`。Vite+ 会自动下载匹配的包管理器并用于你运行的命令。

## 用法

```bash
vp install
```

常见安装流程：

```bash
vp install
vp install --frozen-lockfile
vp install --lockfile-only
vp install --filter web
vp install -w
```

`vp install` 会映射到检测到的包管理器的正确底层安装行为，包括适用于 pnpm、npm、Yarn 和 Bun 的正确锁文件标志。

## 全局包

使用 `-g` 标志来安装、更新或移除全局安装的包：

- `vp install -g <pkg>` 全局安装一个包
- `vp uninstall -g <pkg>` 移除一个全局包
- `vp update -g [pkg]` 更新一个全局包或所有全局包
- `vp list -g [pkg]` 列出全局包

## 管理依赖

Vite+ 提供了所有熟悉的包管理命令：

- `vp install` 会为项目安装当前的依赖图
- `vp add <pkg>` 将包添加到 `dependencies`，使用 `-D` 添加到 `devDependencies`
- `vp remove <pkg>` 移除包
- `vp update` 更新依赖
- `vp dedupe` 在包管理器支持的情况下减少重复依赖条目
- `vp outdated` 显示可用更新
- `vp list` 显示已安装的包
- `vp why <pkg>` 解释为什么会安装该包
- `vp info <pkg>` 显示包的注册表元数据
- `vp rebuild` 重新构建原生模块（例如切换 Node.js 版本后）
- `vp link` 和 `vp unlink` 管理本地包链接
- `vp dlx <pkg>` 运行包的二进制文件而不将其添加到项目中
- `vp pm <command>` 转发原始的、与包管理器相关的命令；当你需要超出已标准化的 `vp` 命令集的行为时使用

### 命令指南

#### 安装

当你想安装与当前 `package.json` 和锁文件完全一致的内容时，使用 `vp install`。

- `vp install` 是标准安装命令
- `vp install --frozen-lockfile` 如果锁文件需要更改则失败
- `vp install --no-frozen-lockfile` 允许显式更新锁文件
- `vp install --lockfile-only` 不执行完整安装，仅更新锁文件
- `vp install --prefer-offline` 和 `vp install --offline` 优先或强制使用缓存包
- `vp install --ignore-scripts` 跳过生命周期脚本
- `vp install --filter <pattern>` 在 monorepo 中限制安装范围
- `vp install -w` 在工作区根目录安装

#### 全局安装

当你想让包管理器管理的工具在单个项目之外可用时，使用这些命令：

- `vp install -g typescript`
- `vp uninstall -g typescript`
- `vp update -g`
- `vp list -g`

#### 添加和移除

使用 `vp add` 和 `vp remove` 进行日常的依赖编辑，而不是手动编辑 `package.json`。

- `vp add react`
- `vp add -D typescript vitest`
- `vp add -O fsevents`
- `vp add --save-peer react`
- `vp remove react`
- `vp remove --filter web react`

#### 更新、压缩和查看过期

使用这些命令来维护依赖图：

- `vp update` 刷新包到更新版本
- `vp outdated` 显示哪些包有可用的新版本
- `vp dedupe` 请求包管理器在可能的情况下折叠重复项

#### 检查

当你需要了解依赖的当前状态时，使用这些命令：

- `vp list` 显示已安装的包
- `vp why react` 解释为什么安装了 `react`
- `vp info react` 显示注册表元数据，如版本和 dist-tags

#### Rebuild

当需要重新编译原生模块时，使用 `vp rebuild`；例如在切换 Node.js 版本后，或当 C/C++ 加载失败的扩展无法加载时。

- `vp rebuild` 重新构建所有原生模块
- `vp rebuild -- <args>` 将额外参数传递给底层包管理器

```bash
vp rebuild
vp rebuild -- --update-binary
```

`vp rebuild` 是 `vp pm rebuild` 的简写。

#### Advanced

当你需要更低级别的包管理器行为时，使用这些命令：

- `vp link` 和 `vp unlink` 管理本地开发链接
- `vp dlx create-vite` 运行包二进制文件而不将其保存为依赖
- `vp pm <command>` 直接转发到解析的包管理器

示例：

```bash
vp pm config get registry
vp pm cache clean --force
vp pm exec tsc --version
```
