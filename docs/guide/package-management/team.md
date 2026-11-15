# vp pm team

管理 registry 组织团队及其成员。

```bash
vp pm team list my-org
vp pm team list my-org:developers --json
vp pm team create my-org:developers
vp pm team add my-org:developers alice
vp pm team rm my-org:developers alice
vp pm team destroy my-org:developers
```

## 选项

- `create <scope:team>` 创建团队。
- `destroy <scope:team>` 删除团队。
- `add <scope:team> <user>` 添加成员。
- `rm <scope:team> <user>` 移除成员。别名：`remove`。
- `list <scope[:team]>` 列出组织的团队或团队成员。别名：`ls`。

所有子命令都接受 `--registry <url>`、`--otp <code>` 和 `--json`。JSON 输出保留原生包管理器的 schema。已登录账户可执行哪些更改由 registry 权限决定。

### `create`

| 选项                | 说明                        | 备注                                |
| ------------------ | --------------------------- | --------------------------------- |
| `--otp <otp>`      | 提供一次性密码。             |                                   |
| `--json`           | 请求原生 JSON 输出。         | 输出保留原生 schema。             |
| `--registry <url>` | 选择 registry。             |                                   |

### `destroy`

| 选项                | 说明                        | 备注                                |
| ------------------ | --------------------------- | --------------------------------- |
| `--otp <otp>`      | 提供一次性密码。             |                                   |
| `--json`           | 请求原生 JSON 输出。         | 输出保留原生 schema。             |
| `--registry <url>` | 选择 registry。             |                                   |

### `add`

| 选项                | 说明                        | 备注                                |
| ------------------ | --------------------------- | --------------------------------- |
| `--otp <otp>`      | 提供一次性密码。             |                                   |
| `--json`           | 请求原生 JSON 输出。         | 输出保留原生 schema。             |
| `--registry <url>` | 选择 registry。             |                                   |

### `rm`

| 选项                | 说明                        | 备注                                |
| ------------------ | --------------------------- | --------------------------------- |
| `--otp <otp>`      | 提供一次性密码。             |                                   |
| `--json`           | 请求原生 JSON 输出。         | 输出保留原生 schema。             |
| `--registry <url>` | 选择 registry。             |                                   |

### `list`

| 选项                | 说明                        | 备注                                |
| ------------------ | --------------------------- | --------------------------------- |
| `--otp <otp>`      | 提供一次性密码。             |                                   |
| `--json`           | 请求原生 JSON 输出。         | 输出保留原生 schema。             |
| `--registry <url>` | 选择 registry。             |                                   |

## 兼容性

回退到 npm 时会发出警告。

### `create`

- **npm:** `npm team create`.
- **pnpm：** 11.13.0 或更高版本使用 `pnpm team create`。较早版本会回退到 `npm team create`。
- **经典版 Yarn：** `yarn team create`。
- **现代版 Yarn：** 没有对应命令。会警告并成功退出，不执行操作。
- **Bun：** 回退到 `npm team create`。

| 选项                | npm | pnpm | 经典版 Yarn      | 现代版 Yarn  | Bun | 备注                                                                          |
| ------------------ | --- | ---- | --------------- | ----------- | --- | --------------------------------------------------------------------------- |
| `--otp <otp>`      | 支持 | 支持  | 1.12.1 或更高版本 | 不支持      | 支持 | 较旧的经典版 Yarn 可能忽略 `--otp`。Vite+ 不会在此处检查其版本。             |
| `--json`           | 支持 | 支持  | 支持             | 不支持      | 支持 |                                                                             |
| `--registry <url>` | 支持 | 支持  | 支持             | 不支持      | 支持 |                                                                             |

### `destroy`

- **npm:** `npm team destroy`.
- **pnpm：** 11.13.0 或更高版本使用 `pnpm team destroy`。较早版本会回退到 `npm team destroy`。
- **经典版 Yarn：** `yarn team destroy`。
- **现代版 Yarn：** 没有对应命令。会警告并成功退出，不执行操作。
- **Bun：** 回退到 `npm team destroy`。

