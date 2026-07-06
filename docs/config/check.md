# 检查配置

`vp check` 会将格式化、lint 和类型检查一起运行。`vite.config.ts` 中的 `check` 配置块为这个组合命令设置默认值，对应于 `--no-fmt` 和 `--no-lint` 这些 CLI 标志。

这在项目希望保留大部分工具链，但默认跳过某一步时很有用。例如，一个进行 lint 但不进行格式化的团队，可以禁用 `check.fmt`，这样普通的 `vp check`（代理和贡献者最常运行的命令）就只会执行 lint，而无需任何人记住 `--no-fmt`。

## 示例

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  check: {
    // 在 `vp check` 中跳过格式化步骤。默认为 true。
    fmt: false,
    // 在 `vp check` 中跳过 lint 规则。当 `lint.options.typeAware` 和
    // `lint.options.typeCheck` 都启用时，类型检查仍会运行。
    // 默认为 true。
    lint: true,
  },
});
```

当这里禁用某个步骤时，`vp check` 会打印一行简短的 `note:`，以便清楚地说明该步骤为何未运行。使用上面的 `check.fmt: false` 配置时：

```bash
$ vp check
note: 已跳过格式化（vite.config.ts 中的 check.fmt: false）
pass: 在 1 个文件中未发现任何警告或 lint 错误（12ms，8 threads）
```

## 作用范围与优先级

- 这些选项只影响组合命令 `vp check`。单独的 [`vp fmt`](/config/fmt) 和 [`vp lint`](/config/lint) 不受影响，因此当你需要时，仍然可以直接运行一个被禁用的工具一次。请注意，任何 `vp check` 调用都会遵守这些默认值，包括从 pre-commit 钩子中运行的那一次：如果你的 [`staged`](/config/staged) 任务调用了 `vp check`，那么那一步在这里也会被跳过。
- 如果配置禁用了某一步，**或者**传入了匹配的 CLI 标志，那么该步骤就会被跳过。没有任何标志可以重新启用在配置中被禁用的步骤；请改为直接运行 `vp fmt` 或 `vp lint`。
