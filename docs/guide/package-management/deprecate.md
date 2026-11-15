# vp pm deprecate

为已发布的软件包版本或版本范围设置弃用提示。

```bash
vp pm deprecate 'my-package@<2.0.0' 'Upgrade to version 2 or later'
```

## 选项

必须提供软件包规格和提示消息。

弃用操作会向使用者发出警告，但不会取消发布软件包。

| 选项                | 说明                        | 备注  |
| ------------------ | --------------------------- | ----- |
| `--otp <otp>`      | 提供一次性密码。             |       |
| `--registry <url>` | 选择 registry。             |       |

## 兼容性

- **npm:** `npm deprecate`.
- **pnpm：** 11 或更高版本使用 `pnpm deprecate`。较早版本会回退到 `npm deprecate`。
- **经典版 Yarn：** 回退到 `npm deprecate`。
- **现代版 Yarn：** 回退到 `npm deprecate`。
- **Bun：** 回退到 `npm deprecate`。

| 选项                | npm | pnpm | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注  |
| ------------------ | --- | ---- | ------------ | ----------- | --- | ----- |
| `--otp <otp>`      | 支持 | 支持  | 支持          | 支持         | 支持 |       |
| `--registry <url>` | 支持 | 支持  | 支持          | 支持         | 支持 |       |

Bun 会发出回退警告。registry 配置和身份验证遵循实际运行的命令。

空提示消息会原样转发。pnpm 原生命令会拒绝此输入；Vite+ 不会将其转换为 `undeprecate`。

## 原生选项

原生选项请参阅 [npm deprecate](https://docs.npmjs.com/cli/v11/commands/npm-deprecate) 和 [pnpm deprecate](https://pnpm.io/cli/deprecate)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
