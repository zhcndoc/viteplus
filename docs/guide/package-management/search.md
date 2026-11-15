# vp pm search

搜索软件包 registry。

```bash
vp pm search vite plugin
vp pm search typescript --json
```

## 选项

至少需要提供一个搜索词。

| 选项                | 说明                        | 备注                                |
| ------------------ | --------------------------- | --------------------------------- |
| `--json`           | 请求原生 JSON 输出。         | 输出保留原生 schema。             |
| `--long`           | 显示扩展信息。               |                                   |
| `--registry <url>` | 选择 registry。             |                                   |

## 兼容性

- **npm:** `npm search`.
- **pnpm：** 11 或更高版本使用 `pnpm search`。较早版本会回退到 `npm search`。
- **经典版 Yarn：** 回退到 `npm search`。
- **现代版 Yarn：** 回退到 `npm search`。
- **Bun：** 回退到 `npm search`。

| 选项                | npm | pnpm      | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注  |
| ------------------ | --- | --------- | ------------ | ----------- | --- | ----- |
| `--json`           | 支持 | 支持       | 支持          | 支持         | 支持 |       |
| `--long`           | 支持 | 11 以前不支持 | 支持        | 支持         | 支持 |       |
| `--registry <url>` | 支持 | 支持       | 支持          | 支持         | 支持 |       |

registry 设置和输出遵循实际运行的命令。

## 原生选项

原生选项请参阅 [npm search](https://docs.npmjs.com/cli/v11/commands/npm-search) 和 [pnpm search](https://pnpm.io/cli/search)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
