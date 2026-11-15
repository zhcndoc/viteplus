# vp pm stage

使用暂存发布将软件包上传与正式发布分开。CI 作业可以在不使用双重身份验证（2FA）的情况下上传暂存版本，之后由维护者通过可信设备使用 2FA 批准或拒绝。

```bash
vp pm stage publish --dry-run
vp pm stage publish
vp pm stage list
vp pm stage view <stage-id>
vp pm stage download <stage-id>
vp pm stage approve <stage-id>
vp pm stage reject <stage-id>
```

## 选项

使用以下子命令上传、查看、批准或拒绝暂存版本。

### `publish`

上传软件包。可以选择 tarball 或目录作为目标。

| 选项                             | 说明                                         | 备注                                            |
| ------------------------------- | -------------------------------------------- | --------------------------------------------- |
| `--tag <tag>`                   | 发布标签。                                   |                                               |
| `--access <public\|restricted>` | 请求公开或受限的软件包访问权限。              |                                               |
| `--otp <otp>`                   | 提供一次性密码。                             |                                               |
| `--dry-run`                     | 预览操作，不进行暂存。                       |                                               |
| `--json`                        | 请求原生 JSON 输出。                         | 输出保留原生 schema。                         |
| `-r, --recursive`               | 暂存所有可发布的 workspace 软件包。          |                                               |
| `--filter <pattern>`            | 按模式选择 workspace。                       | 可重复使用。                                  |
| `--provenance`                  | 暂存并附加来源证明。                         | 需要兼容的发布环境。                          |
| `--registry <url>`              | 选择 registry。                             |                                               |

### `list`

列出暂存版本。可选提供软件包规格。别名：`ls`。

| 选项                | 说明                        | 备注                                |
| ------------------ | --------------------------- | --------------------------------- |
| `--json`           | 请求原生 JSON 输出。         | 输出保留原生 schema。             |
| `--registry <url>` | 选择 registry。             |                                   |

### `view`

查看暂存版本。需要 stage ID。

| 选项                | 说明                        | 备注                                |
| ------------------ | --------------------------- | --------------------------------- |
| `--json`           | 请求原生 JSON 输出。         | 输出保留原生 schema。             |
| `--registry <url>` | 选择 registry。             |                                   |

### `download`

下载暂存 tarball。需要 stage ID。

| 选项                | 说明                 | 备注  |
| ------------------ | -------------------- | ----- |
| `--registry <url>` | 选择 registry。      |       |

### `approve`

将暂存版本发布到正式 registry。需要 stage ID。

| 选项                | 说明                        | 备注  |
| ------------------ | --------------------------- | ----- |
| `--otp <otp>`      | 提供一次性密码。             |       |
| `--registry <url>` | 选择 registry。             |       |

### `reject`

丢弃暂存版本。需要 stage ID。

| 选项                | 说明                        | 备注  |
| ------------------ | --------------------------- | ----- |
| `--otp <otp>`      | 提供一次性密码。             |       |
| `--registry <url>` | 选择 registry。             |       |

## 兼容性

所有 npm 路径（包括回退路径）都要求 npm 11.15 或更高版本以及 Node.js 22.14 或更高版本。

### `publish`

- **npm：** 11.15 或更高版本使用 `npm stage publish`。较早版本会警告并跳过。
- **pnpm：** 11.3 或更高版本使用 `pnpm stage publish`。较早版本会警告并跳过。
- **经典版 Yarn：** 回退到 `npm stage publish`。
- **现代版 Yarn：** 4.16.0 或更高版本使用 `yarn npm publish --staged`。较早版本会回退到 `npm stage publish`。显式目标会使用 npm 回退路径。
- **Bun：** 回退到 `npm stage publish`。

| 选项                             | npm                     | pnpm | 经典版 Yarn              | 现代版 Yarn                                | Bun                     | 备注                                               |
| ------------------------------- | ----------------------- | ---- | ----------------------- | ----------------------------------------- | ----------------------- | ------------------------------------------------ |
| `--tag <tag>`                   | 支持                     | 支持 | 支持                    | 支持                                      | 支持                     |                                                  |
| `--access <public\|restricted>` | 支持                     | 支持 | 支持                    | 支持                                      | 支持                     |                                                  |
| `--otp <otp>`                   | 支持                     | 支持 | 支持                    | 支持                                      | 支持                     |                                                  |
| `--dry-run`                     | 支持                     | 支持 | 支持                    | 支持                                      | 支持                     |                                                  |
| `--json`                        | 支持                     | 支持 | 支持                    | 支持                                      | 支持                     |                                                  |
| `-r, --recursive`               | 不指定目标或目标为 `.`    | 支持 | 不指定目标或目标为 `.`   | 4.16 以前不指定目标或目标为 `.`           | 不指定目标或目标为 `.`    |                                                  |
| `--filter <pattern>`            | 不指定目标或目标为 `.`    | 支持 | 不指定目标或目标为 `.`   | 4.16 以前不指定目标或目标为 `.`           | 不指定目标或目标为 `.`    |                                                  |
| `--provenance`                  | 支持                     | 支持 | 支持                    | 支持                                      | 支持                     |                                                  |
| `--registry <url>`              | 支持                     | 支持 | 支持                    | 4.16 以前，或指定目标时                   | 支持                     | 原生 Yarn 路径需在 Yarn 设置中配置 registry。       |

