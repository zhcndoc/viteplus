# vp pm token

管理 registry 身份验证 token。

```bash
vp pm token list
vp pm token list --json
vp pm token revoke <token-id>
```

## 选项

- `list`（也可写作 `ls`）列出 token。支持 `--json` 和 `--registry <url>`。
- `create` 请求创建新 token。支持 `--json`、`--registry <url>`、`--readonly`，以及可重复使用的 `--cidr <range>` 限制。
- `revoke <token-or-id>` 撤销 token。支持 `--registry <url>`。

请将 token 视为机密。撤销时优先使用 token ID，避免将原始 token 写入 shell 历史记录。创建 token 和支持的 token 类型取决于 registry 当前策略及原生包管理器版本；提供 `create` 命令并不代表 registry 允许通过 CLI 创建 token。

### `list`

| 选项                | 说明                        | 备注                                |
| ------------------ | --------------------------- | --------------------------------- |
| `--json`           | 请求原生 JSON 输出。         | 输出保留原生 schema。             |
| `--registry <url>` | 选择 registry。             |                                   |

### `create`

| 选项                | 说明                                  | 备注                                |
| ------------------ | ------------------------------------- | --------------------------------- |
| `--json`           | 请求原生 JSON 输出。                   | 输出保留原生 schema。             |
| `--registry <url>` | 选择 registry。                       |                                   |
| `--cidr <cidr>`    | 限制 token 可用范围的 CIDR 网段。      | 可重复使用。                      |
| `--readonly`       | 创建只读 token。                      |                                   |

### `revoke`

| 选项                | 说明                 | 备注  |
| ------------------ | -------------------- | ----- |
| `--registry <url>` | 选择 registry。      |       |

## 兼容性

### `list`

- **npm:** `npm token list`.
- **pnpm：** 12.13 或更高版本使用 `pnpm token list`。较早版本会回退到 `npm token list`。
- **经典版 Yarn：** 回退到 `npm token list`。
- **现代版 Yarn：** 回退到 `npm token list`。
- **Bun：** 回退到 `npm token list`。

| 选项                | npm | pnpm | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注  |
| ------------------ | --- | ---- | ------------ | ----------- | --- | ----- |
| `--json`           | 支持 | 支持  | 支持          | 支持         | 支持 |       |
| `--registry <url>` | 支持 | 支持  | 支持          | 支持         | 支持 |       |

### `create`

- **npm:** `npm token create`.
- **pnpm：** 12.13 或更高版本使用 `pnpm token create`。较早版本会回退到 `npm token create`。
- **经典版 Yarn：** 回退到 `npm token create`。
- **现代版 Yarn：** 回退到 `npm token create`。
- **Bun：** 回退到 `npm token create`。

| 选项                | npm | pnpm | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注  |
| ------------------ | --- | ---- | ------------ | ----------- | --- | ----- |
| `--json`           | 支持 | 支持  | 支持          | 支持         | 支持 |       |
| `--registry <url>` | 支持 | 支持  | 支持          | 支持         | 支持 |       |
| `--cidr <cidr>`    | 支持 | 支持  | 支持          | 支持         | 支持 |       |
| `--readonly`       | 支持 | 支持  | 支持          | 支持         | 支持 |       |

### `revoke`

- **npm:** `npm token revoke`.
- **pnpm：** 12.13 或更高版本使用 `pnpm token revoke`。较早版本会回退到 `npm token revoke`。
- **经典版 Yarn：** 回退到 `npm token revoke`。
- **现代版 Yarn：** 回退到 `npm token revoke`。
- **Bun：** 回退到 `npm token revoke`。

| 选项                | npm | pnpm | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注  |
| ------------------ | --- | ---- | ------------ | ----------- | --- | ----- |
| `--registry <url>` | 支持 | 支持  | 支持          | 支持         | 支持 |       |

`revoke` 接受一个 token 或 ID。身份验证、密码提示和 token 解析遵循原生命令。Vite+ 不会规范化 token 类型或输出 schema。

## 原生选项

原生选项请参阅 [npm token](https://docs.npmjs.com/cli/v11/commands/npm-token) 和 [pnpm token](https://pnpm.io/cli/token)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
