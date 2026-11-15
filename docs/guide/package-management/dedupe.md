# vp dedupe

使用所选的包管理器减少重复的依赖条目。

```bash
vp dedupe
vp dedupe --check
```

## 选项

| 选项       | 说明                                         | 备注  |
| --------- | ------------------------------------------ | ----- |
| `--check` | Check if deduplication would make changes. |       |

## 兼容性

- **npm：** `npm dedupe`。
- **pnpm：** `pnpm dedupe`。
- **经典版 Yarn：** 回退到 `yarn install`。
- **现代版 Yarn：** `yarn dedupe`。
- **Bun：** 1.4 或更高版本使用 `bun dedupe`。较早版本会回退到 `bun install`。

| 选项       | npm | pnpm | 经典版 Yarn   | 现代版 Yarn  | Bun          | 备注  |
| --------- | --- | ---- | ------------ | ----------- | ------------ | ----- |
| `--check` | 支持 | 支持  | 不支持        | 支持         | 1.4 或更高版本 |     |

回退安装不是只读检查。不支持的 `--check` 请求会在运行回退操作前失败。

## 原生选项

原生选项请参阅 [npm dedupe](https://docs.npmjs.com/cli/v11/commands/npm-dedupe)、[pnpm dedupe](https://pnpm.io/cli/dedupe)、[Yarn dedupe](https://yarnpkg.com/cli/dedupe)、[Yarn Classic install](https://classic.yarnpkg.com/en/docs/cli/install) 和 [Bun dedupe](https://bun.com/docs/pm/cli/dedupe)。Bun 的回退行为请参阅 [Bun install](https://bun.com/docs/pm/cli/install)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
