# vp pm logout

退出软件包 registry 登录。

```bash
vp pm logout
vp pm logout --scope @my-org
```

## 选项

| 选项                | 说明                  | 备注  |
| ------------------ | --------------------- | ----- |
| `--registry <url>` | 选择 registry。       |       |
| `--scope <scope>`  | 登出的 scope。        |       |

## 兼容性

- **npm:** `npm logout`.
- **pnpm：** 11 或更高版本使用 `pnpm logout`。较早版本会回退到 `npm logout`。
- **经典版 Yarn：** `yarn logout`。
- **现代版 Yarn：** `yarn npm logout`。
- **Bun：** 回退到 `npm logout`。

| 选项                | npm | pnpm      | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注                                       |
| ------------------ | --- | --------- | ------------ | ----------- | --- | ---------------------------------------- |
| `--registry <url>` | 支持 | 支持       | 不支持        | 不支持       | 支持 | 在 Yarn 设置中配置 registry。             |
| `--scope <scope>`  | 支持 | 11 以前不支持 | 不支持      | 支持         | 支持 |                                          |

凭据移除和 token 失效行为遵循原生包管理器与 registry。pnpm 原生 logout 不会运行 npm logout，也不会执行额外的凭据清理。使用 [login](./login) 重新登录。

## 原生选项

原生选项请参阅 [npm logout](https://docs.npmjs.com/cli/v11/commands/npm-logout)、[pnpm logout](https://pnpm.io/cli/logout)、[Yarn npm logout](https://yarnpkg.com/cli/npm/logout) 和 [Yarn Classic logout](https://classic.yarnpkg.com/en/docs/cli/logout)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
