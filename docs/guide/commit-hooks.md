# 提交钩子

使用 `vp hooks` 管理 Git 钩子分发器，使用 `vp config` 进行项目设置（钩子 + 代理集成），并使用 `vp staged` 对已暂存的文件运行检查。

## 概述

Vite+ 支持提交钩子和暂存文件检查，无需额外工具。

使用：

- `vp hooks enable` / `disable` / `status` 管理生成的钩子分发器
- `vp config` 安装分发器（未禁用时）并更新代理集成
- `vp staged` 检查当前在 Git 中暂存的文件

如果你使用 [`vp create`](/guide/create) 或 [`vp migrate`](/guide/migrate)，Vite+ 会提示你自动为项目设置此功能。

### 快速开始

```bash
# 安装或刷新分发器
vp hooks enable

# 检查此克隆中的活动配置
vp hooks status

# 在此克隆中关闭钩子（执行 npm install / prepare 后仍然有效）
vp hooks disable

# 重新启用钩子
vp hooks enable
```

## 命令

### `vp hooks`

管理当前仓库的 Vite+ Git 钩子分发器：

```bash
vp hooks enable
vp hooks enable --hooks-dir .custom-hooks
vp hooks disable
vp hooks status
```

| 命令      | 行为                                                                                                                                                                                                            |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enable`  | 在 `<hooks-dir>/_` 下安装或刷新生成的分发器，并设置 `core.hooksPath`。清除之前的禁用偏好设置。                                                                                  |
| `disable` | 拆除分发器（当 `core.hooksPath` 指向 Vite+ 时取消设置，移除 `<hooks-dir>/_`），并将禁用决定持久化到本地 git 配置中，以便 `vp config` / 生命周期脚本不再重新安装它。 |
| `status`  | 显示偏好设置、`core.hooksPath`、分发器是否存在以及项目自有的钩子脚本。                                                                                                                            |

默认情况下，项目钩子位于 `.vite-hooks` 中。传递 `--hooks-dir` 可使用其他子目录。首次成功启用后，该目录会记忆在本地 git 配置中，供此克隆中的后续 `enable` / `disable` / `status` / `vp config` 调用使用。

`status` 将偏好设置报告为：

- `not set` — 此克隆中未设置禁用偏好，也未曾启用
- `enabled` — 已运行启用操作（或当前由分发器负责）
- `disabled (local)` — 执行 `vp hooks disable` 后

检查 `Dispatcher` 和 `core.hooksPath` 行，以确认钩子是否实际处于活动状态。

`disable` / `enable` **不会**删除项目自有的钩子脚本（例如 `.vite-hooks/pre-commit`）、`vite.config.ts` 中的 `staged` 配置块，或调用 `vp config` 的生命周期脚本。

### `vp config`

`vp config` 为当前项目配置 Vite+。它会安装生成的 Git 钩子分发器（除非已使用 `vp hooks disable` 禁用钩子），还可以处理相关的项目集成，例如代理设置。钩子目录默认为 `.vite-hooks`，或使用此克隆中最近一次由 `vp hooks` / `vp config` 使用的目录：

```bash
vp config
vp config --hooks-dir .vite-hooks
vp config --no-hooks
vp config --no-agent
```

当你希望 `vp config` 保持 Git 钩子分发器不变时，请使用 `--no-hooks`。当你希望跳过对现有编码代理指令文件的更新时，请使用 `--no-agent`。如果希望 `vp config` 跳过这两个设置步骤，可以同时传递这两个标志。执行 `vp hooks disable` 后，`vp config` 会跳过重新安装分发器，并引导你改用 `vp hooks enable`，而不是再次提示。

你还可以将 `VP_GIT_HOOKS=0` 设置为禁用从 `prepare` 或 `postinstall` 等生命周期脚本中安装钩子。

应将 `.vite-hooks/pre-commit` 等项目自有的钩子脚本提交到仓库中。`.vite-hooks/_` 下生成的分发器和垫片会被忽略，并由 `vp config` 或 `vp hooks enable` 重新创建。这两个命令都不会创建或修改项目钩子脚本或暂存文件配置。

### `vp staged`

`vp staged` 使用 `vite.config.ts` 中的 `staged` 配置运行暂存文件检查。若要在每次提交前运行它，请将其添加到项目自有的 pre-commit 钩子中：

```bash
vp staged
vp staged --verbose
vp staged --fail-on-changes
```

```sh [.vite-hooks/pre-commit]
vp staged
```

## 配置

在 `vite.config.ts` 的 `staged` 块中定义暂存文件检查：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*.{js,ts,tsx,vue,svelte}': 'vp check --fix',
  },
});
```

