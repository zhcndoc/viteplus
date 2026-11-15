# vp pm config

读取和写入包管理器配置。别名：`vp pm c`。此命令不同于用于配置项目工具的 `vp config`。

```bash
vp pm config list
vp pm config get registry
vp pm config set registry https://registry.npmjs.org --location project
vp pm config delete registry --location project
```

配置键因包管理器而异。registry 示例使用 npm 或 pnpm 的配置键，不适用于 Yarn 2 配置键。

## 选项

- `list` 显示配置。
- `get <key>` 读取值。
- `set <key> <value>` 写入值。
- `delete <key>` 删除值。

此处的 `--global` 用于选择配置范围，而不是 Vite+ 的全局软件包存储区。

这些子命令不接受 `--` 之后的其他原生参数。

### `list`

| 选项                                  | 说明                            | 备注                                |
| ------------------------------------ | ------------------------------- | --------------------------------- |
| `--json`                             | 请求原生 JSON 输出。             | 输出保留原生 schema。             |
| `-g, --global`                       | 使用全局配置。                   | 优先于 `--location`。             |
| `--location <project\|user\|global>` | 选择配置范围。                   |                                   |

### `get`

| 选项                                  | 说明                            | 备注                                |
| ------------------------------------ | ------------------------------- | --------------------------------- |
| `--json`                             | 请求原生 JSON 输出。             | 输出保留原生 schema。             |
| `-g, --global`                       | 使用全局配置。                   | 优先于 `--location`。             |
| `--location <project\|user\|global>` | 选择配置范围。                   |                                   |

### `set`

| 选项                                  | 说明                            | 备注                                |
| ------------------------------------ | ------------------------------- | --------------------------------- |
| `--json`                             | 请求原生 JSON 输出。             | 输出保留原生 schema。             |
| `-g, --global`                       | 使用全局配置。                   | 优先于 `--location`。             |
| `--location <project\|user\|global>` | 选择配置范围。                   |                                   |

### `delete`

| 选项                                  | 说明                            | 备注                      |
| ------------------------------------ | ------------------------------- | ----------------------- |
| `-g, --global`                       | 使用全局配置。                   | 优先于 `--location`。     |
| `--location <project\|user\|global>` | 选择配置范围。                   |                         |

## 兼容性

### `list`

- **npm:** `npm config list`.
- **pnpm:** `pnpm config list`.
- **经典版 Yarn：** `yarn config list`。
- **现代版 Yarn：** `yarn config`。
- **Bun：** 回退到 `npm config list`。使用 npm 配置，而非 `bunfig.toml`。

| 选项                                  | npm                   | pnpm                  | 经典版 Yarn   | 现代版 Yarn           | Bun                   | 备注                               |
| ------------------------------------ | --------------------- | --------------------- | ------------ | --------------------- | --------------------- | ---------------------------------- |
| `--json`                             | 支持                  | 支持                  | 支持          | 支持                  | 支持                  |                                    |
| `-g, --global`                       | 支持                  | 支持                  | 支持          | 支持                  | 支持                  |                                    |
| `--location <project\|user\|global>` | 项目、用户、全局       | 项目、用户、全局       | 用户、全局    | 项目、用户、全局       | 项目、用户、全局       | 读取结果保留合并后的配置。          |

### `get`

- **npm:** `npm config get`.
- **pnpm:** `pnpm config get`.
- **经典版 Yarn：** `yarn config get`。
- **现代版 Yarn：** `yarn config get`。
- **Bun：** 回退到 `npm config get`。使用 npm 配置，而非 `bunfig.toml`。

| 选项                                  | npm                   | pnpm                  | 经典版 Yarn   | 现代版 Yarn           | Bun                   | 备注                               |
| ------------------------------------ | --------------------- | --------------------- | ------------ | --------------------- | --------------------- | ---------------------------------- |
| `--json`                             | 支持                  | 支持                  | 支持          | 支持                  | 支持                  |                                    |
| `-g, --global`                       | 支持                  | 支持                  | 支持          | 支持                  | 支持                  |                                    |
| `--location <project\|user\|global>` | 项目、用户、全局       | 项目、用户、全局       | 用户、全局    | 项目、用户、全局       | 项目、用户、全局       | 读取结果保留合并后的配置。          |

### `set`

- **npm:** `npm config set`.
- **pnpm:** `pnpm config set`.
- **经典版 Yarn：** `yarn config set`。
- **现代版 Yarn：** `yarn config set`。
- **Bun：** 回退到 `npm config set`。使用 npm 配置，而非 `bunfig.toml`。

| 选项                                  | npm                   | pnpm                  | 经典版 Yarn   | 现代版 Yarn           | Bun                   | 备注  |
| ------------------------------------ | --------------------- | --------------------- | ------------ | --------------------- | --------------------- | ----- |
| `--json`                             | 支持                  | 支持                  | 支持          | 支持                  | 支持                  |       |
| `-g, --global`                       | 支持                  | 支持                  | 支持          | 支持                  | 支持                  |       |
| `--location <project\|user\|global>` | 项目、用户、全局       | 项目、用户、全局       | 用户、全局    | 项目、用户、全局       | 项目、用户、全局       |       |

### `delete`

- **npm:** `npm config delete`.
- **pnpm:** `pnpm config delete`.
- **经典版 Yarn：** `yarn config delete`。
- **现代版 Yarn：** `yarn config unset`。
- **Bun：** 回退到 `npm config delete`。使用 npm 配置，而非 `bunfig.toml`。

| 选项                                  | npm                   | pnpm                  | 经典版 Yarn   | 现代版 Yarn           | Bun                   | 备注  |
| ------------------------------------ | --------------------- | --------------------- | ------------ | --------------------- | --------------------- | ----- |
| `-g, --global`                       | 支持                  | 支持                  | 支持          | 支持                  | 支持                  |       |
| `--location <project\|user\|global>` | 项目、用户、全局       | 项目、用户、全局       | 用户、全局    | 项目、用户、全局       | 项目、用户、全局       |       |

经典版 Yarn 的用户级写入使用原生默认行为。

## 原生选项

原生选项请参阅 [npm config](https://docs.npmjs.com/cli/v11/commands/npm-config)、[pnpm config](https://pnpm.io/cli/config)、[Yarn config](https://yarnpkg.com/cli/config)、[Yarn config get](https://yarnpkg.com/cli/config/get)、[Yarn config set](https://yarnpkg.com/cli/config/set)、[Yarn config unset](https://yarnpkg.com/cli/config/unset) 和 [Yarn Classic config](https://classic.yarnpkg.com/en/docs/cli/config)。此接口以外的原生选项需要直接调用原生命令。

`bunfig.toml` 设置请参阅 [Bun configuration](https://bun.com/docs/runtime/bunfig)。
