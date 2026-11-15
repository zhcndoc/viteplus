# vp pm login

登录软件包 registry。别名：`vp pm adduser`。

```bash
vp pm login
vp pm login --scope @my-org
```

## 选项

| 选项                | 说明                 | 备注  |
| ------------------ | -------------------- | ----- |
| `--registry <url>` | 选择 registry。      |       |
| `--scope <scope>`  | 登录所用的 scope。   |       |

## 兼容性

- **npm:** `npm login`.
- **pnpm：** 11 或更高版本使用 `pnpm login`。较早版本会回退到 `npm login`。
- **经典版 Yarn：** `yarn login`。
- **现代版 Yarn：** `yarn npm login`。
- **Bun：** 回退到 `npm login`。

| 选项                | npm | pnpm                       | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注                                       |
| ------------------ | --- | -------------------------- | ------------ | ----------- | --- | ---------------------------------------- |
| `--registry <url>` | 支持 | 支持                        | 不支持        | 不支持       | 支持 | 在 Yarn 设置中配置 registry。             |
| `--scope <scope>`  | 支持 | 11 以前或 11.2 及更高版本支持 | 不支持      | 支持         | 支持 |                                          |

身份验证提示和凭据存储由原生命令负责。pnpm login 不会将凭据复制到 npm，因此仍使用 npm 的命令可能需要单独登录。使用 [whoami](./whoami) 检查当前账户，使用 [logout](./logout) 结束身份验证。

## 原生选项

原生选项请参阅 [npm login](https://docs.npmjs.com/cli/v11/commands/npm-login)、[pnpm login](https://pnpm.io/cli/login)、[Yarn npm login](https://yarnpkg.com/cli/npm/login) 和 [Yarn Classic login](https://classic.yarnpkg.com/en/docs/cli/login)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
