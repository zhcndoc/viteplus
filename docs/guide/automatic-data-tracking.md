# 自动数据跟踪

自动数据跟踪是 Vite Task 了解任务需要哪些输入以缓存输出的一种方式，无需显式配置。

当你运行一个启用缓存的任务时，Vite Task 会观察任务的执行过程，并记录读取和写入了哪些文件，以及任务报告的任何元数据。在下一次运行时，Vite Task 会使用记录的指纹来决定是回放缓存还是重新运行任务。

当你需要理解为什么某个任务命中或未命中缓存时，或者当你需要决定是否添加 `input`、`output`、`env` 或 `untrackedEnv` 配置时，请使用本页。

## 跟踪层级

自动数据跟踪分为两个层级：

| 层级                 | 适用范围                               | 记录内容                                                                                                                                                         |
| -------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 文件系统跟踪         | 所有启用缓存的任务                      | <ul><li>命令读取的文件</li><li>缺失文件探测</li><li>目录列表</li><li>写入的输出文件</li></ul>                                 |
| 协作跟踪             | 报告缓存的工具（当前为 `vp build`）      | <ul><li>工具报告的环境变量</li><li>由工具管理、且不应作为输入或输出的路径，例如 `node_modules/.vite-temp`</li></ul> |

Vite Task 会对任何命令先启用文件系统跟踪。报告缓存的工具可以在运行时补充只有工具本身知道的信息。

## 文件系统追踪

文件系统追踪适用于每个启用缓存的任务。如果你省略 [`input`](/config/run#input)，Vite Task 会在命令运行时跟踪它读取的文件：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  run: {
    tasks: {
      build: {
        command: 'tsc',
      },
    },
  },
});
```

对于此任务，Vite Task 会记录源文件、配置文件、命令检查过的缺失文件，以及命令扫描过的目录。后续运行时，当这些被追踪的输入之一发生变化，就会重新执行该任务。

文件系统追踪也会跟踪输出。如果你省略 [`output`](/config/run#output)，Vite Task 会在命令成功运行后归档其写入的文件，并在命中缓存时恢复这些文件。

### 限制

Vite Task 无法跟踪对环境变量的读取，并且它也并不总能判断哪些被追踪的路径是稳定输入、生成的输出，或者不应成为输入或输出的工具管理缓存路径。

当文件系统追踪包含了不应影响缓存的文件、遗漏了应当影响缓存的文件，或者恢复了错误的输出时，请使用 [覆盖输入和输出](#override-inputs-and-outputs)。

当命令需要环境变量且该值应该影响缓存时，请使用 [`env`](/config/run#env)；当该值不应影响缓存时，请使用 [`untrackedEnv`](/config/run#untrackedenv)。

这些限制不适用于 `vp build`：Vite 会自动报告 [协作式追踪](#cooperative-tracking) 元数据，包括 `VITE_*`、`NODE_ENV`，以及不应成为输入或输出的 Vite 管理缓存路径。标准的 `vp build` 任务不需要手动设置 `input`、`output` 或 `env`。

### 覆盖输入和输出

[`input`](/config/run#input) 控制哪些内容会使缓存失效。[`output`](/config/run#output) 控制 Vite Task 在命中缓存时恢复哪些文件。

这两个选项使用相同的语法，并且可以分别配置。

- 省略该选项以保留自动追踪。
- 添加 `{ auto: true }` 以在保留自动追踪的同时添加 glob 规则。
- 使用字符串 glob 来包含路径。
- 使用 `!` glob 来排除路径。
- 使用 `[]` 将自动追踪替换为空列表。

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'node build.mjs',

    // 保留自动输入追踪，但将 `dist` 从输入中排除。
    input: [{ auto: true }, '!dist/**'],

    // 禁用自动输出追踪，并且在命中缓存时仅恢复 `dist/**`。
    output: ['dist/**'],
  },
}
```

仅当你清楚命令的完整输入集时，才使用显式的 `input` glob。这个 lint 任务只覆盖输入，因此输出追踪仍保持自动：

```ts [vite.config.ts]
tasks: {
  lint: {
    command: 'vp lint',
    // 禁用自动输入追踪，并且只对这些文件进行指纹识别。
    input: ['src/**', 'vite.config.ts'],
  },
}
```

当没有文件应影响缓存指纹时，设置 `input: []`。这很少有用。例如，如果同一个 URL 始终提供相同的文件，下载任务就可以被缓存。此任务不应对任何输入文件进行指纹识别，但更改 URL 仍会使缓存失效：

```ts [vite.config.ts]
tasks: {
  downloadSchema: {
    command: 'curl -O https://example.com/schema.json',
    input: [],
  },
}
```

当命中缓存时不应恢复任何文件，请设置 `output: []`。

## 协作式跟踪

文件系统跟踪会记录访问情况。它无法知道某个工具为什么使用了某个路径。

`vp build` 比 Vite Task 仅通过文件访问推断出来的信息更多。 当 `vp build` 在启用缓存时运行，Vite 会将这些元数据报告给 Vite Task。Vite Task 会将该报告与文件系统跟踪结果合并，以构建更准确的缓存指纹。

对于标准的 Vite 构建，你无需自行添加这些条目，因为 Vite 会在运行时自动报告它们：

- `env: ['VITE_*']` 或 `env: ['NODE_ENV']`
- `output: ['dist/**']`
- 对 `node_modules/.vite-temp` 之类的临时路径的输入或输出排除

你只需要使用 `vp build` 来定义任务：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  run: {
    tasks: {
      frontendBuild: 'vp build',
    },
  },
});
```

使用 `vpr frontendBuild` 或 `vp run frontendBuild` 运行此任务。

手动配置会覆盖已报告的元数据。当你的项目存在 Vite 无法报告的行为时，添加 `input`、`output`、`env` 或 `untrackedEnv`。

Vite+ 目前支持 `vp build` 的协作式跟踪。未来它将把这一支持扩展到更多第一方工具。第三方工具可以使用 [`@voidzero-dev/vite-task-client`](https://npmx.dev/package/@voidzero-dev/vite-task-client) 报告缓存元数据。

## 何时添加手动配置

当你的项目具有命令或工具无法知晓的行为时，请添加配置。

| 情况                                                              | 示例                                                                                         |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 将输出目录从输入中排除                           | `input: [{ auto: true }, '!dist/**']`                                                           |
| 将临时生成的文件从输入和输出跟踪中排除 | `input: [{ auto: true }, '!.tmp/config.mjs']`<br>`output: [{ auto: true }, '!.tmp/config.mjs']` |
| 避免对某个任务进行自动文件跟踪                          | `input: ['src/**']`<br>`output: ['dist/**']`                                                    |
| 跟踪并传递环境变量                                         | `env: ['NODE_ENV']`                                                                             |
| 传递环境变量但不对其进行指纹识别                         | `untrackedEnv: ['GITHUB_ACTIONS']`                                                              |
