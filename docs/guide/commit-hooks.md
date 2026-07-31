# 提交钩子

使用 `vp config` 安装提交钩子，使用 `vp staged` 对暂存文件运行检查。

## 概述

Vite+ 支持提交钩子和暂存文件检查，无需额外工具。

使用：

- `vp config` 设置项目钩子和相关集成
- `vp staged` 对当前 Git 暂存的文件运行检查

如果你使用 [`vp create`](/guide/create) 或 [`vp migrate`](/guide/migrate)，Vite+ 会提示你自动为项目设置此功能。

## 命令

### `vp config`

`vp config` 为当前项目配置 Vite+。它会安装 Git 钩子、设置钩子目录，并可以处理相关的项目集成，例如代理设置。默认情况下，钩子会写入 `.vite-hooks`：

```bash
vp config
vp config --hooks-dir .vite-hooks
vp config --no-hooks
vp config --no-agent
```

当你希望 `vp config` 保持现有的 Git 钩子设置不变时，请使用 `--no-hooks`。当你希望它跳过对现有编码代理说明文件的更新时，请使用 `--no-agent`。当你希望 `vp config` 同时跳过这两个设置步骤时，可以同时传入这两个标志。

你也可以设置 `VITE_GIT_HOOKS=0`，以便在 `prepare` 或 `postinstall` 等生命周期脚本中禁用钩子安装。

### `vp staged`

`vp staged` 使用 `vite.config.ts` 中的 `staged` 配置运行暂存文件检查。如果你已设置 Vite+ 来处理提交钩子，它会在你提交本地更改时自动运行。

```bash
vp staged
vp staged --verbose
vp staged --fail-on-changes
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

这是 Vite+ 的默认方式，在大多数项目中应替代单独的 `lint-staged` 配置。由于 `vp staged` 会读取 `vite.config.ts`，你的暂存文件检查就能与 lint、格式化、测试、构建和任务运行器配置统一放在同一处。

## 在特定环境中禁用钩子

已安装的钩子会在每次运行时检查环境，因此你可以按机器或进程禁用它们，而无需卸载任何内容。当提交发生在开发环境之外时（例如通过扁平文件 CMS 或其他进程），这会非常有用。

### 环境变量

在运行 `git commit` 的进程环境中设置 `VITE_GIT_HOOKS=0`，每个 Vite+ 钩子都会立即退出而不运行：

```bash
VITE_GIT_HOOKS=0 git commit -m "content update"
```

出于生态系统工具兼容性的考虑，`HUSKY=0` 也会以相同方式生效。在某个环境中设置 `VITE_GIT_HOOKS=0` 后，当生命周期脚本（例如 `prepare`）运行时，`vp config` 也不会在该环境中重新安装钩子。

### 初始化脚本

在检查环境变量之前，每个钩子都会加载一个初始化脚本（如果存在）：

1. `$XDG_CONFIG_HOME/vite-plus/hooks-init.sh`（默认为 `~/.config/vite-plus/hooks-init.sh`）
2. `$XDG_CONFIG_HOME/husky/init.sh` 作为备用选项

要为整台机器禁用钩子，请创建初始化脚本，并在其中导出该变量：

```sh [~/.config/vite-plus/hooks-init.sh]
export VITE_GIT_HOOKS=0
```

由于钩子本身会读取此文件，即使执行提交的进程没有继承你的 shell 环境，它也能正常工作，例如由守护进程或 Web 服务器执行提交时。

## 移除提交钩子

要完全移除 Vite+ 提交钩子，请撤销 `vp config` 设置的每一项内容：

1. 取消指向 Vite+ 分发器的 Git 钩子路径：

```bash
git config --unset core.hooksPath
```

2. 删除钩子目录（如果修改过目录，请使用你的 `--hooks-dir` 值）：

```bash
rm -rf .vite-hooks
```

3. 从 `package.json` 的 `prepare` 脚本中移除 `vp config`。否则下一次安装时会重新运行 `vp config` 并重新安装钩子。

4. 如果 `vite.config.ts` 中存在 `staged` 块，请将其移除
