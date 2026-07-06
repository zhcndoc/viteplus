# 运行配置

你可以在 `vite.config.ts` 中的 `run` 字段下配置 Vite Task。查看 [`vp run`](/guide/run) 以了解有关运行脚本和任务（使用 Vite+）的更多信息。

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  run: {
    enablePrePostScripts: true,
    cache: {
      /* ... */
    },
    tasks: {
      /* ... */
    },
  },
});
```

## `run.enablePrePostScripts`

- **类型:** `boolean`
- **默认值:** `true`

当执行脚本 `X` 时，是否自动运行 `preX`/`postX` package.json 脚本作为生命周期钩子。

启用时（默认），运行类似 `test` 的脚本会在执行前自动运行 `pretest`，执行后自动运行 `posttest`（如果它们存在于 `package.json` 中）。

```ts [vite.config.ts]
export default defineConfig({
  run: {
    enablePrePostScripts: false, // 禁用前/后生命周期钩子
  },
});
```

::: warning
此选项只能在 workspace 根目录的 `vite.config.ts` 中设置。在包的配置中设置会导致错误。
:::

## `run.cache`

- **类型:** `boolean | { scripts?: boolean, tasks?: boolean }`
- **默认值:** `{ scripts: false, tasks: true }`

控制是否在后续运行中缓存并重放任务结果。

```ts [vite.config.ts]
export default defineConfig({
  run: {
    cache: {
      scripts: true, // 缓存 package.json 脚本（默认: false）
      tasks: true, // 缓存任务定义（默认: true）
    },
  },
});
```

`cache: true` 同时启用任务和脚本缓存，`cache: false` 则禁用两者。

## `run.tasks`

- **类型:** `Record<string, Task | string | string[]>`

定义可以通过 `vp run <task>` 运行的任务。

作为简写，任务值可以直接是命令字符串或命令字符串数组：

```ts [vite.config.ts]
tasks: {
  build: 'vp build',
  check: ['vp lint', 'vp build'],
}
```

这等价于仅在任务配置中设置 `command`：

```ts [vite.config.ts]
tasks: {
  build: { command: 'vp build' },
  check: { command: ['vp lint', 'vp build'] },
}
```

当任务需要其他字段，如 `cache`、`dependsOn`、`env` 或 `input` 时，请使用对象形式。

### `command`

- **类型:** `string | string[]`

定义要为该任务运行的 shell 命令。该字符串会由 shell 解释，因此空格、引号、`&&`、管道符和重定向都可以像在命令行中写的那样正常工作。

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'vp build',
  },
}
```

数组会按顺序将每一项作为单独的命令运行，等同于用 `&&` 连接。它**不是**将一个命令拆分为 argv 参数的方式——`['vp', 'build']` 会尝试先运行一个名为 `vp` 的命令且不带参数，然后再运行一个名为 `build` 的命令，而不是 `vp build`。

```ts [vite.config.ts]
tasks: {
  check: {
    // 两个命令，按顺序运行
    command: ['vp lint', 'vp build'],
  },
  bad: {
    // 错误：这不是 `vp build`；而是先执行 `vp`，再执行 `build`
    command: ['vp', 'build'],
  },
}
```

在 `vite.config.ts` 中定义的每个任务都必须包含自己的 `command`。你不能在 `vite.config.ts` 和 `package.json` 中定义同名任务。

使用 `&&` 连接的命令（或以数组形式提供的命令）会自动拆分为可独立缓存的子任务。参见[复合命令](/guide/run#compound-commands)。

### `dependsOn`

- **类型:** `Array<string | { task: string, from: DependsOnFrom }>`
- **默认值:** `[]`

`from` 接受依赖类型 `"dependencies"`、`"devDependencies"`、`"peerDependencies"`，或者这些值的数组，例如 `["dependencies", "devDependencies"]`。

这些依赖项必须在此任务开始前成功完成。

```ts [vite.config.ts]
tasks: {
  deploy: {
    command: 'deploy-script --prod',
    dependsOn: ['build', 'test'],
  },
}
```

依赖项可以使用 `package#task` 格式引用其他包中的任务：

```ts [vite.config.ts]
dependsOn: ['@my/core#build', '@my/utils#lint'];
```

使用对象形式 `{ task: string, from: DependsOnFrom }` 引用所有依赖中的任务：

```ts [vite.config.ts]
tasks: {
  test: {
    command: 'vp test',
    dependsOn: [{ task: 'build', from: ['dependencies', 'devDependencies'] }],
  },
}
```

对于上面的示例，Vite Task 会读取声明包的直接 `dependencies` 和 `devDependencies`，并在每个定义了 `build` 任务的依赖中运行该任务。没有 `build` 的包会被跳过。

有关显式依赖和拓扑依赖如何交互的详细信息，请参见[任务依赖](/guide/run#task-dependencies)。

### `cache`

- **类型:** `boolean`
- **默认值:** `true`

是否缓存此任务的输出。对于不应被缓存的任务（如开发服务器），请设置为 `false`：

```ts [vite.config.ts]
tasks: {
  dev: {
    command: 'vp dev',
    cache: false,
  },
}
```

### `env`

- **类型:** `string[]`
- **默认值:** `[]`

包含在缓存指纹中的环境变量。当任何列出的变量值发生变化时，缓存将失效。

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'node build.mjs',
    env: ['NODE_ENV'],
  },
}
```

支持通配符模式和 `!` 排除模式：`VITE_*` 匹配所有以 `VITE_` 开头的变量，`!VITE_SECRET` 会将 `VITE_SECRET` 变量从匹配中排除。

对于 `vp build`，Vite 会通过[自动跟踪](/guide/automatic-data-tracking#cooperative-tracking)报告 Vite 环境变量。除非你的项目有 Vite 无法报告的额外构建行为，否则标准 Vite 构建不要在这里添加 `VITE_*` 或 `NODE_ENV`。

```bash
$ NODE_ENV=development vp run build    # 首次运行
$ NODE_ENV=production vp run build     # 缓存未命中：`NODE_ENV` 已更改
```

### `untrackedEnv`

- **类型:** `string[]`
- **默认值:** 见下文

传递给任务进程但**不**包含在缓存指纹中的环境变量。更改这些值不会使缓存失效。

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'node build.mjs',
    untrackedEnv: ['CI', 'GITHUB_ACTIONS'],
  },
}
```

