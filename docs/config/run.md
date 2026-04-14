# 运行配置

你可以在 `vite.config.ts` 中的 `run` 字段下配置 Vite Task。查看 [`vp run`](/guide/run) 以了解有关运行脚本和任务（使用 Vite+）的更多信息。

```ts
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

```ts
export default defineConfig({
  run: {
    enablePrePostScripts: false, // 禁用预/后生命周期钩子
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

```ts
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

- **类型:** `Record<string, TaskConfig>`

定义可以通过 `vp run <task>` 运行的任务。

### `command`

- **类型:** `string`

定义任务要运行的 shell 命令。

```ts
tasks: {
  build: {
    command: 'vp build',
  },
}
```

在 `vite.config.ts` 中定义的每个任务都必须包含自己的 `command`。你不能使用相同的任务名称在 `vite.config.ts` 和 `package.json` 中定义任务。

使用 `&&` 连接的命令会自动拆分为独立缓存的子任务。参见[复合命令](/guide/run#compound-commands)。

### `dependsOn`

- **类型:** `string[]`
- **默认值:** `[]`

在此任务开始之前必须成功完成的任务。

```ts
tasks: {
  deploy: {
    command: 'deploy-script --prod',
    dependsOn: ['build', 'test'],
  },
}
```

依赖项可以使用 `package#task` 格式引用其他包中的任务：

```ts
dependsOn: ['@my/core#build', '@my/utils#lint'];
```

关于显式依赖和拓扑依赖如何交互的详细信息，请参见[任务依赖](/guide/run#task-dependencies)。

### `cache`

- **类型:** `boolean`
- **默认值:** `true`

是否缓存此任务的输出。对于不应被缓存的任务（如开发服务器），请设置为 `false`：

```ts
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

```ts
tasks: {
  build: {
    command: 'vp build',
    env: ['NODE_ENV'],
  },
}
```

支持通配符模式：`VITE_*` 匹配所有以 `VITE_` 开头的变量。

```bash
$ NODE_ENV=development vp run build    # 首次运行
$ NODE_ENV=production vp run build     # 缓存未命中：变量已更改
```

### `untrackedEnv`

- **类型:** `string[]`
- **默认值:** 见下文

传递给任务进程但**不**包含在缓存指纹中的环境变量。更改这些值不会使缓存失效。

```ts
tasks: {
  build: {
    command: 'vp build',
    untrackedEnv: ['CI', 'GITHUB_ACTIONS'],
  },
}
```

一组常见的环境变量会自动传递给所有任务：

- **系统:** `HOME`, `USER`, `PATH`, `SHELL`, `LANG`, `TZ`
- **Node.js:** `NODE_OPTIONS`, `COREPACK_HOME`, `PNPM_HOME`
- **CI/CD:** `CI`, `VERCEL_*`, `NEXT_*`
- **终端:** `TERM`, `COLORTERM`, `FORCE_COLOR`, `NO_COLOR`

### `input`

- **类型:** `Array<string | { auto: boolean } | { pattern: string, base: "workspace" | "package" }>`
- **默认值:** `[{ auto: true }]`（自动推断）

Vite Task 会自动检测命令使用了哪些文件（参见[自动文件跟踪](/guide/cache#automatic-file-tracking)）。`input` 选项可用于显式包含或排除特定文件。

**从自动跟踪中排除文件**：

```ts
tasks: {
  build: {
    command: 'vp build',
    // 使用 `{ auto: true }` 使用自动指纹识别（默认）。
    input: [{ auto: true }, '!**/*.tsbuildinfo', '!dist/**'],
  },
}
```

**仅指定显式文件而不进行自动跟踪**：

```ts
tasks: {
  build: {
    command: 'vp build',
    input: ['src/**/*.ts', 'vite.config.ts'],
  },
}
```

**使用对象形式将模式解析为相对于工作区根目录**：

```ts
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

`base` 字段是必需的，用于控制如何解析 glob 模式：
- `"package"`：相对于包目录
- `"workspace"`：相对于工作区根目录

**完全禁用文件跟踪，仅根据命令/环境变化缓存**：

```ts
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

### `cwd`

- **类型:** `string`
- **默认值:** 包根目录

任务的工作目录，相对于包根目录。

```ts
tasks: {
  'test-e2e': {
    command: 'vp test',
    cwd: 'tests/e2e',
  },
}
```
