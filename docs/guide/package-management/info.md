# vp info

从 registry 读取软件包元数据。别名：`vp view`、`vp show`、`vp pm view`、`vp pm info` 和 `vp pm show`。

```bash
vp info react
vp info react versions --json
vp info react@19 dist.tarball
```

## 选项

提供软件包名称和可选版本，后面还可以指定字段名称。

| 选项      | 说明                        | 备注                                |
| -------- | --------------------------- | --------------------------------- |
| `--json` | 请求原生 JSON 输出。         | 输出保留原生 schema。             |

## 兼容性

- **npm:** `npm view`.
- **pnpm:** `pnpm view`.
- **经典版 Yarn：** `yarn info`。
- **现代版 Yarn：** `yarn npm info`。请求的字段会作为 `--fields` 传递。
- **Bun：** `bun info`。

| 选项      | npm | pnpm | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注  |
| -------- | --- | ---- | ------------ | ----------- | --- | ----- |
| `--json` | 支持 | 支持  | 支持          | 支持         | 支持 |       |

此命令查询 registry 元数据，而非本地依赖树。请使用 [list](./list) 或 [why](./why) 查看已安装的软件包。

## 原生选项

原生选项请参阅 [npm view](https://docs.npmjs.com/cli/v11/commands/npm-view)、[pnpm view](https://pnpm.io/cli/view)、[Yarn npm info](https://yarnpkg.com/cli/npm/info)、[Yarn Classic info](https://classic.yarnpkg.com/en/docs/cli/info) 和 [Bun info](https://bun.com/docs/pm/cli/info)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