`untrackedEnv` 接受与 [`env`](#env) 相同的通配符和 `!` 排除模式。

如果某个变量的值会改变任务结果，就不要把它放入 `untrackedEnv`。如果某个缓存报告工具已通过[自动跟踪](/guide/automatic-data-tracking#cooperative-tracking)覆盖了该变量，请不要将其放入 `env` 和 `untrackedEnv` 中。

Vite Task 会向所有任务传递一组常见环境变量：

- **系统:** `HOME`, `USER`, `PATH`, `SHELL`, `LANG`, `TZ`
- **Node.js:** `NODE_OPTIONS`, `COREPACK_HOME`, `PNPM_HOME`
- **CI/CD:** `CI`, `VERCEL_*`, `NEXT_*`
- **终端:** 颜色变量（`FORCE_COLOR`、`NO_COLOR`、`COLORTERM`、`TERM`、`TERM_PROGRAM`）不会传递给任务，除非你将它们列在 `env` 下（其值会被纳入指纹，因此更改后会使缓存失效）或 `untrackedEnv` 下（传递但不进行指纹识别）。如果 `FORCE_COLOR` 不在这两个列表中，子进程会获得 `FORCE_COLOR=1`，以便缓存日志保持彩色。当终端无法渲染颜色时，颜色会在显示时被去除。

### `input`

- **类型:** `Array<string | { auto: boolean } | { pattern: string, base: "workspace" | "package" }>`
- **默认值:** `[{ auto: true }]`（自动推断）

Vite Task 会自动检测命令使用了哪些文件。有关详细信息以及何时添加手动配置，请参见[自动数据跟踪](/guide/automatic-data-tracking)。

**从自动跟踪中排除文件**：

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'vp build',
    // 使用 `{ auto: true }` 进行自动指纹识别（默认）。
    input: [{ auto: true }, '!**/*.tsbuildinfo', '!dist/**'],
  },
}
```

**仅指定显式文件而不进行自动跟踪**：

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'vp build',
    input: ['src/**/*.ts', 'vite.config.ts'],
  },
}
```

**使用对象形式将模式解析为相对于工作区根目录**：

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'vp build',
    input: [
      { auto: true },
      { pattern: 'shared-config/**', base: 'workspace' },
    ],
  },
}
```

`base` 字段是必需的，并控制 glob 模式的解析方式：

- `"package"`：相对于包目录
- `"workspace"`：相对于工作区根目录

**完全禁用文件跟踪，仅根据命令/环境变化缓存**：

```ts [vite.config.ts]
tasks: {
  greet: {
    command: 'node greet.mjs',
    input: [],
  },
}
```

::: tip
字符串通配符模式默认相对于包目录解析。使用对象形式并设置 `base: "workspace"` 可将解析基准设为工作区根目录。
:::

### `output`

- **类型:** `Array<string | { auto: boolean } | { pattern: string, base: "workspace" | "package" }>`
- **默认值:** 自动写入跟踪

Vite Task 会自动归档成功任务运行生成的文件，并在缓存命中时恢复这些文件。

如果你省略 `output`，Vite Task 会使用自动写入跟踪来选择这些文件。当你需要覆盖要恢复的文件时，请添加显式的 `output` 条目。

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'node build.mjs',
    output: ['dist/**', '!dist/cache/**'],
  },
}
```

使用 `{ auto: true }` 可以在添加显式输出 glob 的同时保留自动写入跟踪。

这在任务会写入不应从缓存恢复的文件时很有用。例如，可排除 TypeScript 的 `.tsbuildinfo` 文件：

```ts [vite.config.ts]
tasks: {
  typecheck: {
    command: 'tsc --build',
    output: [{ auto: true }, '!*.tsbuildinfo'],
  },
}
```

如果任务写入到了其自身包之外，请使用带有 `base: "workspace"` 的对象形式：

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'node build.mjs',
    output: [
      'dist/**',
      { pattern: 'shared-artifacts/**', base: 'workspace' },
    ],
  },
}
```

将 `output: []` 设为空数组，可为缓存任务禁用输出恢复：

```ts [vite.config.ts]
tasks: {
  report: {
    command: 'node scripts/report.mjs',
    output: [],
  },
}
```

与 `cache: false` 不同，`output: []` 仍然允许 Vite Task 对任务进行指纹识别。在缓存命中时，Vite Task 会跳过命令并回放其终端输出。当任务的输出文件已经存在且不需要恢复时，可在本地缓存场景中使用此配置。

### `cwd`

- **类型:** `string`
- **默认值:** 包根目录

任务的工作目录，相对于包根目录。

```ts [vite.config.ts]
tasks: {
  'test-e2e': {
    command: 'vp test',
    cwd: 'tests/e2e',
  },
}
```
