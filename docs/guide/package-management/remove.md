# vp remove

从项目中移除依赖。别名：`vp rm`、`vp un` 和 `vp uninstall`。

```bash
vp remove react
vp remove --filter web react
vp remove -g --dry-run typescript
```

## 选项

| 选项                    | 说明                                                       | 备注                                                                           |
| ---------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `-D, --save-dev`       | Remove from devDependencies.                             |                                                                              |
| `-O, --save-optional`  | Remove from optionalDependencies.                        |                                                                              |
| `-P, --save-prod`      | Remove from dependencies.                                |                                                                              |
| `--filter <pattern>`   | Select workspaces by pattern.                            | Can be repeated.                                                             |
| `-w, --workspace-root` | Remove from workspace root.                              |                                                                              |
| `-r, --recursive`      | Remove recursively from all workspace packages.          |                                                                              |
| `-g, --global`         | Remove global packages.                                  | Requires the global CLI. Uses the [global package store](./global-packages). |
| `--dry-run`            | Preview what would be removed without actually removing. | Requires --global.                                                           |

## 兼容性

以下命令介绍项目操作。全局模式请参见[选项](#options)。

- **npm：** `npm uninstall`。
- **pnpm：** `pnpm remove`。
- **经典版 Yarn：** `yarn remove`。
- **现代版 Yarn：** `yarn remove`。
- **Bun：** `bun remove`。

| 选项                    | npm             | pnpm | 经典版 Yarn   | 现代版 Yarn  | Bun          | 备注                               |
| ---------------------- | --------------- | ---- | ------------ | ----------- | ------------ | -------------------------------- |
| `-D, --save-dev`       | 支持              | 支持 | 不支持        | 不支持       | 不支持        |                                  |
| `-O, --save-optional`  | 支持              | 支持 | 不支持        | 不支持       | 不支持        |                                  |
| `-P, --save-prod`      | 支持              | 支持 | 不支持        | 不支持       | 不支持        |                                  |
| `--filter <pattern>`   | 7.14.0 或更高版本 | 支持 | 单一过滤条件  | 支持         | 1.4 或更高版本 |                                 |
| `-w, --workspace-root` | 8.1.0 或更高版本  | 支持 | 不支持        | 不支持       | 不支持        |                                  |
| `-r, --recursive`      | 8.1.0 或更高版本  | 支持 | 不支持        | 支持         | 不支持        | npm 会包含 workspace 根目录。    |
| `-g, --global`         | 支持              | 支持 | 支持          | 支持         | 支持          |                                  |
| `--dry-run`            | 支持              | 支持 | 支持          | 支持         | 支持          |                                  |

## 原生选项

原生选项请参阅 [npm uninstall](https://docs.npmjs.com/cli/v11/commands/npm-uninstall)、[pnpm remove](https://pnpm.io/cli/remove)、[Yarn remove](https://yarnpkg.com/cli/remove)、[Yarn Classic remove](https://classic.yarnpkg.com/en/docs/cli/remove) 和 [Bun remove](https://bun.com/docs/pm/cli/remove)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
