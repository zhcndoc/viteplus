# GitHub Actions 缓存

::: warning Experimental
在 GitHub Actions 的多次运行之间复用 Vite Task 的缓存属于实验性功能。请先在你的项目中测试并衡量其效果，再决定是否在 CI 中依赖它。
:::

Vite Task 会将任务结果存储在工作区根目录下的 `node_modules/.vite/task-cache` 中。请在后续的 GitHub Actions 运行中恢复该目录，这样 Vite Task 就可以复用之前的任务结果。

GitHub Actions 缓存和 Vite Task 会分别做出决定：

1. `actions/cache` 会根据你工作流中的 key 恢复并保存缓存目录。
2. Vite Task 会使用已恢复的缓存目录，并且只重放那些其指纹仍然匹配的任务。

## 开始之前

当以下所有条件都为真时，使用此工作流：

- 命令通过 [`vp run`](/guide/run) 运行。
- 紧接着的第二次运行会报告该任务命中缓存。
- 该任务为 CI 提供稳定的输入和输出跟踪。
- 该工作流会在恢复 `node_modules/.vite/task-cache` 之前安装依赖。

如果紧接着的第二次运行未命中，请先修复任务的跟踪配置，再添加 GitHub Actions 缓存。请查看 [何时添加手动配置](/guide/automatic-data-tracking#when-to-add-manual-config)，了解缓存不稳定的常见原因及修复方法。

## 跨运行缓存前先进行测量

在以下情况下，你可能不需要在 GitHub Actions 运行之间恢复 Vite Task 缓存：

- 任务本身已经足够快。恢复和保存步骤会增加额外开销，因此对于较短的任务，不使用此工作流反而可能更快完成。
- 缓存传输所花费的时间比重新运行任务更长。Vite Task 在同一次工作流运行中，当同一任务执行多次时，仍然可以节省时间，但在跨运行场景中，传输时间也是成本的一部分。

在为 Vite Task 添加 GitHub Actions 缓存之前，请先进行测量。比较有无 restore 和 save 步骤时的工作流持续时间。检查 GitHub cache 步骤耗时和 `vp run` 耗时。

## 1. 定义可缓存的 CI 任务

只有通过 `vp run` 运行的命令才会使用 Vite Task 缓存。像 `vp build` 这样的直接命令不会使用任务缓存。请在 `vite.config.ts` 中为你希望在 CI 中缓存的每个命令定义一个任务：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  run: {
    tasks: {
      build: 'vp build',
      lint: 'vp lint',
    },
  },
});
```

本指南假设每个任务在本地运行时都能命中缓存。如果某个任务未命中，请先在添加 GitHub Actions 缓存步骤之前，修复 `vite.config.ts` 中的跟踪配置。请参阅[自动数据跟踪](/guide/automatic-data-tracking)和[`run.tasks`](/config/run#run-tasks)。

将每个任务运行两次：

```bash
vp run build
vp run build # 应打印 "cache hit"
vp run lint
vp run lint # 应打印 "cache hit"
```

## 2. 安装后恢复缓存

在 `vp install` 之后恢复 `node_modules/.vite/task-cache`，因为安装包可能会重新创建或修改 `node_modules`。

```yaml [.github/workflows/ci.yml]
name: CI

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: voidzero-dev/setup-vp@v1
        with:
          node-version: '24'
          cache: true

      - run: vp install

      - name: 恢复 Vite Task 缓存
        id: vite-task-cache
        uses: actions/cache/restore@v6
        with:
          path: node_modules/.vite/task-cache
          key: vite-task-${{ runner.os }}-${{ runner.arch }}-${{ github.run_id }}-${{ github.run_attempt }}
          restore-keys: |
            vite-task-${{ runner.os }}-${{ runner.arch }}-

      - run: vp run lint
      - run: vp run build

      - name: 保存 Vite Task 缓存
        if: success()
        uses: actions/cache/save@v6
        with:
          path: node_modules/.vite/task-cache
          key: ${{ steps.vite-task-cache.outputs.cache-primary-key }}
```

主键包含 `github.run_id` 和 `github.run_attempt`，因此每次成功运行都可以保存一个新的不可变缓存条目。恢复前缀允许 GitHub 为相同操作系统和架构恢复最新的缓存。

不要把任务输入，包括源文件和 lockfile，放进 GitHub Actions 的 key 中。Vite Task 会对它们进行指纹识别。如果这些内容改变了 Actions key，GitHub 可能会在 Vite Task 还没决定哪些任务仍然命中之前，跳过有用的恢复。

对于 monorepo，请从工作区根目录恢复任务缓存。然后运行与你在本地使用的相同 `vp run` 命令，例如 `vp run -t @my/app#build`。Vite Task 可以复用所请求包以及其依赖包的结果。

## 3. 在日志中验证

在第一次运行时，恢复步骤应该会提示未找到缓存，而保存步骤会创建一个缓存。来自派生仓库的拉取请求可能只能恢复缓存，因为 GitHub 可以为缓存令牌提供只读访问权限。在这种情况下，保存步骤会发出警告，并在不写入缓存条目的情况下成功退出。

在后续运行中，请同时查找以下两层：

```text
Cache restored from key: vite-task-Linux-X64-...
$ vp build ◉ cache hit, replaying
vp run: cache hit, 1.10s saved.
```

如果 GitHub 恢复了缓存，但 Vite Task 打印缓存未命中，则说明工作流恢复了缓存目录，但任务指纹发生了变化。

## 保持任务跟踪稳定

如果 GitHub 恢复了缓存，但 `vp run` 显示缓存未命中，请先修复任务指纹，再修改 Actions 缓存键。请参阅[自动数据跟踪](/guide/automatic-data-tracking)和[`run.tasks`](/config/run#run-tasks)。

## 选择一个缓存键

使用滚动主键加上恢复前缀：

```yaml [.github/workflows/ci.yml]
key: vite-task-${{ runner.os }}-${{ runner.arch }}-${{ github.run_id }}-${{ github.run_attempt }}
restore-keys: |
  vite-task-${{ runner.os }}-${{ runner.arch }}-
```

主键对每次运行都是唯一的，因为它包含 `github.run_id` 和 `github.run_attempt`。然后 GitHub 会搜索恢复前缀，并恢复最新匹配的缓存。

请包含：

- `runner.os` 和 `runner.arch`，因为输出和原生工具可能具有平台特定性。
- 每次运行的值，例如 `github.run_id` 和 `github.run_attempt`，因为 GitHub 缓存条目是不可变的。

如果某个依赖文件会影响任务结果，请将其记录在任务指纹中，而不是 GitHub Actions 键中。

## 管理缓存淘汰和作用域

GitHub 会根据其缓存保留和仓库存储规则来淘汰缓存。缓存作用域也与分支相关：工作流运行可以从当前分支和默认分支恢复缓存，而拉取请求的合并引用（merge-ref）缓存作用域有限。

Vite Task 可以清除整个任务缓存，但目前不会按年龄或大小逐个淘汰单独的任务条目。随着新的任务条目和输出归档被保存，`node_modules/.vite/task-cache` 可能会持续增长。

在 GitHub Actions 缓存层面管理大小：

- 将缓存的 `path` 限制为 Vite Task 缓存目录。
- 将恢复前缀限定为兼容的运行器，例如相同的操作系统和架构。
- 删除过期的 GitHub Actions 缓存条目、减少保存缓存的工作流数量，或者在大型缓存导致频繁淘汰时调整仓库缓存限制。

有关当前的淘汰和作用域规则，请参阅 [GitHub 的缓存参考](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching)。
