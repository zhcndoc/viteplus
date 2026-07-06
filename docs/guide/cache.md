# 任务缓存

Vite 任务可以自动跟踪依赖关系，并缓存通过 `vp run` 执行的任务。

## 概述

当一个任务成功运行（退出代码 0）时，其终端输出（stdout/stderr）和所有写入的文件（输出文件）都会被保存。在下一次运行时，Vite Task 会检查是否有任何变化：

1. **参数：** 传递给任务的[附加参数](/guide/run#additional-arguments)是否发生了变化？
2. **环境变量：** 任何[指纹化的环境变量](/config/run#env)是否发生了变化？
3. **输入：** 命令读取的任何输入文件是否发生了变化？

当所有检查都匹配时，Vite Task 会重放缓存的终端输出，恢复已保存的输出文件，并跳过该命令。

当发生缓存未命中时，Vite Task 会准确告诉你原因：

```
$ vp lint ✗ cache miss: 'src/utils.ts' modified, executing
$ vp build ✗ cache miss: env 'VITE_GREETING' changed, executing
$ vp test ✗ cache miss: args changed, executing
```

## 何时启用缓存？

由 `vp run` 运行的命令可以是 `vite.config.ts` 中定义的**任务**，也可以是 `package.json` 中定义的**脚本**。任务名称和脚本名称不能重叠。默认情况下，**任务会被缓存，而脚本不会**。

任务缓存共有三种控制方式，按优先级顺序如下：

### 1. 每个任务的 `cache: false`

任务可以设置 [`cache: false`](/config/run#cache) 选项以选择退出缓存。这不能被任何其他缓存控制标志覆盖。

### 2. CLI 标志

`--no-cache` 会为该次运行中的每个任务和脚本禁用缓存。`--cache` 会为任务和脚本都启用缓存，这等同于在该次调用中设置 [`run.cache: true`](/config/run#run-cache)。

### 3. 工作区配置

根目录 `vite.config.ts` 中的 [`run.cache`](/config/run#run-cache) 选项控制每个类别的默认行为：

| 设置 | 默认值 | 效果 |
| --- | --- | --- |
| `cache.tasks` | `true` | 缓存 `vite.config.ts` 中定义的任务 |
| `cache.scripts` | `false` | 缓存 `package.json` 脚本 |

## 自动数据追踪

Vite Task 使用[自动数据追踪](/guide/automatic-data-tracking)来了解每个任务进行缓存时所需的内容，因此你无需手动配置。自动数据追踪分为两个层级：

- **文件系统追踪：** Vite Task 会记录每个启用缓存的任务的文件读取、缺失文件探测、目录列表以及写入的输出文件。
- **协作式追踪：** 缓存报告工具可以报告文件系统追踪无法推断的元数据。Vite+ 目前已支持 `vp build`。

当任务需要手动追踪规则时，请使用[`input`](/config/run#input)或[`output`](/config/run#output)。`input` 控制什么会使缓存失效。`output` 控制 Vite Task 在缓存命中时恢复哪些文件。

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'node build.mjs',
    input: [{ auto: true }, '!dist/**'],
    output: ['dist/**'],
  },
}
```

## 环境变量

默认情况下，任务在一个干净的环境中运行。仅传递少量通用变量，如 `PATH`、`HOME` 和 `CI`。其他环境变量对任务不可见，也不会包含在缓存指纹中。

要将环境变量添加到缓存键中，请将其添加到 [`env`](/config/run#env)。更改其值会触发缓存失效：

```ts [vite.config.ts]
tasks: {
  build: {
    command: 'webpack --mode production',
    env: ['NODE_ENV'],
  },
}
```

要在**不**影响缓存行为的情况下将变量传递给任务，请使用 [`untrackedEnv`](/config/run#untrackedenv)。这对于像 `CI` 或 `GITHUB_ACTIONS` 这样的变量很有用，它们应该在任务中可用，但不应影响缓存行为。

有关通配符模式和自动传递变量的完整列表，请参见 [运行配置](/config/run#env)。

## 缓存共享

Vite 任务的缓存是基于内容的。如果两个任务使用相同的输入运行相同的命令，它们会共享同一个缓存条目。这在多个任务包含共同步骤时自然发生，无论是作为独立任务还是作为[复合命令](/guide/run#复合命令)的一部分：

```json [package.json]
{
  "scripts": {
    "check": "vp lint && vp build",
    "release": "vp lint && deploy-script"
  }
}
```

启用缓存后（例如通过 `--cache` 或 [`run.cache.scripts: true`](/config/run#run-cache)），先运行 `check`，则 `release` 中的 `vp lint` 步骤会立即命中缓存，因为两者针对相同文件和相同命令运行。

## 清除缓存

当需要清除缓存的任务结果时，请使用 `vp cache clean`：

```bash
vp cache clean
```

任务缓存存储在项目根目录的 `node_modules/.vite/task-cache` 中。`vp cache clean` 会删除该缓存目录。
