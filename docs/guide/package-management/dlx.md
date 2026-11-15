# vp dlx

下载并运行软件包，而不将其添加到项目依赖中。

```bash
vp dlx create-vite my-app
vp dlx --silent create-vite my-app
```

## 选项

将 Vite+ 选项放在软件包或命令之前：

命令之后的参数会传给执行的程序，不会解析为 Vite+ 选项。Shell 模式会解释 shell 语法；仅对可信的命令字符串使用此模式。

| 选项                    | 说明                                                                   | 备注               |
| ---------------------- | ---------------------------------------------------------------------- | ---------------- |
| `-p, --package <name>` | 使所选软件包可供执行的命令使用。                                       | 可重复使用。       |
| `-c, --shell-mode`     | 在 shell 环境中执行。                                                  |                  |
| `-s, --silent`         | 隐藏 Vite+ 输出，并在支持时请求原生静默输出。                           |                  |

## 兼容性

- **npm：** `npm exec --yes`。
- **pnpm：** `pnpm dlx`。
- **经典版 Yarn：** 回退到 `npx --yes`。
- **现代版 Yarn：** `yarn dlx`。
- **Bun：** `bun x`。

| 选项                    | npm | pnpm            | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注                                |
| ---------------------- | --- | --------------- | ------------ | ----------- | --- | --------------------------------- |
| `-p, --package <name>` | 支持 | 支持             | 支持          | 支持         | 支持 |                                    |
| `-c, --shell-mode`     | 支持 | 7.21.0 或更高版本 | 支持         | 不支持       | 不支持 |                                  |
| `-s, --silent`         | 支持 | 支持             | 支持          | 支持         | 支持 | Bun 仅会隐藏 Vite+ 输出。           |

对于已安装的项目二进制文件，请改用 `vp exec` 或 `vpx`。相关工作流请参阅[运行二进制文件](/guide/vpx)。

## 原生选项

原生选项请参阅 [npm exec](https://docs.npmjs.com/cli/v11/commands/npm-exec)、[pnpm dlx](https://pnpm.io/cli/dlx)、[Yarn dlx](https://yarnpkg.com/cli/dlx) 和 [Bun x](https://bun.com/docs/pm/bunx)。Yarn Classic 的回退命令请参阅 [npx](https://docs.npmjs.com/cli/v11/commands/npx)。参数处理方式请参阅[原生命令参数](./#native-arguments)。
