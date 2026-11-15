# vp pm version

运行包管理器的 version 命令。此命令管理软件包版本，不管理 `vp --version` 显示的 Vite+ 版本。

```bash
vp pm version patch
vp pm version 2.0.0
```

## 选项

提供版本号或 `major`、`minor`、`patch` 等递增策略。省略后会保留包管理器的原生行为，可能显示信息、提示用户或要求提供策略。

| 选项      | 说明                        | 备注                                |
| -------- | --------------------------- | --------------------------------- |
| `--json` | 请求原生 JSON 输出。         | 输出保留原生 schema。             |

## 兼容性

- **npm:** `npm version`.
- **pnpm:** `pnpm version`.
- **经典版 Yarn：** `yarn version`。
- **现代版 Yarn：** `yarn version`。
- **Bun：** 1.2.18 或更高版本使用 `bun pm version`。较早版本会在调用命令前发出警告。

| 选项      | npm | pnpm | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注  |
| -------- | --- | ---- | ------------ | ----------- | --- | ----- |
| `--json` | 支持 | 支持  | 支持          | 不支持       | 不支持 |     |

经典版 Yarn 会将递增策略转换为 `--patch` 等标志。显式版本会转换为 `--new-version <version>`。其他包管理器保留其原生操作数语法。

version 命令可能会修改清单和 lockfile，也可能创建 Git 提交或标签。Vite+ 会保留所选包管理器的行为。

## 原生选项

原生选项请参阅 [npm version](https://docs.npmjs.com/cli/v11/commands/npm-version)、[pnpm version](https://pnpm.io/cli/version)、[Yarn version](https://yarnpkg.com/cli/version)、[Yarn Classic version](https://classic.yarnpkg.com/en/docs/cli/version) 和 [Bun pm version](https://bun.com/docs/pm/cli/pm)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
