# vp pm patch

准备对已安装的依赖进行本地补丁修改。

```bash
vp pm patch my-dependency@1.0.0
```

在原生包管理器报告的位置编辑软件包，然后使用 [patch-commit](./patch-commit) 保存补丁。

## 选项

必须提供软件包规格。Vite+ 没有额外选项。

没有该命令专用的选项。

## 兼容性

- **npm：** 12 或更高版本使用 `npm patch add`。较早版本会警告并跳过。
- **pnpm：** 7.4 或更高版本使用 `pnpm patch`。较早版本会警告并跳过。
- **经典版 Yarn：** 没有对应命令。会警告并成功退出，不执行操作。
- **现代版 Yarn：** `yarn patch`。
- **Bun：** `bun patch`。

编辑位置和补丁存储格式由原生包管理器决定。Vite+ 不会在不同包管理器之间转换补丁。

## 原生选项

原生选项请参阅 [npm patch add](https://docs.npmjs.com/cli/v12/commands/npm-patch)、[pnpm patch](https://pnpm.io/cli/patch)、[Yarn patch](https://yarnpkg.com/cli/patch) 和 [Bun patch](https://bun.com/docs/pm/cli/patch)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
