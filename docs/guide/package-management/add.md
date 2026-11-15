# vp add

向项目添加软件包并更新清单和 lockfile。

```bash
vp add react
vp add -D typescript
vp add --save-peer react
vp add --filter web react
```

## 选项

每次只能选择一种依赖目标。peer 依赖遵循原生包管理器的行为，包括是否同时记录为开发依赖。

| 选项                          | 说明                                                   | 备注                                                                             |
| ---------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `-P, --save-prod`            | 保存到 dependencies（默认目标）。                       | 每次选择一种依赖目标。                                                         |
| `-D, --save-dev`             | 保存到 devDependencies。                                | 每次选择一种依赖目标。                                                         |
| `--save-peer`                | 请求包管理器保存 peer 依赖。                            | 每次选择一种依赖目标。                                                         |
| `-O, --save-optional`        | 保存到 optionalDependencies。                           | 每次选择一种依赖目标。                                                         |
| `-E, --save-exact`           | 保存精确的依赖版本。                                    |                                                                                |
| `--save-catalog-name <name>` | 将依赖保存到指定名称的 catalog。                        |                                                                                |
| `--save-catalog`             | 将依赖保存到默认 catalog。                              |                                                                                |
| `--allow-build <names>`      | 允许指定的软件包运行 postinstall 脚本。                  |                                                                                |
| `--ignore-scripts`           | 不运行生命周期脚本。                                    |                                                                                |
| `--no-optional`              | 不安装 optionalDependencies。                           | 不能与 `--global` 同用。                                                       |
| `--frozen-lockfile`          | 禁止修改 lockfile。                                     | 不能与 `--global` 同用。优先于更早传入的 `--no-frozen-lockfile`。               |
| `--no-frozen-lockfile`       | 明确允许更新 lockfile。                                 | 不能与 `--global` 同用。优先于更早传入的 `--frozen-lockfile`。                 |
| `--lockfile-only`            | 只更新 lockfile，不执行完整安装。                       | 不能与 `--global` 同用。                                                       |
| `--prefer-offline`           | 有缓存时优先使用缓存的软件包。                          | 不能与 `--global` 同用。                                                       |
| `--offline`                  | 只使用缓存中已有的软件包。                              | 不能与 `--global` 同用。                                                       |
| `-f, --force`                | 请求强制重新安装。                                      | 不能与 `--global` 同用。                                                       |
| `--no-lockfile`              | 跳过读取或生成 lockfile。                               | 不能与 `--global` 同用。                                                       |
| `--shamefully-hoist`         | 创建扁平的 `node_modules` 布局。                         | 不能与 `--global` 同用。                                                       |
| `--silent`                   | 隐藏 Vite+ 输出，并请求包管理器以静默模式输出。          | 不能与 `--global` 同用。                                                       |
| `--filter <pattern>`         | 按模式选择 workspace。                                 | 可重复使用。                                                                   |
| `-w, --workspace-root`       | 添加到 workspace 根目录。                              |                                                                                |
| `--workspace`                | 要求该依赖已存在于 workspace 中。                       |                                                                                |
| `-g, --global`               | 全局安装。                                              | 需要全局 CLI。使用[全局软件包存储区](./global-packages)。                       |
| `--node <version>`           | 全局安装使用的 Node.js 版本。                          | 需要 `--global`。                                                              |
| `--concurrency <number>`     | 并行执行的全局软件包安装数。                            | 需要 `--global`。必须为正整数。                                                |

## 兼容性

以下命令介绍项目操作。全局模式请参见[选项](#options)。

- **npm:** `npm install`.
- **pnpm:** `pnpm add`.
- **经典版 Yarn：** `yarn add`。
- **现代版 Yarn：** `yarn add`。
- **Bun：** `bun add`。

| 选项                          | npm             | pnpm             | 经典版 Yarn   | 现代版 Yarn  | Bun            | 备注                                                 |
| ---------------------------- | --------------- | ---------------- | ------------ | ----------- | -------------- | -------------------------------------------------- |
| `-P, --save-prod`            | 支持              | 支持              | 支持           | 支持          | 支持             |                                                    |
| `-D, --save-dev`             | 支持              | 支持              | 支持           | 支持          | 支持             |                                                    |
| `--save-peer`                | 支持              | 支持              | 支持           | 支持          | 支持             |                                                    |
| `-O, --save-optional`        | 支持              | 支持              | 支持           | 支持          | 支持             |                                                    |
| `-E, --save-exact`           | 支持              | 支持              | 支持           | 支持          | 支持             |                                                    |
| `--save-catalog-name <name>` | 不支持            | 10.12.0 或更高版本 | 不支持         | 不支持        | 1.4 或更高版本  |                                                    |
| `--save-catalog`             | 不支持            | 10.12.0 或更高版本 | 不支持         | 不支持        | 1.4 或更高版本  |                                                    |
| `--allow-build <names>`      | 不支持            | 10.4.0 或更高版本  | 不支持         | 不支持        | 不支持           |                                                    |
| `--ignore-scripts`           | 支持              | 支持              | 支持           | 3 或更高版本  | 支持             | 现代版 Yarn 优先采用仅更新 lockfile 模式。           |
| `--no-optional`              | 支持              | 支持              | 支持           | 不支持        | 支持             |                                                    |
| `--frozen-lockfile`          | 不支持            | 不支持            | 支持           | 不支持        | 支持             |                                                    |
| `--no-frozen-lockfile`       | 不支持            | 不支持            | 不支持         | 不支持        | 支持             |                                                    |
| `--lockfile-only`            | 支持              | 支持              | 不支持         | 3 或更高版本  | 支持             |                                                    |
| `--prefer-offline`           | 支持              | 支持              | 支持           | 不支持        | 1.4.1 或更高版本 |                                                    |
| `--offline`                  | 支持              | 支持              | 支持           | 不支持        | 1.4.1 或更高版本 |                                                    |
| `-f, --force`                | 支持              | 支持              | 支持           | 不支持        | 支持             |                                                    |
| `--no-lockfile`              | 支持              | 支持              | 支持           | 不支持        | 不支持           |                                                    |
| `--shamefully-hoist`         | 不支持            | 支持              | 不支持         | 不支持        | 不支持           |                                                    |
| `--silent`                   | 支持              | 支持              | 支持           | 不支持        | 支持             |                                                    |
| `--filter <pattern>`         | 7.14.0 或更高版本 | 支持              | 不支持         | 支持          | 1.4 或更高版本  |                                                    |
| `-w, --workspace-root`       | 8.1.0 或更高版本  | 支持              | 支持           | 不支持        | 不支持           |                                                    |
| `--workspace`                | 不支持            | 支持              | 不支持         | 不支持        | 不支持           |                                                    |
| `-g, --global`               | 支持              | 支持              | 支持           | 支持          | 支持             |                                                    |
| `--node <version>`           | 支持              | 支持              | 支持           | 支持          | 支持             |                                                    |
| `--concurrency <number>`     | 支持              | 支持              | 支持           | 支持          | 支持             |                                                    |

## 原生选项

原生选项请参阅 [npm install](https://docs.npmjs.com/cli/v11/commands/npm-install)、[pnpm add](https://pnpm.io/cli/add)、[Yarn add](https://yarnpkg.com/cli/add)、[Yarn Classic add](https://classic.yarnpkg.com/en/docs/cli/add) 和 [Bun add](https://bun.com/docs/pm/cli/add)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