这是 Vite+ 的默认方式，在大多数项目中应替代单独的 `lint-staged` 配置。当你在执行 `vp create` 时选择启用钩子，Vite+ 会同时生成此配置和相应的提交前钩子。在执行 `vp migrate` 时，会保留现有的钩子策略；只有在未找到现有钩子策略时，才会引入默认配置。由于 `vp staged` 会读取 `vite.config.ts`，你的暂存文件检查会与 lint、格式化、测试、构建和任务运行器配置保持在同一位置。

## 在特定环境中禁用钩子

已安装的钩子会在每次运行时检查环境，因此你可以按机器或进程禁用它们，而无需卸载任何内容。当提交发生在开发环境之外时（例如通过扁平文件 CMS 或其他进程），这会非常有用。

### 环境变量

在运行 `git commit` 的进程环境中设置 `VP_GIT_HOOKS=0`，每个 Vite+ 钩子都会立即退出，而不会运行：

```bash
VP_GIT_HOOKS=0 git commit -m "content update"
```

出于生态系统工具兼容性的考虑，也会以相同方式遵循 `HUSKY=0`。在环境中设置 `VP_GIT_HOOKS=0` 后，当生命周期脚本（例如 `prepare`）运行时，`vp config` / `vp hooks enable` 也不会在该环境中重新安装钩子。

### 初始化脚本

在检查环境变量之前，每个钩子都会加载一个初始化脚本（如果存在）：

1. `$XDG_CONFIG_HOME/vite-plus/hooks-init.sh`（默认为 `~/.config/vite-plus/hooks-init.sh`）
2. `$XDG_CONFIG_HOME/husky/init.sh` 作为备用选项

要为整台机器禁用钩子，请创建初始化脚本，并在其中导出该变量：

```sh [~/.config/vite-plus/hooks-init.sh]
export VP_GIT_HOOKS=0
```

由于钩子本身会读取此文件，即使执行提交的进程没有继承你的 shell 环境，它也能正常工作，例如由守护进程或 Web 服务器执行提交时。

## 移除提交钩子

要停止在此克隆中使用 Vite+ 钩子分发器（并防止 `prepare` / `vp config` 重新安装它）：

```bash
vp hooks disable
# 或者，如果你使用了自定义目录：
vp hooks disable --hooks-dir .custom-hooks
```

此操作会：

1. 当 `core.hooksPath` 指向 Vite+ 分发器时，取消设置该配置
2. 删除生成的 `<hooks-dir>/_` 目录
3. 记录一个**本地**禁用偏好，使生命周期脚本跳过重新安装，直到你再次运行
   `vp hooks enable`

重新启用：

```bash
vp hooks enable
```

如果你不再希望项目使用钩子（包括与团队成员共享的情况），还需要从 `package.json` 中的
`prepare` 或 `postinstall` 脚本里移除 `vp config`。

### 手动等效操作

如果你更愿意手动操作：

```bash
git config --unset core.hooksPath
rm -rf .vite-hooks/_
# 可选：防止 prepare/vp config 在此克隆中重新安装
git config --local vp.hooks.disabled true
# 可选：记住的钩子目录（由 enable/disable 设置）
# git config --local vp.hooks.dir .vite-hooks
```

项目自有的脚本（例如 `.vite-hooks/pre-commit`）以及 `vite.config.ts` 中的
`staged` 配置块可以保留以便日后使用；如果项目不再需要它们，也可以单独移除。
`vp hooks disable` **不会**删除这些项目自有的文件。
