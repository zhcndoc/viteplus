# vp pm fund

显示已安装依赖的资助信息。

```bash
vp pm fund
vp pm fund --json
```

## 选项

| 选项      | 说明                        | 备注                                |
| -------- | --------------------------- | --------------------------------- |
| `--json` | 请求原生 JSON 输出。         | 输出保留原生 schema。             |

## 兼容性

- **npm:** `npm fund`.
- **pnpm:** Fallback: `npm fund`.
- **经典版 Yarn：** 回退到 `npm fund`。
- **现代版 Yarn：** 回退到 `npm fund`。
- **Bun：** 回退到 `npm fund`。

| 选项      | npm | pnpm | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注  |
| -------- | --- | ---- | ------------ | ----------- | --- | ----- |
| `--json` | 支持 | 支持  | 支持          | 支持         | 支持 |       |

Bun 会发出回退警告。结果遵循 npm 对已安装依赖的判断。

## 原生选项

原生选项请参阅 [npm fund](https://docs.npmjs.com/cli/v11/commands/npm-fund)，Vite+ 对所有包管理器都会使用该命令。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
