# 故障排除

当 Vite+ 的行为不符合预期时，请使用本页面。

::: info
Vite+ 处于 beta 阶段：稳定，但尚未完整。我们正在通往 1.0 的路上添加功能，并优先考虑社区反馈，所以如果某些内容没有按预期工作，请[联系我们](#asking-for-help)。
:::

## 支持的工具版本

Vite+ 期望使用现代的上游工具版本。

- Vite 8 或更高版本
- Vitest 4.1 或更高版本

如果你正在迁移一个现有项目，并且它仍然依赖旧版本的 Vite 或 Vitest，请先升级这些依赖，然后再采用 Vite+。

## `vp check` 未运行类型感知 lint 规则或类型检查

- 确认 `vite.config.ts` 中已启用 `lint.options.typeAware` 和 `lint.options.typeCheck`
- 检查你的 `tsconfig.json` 是否仍在使用 `compilerOptions.baseUrl`

由 `tsgolint` 驱动的 Oxlint 类型检查器路径不支持 `baseUrl`。  
`vp migrate` 和 `vp lint --init` 会尝试运行 `vp dlx @andrewbranch/ts5to6 --fixBaseUrl .`  
以在启用类型感知 lint 之前修复该问题。如果该修复失败或被拒绝，Vite+  
会跳过 `typeAware` 和 `typeCheck`。

## VS Code 扩展未读取 `vite.config.ts`

如果 VS Code 同时打开了多个文件夹，共享的 Oxc 语言服务器可能会选择与预期不同的工作区。这可能导致看起来像是缺少 `vite.config.ts` 支持。

- 确认扩展正在使用正确的工作区。

## `vp dev` 或 `vp build` 不会运行我的脚本

与包管理器不同，内置命令无法被覆盖。如果你想运行 `package.json` 脚本，请改用 `vp run <script>`。

例如：

- `vp dev` 始终启动内置的 Vite 开发服务器
- `vp build` 始终运行内置的 Vite 构建命令
- `vp test` 始终运行内置的 Vitest 命令
- `vp run dev`、`vp run build` 和 `vp run test` 会运行相应的 `package.json` 脚本

关于何时优先选择这两种方式，请参阅[内置命令与脚本](/guide/run#built-in-commands-vs-scripts)。

::: info
你还可以在 `vite.config.ts` 中定义自定义任务，并完全迁移出 `package.json` 脚本。
:::

## 分阶段检查与提交钩子

如果 `vp staged` 失败或预提交钩子未运行：

- 确保 `vite.config.ts` 包含 `staged` 配置块
- 确保项目自有的预提交钩子运行 `vp staged`（例如 `.vite-hooks/pre-commit`）
- 运行 `vp hooks status` 查看偏好设置、`core.hooksPath` 以及调度器是否已安装
- 运行 `vp hooks enable`（或 `vp config`）以安装钩子调度器
- 如果状态显示 `Preference: disabled (local)`，请使用 `vp hooks enable` 重新启用
- 检查是否通过 `VP_GIT_HOOKS=0` 有意跳过了钩子

若要在此克隆版本中停止钩子而不删除项目策略文件，请运行 `vp hooks disable`。
完整的工作流程请参阅[提交钩子指南](/guide/commit-hooks)。

一个最小的分阶段配置示例如下：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
});
```

## 由于重型插件导致的配置加载缓慢

当 `vite.config.ts` 在顶层导入插件时，这些插件会在每次执行命令时被求值，包括 `vp lint`、`vp fmt`、编辑器集成以及长生命周期的后台进程。这会使配置加载变慢，并可能触发插件初始化的副作用，例如读取文件、启动监听器或连接到服务。

使用 `lazyPlugins` 可在 vite-plus 仅为读取元数据而加载你的配置时跳过插件工厂（`lint`、`fmt`、`check`、`staged`、`pack`、`create`、`run`/`cache` 任务查找，以及编辑器工具）。当 Vite 真正运行时，插件仍会加载：`dev`、`build`、`test`、`preview`，以及你的脚本所启动的任何构建（例如 `vp run` 任务、`vp exec`）：

```ts [vite.config.ts]
import { defineConfig, lazyPlugins } from 'vite-plus';
import myPlugin from 'vite-plugin-foo';

export default defineConfig({
  plugins: lazyPlugins(() => [myPlugin()]),
});
```

对于应当延迟导入的重型插件，将其与动态 `import()` 结合使用：

```ts [vite.config.ts]
import { defineConfig, lazyPlugins } from 'vite-plus';

export default defineConfig({
  plugins: lazyPlugins(async () => {
    const { default: heavyPlugin } = await import('vite-plugin-heavy');
    return [heavyPlugin()];
  }),
});
```

## 寻求帮助

如果你遇到困难，请联系我们：

- [Discord](https://discord.gg/cAnsqHh5PX) 用于实时讨论和故障排除帮助
- [GitHub](https://github.com/voidzero-dev/vite-plus) 用于问题、讨论和错误报告

在报告问题时，请包含：

- `vp env current` 和 `vp --version` 的完整输出
- 项目使用的包管理器
- 复现问题的具体步骤以及你的 `vite.config.ts`
- 最小的可重现仓库或可运行沙箱。
