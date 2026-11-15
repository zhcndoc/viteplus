# vp pm prune

移除不需要的已安装软件包。

```bash
vp pm prune
vp pm prune --prod
```

## 选项

| 选项             | 说明                          | 备注  |
| --------------- | ----------------------------- | ----- |
| `--prod`        | 移除 devDependencies。        |       |
| `--no-optional` | 移除可选依赖。                |       |

## 兼容性

- **npm:** `npm prune`.
- **pnpm:** `pnpm prune`.
- **经典版 Yarn：** 没有对应命令。会警告并成功退出，不执行操作。
- **现代版 Yarn：** 没有对应命令。会警告并成功退出，不执行操作。
- **Bun：** 1.4 或更高版本使用 `bun prune`。较早版本会警告并跳过。

| 选项             | npm        | pnpm | 经典版 Yarn   | 现代版 Yarn  | Bun          | 备注  |
| --------------- | ---------- | ---- | ------------ | ----------- | ------------ | ----- |
| `--prod`        | 支持        | 支持  | 不支持        | 不支持       | 1.4 或更高版本 |     |
| `--no-optional` | 7 或更高版本 | 支持  | 不支持       | 不支持       | 1.4 或更高版本 |     |

npm 7 及更高版本会将选择标志转换为 `--omit=dev` 和 `--omit=optional`。npm 6 会将 `--prod` 转换为 `--production`，且不支持 `--no-optional`。Bun 会将 `--prod` 转换为 `--production`。Yarn 和较旧版本的 Bun 会在安装过程中移除多余软件包，而不提供原生 prune 命令。

## 原生选项

原生选项请参阅 [npm prune](https://docs.npmjs.com/cli/v11/commands/npm-prune)、[pnpm prune](https://pnpm.io/cli/prune) 和 [Bun prune](https://bun.com/docs/pm/cli/prune)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
