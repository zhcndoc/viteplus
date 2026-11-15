# vp update

使用所选包管理器的更新规则更新项目依赖。别名：`vp up`。

```bash
vp update
vp update react
vp update --latest
vp update -g
```

## 选项

| 选项                         | 说明                                                                             | 备注                                                                           |
| --------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `-L, --latest`              | 更新到最新版本（忽略 semver 范围）。                                               | 全局模式会清除记录的版本范围。                                                 |
| `-g, --global`              | 更新全局软件包。                                                                 | 需要全局 CLI。使用[全局软件包存储区](./global-packages)。                     |
| `--concurrency <number>`    | 并行执行的全局软件包更新数。                                                     | 需要 `--global`。必须为正整数。                                               |
| `--reinstall-node-mismatch` | 重新安装由不同 Node.js 版本安装的、当前已是最新的全局软件包。                    | 需要 `--global`。                                                             |
| `--ignore-node-mismatch`    | 跳过由不同 Node.js 版本安装的、当前已是最新的全局软件包。                        | 需要 `--global`。                                                             |
| `-r, --recursive`           | 递归更新所有 workspace 软件包。                                                 |                                                                              |
| `--filter <pattern>`        | 按模式选择 workspace。                                                         | 可重复使用。                                                                 |
| `-w, --workspace-root`      | 包含 workspace 根目录。                                                        |                                                                              |
| `-D, --dev`                 | 选择开发依赖。                                                                 |                                                                              |
| `-P, --prod`                | 选择生产依赖。                                                                 |                                                                              |
| `-i, --interactive`         | 交互模式。                                                                     |                                                                              |
| `--no-optional`             | 排除可选依赖。                                                                 |                                                                              |
| `--no-save`                 | 请求原生的 no-save 行为。                                                      |                                                                              |
| `--workspace`               | 仅更新 workspace 中可用的依赖。                                                |                                                                              |

## 兼容性

以下命令介绍项目操作。全局模式请参见[选项](#options)。

- **npm:** `npm update`.
- **pnpm:** `pnpm update`.
- **经典版 Yarn：** `yarn upgrade` 或 `yarn upgrade-interactive`。
- **现代版 Yarn：** `yarn up`。
- **Bun：** `bun update`。

| 选项                         | npm              | pnpm | 经典版 Yarn   | 现代版 Yarn                   | Bun          | 备注  |
| --------------------------- | ---------------- | ---- | ------------ | ---------------------------- | ------------ | ----- |
| `-L, --latest`              | 仅全局模式支持   | 支持 | 支持          | 支持                          | 支持         |       |
| `-g, --global`              | 支持              | 支持 | 支持          | 支持                          | 支持         |       |
| `--concurrency <number>`    | 支持              | 支持 | 支持          | 支持                          | 支持         |       |
| `--reinstall-node-mismatch` | 支持              | 支持 | 支持          | 支持                          | 支持         |       |
| `--ignore-node-mismatch`    | 支持              | 支持 | 支持          | 支持                          | 支持         |       |
| `-r, --recursive`           | 8.1.0 或更高版本  | 支持 | 不支持        | 支持                          | 1.4 或更高版本 |      |
| `--filter <pattern>`        | 7.14.0 或更高版本 | 支持 | 单一过滤条件  | 不支持                        | 1.4 或更高版本 |      |
| `-w, --workspace-root`      | 8.1.0 或更高版本  | 支持 | 不支持        | 不支持                        | 不支持        |       |
| `-D, --dev`                 | 支持              | 支持 | 不支持        | 不支持                        | 1.4 或更高版本 |      |
| `-P, --prod`                | 7 或更高版本      | 支持 | 支持          | 不支持                        | 1.4 或更高版本 |      |
| `-i, --interactive`         | 不支持            | 支持 | 支持          | 支持                          | 支持         |       |
| `--no-optional`             | 支持              | 支持 | 支持          | 不支持                        | 1.4 或更高版本 |      |
| `--no-save`                 | 支持              | 支持 | 不支持        | 不使用 --latest 的 --recursive | 支持       |       |
| `--workspace`               | 不支持            | 支持 | 不支持        | 不支持                        | 不支持        |       |

在 npm 中，要更改依赖声明的范围，请使用新的版本规格运行 [add](./add)。现代版 Yarn 遵循项目级更新语义。递归模式不带 `--latest` 时会重新解析现有范围，但不改写清单；与 `--latest` 一起使用时则会执行普通的 `yarn up`。

## 原生选项

原生选项请参阅 [npm update](https://docs.npmjs.com/cli/v11/commands/npm-update)、[pnpm update](https://pnpm.io/cli/update)、[Yarn up](https://yarnpkg.com/cli/up)、[Yarn Classic upgrade](https://classic.yarnpkg.com/en/docs/cli/upgrade)、[Yarn Classic upgrade-interactive](https://classic.yarnpkg.com/en/docs/cli/upgrade-interactive) 和 [Bun update](https://bun.com/docs/pm/cli/update)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
