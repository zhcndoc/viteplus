# 升级 Vite+

使用 `vp upgrade` 来更新全局的 `vp` 二进制文件，并使用 Vite+ 的包管理命令来更新项目中的本地 `vite-plus` 包。

## 概述

升级 Vite+ 包含两个部分：

- 全局的 `vp` 命令（安装在你的机器上）
- 单个项目使用的本地 `vite-plus` 包

你可以独立升级这两者。

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

使用 Vite+ 的包管理命令更新项目依赖：

```bash
vp update vite-plus
```

如果你想将依赖显式地移动到最新版本，也可以使用 `vp add vite-plus@latest`。

### 更新别名包

Vite+ 在安装期间会为其核心包设置一个 npm 别名：

- `vite` 别名为 `npm:@voidzero-dev/vite-plus-core@latest`

`vp update vite-plus` 不会在锁文件中重新解析此别名。要完全升级，请单独更新它：

```bash
vp update @voidzero-dev/vite-plus-core
```

或者一次性更新所有包：

```bash
vp update vite-plus @voidzero-dev/vite-plus-core
```

你可以使用 `vp outdated` 验证没有任何 Vite+ 包仍然过时。

### 更新 Vitest 固定版本

如果你是通过 `vp migrate` 迁移的，项目会将 `vitest` 固定到一个精确版本，以便整个项目与内置的 `vp test` 运行器共享同一个 Vitest 副本。这个固定项位于包管理器的覆盖配置中：

- **npm / Bun：** `package.json` 中 `overrides` 下的 `vitest` 条目
- **Yarn：** `package.json` 中 `resolutions` 下的 `vitest` 条目
- **pnpm：** `pnpm-workspace.yaml` 中 `overrides` 下的 `vitest` 条目——除非你的 `package.json` 已经有 `pnpm` 字段；在这种情况下，它会位于 `package.json` 中的 `pnpm.overrides` 下（如果 `package.json` 定义了 `pnpm.overrides`，pnpm 会忽略 `pnpm-workspace.yaml` 中的 overrides）

Vite+ 的某个版本可能会提升内置的 Vitest 版本。由于这个固定版本也会应用到 `vite-plus` 自身的 `vitest` 依赖，如果固定版本过旧，即使你升级了 `vite-plus`，仍然会安装旧的运行器——这会把 Vitest 的内部实现（mocks、`expect`、运行器状态）分散到被固定的副本和 `vp test` 加载的副本之间。

升级 `vite-plus` 后，请将 `vitest` 重新固定到 Vite+ 现在所内置的版本。你可以通过以下命令查看该版本：

```bash
vp --version
```

然后将 `vitest` 覆盖项设置为该精确版本，或者重新运行 `vp migrate` 让它为你更新固定版本。
