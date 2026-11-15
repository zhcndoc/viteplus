# vp pm ci

在 CI 中使用冻结的 lockfile 安装依赖。

```bash
vp pm ci
vp pm ci -- --ignore-scripts
```

## 选项

此命令没有额外的 Vite+ 选项。若需使用经 Vite+ 转换的选项，请运行 [`vp install --frozen-lockfile`](./install)。

没有该命令专用的选项。

## 兼容性

- **npm:** `npm ci`.
- **pnpm:** `pnpm install --frozen-lockfile`.
- **经典版 Yarn：** `yarn install --frozen-lockfile`。
- **现代版 Yarn：** `yarn install --immutable`。
- **Bun：** `bun install --frozen-lockfile`。

清理安装内容和验证 lockfile 的行为由原生包管理器决定。除冻结 lockfile 的要求外，此命令不会让所有包管理器都表现得像 `npm ci`。

## 原生选项

原生选项请参阅 [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci)、[pnpm install](https://pnpm.io/cli/install)、[Yarn install](https://yarnpkg.com/cli/install)、[Yarn Classic install](https://classic.yarnpkg.com/en/docs/cli/install) 和 [Bun install](https://bun.com/docs/pm/cli/install)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。CI 设置请参阅 [CI 指南](/guide/ci)。
