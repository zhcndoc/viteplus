# 任务缓存

Vite 任务可以自动跟踪依赖关系，并缓存通过 `vp run` 执行的任务。

## 概述

当任务成功运行（退出代码为 0）时，其终端输出（标准输出/标准错误）会被保存。下一次运行时，Vite 任务会检查是否有任何变化：

1. **参数：** 传递给任务的[附加参数](/guide/run#附加参数)是否发生变化？
2. **环境变量：** 任何[指纹识别的环境变量](/config/run#env)是否变化？
3. **输入文件：** 命令读取的任何文件是否变化？

如果所有内容都匹配，缓存的输出会立即重放，命令不会实际执行。

::: info
目前，仅缓存并重放终端输出。像 `dist/` 这样的输出文件不会被缓存。如果删除了它们，请使用 `--no-cache` 强制重新执行。输出文件缓存计划在未来版本中支持。
:::

当发生缓存未命中时，Vite 任务会明确告诉你原因：

```
$ vp lint ✗ 缓存未命中：'src/utils.ts' 已修改，正在执行
$ vp build ✗ 缓存未命中：环境变量已更改，正在执行
$ vp test ✗ 缓存未命中：参数已更改，正在执行
```

## 何时启用缓存？

由 `vp run` 运行的命令可以是 `vite.config.ts` 中定义的**任务**，也可以是 `package.json` 中定义的**脚本**。任务名称和脚本名称不能重叠。默认情况下，**任务会被缓存，而脚本不会**。

任务缓存共有三种控制方式，按优先级顺序如下：

### 1. 每个任务的 `cache: false`

任务可以设置 [`cache: false`](/config/run#cache) 选项以选择退出缓存。这不能被任何其他缓存控制标志覆盖。

### 2. CLI 标志

`--no-cache` 禁用所有缓存。`--cache` 启用任务和脚本的缓存，相当于为本次调用设置 [`run.cache: true`](/config/run#run-cache)。

### 3. 工作区配置

根目录 `vite.config.ts` 中的 [`run.cache`](/config/run#run-cache) 选项控制每个类别的默认行为：

| 设置 | 默认值 | 效果 |
| --- | --- | --- |
| `cache.tasks` | `true` | 缓存 `vite.config.ts` 中定义的任务 |
| `cache.scripts` | `false` | 缓存 `package.json` 脚本 |

## 自动文件跟踪

Vite 任务会在执行过程中跟踪每个命令读取了哪些文件。当任务运行时，它会记录进程打开了哪些文件，例如你的 `.ts` 源文件、`vite.config.ts` 和 `package.json`，并记录它们的内容哈希。下一次运行时，它会重新检查这些哈希值以确定是否发生了变化。

这意味着大多数命令无需任何配置即可开箱即用地支持缓存。Vite 任务还会记录：

- **缺失的文件：**如果命令在解析模块时探测到不存在的文件（例如 `utils.ts`），后续创建该文件会正确使缓存失效。
- **目录列表：**当命令扫描目录（例如测试运行器查找 `*.test.ts`）时，向该目录添加或删除文件会使缓存失效。

### 避免过度宽泛的输入跟踪

自动跟踪有时会包含比必要更多的文件，导致不必要的缓存未命中：

- **工具缓存文件：**某些工具会维护自己的缓存，例如 TypeScript 的 `.tsbuildinfo` 或 Cargo 的 `target/`。这些文件可能在源代码未变更时发生改变，导致不必要的缓存失效。
- **目录列表：**当命令扫描目录（例如使用通配符 `**/*.js`）时，Vite 任务会看到目录读取，但看不到通配模式。该目录中添加或删除的任何文件（即使无关）都会使缓存失效。

使用 [`input`](/config/run#input) 选项可排除文件或用显式文件模式替换自动跟踪：

```ts
tasks: {
  build: {
    command: 'tsc',
    input: [{ auto: true }, '!**/*.tsbuildinfo'],
  },
}
```

## 环境变量

默认情况下，任务在一个干净的环境中运行。仅传递少量通用变量，如 `PATH`、`HOME` 和 `CI`。其他环境变量对任务不可见，也不会包含在缓存指纹中。

要将环境变量添加到缓存键中，请将其添加到 [`env`](/config/run#env)。更改其值会触发缓存失效：

```ts
tasks: {
  build: {
    command: 'webpack --mode production',
    env: ['NODE_ENV'],
  },
}
```

若要将变量传递给任务**而不影响**缓存行为，请使用 [`untrackedEnv`](/config/run#untracked-env)。这对于 `CI` 或 `GITHUB_ACTIONS` 等变量很有用，这些变量应可在任务中使用，但通常不会影响缓存行为。

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

## 缓存命令

当需要清除缓存的任务结果时，请使用 `vp cache clean`：

```bash
vp cache clean
```

任务缓存存储在项目根目录的 `node_modules/.vite/task-cache` 中。`vp cache clean` 会删除该缓存目录。
