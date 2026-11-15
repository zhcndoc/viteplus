# vp unlink

移除本地开发期间创建的包管理器原生链接。

```bash
vp unlink my-library
```

## 选项

可选的软件包名称或目录会转发给包管理器。在支持时，`-r, --recursive` 会请求解除所有 workspace 中的链接。

| 选项               | 说明                               | 备注  |
| ----------------- | ---------------------------------- | ----- |
| `-r, --recursive` | 在每个 workspace 软件包中解除链接。 |       |

## 兼容性

- **npm:** `npm unlink`.
- **pnpm:** `pnpm unlink`.
- **经典版 Yarn：** `yarn unlink`。
- **现代版 Yarn：** 3 或更高版本使用 `yarn unlink`。较早版本会警告并跳过。
- **Bun：** `bun unlink`。

| 选项               | npm            | pnpm | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注                               |
| ----------------- | -------------- | ---- | ------------ | ----------- | --- | -------------------------------- |
| `-r, --recursive` | 8.1.0 或更高版本 | 支持  | 不支持        | 3 或更高版本 | 不支持 | npm 会包含 workspace 根目录。      |

操作数和清单更新行为遵循原生包管理器。此命令不会从 Vite+ 的[全局存储区](./global-packages)中移除软件包。

## 原生选项

原生选项请参阅 [npm unlink](https://docs.npmjs.com/cli/v11/commands/npm-uninstall)、[pnpm unlink](https://pnpm.io/cli/unlink)、[Yarn unlink](https://yarnpkg.com/cli/unlink)、[Yarn Classic unlink](https://classic.yarnpkg.com/en/docs/cli/unlink) 和 [Bun unlink](https://bun.com/docs/pm/cli/link)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
