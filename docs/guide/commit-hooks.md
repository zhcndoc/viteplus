# 提交钩子

使用 `vp config` 安装 Git 钩子分发器，并使用 `vp staged` 对已暂存的文件运行检查。

## 概述

Vite+ 支持提交钩子和暂存文件检查，无需额外工具。

使用：

- `vp config` 安装生成的钩子基础设施及相关集成
- `vp staged` 对当前在 Git 中暂存的文件运行检查

如果你使用 [`vp create`](/guide/create) 或 [`vp migrate`](/guide/migrate)，Vite+ 会提示你自动为项目设置此功能。

## 命令

### `vp config`

`vp config` 为当前项目配置 Vite+。它会安装生成的 Git 钩子分发器，也可以处理相关的项目集成，例如代理设置。默认情况下，项目钩子从 `.vite-hooks` 中读取：

```bash
vp config
vp config --hooks-dir .vite-hooks
vp config --no-hooks
vp config --no-agent
```

当你希望 `vp config` 保持 Git 钩子分发器不变时，请使用 `--no-hooks`。当你希望跳过对现有代码代理指令文件的更新时，请使用 `--no-agent`。如果希望 `vp config` 跳过这两个设置步骤，可以同时传入这两个标志。

你还可以将 `VP_GIT_HOOKS=0` 设置为禁用从 `prepare` 或 `postinstall` 等生命周期脚本中安装钩子。

项目自有的钩子脚本（例如 `.vite-hooks/pre-commit`）应提交到代码仓库中。`.vite-hooks/_` 下生成的分发器和垫片会被忽略，并由 `vp config` 重新创建。`vp config` 不会创建或修改项目钩子脚本或暂存文件配置。

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

为兼容生态系统工具，`HUSKY=0` 也会以相同方式生效。在环境中设置 `VP_GIT_HOOKS=0` 后，当生命周期脚本（例如 `prepare`）运行时，`vp config` 也不会在该环境中重新安装钩子。

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

要停止使用 Vite+ 钩子分发器：

1. 从 `package.json` 的 `prepare` 或 `postinstall` 脚本中移除 `vp config`。

2. 取消设置指向 Vite+ 分发器的 Git 钩子路径：

```bash
git config --unset core.hooksPath
```

3. 移除生成的分发器目录（如果修改过目录，请使用你的 `--hooks-dir` 值）：

```bash
rm -rf .vite-hooks/_
```

项目自有的脚本（例如 `.vite-hooks/pre-commit`）以及 `vite.config.ts` 中的 `staged` 配置块可以保留以供日后使用；如果项目不再需要它们，也可以单独移除。
