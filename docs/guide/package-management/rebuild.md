# vp rebuild

重新构建已安装的软件包，例如切换 Node.js 版本后，或原生插件需要重新编译时。此顶层命令需要全局 CLI。全局和项目本地 CLI 都接受 `vp pm rebuild` 及其别名 `vp pm rb`。

```bash
vp rebuild
vp rebuild better-sqlite3 sharp
vp rebuild -- --update-binary
```

## 选项

提供软件包名称时只重建这些软件包。省略名称则请求完整重建。Vite+ 没有额外选项。

没有该命令专用的选项。

## 兼容性

- **npm:** `npm rebuild`.
- **pnpm:** `pnpm rebuild`.
- **经典版 Yarn：** 没有对应命令。会警告并成功退出，不执行操作。
- **现代版 Yarn：** `yarn rebuild`。
- **Bun：** 没有对应命令。会警告并成功退出，不执行操作。

pnpm 10 及更高版本中，不指定名称的重建会遵循构建脚本批准设置。明确指定软件包名称会绕过此批准门槛，因此只重建其脚本可信的软件包。

npm 12 中，[批准依赖脚本](./approve-builds)只会记录策略，不会运行先前安装时跳过的脚本。批准后请重建对应软件包。

## 原生选项

原生选项请参阅 [npm rebuild](https://docs.npmjs.com/cli/v11/commands/npm-rebuild)、[pnpm rebuild](https://pnpm.io/cli/rebuild) 和 [Yarn rebuild](https://yarnpkg.com/cli/rebuild)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
