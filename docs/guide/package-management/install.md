# vp install

安装项目声明的依赖。别名：`vp i`。提供软件包名称时，会切换为 [add](./add) 的行为。

```bash
vp install
vp install --frozen-lockfile
vp install --lockfile-only
vp install --filter web
vp install react
```

## 选项

| 选项                      | 说明                                                                        | 备注                                                                                                 |
| ------------------------ | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `-P, --prod`             | 选择生产依赖，或将新增软件包保存到 dependencies。                              |                                                                                                      |
| `-D, --dev`              | 包含开发依赖，或将新增软件包保存到 devDependencies。                           |                                                                                                      |
| `--no-optional`          | 不安装 optionalDependencies。                                                |                                                                                                      |
| `--frozen-lockfile`      | 禁止修改 lockfile。                                                          | 优先于更早传入的 `--no-frozen-lockfile`。                                                            |
| `--no-frozen-lockfile`   | 明确允许更新 lockfile。                                                      | 优先于更早传入的 `--frozen-lockfile`。                                                              |
| `--lockfile-only`        | 只更新 lockfile，不执行完整安装。                                            |                                                                                                      |
| `--prefer-offline`       | 有缓存时优先使用缓存的软件包。                                               |                                                                                                      |
| `--offline`              | 只使用缓存中已有的软件包。                                                   |                                                                                                      |
| `-f, --force`            | 请求强制重新安装。                                                          |                                                                                                      |
| `--ignore-scripts`       | 不运行生命周期脚本。                                                        |                                                                                                      |
| `--no-lockfile`          | 跳过读取或生成 lockfile。                                                    |                                                                                                      |
| `--fix-lockfile`         | 修复 lockfile 条目。                                                        | 不能与软件包名称一起使用。                                                                          |
| `--shamefully-hoist`     | 创建扁平的 `node_modules` 布局。                                             |                                                                                                      |
| `--resolution-only`      | 重新解析依赖以供分析。                                                      | 不能与软件包名称一起使用。                                                                          |
| `--silent`               | 隐藏 Vite+ 输出，并请求包管理器以静默模式输出。                              |                                                                                                      |
| `--filter <pattern>`     | 按模式选择 workspace。                                                      | 可重复使用。                                                                                        |
| `-w, --workspace-root`   | 选择 workspace 根目录。                                                     |                                                                                                      |
| `-E, --save-exact`       | 保存精确的依赖版本。                                                        | 需要提供软件包名称。                                                                                |
| `--save-peer`            | 请求包管理器保存 peer 依赖。                                                | 需要提供软件包名称。                                                                                |
| `-O, --save-optional`    | 保存到 optionalDependencies。                                               | 需要提供软件包名称。                                                                                |
| `--save-catalog`         | 将依赖保存到默认 catalog。                                                  | 需要提供软件包名称。                                                                                |
| `-g, --global`           | 全局安装。                                                                  | 需要全局 CLI。使用[全局软件包存储区](./global-packages)。需要提供软件包名称。                        |
| `--node <version>`       | 全局安装使用的 Node.js 版本。                                               | 需要 `--global`。                                                                                   |
| `--concurrency <number>` | 并行执行的全局软件包安装数。                                                | 需要 `--global`。必须为正整数。                                                                     |

## 兼容性

