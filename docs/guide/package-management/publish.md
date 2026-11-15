# vp pm publish

向 registry 发布软件包。支持的目标和预览选项因包管理器而异：

```bash
vp pm publish --dry-run
vp pm publish --access public --tag next
vp pm publish ./package.tgz
```

## 选项

| 选项                             | 说明                                         | 备注                                            |
| ------------------------------- | -------------------------------------------- | --------------------------------------------- |
| `--dry-run`                     | 预览发布，不实际发布。                       |                                               |
| `--tag <tag>`                   | 选择 distribution 标签。                    |                                               |
| `--access <public\|restricted>` | 请求公开或受限的软件包访问权限。              |                                               |
| `--otp <otp>`                   | 提供一次性密码。                             |                                               |
| `--no-git-checks`               | 跳过 git 检查。                              |                                               |
| `--publish-branch <branch>`     | 设置用于发布的分支名称。                     |                                               |
| `--report-summary`              | 保存发布摘要。                               |                                               |
| `--provenance`                  | 随发布内容附加来源证明。                     | 需要兼容的发布环境。                          |
| `--force`                       | 请求原生强制发布。                           |                                               |
| `--json`                        | 请求原生 JSON 输出。                         | 输出保留原生 schema。                         |
| `-r, --recursive`               | 发布所有 workspace 软件包。                 |                                               |
| `--filter <pattern>`            | 按模式选择 workspace。                       | 可重复使用。                                  |

## 兼容性

- **npm:** `npm publish`.
- **pnpm:** `pnpm publish`.
- **经典版 Yarn：** `yarn publish`。
- **现代版 Yarn：** 对当前 workspace 使用 `yarn npm publish`。显式 tarball 或目录目标会被拒绝。
- **Bun：** `bun publish`。

| 选项                             | npm             | pnpm                              | 经典版 Yarn      | 现代版 Yarn     | Bun | 备注  |
| ------------------------------- | --------------- | --------------------------------- | --------------- | -------------- | --- | ----- |
| `--dry-run`                     | 5.10.0 或更高版本 | 支持                              | 不支持           | 4.9.3 或更高版本 | 支持 |      |
| `--tag <tag>`                   | 支持              | 支持                              | 支持             | 支持             | 支持 |      |
| `--access <public\|restricted>` | 支持              | 支持                              | 支持             | 支持             | 支持 |      |
| `--otp <otp>`                   | 支持              | 支持                              | 1.12.1 或更高版本 | 3.2.0 或更高版本 | 支持 |      |
| `--no-git-checks`               | 不支持            | 支持                              | 不支持           | 不支持           | 不支持 |     |
| `--publish-branch <branch>`     | 不支持            | 支持                              | 不支持           | 不支持           | 不支持 |     |
| `--report-summary`              | 不支持            | 支持                              | 不支持           | 不支持           | 不支持 |     |
| `--provenance`                  | 9.5.0 或更高版本  | 支持                              | 不支持           | 4.9.0 或更高版本 | 不支持 |     |
| `--force`                       | 支持              | 支持                              | 不支持           | 不支持           | 不支持 |     |
| `--json`                        | 支持              | 11.0.0 以前不支持，或 11.0.7 起支持 | 支持           | 4.9.3 或更高版本 | 不支持 |    |
| `-r, --recursive`               | 7.13.0 或更高版本 | 支持                              | 不支持           | 不支持           | 不支持 |     |
| `--filter <pattern>`            | 7.13.0 或更高版本 | 支持                              | 不支持           | 不支持           | 不支持 |     |

Yarn 发布使用其 registry 配置和凭据。不支持的目标和 workspace 选择会导致错误，不会回退到 npm。原生发布失败后不会通过 npm 重试。

Vite+ 会在运行原生发布命令前拒绝不支持的选项。经典版 Yarn 可能忽略 `--dry-run` 并实际发布，也可能接受 `--provenance` 但不生成证明。Vite+ 会在经典版 Yarn 上拒绝这两个选项。

`--` 之后的参数会直接传给原生命令，不经过上述检查。以此方式传递不受支持的安全选项，可能导致实际发布，或发布内容未附加来源证明。

要将 CI 上传与维护者批准分开的工作流，请使用 [stage](./stage)。

## 原生选项

原生选项请参阅 [npm publish](https://docs.npmjs.com/cli/v11/commands/npm-publish)、[pnpm publish](https://pnpm.io/cli/publish)、[Yarn Classic publish](https://classic.yarnpkg.com/en/docs/cli/publish)、[Yarn npm publish](https://yarnpkg.com/cli/npm/publish) 和 [Bun publish](https://bun.com/docs/pm/cli/publish)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
