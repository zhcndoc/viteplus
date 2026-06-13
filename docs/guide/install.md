# 安装依赖

`vp install` 使用当前工作区的包管理器来安装依赖。

## 概述

使用 Vite+ 来管理 pnpm、npm、Yarn 和 Bun 之间的依赖关系。无需在 `pnpm install`、`npm install`、`yarn install` 和 `bun install` 之间切换，你可以继续使用 `vp install`、`vp add`、`vp remove` 以及其余的 Vite+ 包管理命令。

Vite+ 按照以下顺序检测包管理器：

1. `packageManager` 位于 `package.json` 中
2. `devEngines.packageManager` 位于 `package.json` 中
3. `pnpm-workspace.yaml`
4. `pnpm-lock.yaml`
5. `yarn.lock` 或 `.yarnrc.yml`
6. `package-lock.json`
7. `bun.lock` 或 `bun.lockb`
8. `.pnpmfile.cjs` 或 `pnpmfile.cjs`
9. `bunfig.toml`
10. `yarn.config.cjs`

如果这些文件都不存在，`vp` 默认回退到 `pnpm`。Vite+ 会自动下载匹配的包管理器并将其用于你运行的命令。当检测结果来自锁文件或配置文件时，解析出的版本会写入 `devEngines.packageManager`，以便后续运行保持确定性；已经声明了 `packageManager` 或 `devEngines.packageManager` 的项目会保持原样。

[`devEngines.packageManager`](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devengines) 字段接受单个对象或对象数组，其 `version` 可以是 semver 范围：

```json
{
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "^11.0.0",
      "onFail": "download"
    }
  }
}
```

当可能时，范围会解析为已下载且满足条件的版本，否则会解析为 npm 注册表中最新的满足条件版本。该范围本身仍是唯一事实来源；Vite+ 绝不会将其冻结为精确的 `packageManager` 固定版本。当同时声明了 `packageManager` 和 `devEngines.packageManager` 时，`packageManager` 字段决定选择结果，而当它不满足 devEngines 约束时，Vite+ 会发出警告（`vp env doctor` 会显示详细信息）。

Vite+ 当前会下载所声明的包管理器（即 `onFail: "download"` 的行为）；其他 `onFail` 值虽被接受，但尚未做区分处理。

显式的 `packageManager` 字段（或 `devEngines.packageManager` 声明）也会影响匹配的包管理器 shim。如果项目有 `packageManager: "npm@10.9.4"`，`npm` 和 `npx` 会使用 npm 10.9.4。其他生成的别名对也遵循同样的规则：`pnpm`/`pnpx`、`yarn`/`yarnpkg`、以及 `bun`/`bunx`。不匹配的工具不会被转换；`pnpm` 项目中的 `npm` 仍然会按 npm 解析。

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

#### 重新构建

当需要重新编译原生模块时，使用 `vp rebuild`；例如在切换 Node.js 版本后，或当 C/C++ 加载失败的扩展无法加载时。

- `vp rebuild` 重新构建所有原生模块
- `vp rebuild <package...>` 仅重新构建列出的包
- `vp rebuild -- <args>` 将额外参数传递给底层包管理器

```bash
vp rebuild
vp rebuild better-sqlite3 sharp
vp rebuild -- --update-binary
```

`vp rebuild` 是 `vp pm rebuild` 的简写。

对于 pnpm v10+，裸用 `vp rebuild` 只会重新构建其构建脚本列在 `onlyBuiltDependencies` 中（或通过 `pnpm approve-builds` 批准）的包；如果要强制重新构建并绕过批准门槛，请显式指定包名。

#### 高级

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

#### 分阶段发布

`vp pm stage` 提供了 [npm 的分阶段发布](https://docs.npmjs.com/staged-publishing) 工作流：构建产物会被上传到暂存区（不需要 2FA，适合 CI），然后维护者可以从受信任的设备上批准或拒绝它（2FA）。它会适配检测到的包管理器。

```bash
vp pm stage publish              # 将包上传到暂存区（不需要 2FA）
vp pm stage list                 # 列出暂存的版本
vp pm stage view <stage-id>      # 查看暂存版本
vp pm stage download <stage-id>  # 下载暂存的 tarball
vp pm stage approve <stage-id>   # 推送到正式注册表（2FA）
vp pm stage reject <stage-id>    # 丢弃暂存版本（2FA）
```

- pnpm（`pnpm stage`，要求 pnpm ≥ 11.3）和 npm（`npm stage`，要求 npm ≥ 11.15 且 Node ≥ 22.14）会直接透传。
- yarn（Berry）使用其 npm 插件（`yarn npm publish --staged`、`yarn npm stage …`）；`view`/`download` 会回退到 npm。
- yarn Classic 和 bun 不支持分阶段发布，因此会回退到 `npm stage`。
