# vp list

列出已安装的依赖。别名：`vp ls`。这些顶层命令需要全局 CLI。全局和项目本地 CLI 都接受 `vp pm list` 和 `vp pm ls`。

```bash
vp list
vp list react --depth 2
vp list --json
vp list -g
```

## 选项

| 选项                       | 说明                              | 备注                                                                           |
| ------------------------- | --------------------------------- | ---------------------------------------------------------------------------- |
| `--depth <depth>`         | 依赖树的最大深度。                |                                                                              |
| `--json`                  | 请求原生 JSON 输出。             | 输出保留原生 schema。                                                       |
| `--long`                  | 显示扩展信息。                    |                                                                              |
| `--parseable`             | 使用便于解析的输出格式。          |                                                                              |
| `-P, --prod`              | 仅显示生产依赖。                  |                                                                              |
| `-D, --dev`               | 包含开发依赖。                    |                                                                              |
| `--no-optional`           | 排除可选依赖。                    |                                                                              |
| `--exclude-peers`         | 排除 peer 依赖。                  |                                                                              |
| `--only-projects`         | 仅显示项目软件包。                |                                                                              |
| `--find-by <finder_name>` | 使用 finder 函数。               |                                                                              |
| `-r, --recursive`         | 列出所有 workspace 中的依赖。     |                                                                              |
| `--filter <pattern>`      | 按模式选择 workspace。            | 可重复使用。                                                                 |
| `-g, --global`            | 列出全局软件包。                  | 需要全局 CLI。使用[全局软件包存储区](./global-packages)。                     |

## 兼容性

以下命令介绍项目操作。全局模式请参见[选项](#options)。

- **npm:** `npm list`.
- **pnpm:** `pnpm list`.
- **经典版 Yarn：** `yarn list`。
- **现代版 Yarn：** 没有对应命令。会警告并成功退出，不执行操作。
- **Bun：** `bun pm ls`。

| 选项                       | npm             | pnpm             | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注                                                                |
| ------------------------- | --------------- | ---------------- | ------------ | ----------- | --- | ----------------------------------------------------------------- |
| `--depth <depth>`         | 支持              | 支持              | 支持           | 不支持       | 不支持 |                                                                    |
| `--json`                  | 支持              | 支持              | 支持           | 不支持       | 不支持 |                                                                    |
| `--long`                  | 支持              | 支持              | 不支持         | 不支持       | 不支持 |                                                                    |
| `--parseable`             | 支持              | 支持              | 不支持         | 不支持       | 不支持 |                                                                    |
| `-P, --prod`              | 支持              | 支持              | 支持           | 不支持       | 不支持 | npm 6 使用 `--production`，该选项也会排除 peer 依赖。               |
| `-D, --dev`               | 支持              | 支持              | 支持           | 不支持       | 不支持 |                                                                    |
| `--no-optional`           | 7 或更高版本      | 支持              | 不支持         | 不支持       | 不支持 |                                                                    |
| `--exclude-peers`         | 7 或更高版本      | 支持              | 不支持         | 不支持       | 不支持 |                                                                    |
| `--only-projects`         | 不支持            | 支持              | 不支持         | 不支持       | 不支持 |                                                                    |
| `--find-by <finder_name>` | 不支持            | 10.16.0 或更高版本 | 不支持        | 不支持       | 不支持 |                                                                    |
| `-r, --recursive`         | 7.14.0 或更高版本 | 支持              | 不支持         | 不支持       | 不支持 |                                                                    |
| `--filter <pattern>`      | 7.14.0 或更高版本 | 支持              | 不支持         | 不支持       | 不支持 |                                                                    |
| `-g, --global`            | 支持              | 支持              | 支持           | 支持         | 支持   |                                                                    |

这些结果描述的是已安装的软件包，而不是 Vite+ 捆绑的工具。使用 `vp toolchain [tool]` 查看捆绑的 Vite、Rolldown、Oxc 和其他工具版本。

## 原生选项

原生选项请参阅 [npm ls](https://docs.npmjs.com/cli/v11/commands/npm-ls)、[pnpm list](https://pnpm.io/cli/list)、[Yarn Classic list](https://classic.yarnpkg.com/en/docs/cli/list) 和 [Bun pm ls](https://bun.com/docs/pm/cli/pm)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
