# vp link

通过所选包管理器创建本地开发链接。别名：`vp ln`。

```bash
vp link ../my-library
```

## 选项

可选的软件包名称或目录会传给包管理器。

没有该命令专用的选项。

## 兼容性

- **npm:** `npm link`.
- **pnpm:** `pnpm link`.
- **经典版 Yarn：** `yarn link`。
- **现代版 Yarn：** `yarn link`。
- **Bun：** `bun link`。

目录、软件包名称或省略参数时的含义遵循包管理器的原生链接流程。特别是，Yarn 2 及更高版本链接项目的方式与经典版 Yarn 的软件包注册流程不同。

这些链接不会使用 Vite+ 的[全局软件包存储区](./global-packages)，也不会显示在 `vp list -g` 中。使用 [unlink](./unlink) 移除原生链接。

## 原生选项

原生选项请参阅 [npm link](https://docs.npmjs.com/cli/v11/commands/npm-link)、[pnpm link](https://pnpm.io/cli/link)、[Yarn link](https://yarnpkg.com/cli/link)、[Yarn Classic link](https://classic.yarnpkg.com/en/docs/cli/link) 和 [Bun link](https://bun.com/docs/pm/cli/link)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