### `list`

- **npm：** 11.15 或更高版本使用 `npm stage list`。较早版本会警告并跳过。
- **pnpm：** 11.3 或更高版本使用 `pnpm stage list`。较早版本会警告并跳过。
- **经典版 Yarn：** 回退到 `npm stage list`。
- **现代版 Yarn：** 4.16.0 或更高版本使用 `yarn npm stage list`。较早版本会回退到 `npm stage list`。
- **Bun：** 回退到 `npm stage list`。

| 选项                | npm | pnpm | 经典版 Yarn   | 现代版 Yarn    | Bun | 备注                                               |
| ------------------ | --- | ---- | ------------ | ------------- | --- | ------------------------------------------------ |
| `--json`           | 支持 | 支持  | 支持          | 支持           | 支持 |                                                  |
| `--registry <url>` | 支持 | 支持  | 支持          | 4.16.0 以前不支持 | 支持 | 原生 Yarn 路径需在 Yarn 设置中配置 registry。  |

### `view`

- **npm：** 11.15 或更高版本使用 `npm stage view`。较早版本会警告并跳过。
- **pnpm：** 11.3 或更高版本使用 `pnpm stage view`。较早版本会警告并跳过。
- **经典版 Yarn：** 回退到 `npm stage view`。
- **现代版 Yarn：** 回退到 `npm stage view`。
- **Bun：** 回退到 `npm stage view`。

| 选项                | npm | pnpm | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注  |
| ------------------ | --- | ---- | ------------ | ----------- | --- | ----- |
| `--json`           | 支持 | 支持  | 支持          | 支持         | 支持 |       |
| `--registry <url>` | 支持 | 支持  | 支持          | 支持         | 支持 |       |

### `download`

- **npm：** 11.15 或更高版本使用 `npm stage download`。较早版本会警告并跳过。
- **pnpm：** 11.3 或更高版本使用 `pnpm stage download`。较早版本会警告并跳过。
- **经典版 Yarn：** 回退到 `npm stage download`。
- **现代版 Yarn：** 回退到 `npm stage download`。
- **Bun：** 回退到 `npm stage download`。

| 选项                | npm | pnpm | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注  |
| ------------------ | --- | ---- | ------------ | ----------- | --- | ----- |
| `--registry <url>` | 支持 | 支持  | 支持          | 支持         | 支持 |       |

### `approve`

- **npm：** 11.15 或更高版本使用 `npm stage approve`。较早版本会警告并跳过。
- **pnpm：** 11.3 或更高版本使用 `pnpm stage approve`。较早版本会警告并跳过。
- **经典版 Yarn：** 回退到 `npm stage approve`。
- **现代版 Yarn：** 4.16.0 或更高版本使用 `yarn npm stage approve`。较早版本会回退到 `npm stage approve`。
- **Bun：** 回退到 `npm stage approve`。

| 选项                | npm | pnpm | 经典版 Yarn   | 现代版 Yarn    | Bun | 备注                                               |
| ------------------ | --- | ---- | ------------ | ------------- | --- | ------------------------------------------------ |
| `--otp <otp>`      | 支持 | 支持  | 支持          | 支持           | 支持 |                                                  |
| `--registry <url>` | 支持 | 支持  | 支持          | 4.16.0 以前不支持 | 支持 | 原生 Yarn 路径需在 Yarn 设置中配置 registry。  |

### `reject`

- **npm：** 11.15 或更高版本使用 `npm stage reject`。较早版本会警告并跳过。
- **pnpm：** 11.3 或更高版本使用 `pnpm stage reject`。较早版本会警告并跳过。
- **经典版 Yarn：** 回退到 `npm stage reject`。
- **现代版 Yarn：** 4.16.0 或更高版本使用 `yarn npm stage reject`。较早版本会回退到 `npm stage reject`。
- **Bun：** 回退到 `npm stage reject`。

| 选项                | npm | pnpm | 经典版 Yarn   | 现代版 Yarn    | Bun | 备注                                               |
| ------------------ | --- | ---- | ------------ | ------------- | --- | ------------------------------------------------ |
| `--otp <otp>`      | 支持 | 支持  | 支持          | 支持           | 支持 |                                                  |
| `--registry <url>` | 支持 | 支持  | 支持          | 4.16.0 以前不支持 | 支持 | 原生 Yarn 路径需在 Yarn 设置中配置 registry。  |

Yarn 回退路径和 Bun 会在调用 npm 前发出警告。

此命令与 Yarn 的版本控制暂存命令或 Vite+ 的暂存文件检查无关。

## 原生选项

原生选项请参阅 [npm stage](https://docs.npmjs.com/cli/v11/commands/npm-stage)、[pnpm stage](https://pnpm.io/cli/stage)、[Yarn npm publish](https://yarnpkg.com/cli/npm/publish)、[Yarn npm stage list](https://yarnpkg.com/cli/npm/stage/list)、[Yarn npm stage approve](https://yarnpkg.com/cli/npm/stage/approve) 和 [Yarn npm stage reject](https://yarnpkg.com/cli/npm/stage/reject)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。

registry 工作流请参阅 [npm staged publishing](https://docs.npmjs.com/staged-publishing)。
