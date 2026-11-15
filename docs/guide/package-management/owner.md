# vp pm owner

管理软件包所有者。别名：`vp pm author`。

```bash
vp pm owner list my-package
vp pm owner add alice my-package
vp pm owner rm alice my-package
```

## 选项

- `list <package>` 列出所有者。别名：`ls`。
- `add <user> <package>` 授予所有权。
- `rm <user> <package>` 移除所有权。

每个子命令都接受 `--otp <code>`。这些子命令不接受 `--` 之后的其他原生参数。所有权变更会影响 registry 权限，不会修改本地清单的 author 字段。

### `list`

| 选项           | 说明                        | 备注  |
| ------------- | --------------------------- | ----- |
| `--otp <otp>` | 提供一次性密码。             |       |

### `add`

| 选项           | 说明                        | 备注  |
| ------------- | --------------------------- | ----- |
| `--otp <otp>` | 提供一次性密码。             |       |

### `rm`

| 选项           | 说明                        | 备注  |
| ------------- | --------------------------- | ----- |
| `--otp <otp>` | 提供一次性密码。             |       |

## 兼容性

### `list`

- **npm:** `npm owner list`.
- **pnpm：** 11.1 或更高版本使用 `pnpm owner list`。较早版本会回退到 `npm owner list`。
- **经典版 Yarn：** `yarn owner list`。
- **现代版 Yarn：** 回退到 `npm owner list`。
- **Bun：** 回退到 `npm owner list`。

| 选项           | npm | pnpm | 经典版 Yarn      | 现代版 Yarn  | Bun | 备注  |
| ------------- | --- | ---- | --------------- | ----------- | --- | ----- |
| `--otp <otp>` | 支持 | 支持  | 1.12.1 或更高版本 | 支持       | 支持 |       |

### `add`

- **npm:** `npm owner add`.
- **pnpm：** 11.1 或更高版本使用 `pnpm owner add`。较早版本会回退到 `npm owner add`。pnpm 原生命令将软件包放在用户之前。
- **经典版 Yarn：** `yarn owner add`。用户仍放在软件包之前。
- **现代版 Yarn：** 回退到 `npm owner add`。
- **Bun：** 回退到 `npm owner add`。

| 选项           | npm | pnpm | 经典版 Yarn      | 现代版 Yarn  | Bun | 备注  |
| ------------- | --- | ---- | --------------- | ----------- | --- | ----- |
| `--otp <otp>` | 支持 | 支持  | 1.12.1 或更高版本 | 支持       | 支持 |       |

### `rm`

- **npm:** `npm owner rm`.
- **pnpm：** 11.1 或更高版本使用 `pnpm owner rm`。较早版本会回退到 `npm owner rm`。pnpm 原生命令将软件包放在用户之前。
- **经典版 Yarn：** `yarn owner remove`。用户仍放在软件包之前。由于上游错误，在 Yarn Classic 1.22.22 中移除操作可能失败。Vite+ 不会改用 npm 重试。
- **现代版 Yarn：** 回退到 `npm owner rm`。
- **Bun：** 回退到 `npm owner rm`。

| 选项           | npm | pnpm | 经典版 Yarn      | 现代版 Yarn  | Bun | 备注  |
| ------------- | --- | ---- | --------------- | ----------- | --- | ----- |
| `--otp <otp>` | 支持 | 支持  | 1.12.1 或更高版本 | 支持       | 支持 |       |

registry 凭据与授权遵循实际运行的命令。

## 原生选项

registry 要求和原生选项请参阅 [npm owner](https://docs.npmjs.com/cli/v11/commands/npm-owner)、[pnpm owner](https://pnpm.io/cli/owner) 和 [Yarn Classic owner](https://classic.yarnpkg.com/en/docs/cli/owner)。上文未列出的选项必须直接通过原生命令使用。
