# vp pm licenses

列出已安装依赖报告的许可证。

```bash
vp pm licenses list
vp pm licenses list --json
```

## 选项

支持的子命令为 `list`，也可写作 `ls`。`--json` 请求包管理器的原生 JSON 输出。Vite+ 不会将输出规范化为统一 schema。

### `list`

| 选项      | 说明                        | 备注                                |
| -------- | --------------------------- | --------------------------------- |
| `--json` | 请求原生 JSON 输出。         | 输出保留原生 schema。             |

## 兼容性

### `list`

- **npm：** 没有对应命令。会警告并成功退出，不执行操作。
- **pnpm：** 7.17.0 或更高版本使用 `pnpm licenses list`。较早版本会警告并跳过。
- **经典版 Yarn：** `yarn licenses list`。
- **现代版 Yarn：** 没有对应命令。会警告并成功退出，不执行操作。
- **Bun：** 1.4.0 或更高版本使用 `bun pm licenses`。较早版本会警告并跳过。

| 选项      | npm | pnpm            | 经典版 Yarn   | 现代版 Yarn  | Bun            | 备注  |
| -------- | --- | --------------- | ------------ | ----------- | -------------- | ----- |
| `--json` | 不支持 | 7.17.0 或更高版本 | 支持         | 不支持       | 1.4.0 或更高版本 |     |

## 原生选项

For example, a pnpm project can use:

```bash
vp pm licenses list -- --prod --long
```

原生选项请参阅 [pnpm licenses](https://pnpm.io/cli/licenses)、[Yarn Classic licenses](https://classic.yarnpkg.com/en/docs/cli/licenses) 和 [Bun pm licenses](https://bun.com/docs/pm/cli/pm)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
