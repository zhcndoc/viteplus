# vp why

说明某个依赖为何被安装。别名：`vp explain`。

```bash
vp why react
vp why react --json
vp why react --filter web
```

## 选项

| 选项                       | 说明                                            | 备注                                |
| ------------------------- | ----------------------------------------------- | --------------------------------- |
| `--json`                  | 请求原生 JSON 输出。                            | 输出保留原生 schema。             |
| `--long`                  | 显示扩展信息。                                  |                                   |
| `--parseable`             | 显示便于解析的输出。                            |                                   |
| `-r, --recursive`         | 递归检查所有 workspace。                        |                                   |
| `--filter <pattern>`      | 按模式选择 workspace。                          | 可重复使用。                      |
| `-w, --workspace-root`    | 在 workspace 根目录中检查。                     |                                   |
| `-P, --prod`              | 仅检查生产依赖。                                |                                   |
| `-D, --dev`               | 仅检查开发依赖。                                |                                   |
| `--depth <depth>`         | 限制依赖树深度。                                |                                   |
| `--no-optional`           | 排除可选依赖。                                  |                                   |
| `--exclude-peers`         | 排除 peer 依赖。                                |                                   |
| `--find-by <finder_name>` | 使用 `.pnpmfile.cjs` 中定义的 finder 函数。      |                                   |

## 兼容性

- **npm:** `npm explain`.
- **pnpm:** `pnpm why`.
- **经典版 Yarn：** `yarn why`。提供多个软件包名称时会警告，并且只检查第一个。
- **现代版 Yarn：** `yarn why`。提供多个软件包名称时会警告，并且只检查第一个。
- **Bun：** `bun why`。

| 选项                       | npm             | pnpm             | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注                                     |
| ------------------------- | --------------- | ---------------- | ------------ | ----------- | --- | -------------------------------------- |
| `--json`                  | 支持              | 支持              | 支持           | 支持         | 不支持 |                                    |
| `--long`                  | 不支持            | 支持              | 不支持         | 不支持       | 不支持 |                                    |
| `--parseable`             | 不支持            | 支持              | 不支持         | 不支持       | 不支持 |                                    |
| `-r, --recursive`         | 7.14.0 或更高版本 | 支持              | 不支持         | 支持         | 不支持 |                                    |
| `--filter <pattern>`      | 7.14.0 或更高版本 | 支持              | 不支持         | 不支持       | 不支持 |                                    |
| `-w, --workspace-root`    | 不支持            | 支持              | 不支持         | 不支持       | 不支持 |                                    |
| `-P, --prod`              | 不支持            | 支持              | 不支持         | 不支持       | 不支持 |                                    |
| `-D, --dev`               | 不支持            | 支持              | 不支持         | 不支持       | 不支持 |                                    |
| `--depth <depth>`         | 不支持            | 支持              | 不支持         | 不支持       | 支持   |                                    |
| `--no-optional`           | 不支持            | 支持              | 不支持         | 不支持       | 不支持 |                                    |
| `--exclude-peers`         | 不支持            | 支持              | 不支持         | 支持         | 不支持 | 现代版 Yarn 默认包含 peer 依赖。    |
| `--find-by <finder_name>` | 不支持            | 10.16.0 或更高版本 | 不支持        | 不支持       | 不支持 |                                    |

依赖关系图不包含 Vite+ 捆绑或编译的工具。为便于阅读，当 Vite+ 也提供所查软件包时会显示提示。使用 `vp toolchain [tool]` 查看捆绑的工具。

## 原生选项

原生选项请参阅 [npm explain](https://docs.npmjs.com/cli/v11/commands/npm-explain)、[pnpm why](https://pnpm.io/cli/why)、[Yarn why](https://yarnpkg.com/cli/why)、[Yarn Classic why](https://classic.yarnpkg.com/en/docs/cli/why) 和 [Bun why](https://bun.com/docs/pm/cli/why)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
