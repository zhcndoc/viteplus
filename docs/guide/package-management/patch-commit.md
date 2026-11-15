# vp pm patch-commit

将通过 [patch](./patch) 准备的编辑保存为依赖补丁。

```bash
vp pm patch-commit /path/to/edited-package
```

## 选项

提供包管理器补丁流程返回的编辑目录。Vite+ 没有额外选项。

没有该命令专用的选项。

## 兼容性

- **npm：** 12 或更高版本使用 `npm patch commit`。较早版本会警告并跳过。
- **pnpm：** 7.4 或更高版本使用 `pnpm patch-commit`。较早版本会警告并跳过。
- **经典版 Yarn：** 没有对应命令。会警告并成功退出，不执行操作。
- **现代版 Yarn：** 3 或更高版本使用 `yarn patch-commit --save`。较早版本会警告并跳过。
- **Bun：** `bun patch --commit`。

请检查并提交补丁，以及包管理器生成的任何清单或 lockfile 变更。

## 原生选项

原生选项请参阅 [npm patch commit](https://docs.npmjs.com/cli/v12/commands/npm-patch)、[pnpm patch-commit](https://pnpm.io/cli/patch-commit)、[Yarn patch-commit](https://yarnpkg.com/cli/patch-commit) 和 [Bun patch --commit](https://bun.com/docs/pm/cli/patch)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
