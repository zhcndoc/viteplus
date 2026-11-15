# vp pm whoami

显示 registry 中已登录的账户。

```bash
vp pm whoami
vp pm whoami --registry https://registry.npmjs.org
```

## 选项

| 选项                | 说明                 | 备注  |
| ------------------ | -------------------- | ----- |
| `--registry <url>` | 选择 registry。      |       |

## 兼容性

- **npm：** `npm whoami`。
- **pnpm：** 11 或更高版本使用 `pnpm whoami`。较早版本会回退到 `npm whoami`。
- **经典版 Yarn：** 没有对应命令。会警告并成功退出，不执行操作。
- **现代版 Yarn：** `yarn npm whoami`。
- **Bun：** `bun pm whoami`。

| 选项                | npm | pnpm | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注                                              |
| ------------------ | --- | ---- | ------------ | ----------- | --- | ----------------------------------------------- |
| `--registry <url>` | 支持 | 支持  | 不支持        | 不支持       | 支持 | 在现代版 Yarn 设置中配置 registry。              |

## 原生选项

原生选项请参阅 [npm whoami](https://docs.npmjs.com/cli/v11/commands/npm-whoami)、[pnpm whoami](https://pnpm.io/cli/whoami)、[Yarn npm whoami](https://yarnpkg.com/cli/npm/whoami) 和 [Bun pm whoami](https://bun.com/docs/pm/cli/pm)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
