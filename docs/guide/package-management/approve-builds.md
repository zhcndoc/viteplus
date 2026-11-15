# vp pm approve-builds

使用所选包管理器的信任策略批准依赖生命周期脚本。只批准你确实打算执行其安装脚本的软件包。

```bash
vp pm approve-builds
vp pm approve-builds sharp
vp pm approve-builds '!untrusted-package'
vp pm approve-builds --all
```

## 选项

提供要批准的软件包；在名称前加 `!` 可在支持时请求拒绝。请将拒绝参数加引号，避免 shell 历史展开。

| 选项     | 说明                                                | 备注                                                                 |
| ------- | --------------------------------------------------- | ------------------------------------------------------------------ |
| `--all` | 批准所有待批准构建脚本的软件包。                    | 不能与软件包名称一起使用，包括 `--` 后的名称。                      |

## 兼容性

- **npm：** 11.16 或更高版本使用 `npm approve-scripts`。较早版本会警告并跳过。拒绝操作使用 `npm deny-scripts`。
- **pnpm：** 10.1 或更高版本使用 `pnpm approve-builds`。较早版本会警告并跳过。
- **经典版 Yarn：** 没有对应命令。会警告并成功退出，不执行操作。
- **现代版 Yarn：** 没有对应命令。会警告并成功退出，不执行操作。
- **Bun：** 指定软件包或使用 `--all` 时运行 `bun pm trust`。

| 选项     | npm              | pnpm             | 经典版 Yarn   | 现代版 Yarn  | Bun | 备注  |
| ------- | ---------------- | ---------------- | ------------ | ----------- | --- | ----- |
| `--all` | 11.16.0 或更高版本 | 10.32.0 或更高版本 | 不支持        | 不支持       | 支持 |       |

未提供软件包名称时，pnpm 会打开交互流程，npm 则通过 `--allow-scripts-pending` 列出待处理的软件包。Bun 不会打开交互式选择器；请先用 `bun pm untrusted` 查看待处理的软件包，再指定要信任的名称。

以 `!` 为前缀的拒绝参数需要 pnpm 11 或更高版本，或 npm 11.16 或更高版本。npm 要求分别调用批准和拒绝命令。Bun 使用 `trustedDependencies` 而非拒绝列表，因此会警告并跳过拒绝条目。

对于现代版 Yarn，请将 `enableScripts` 设为 `false`，并通过 `dependenciesMeta` 明确允许受信任的软件包。

### npm 构建脚本策略

npm 12 会强制执行 `package.json` 中的 `allowScripts` 策略。未被策略涵盖的依赖安装脚本会被跳过，包括隐式的原生构建。批准操作会更新策略，但不会运行先前跳过的脚本。之后请运行 [`vp pm rebuild <package>`](./rebuild)。

npm 11.16 到 11.x 中，此策略仅提供建议。脚本仍会运行，npm 会针对未经审查的软件包发出警告。

## 原生选项

原生选项请参阅 [npm approve-scripts](https://docs.npmjs.com/cli/v11/commands/npm-approve-scripts)、[npm deny-scripts](https://docs.npmjs.com/cli/v11/commands/npm-deny-scripts)、[pnpm approve-builds](https://pnpm.io/cli/approve-builds)、[Bun pm trust](https://bun.com/docs/pm/cli/pm) 和 [Bun pm untrusted](https://bun.com/docs/pm/cli/pm)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。

脚本策略配置请参阅 [npm package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)、[Yarn enableScripts](https://yarnpkg.com/configuration/yarnrc#enableScripts) 和 [Bun lifecycle scripts](https://bun.com/docs/pm/lifecycle)。