| 选项                | npm | pnpm | 经典版 Yarn      | 现代版 Yarn  | Bun | 备注                                                                          |
| ------------------ | --- | ---- | --------------- | ----------- | --- | --------------------------------------------------------------------------- |
| `--otp <otp>`      | 支持 | 支持  | 1.12.1 或更高版本 | 不支持      | 支持 | 较旧的经典版 Yarn 可能忽略 `--otp`。Vite+ 不会在此处检查其版本。             |
| `--json`           | 支持 | 支持  | 支持             | 不支持      | 支持 |                                                                             |
| `--registry <url>` | 支持 | 支持  | 支持             | 不支持      | 支持 |                                                                             |

### `add`

- **npm:** `npm team add`.
- **pnpm：** 11.13.0 或更高版本使用 `pnpm team add`。较早版本会回退到 `npm team add`。
- **经典版 Yarn：** `yarn team add`。
- **现代版 Yarn：** 没有对应命令。会警告并成功退出，不执行操作。
- **Bun：** 回退到 `npm team add`。

| 选项                | npm | pnpm | 经典版 Yarn      | 现代版 Yarn  | Bun | 备注                                                                          |
| ------------------ | --- | ---- | --------------- | ----------- | --- | --------------------------------------------------------------------------- |
| `--otp <otp>`      | 支持 | 支持  | 1.12.1 或更高版本 | 不支持      | 支持 | 较旧的经典版 Yarn 可能忽略 `--otp`。Vite+ 不会在此处检查其版本。             |
| `--json`           | 支持 | 支持  | 支持             | 不支持      | 支持 |                                                                             |
| `--registry <url>` | 支持 | 支持  | 支持             | 不支持      | 支持 |                                                                             |

### `rm`

- **npm:** `npm team rm`.
- **pnpm：** 11.13.0 或更高版本使用 `pnpm team rm`。较早版本会回退到 `npm team rm`。
- **经典版 Yarn：** `yarn team remove`。
- **现代版 Yarn：** 没有对应命令。会警告并成功退出，不执行操作。
- **Bun：** 回退到 `npm team rm`。

| 选项                | npm | pnpm | 经典版 Yarn      | 现代版 Yarn  | Bun | 备注                                                                          |
| ------------------ | --- | ---- | --------------- | ----------- | --- | --------------------------------------------------------------------------- |
| `--otp <otp>`      | 支持 | 支持  | 1.12.1 或更高版本 | 不支持      | 支持 | 较旧的经典版 Yarn 可能忽略 `--otp`。Vite+ 不会在此处检查其版本。             |
| `--json`           | 支持 | 支持  | 支持             | 不支持      | 支持 |                                                                             |
| `--registry <url>` | 支持 | 支持  | 支持             | 不支持      | 支持 |                                                                             |

### `list`

- **npm:** `npm team ls`.
- **pnpm：** 11.13.0 或更高版本使用 `pnpm team ls`。较早版本会回退到 `npm team ls`。
- **经典版 Yarn：** `yarn team list`。
- **现代版 Yarn：** 没有对应命令。会警告并成功退出，不执行操作。
- **Bun：** 回退到 `npm team ls`。

| 选项                | npm | pnpm | 经典版 Yarn      | 现代版 Yarn  | Bun | 备注                                                                          |
| ------------------ | --- | ---- | --------------- | ----------- | --- | --------------------------------------------------------------------------- |
| `--otp <otp>`      | 支持 | 支持  | 1.12.1 或更高版本 | 不支持      | 支持 | 较旧的经典版 Yarn 可能忽略 `--otp`。Vite+ 不会在此处检查其版本。             |
| `--json`           | 支持 | 支持  | 支持             | 不支持      | 支持 |                                                                             |
| `--registry <url>` | 支持 | 支持  | 支持             | 不支持      | 支持 |                                                                             |

## 原生选项

原生选项请参阅 [npm team](https://docs.npmjs.com/cli/v11/commands/npm-team)、[pnpm team](https://pnpm.io/cli/team) 和 [Yarn Classic team](https://classic.yarnpkg.com/en/docs/cli/team)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
