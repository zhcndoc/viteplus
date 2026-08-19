# 升级 Vite+

使用 `vp upgrade` 来更新全局的 `vp` 二进制文件，并使用 Vite+ 的包管理命令来更新项目中的本地 `vite-plus` 包。

## 概述

升级 Vite+ 包含两个部分：

- 全局的 `vp` 命令（安装在你的机器上）
- 单个项目使用的本地 `vite-plus` 包

你可以独立升级这两者。

## 查看工具链

运行 `vp toolchain` 以显示当前目录的组件：

```bash
vp toolchain
vp toolchain vite
vp toolchain vite rolldown oxc
vp toolchain --json
```

当项目中存在本地 `vite-plus` 包时，该命令会使用它。使用 `--global` 可显示全局 `vp` 命令所对应的版本：

```bash
vp toolchain --global
```

`vp why <package>` 会显示包管理器中的依赖关系图。它无法显示打包进 `@voidzero-dev/vite-plus-core` 的代码，也无法显示编译进 Vite+ 的引擎。使用 `vp toolchain` 查看这些版本及其关系。

## 全局 `vp`

```bash
vp upgrade                        # 升级到最新版本
vp upgrade --check                # 检查更新但不安装
vp upgrade <version>              # 安装特定版本
vp upgrade --registry <registry>  # 使用自定义 npm registry
```

### 回滚

Vite+ 会保留最近的 **3 个**已安装版本，因此你可以快速回退：

```bash
vp upgrade --rollback
```

每次升级后，较旧的版本会自动清理。当前使用的版本和上一个版本始终会被保留，因此回滚目标不会被删除。

## 本地 `vite-plus`

升级现有 Vite+ 项目的推荐方式是使用 `vp migrate`：

```bash
vp migrate
```

对于已经使用 Vite+ 的项目，`migrate` 仅执行工具链版本升级：它会在每个工作区包中，将 `vite-plus`、`vite` -> `@voidzero-dev/vite-plus-core` 别名，以及 `vitest` 的固定版本，重新锁定到当前全局 `vp` 所捆绑的版本。它会跳过首次设置步骤（git hooks、编辑器和 agent 文件、lint 迁移），因此版本升级不会重新改动你已经配置好的内容。传入 `--full` 以同时执行这些设置。

### 更新 Vitest 固定版本

如果你是通过 `vp migrate` 迁移的，项目会将 `vitest` 固定到一个精确版本，以便整个项目与内置的 `vp test` 运行器共享同一个 Vitest 副本。这个固定项位于包管理器的覆盖配置中：

- **npm / Bun：** `package.json` 中 `overrides` 下的 `vitest` 条目
- **Yarn：** `package.json` 中 `resolutions` 下的 `vitest` 条目
- **pnpm：** `pnpm-workspace.yaml` 中 `overrides` 下的 `vitest@*` 条目。如果你的 `package.json` 已经有 `pnpm` 字段，则该条目位于 `package.json` 的 `pnpm.overrides` 下。当 `package.json` 定义了 `pnpm.overrides` 时，pnpm 会忽略 `pnpm-workspace.yaml` 中的 overrides。

在 pnpm 下，受管理的键使用显式的 `@*` 范围（`vite@*`、`vitest@*`）。pnpm 会通过替换每个清单（包括导入器清单）中声明的 spec 来应用 override。裸键会匹配任何 spec，包括 `catalog:`。`@*` 范围会让 override 保留在传递依赖和 peer 声明所使用的 semver 范围上，同时保留 `catalog:` 引用不变。因此，`vp up` 不再将它们重写为具体版本。

Vite+ 的某个版本可能会提升内置的 Vitest 版本。由于这个固定版本也会应用到 `vite-plus` 自身的 `vitest` 依赖，如果固定版本过旧，即使你升级了 `vite-plus`，仍然会安装旧的运行器——这会把 Vitest 的内部实现（mocks、`expect`、运行器状态）分散到被固定的副本和 `vp test` 加载的副本之间。

升级 `vite-plus` 后，请将 `vitest` 重新固定到 Vite+ 现在所内置的版本。你可以通过以下命令查看该版本：

```bash
vp toolchain vitest
```

然后将 `vitest` 覆盖项设置为该精确版本，或者重新运行 `vp migrate` 让它为你更新固定版本。

## 预览构建

一些 Vite+ 拉取请求会在 npm 发布之前发布临时包用于测试。可将其视为夜间构建或前沿构建：当你需要验证某个特定修复、测试新的上游依赖升级，或在下一个版本发布前确认某项更改时，它们很有用。日常工作中，建议优先使用已发布的 `latest` 版本。

每个符合条件的拉取请求中的每次提交都会发布到 [registry bridge](https://registry-bridge.viteplus.dev/)。该桥接服务将这些构建作为普通的 npm 版本提供，格式为 `0.0.0-commit.<sha>`，并将其他所有包代理到 npm 注册表。这意味着你可以使用常规的版本规格而不是可变 URL 来安装预览版，并且相同版本在 CI 中也会解析为一致结果。

`vite-plus` 和 `@voidzero-dev/vite-plus-core` 都以相同的 `0.0.0-commit.<sha>` 版本发布。每个拉取请求都会附带一条评论，列出其最新提交对应的确切版本，并提供可直接复制的安装步骤。

你可以在自动更新上游依赖的拉取请求中找到预览构建。示例可在已合并的拉取请求中搜索 [上游依赖更新](https://github.com/voidzero-dev/vite-plus/pulls?q=is%3Apr+is%3Amerged+upgrade+upstream+dependencies)。

预览构建通过拉取请求编号或提交 SHA 来指定。它们不是稳定的版本范围，除非维护者要求，否则你应避免将其保留在长期存在的分支中。

### 全局 `vp` 预览版

通过向安装器传递 `VP_PR_VERSION` 来安装全局 CLI 的预览构建。传入拉取请求编号或提交 SHA：

```bash
curl -fsSL https://vite.plus | VP_PR_VERSION=<pr-or-sha> bash
```

在 Windows 上：

```powershell
$env:VP_PR_VERSION = "<pr-or-sha>"
irm https://vite.plus/ps1 | iex
Remove-Item Env:\VP_PR_VERSION
```

安装器使用 registry bridge 将 ref 解析为 `0.0.0-commit.<sha>` 构建。它会像安装其他版本一样安装此构建。运行 `vp toolchain --global` 以显示当前使用的构建和工具版本。测试完成后，运行 `vp upgrade --force` 以恢复已发布的版本。你也可以在不传入 `VP_PR_VERSION` 的情况下运行安装器。

### 本地 `vite-plus` 预览版

在安装了上述预览版全局 CLI 之后，在项目中运行 migrate，将其本地 `vite-plus` 切换到同一构建：

```bash
vp migrate
```

Migrate 会将桥接注册表写入 `.npmrc`。对于 Yarn Berry，它会将注册表写入 `.yarnrc.yml`。它会将 `vite-plus` 和 `vite` 别名固定到匹配的 `0.0.0-commit.<sha>` 版本。`vite` 别名指向 `@voidzero-dev/vite-plus-core`。如果项目 CI 必须测试预览版，请提交该注册表行。

安装完成后，运行 `vp toolchain` 以显示所选版本。测试完成后，将 `vite-plus` 设置为 `latest`。从 `.npmrc` 或 `.yarnrc.yml` 中移除桥接 `registry` 行。然后运行 `vp install`。
