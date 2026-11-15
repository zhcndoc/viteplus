# vp outdated

检查哪些依赖有较新版本可用。

```bash
vp outdated
vp outdated react
vp outdated --format json
vp outdated -g
```

## 选项

| 选项                            | 说明                                                | 备注                                                                           |
| ------------------------------ | --------------------------------------------------- | ---------------------------------------------------------------------------- |
| `--long`                       | 显示扩展信息。                                      |                                                                              |
| `--format <table\|list\|json>` | 选择输出格式。                                      |                                                                              |
| `-r, --recursive`              | 递归检查所有 workspace。                            |                                                                              |
| `--filter <pattern>`           | 按模式选择 workspace。                              | 可重复使用。                                                                 |
| `-w, --workspace-root`         | 包含 workspace 根目录。                             |                                                                              |
| `-P, --prod`                   | 仅检查生产和可选依赖。                              |                                                                              |
| `-D, --dev`                    | 包含开发依赖。                                      |                                                                              |
| `--no-optional`                | 排除可选依赖。                                      |                                                                              |
| `--compatible`                 | 仅显示满足兼容范围的版本。                          |                                                                              |
| `--sort-by <field>`            | 按字段排序结果。                                    |                                                                              |
| `-g, --global`                 | 检查全局安装的软件包。                              | 需要全局 CLI。使用[全局软件包存储区](./global-packages)。                     |
| `--concurrency <number>`       | 并行检查的全局软件包数量。                          | 需要 `--global`。必须为正整数。                                              |

## 兼容性

以下命令介绍项目操作。全局模式请参见[选项](#options)。

- **npm:** `npm outdated`.
- **pnpm:** `pnpm outdated`.
- **经典版 Yarn：** `yarn outdated`。
- **现代版 Yarn：** 可改用 `yarn upgrade-interactive`。
- **Bun：** `bun outdated`。

| 选项                            | npm               | pnpm              | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注                                                                        |
| ------------------------------ | ----------------- | ----------------- | ------------ | ----------- | --- | ------------------------------------------------------------------------- |
| `--long`                       | 支持                | 支持                | 不支持        | 不支持       | 不支持 |                                                                           |
| `--format <table\|list\|json>` | table、list、json | table、list、json | table、json  | 不支持       | 不支持 |                                                                           |
| `-r, --recursive`              | 7.14.0 或更高版本  | 支持                | 不支持        | 不支持       | 支持   | npm 使用 `--workspaces` 检查 workspace，不检查传递依赖。                    |
| `--filter <pattern>`           | 7.14.0 或更高版本  | 支持                | 不支持        | 不支持       | 支持   |                                                                           |
| `-w, --workspace-root`         | 8.1.0 或更高版本   | 支持                | 不支持        | 不支持       | 不支持 |                                                                           |
| `-P, --prod`                   | 7 或更高版本       | 支持                | 不支持        | 不支持       | 支持   |                                                                           |
| `-D, --dev`                    | 支持                | 支持                | 不支持        | 不支持       | 不支持 |                                                                           |
| `--no-optional`                | 7 或更高版本       | 支持                | 不支持        | 不支持       | 支持   |                                                                           |
| `--compatible`                 | 不支持              | 支持                | 不支持        | 不支持       | 不支持 |                                                                           |
| `--sort-by <field>`            | 不支持              | 支持                | 不支持        | 不支持       | 不支持 |                                                                           |
| `-g, --global`                 | 支持                | 支持                | 支持          | 支持         | 支持   |                                                                           |
| `--concurrency <number>`       | 支持                | 支持                | 支持          | 支持         | 支持   |                                                                           |

现代版 Yarn 不会转发位置参数中的软件包名称。其交互式更新器可能会更改依赖，与只读的过期依赖查询不同。

原生命令的输出和退出码各不相同。非零退出码可能表示存在过期依赖，而不是查询 registry 失败。

## 原生选项

原生选项请参阅 [npm outdated](https://docs.npmjs.com/cli/v11/commands/npm-outdated)、[pnpm outdated](https://pnpm.io/cli/outdated)、[Yarn upgrade-interactive](https://yarnpkg.com/cli/upgrade-interactive)、[Yarn Classic outdated](https://classic.yarnpkg.com/en/docs/cli/outdated) 和 [Bun outdated](https://bun.com/docs/pm/cli/outdated)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
