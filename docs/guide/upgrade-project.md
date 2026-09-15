# 更新 Vite+

更新 `vite-plus` 及其相关项目依赖项。要升级全局 `vp` 二进制文件，请参阅[升级 Vite+](/guide/upgrade)。

## 使用 Migrate 更新

推荐使用 `vp migrate` 更新项目，它可以保持工具链依赖项一致。

更新项目的 `vite-plus` 依赖项后，运行本地 CLI 以对齐工具链版本：

```bash
./node_modules/.bin/vp migrate
```

如果全局 CLI 比项目中的版本更新，运行 `vp migrate` 会将项目升级到该全局版本：

```bash
vp migrate
```

对于已经使用 Vite+ 的项目，migrate 仅执行工具链版本升级：在每个工作区软件包中，重新固定 `vite-plus`、`vite` -> `@voidzero-dev/vite-plus-core` 别名，以及 `vitest` 固定版本，使其与执行迁移的 CLI 中捆绑的版本一致。它会跳过首次设置步骤（Git 钩子、编辑器和代理文件、lint 迁移），因此版本升级不会重新修改你已经配置好的内容。传入 `--full` 可同时运行这些设置步骤。

## 手动更新

同时更新 `vite-plus` 和指向 `@voidzero-dev/vite-plus-core` 的 `vite` 别名，并确保核心版本与 `vite-plus` 保持一致。在工作区中声明这些内容的所有位置进行更新，包括 overrides 或 catalogs，然后安装依赖项以刷新 lockfile。此外，还要[更新 Vitest 固定版本](#更新-vitest-固定版本)，使其与捆绑的版本一致。

如果没有全局 CLI，请通过包管理器运行本页中的 `vp` 命令，例如 `pnpm exec vp toolchain vitest`。

### 更新 Vitest 固定版本

如果你使用 `vp migrate` 进行迁移，项目会将 `vitest` 固定为精确版本，以便整个项目与捆绑的 `vp test` 运行器共享同一份 Vitest。该固定版本位于包管理器的 override 区块中：

- **npm / Bun：** `package.json` 中 `overrides` 下的 `vitest` 条目
- **Yarn：** `package.json` 中 `resolutions` 下的 `vitest` 条目
- **pnpm：** `pnpm-workspace.yaml` 中 `overrides` 下的 `vitest@*` 条目。如果你的 `package.json` 已经有 `pnpm` 字段，则该条目位于 `package.json` 中的 `pnpm.overrides` 下。当 `package.json` 定义了 `pnpm.overrides` 时，pnpm 会忽略 `pnpm-workspace.yaml` 中的 overrides。

Vite+ 版本可能会升级捆绑的 Vitest。由于该固定版本也适用于 `vite-plus` 自身的 `vitest` 依赖项，过期的固定版本会导致即使升级了 `vite-plus`，仍然安装之前的运行器——使 Vitest 的内部机制（mocks、`expect`、运行器状态）在固定版本和 `vp test` 加载的版本之间发生分裂。

升级 `vite-plus` 后，将 `vitest` 重新固定为 Vite+ 当前捆绑的版本。使用以下命令检查该版本：

```bash
vp toolchain vitest
```

然后将 `vitest` override 设置为该精确版本，并重新安装依赖项。

::: details 为什么 pnpm overrides 使用 `@*`
在 pnpm 中，受管理的键使用显式的 `@*` 范围（`vite@*`、`vitest@*`）。pnpm 会通过替换每个清单（包括导入器清单）中声明的 spec 来应用 override。裸键会匹配任何 spec，包括 `catalog:`。`@*` 范围会使 override 仅作用于传递依赖和 peer 声明使用的 semver 范围，同时保留 `catalog:` 引用不变。因此，`vp up` 不再将它们重写为具体版本。
:::

## 预览版本

在[安装全局 CLI 的预览版本](/guide/upgrade#global-vp-preview)后，在项目中运行 migrate，将本地 `vite-plus` 移动到相同的构建版本：

```bash
vp migrate
```

Migrate 会将桥接注册表写入 `.npmrc`。对于 Yarn Berry，它会将注册表写入 `.yarnrc.yml`。它会将 `vite-plus` 和 `vite` 别名固定为匹配的 `0.0.0-commit.<sha>` 版本。`vite` 别名指向 `@voidzero-dev/vite-plus-core`。如果项目 CI 必须测试预览版本，请提交注册表行。

安装完成后，运行 `vp toolchain` 以显示选定的版本。测试完成后，将 `vite-plus` 设置为 `latest`。从 `.npmrc` 或 `.yarnrc.yml` 中移除桥接 `registry` 行。然后运行 `vp install`。