以下命令介绍项目操作。全局模式请参见[选项](#options)。

- **npm:** `npm install`, or `npm ci` with `--frozen-lockfile` and no package names. With package names: `npm install`.
- **pnpm:** `pnpm install`. With package names: `pnpm add`.
- **经典版 Yarn：** `yarn install`。提供软件包名称时使用 `yarn add`。
- **现代版 Yarn：** `yarn install`。提供软件包名称时使用 `yarn add`。
- **Bun：** `bun install`。提供软件包名称时使用 `bun add`。

| 选项                      | npm                       | pnpm                  | 经典版 Yarn            | 现代版 Yarn            | Bun                              | 备注                                                 |
| ------------------------ | ------------------------- | --------------------- | --------------------- | --------------------- | -------------------------------- | -------------------------------------------------- |
| `-P, --prod`             | 支持                      | 支持                  | 支持                  | 提供软件包名称时支持   | 支持                             | 现代版 Yarn 仅在安装模式下发出警告。                 |
| `-D, --dev`              | 支持                      | 支持                  | 支持                  | 提供软件包名称时支持   | 支持                             |                                                    |
| `--no-optional`          | 支持                      | 支持                  | 支持                  | 不支持                | 支持                             |                                                    |
| `--frozen-lockfile`      | 不提供软件包名称时支持     | 不提供软件包名称时支持 | 支持                  | 不提供软件包名称时支持 | 支持                             |                                                    |
| `--no-frozen-lockfile`   | 不提供软件包名称时支持     | 不提供软件包名称时支持 | 不提供软件包名称时支持 | 不提供软件包名称时支持 | 支持                             |                                                    |
| `--lockfile-only`        | 不与 --frozen-lockfile 同用 | 支持                 | 不支持                | 3 或更高版本          | 支持                             | npm 在 CI 模式下忽略此选项。                         |
| `--prefer-offline`       | 支持                      | 支持                  | 支持                  | 不支持                | 1.4.1 或更高版本                 |                                                    |
| `--offline`              | 支持                      | 支持                  | 支持                  | 不支持                | 1.4.1 或更高版本                 |                                                    |
| `-f, --force`            | 不与 --frozen-lockfile 同用 | 支持                 | 支持                  | 不支持                | 支持                             | npm 在 CI 模式下忽略此选项。                         |
| `--ignore-scripts`       | 支持                      | 支持                  | 支持                  | 2.4 或更高版本        | 支持                             | 现代版 Yarn 优先采用仅更新 lockfile 模式。           |
| `--no-lockfile`          | 不与 --frozen-lockfile 同用 | 支持                 | 支持                  | 不支持                | 不支持                           | npm 在 CI 模式下忽略此选项。                         |
| `--fix-lockfile`         | 不支持                    | 支持                  | 不支持                | 4 或更高版本          | 不支持                           |                                                    |
| `--shamefully-hoist`     | 不支持                    | 支持                  | 不支持                | 不支持                | 不支持                           |                                                    |
| `--resolution-only`      | 不支持                    | 支持                  | 不支持                | 不支持                | 不支持                           |                                                    |
| `--silent`               | 支持                      | 支持                  | 支持                  | 不支持                | 支持                             |                                                    |
| `--filter <pattern>`     | 7.14.0 或更高版本          | 支持                  | 不支持                | 支持                  | 安装支持；add 从 1.4 起支持     |                                                    |
| `-w, --workspace-root`   | 8.1.0 或更高版本           | 支持                  | 提供软件包名称时支持   | 不支持                | 不支持                           |                                                    |
| `-E, --save-exact`       | 支持                      | 支持                  | 支持                  | 支持                  | 支持                             |                                                    |
| `--save-peer`            | 支持                      | 支持                  | 支持                  | 支持                  | 支持                             |                                                    |
| `-O, --save-optional`    | 支持                      | 支持                  | 支持                  | 支持                  | 支持                             |                                                    |
| `--save-catalog`         | 不支持                    | 10.12.0 或更高版本    | 不支持                | 不支持                | 1.4 或更高版本                   |                                                    |
| `-g, --global`           | 支持                      | 支持                  | 支持                  | 支持                  | 支持                             |                                                    |
| `--node <version>`       | 支持                      | 支持                  | 支持                  | 支持                  | 支持                             |                                                    |
| `--concurrency <number>` | 支持                      | 支持                  | 支持                  | 支持                  | 支持                             |                                                    |

提供软件包名称时，适用 [add](./add) 的兼容性规则。

### Git 与远程 Tarball 依赖

npm 12 默认禁用 git 依赖和远程 tarball URL。安装可能以 `EALLOWGIT` 或 `EALLOWREMOTE` 失败。只有确实需要使用这些来源时，才通过 npm 项目的 `allow-git` 或 `allow-remote` 配置显式启用。

依赖构建脚本的批准方式请参见[批准构建脚本](./approve-builds)。

## 原生选项

原生选项请参阅 [npm install](https://docs.npmjs.com/cli/v11/commands/npm-install)、[pnpm install](https://pnpm.io/cli/install)、[Yarn install](https://yarnpkg.com/cli/install)、[Yarn Classic install](https://classic.yarnpkg.com/en/docs/cli/install) 和 [Bun install](https://bun.com/docs/pm/cli/install)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
