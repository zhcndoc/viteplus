# vp pm ping

检查与软件包 registry 的连接。

```bash
vp pm ping
vp pm ping --registry https://registry.npmjs.org
```

## 选项

| 选项                | 说明                 | 备注  |
| ------------------ | -------------------- | ----- |
| `--registry <url>` | 选择 registry。      |       |

## 兼容性

- **npm:** `npm ping`.
- **pnpm：** 11 或更高版本使用 `pnpm ping`。较早版本会回退到 `npm ping`。
- **经典版 Yarn：** 回退到 `npm ping`。
- **现代版 Yarn：** 回退到 `npm ping`。
- **Bun：** 回退到 `npm ping`。

| 选项                | npm | pnpm | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注  |
| ------------------ | --- | ---- | ------------ | ----------- | --- | ----- |
| `--registry <url>` | 支持 | 支持  | 支持          | 支持         | 支持 |       |

registry 配置、输出和退出码遵循实际运行的命令。若要检查已认证的账户而非连接状态，请使用 [whoami](./whoami)。

## 原生选项

原生选项请参阅 [npm ping](https://docs.npmjs.com/cli/v11/commands/npm-ping) 和 [pnpm ping](https://pnpm.io/cli/ping)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
