# vp pm audit

审计依赖中已知的安全漏洞。

```bash
vp pm audit
vp pm audit --json
vp pm audit --production --level high
```

## 选项

| 选项               | 说明                                         | 备注                                |
| ----------------- | -------------------------------------------- | --------------------------------- |
| `--fix`           | 请求自动修复漏洞。                           |                                   |
| `--json`          | 请求原生 JSON 输出。                         | 输出保留原生 schema。             |
| `--level <level>` | 要报告的最低漏洞级别。                       |                                   |
| `--production`    | 仅审计生产依赖。                             |                                   |

## 兼容性

- **npm:** `npm audit` or `npm audit fix`.
- **pnpm:** `pnpm audit`.
- **经典版 Yarn：** `yarn audit`。
- **现代版 Yarn：** 2.4 或更高版本使用 `yarn npm audit`。较早版本会警告并跳过。
- **Bun：** `bun audit` 或 `bun audit fix`。

| 选项               | npm | pnpm | 经典版 Yarn   | 现代版 Yarn  | Bun             | 备注  |
| ----------------- | --- | ---- | ------------ | ----------- | --------------- | ----- |
| `--fix`           | 支持 | 支持 | 不支持        | 不支持       | 1.4 或更高版本  |       |
| `--json`          | 支持 | 支持 | 支持          | 支持         | 支持             |       |
| `--level <level>` | 支持 | 支持 | 支持          | 支持         | 支持             |       |
| `--production`    | 支持 | 支持 | 支持          | 支持         | 1.2.21 或更高版本 |      |

漏洞输出和失败阈值遵循原生包管理器的语义。

## 原生选项

原生选项请参阅 [npm audit](https://docs.npmjs.com/cli/v11/commands/npm-audit)、[pnpm audit](https://pnpm.io/cli/audit)、[Yarn npm audit](https://yarnpkg.com/cli/npm/audit)、[Yarn Classic audit](https://classic.yarnpkg.com/en/docs/cli/audit) 和 [Bun audit](https://bun.com/docs/pm/cli/audit)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
