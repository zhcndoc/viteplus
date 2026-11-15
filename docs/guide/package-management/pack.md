# vp pm pack

从项目创建软件包 tarball。这不同于使用 tsdown 构建库的 [`vp pack`](/guide/pack)。

```bash
vp pm pack
vp pm pack --pack-destination ./artifacts
```

## 选项

| 选项                                     | 说明                                               | 备注                                |
| --------------------------------------- | -------------------------------------------------- | --------------------------------- |
| `-r, --recursive`                       | 打包所有 workspace 软件包。                       |                                   |
| `--filter <pattern>`                    | 按模式选择 workspace。                            | 可重复使用。                      |
| `--out <out>`                           | 选择 tarball 输出路径。                            |                                   |
| `--pack-destination <pack-destination>` | 选择 tarball 输出目录。                            |                                   |
| `--pack-gzip-level <pack-gzip-level>`   | 请求使用 0 到 9 的 gzip 压缩级别。                 |                                   |
| `--json`                                | 请求原生 JSON 输出。                              | 输出保留原生 schema。             |

## 兼容性

- **npm:** `npm pack`.
- **pnpm:** `pnpm pack`.
- **经典版 Yarn：** `yarn pack`。
- **现代版 Yarn：** `yarn pack`。
- **Bun：** `bun pm pack`。

| 选项                                     | npm             | pnpm             | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注                                   |
| --------------------------------------- | --------------- | ---------------- | ------------ | ----------- | --- | ------------------------------------ |
| `-r, --recursive`                       | 7.9.0 或更高版本 | 10.11.0 或更高版本 | 不支持      | 支持         | 不支持 |                                  |
| `--filter <pattern>`                    | 7.9.0 或更高版本 | 10.11.0 或更高版本 | 不支持      | 支持         | 不支持 |                                  |
| `--out <out>`                           | 不支持            | 10.0.0 或更高版本 | 支持        | 支持         | 支持   |                                  |
| `--pack-destination <pack-destination>` | 7.18.0 或更高版本 | 支持              | 不支持      | 不支持       | 支持   | Vite+ 会为 npm 创建目录。         |
| `--pack-gzip-level <pack-gzip-level>`   | 不支持            | 8.3.0 或更高版本  | 不支持      | 不支持       | 支持   |                                  |
| `--json`                                | 支持              | 9.14.0 或更高版本 | 支持        | 支持         | 不支持 |                                  |

## 原生选项

原生选项请参阅 [npm pack](https://docs.npmjs.com/cli/v11/commands/npm-pack)、[pnpm pack](https://pnpm.io/cli/pack)、[Yarn pack](https://yarnpkg.com/cli/pack)、[Yarn Classic pack](https://classic.yarnpkg.com/en/docs/cli/pack) 和 [Bun pm pack](https://bun.com/docs/pm/cli/pm)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
