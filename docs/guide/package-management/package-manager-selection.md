# 包管理器选择

`vp` 按以下顺序在 workspace 根目录检测包管理器：

1. `packageManager` in `package.json`
2. `devEngines.packageManager` in `package.json`
3. `pnpm-workspace.yaml`
4. `pnpm-lock.yaml`
5. `yarn.lock` or `.yarnrc.yml`
6. `package-lock.json`
7. `bun.lock` or `bun.lockb`
8. `.pnpmfile.cjs` or `pnpmfile.cjs`
9. `bunfig.toml`
10. `yarn.config.cjs`

如果这些声明和文件都不存在，Vite+ 默认使用 pnpm。必要时，Vite+ 会下载对应的包管理器版本。检测过程不会改写 `package.json`。

Yarn Classic 指 Yarn 1；Yarn Modern 指 Yarn 2 或更高版本。

## 固定版本

使用 [`vp env pin`](/guide/env) 声明精确的包管理器版本：

```bash
vp env pin pnpm@11.3.0
```

`packageManager` 固定版本可以包含完整性哈希，例如 `yarn@4.17.1+sha512.…`。Vite+ 支持与 Corepack 兼容的完整性哈希；验证失败时会停止。

## 版本范围

[`devEngines.packageManager`](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devengines) 字段接受对象或对象数组。其 `version` 可以使用 semver 范围：

```json
{
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "^11.0.0",
      "onFail": "download"
    }
  }
}
```

如果本地已有符合条件的版本，Vite+ 会优先使用；否则会从 npm registry 解析符合范围的最新版本。该范围仍是唯一依据，不会被替换为精确的 `packageManager` 固定版本。

两个字段同时存在时，以 `packageManager` 决定选择结果。如果它不满足 `devEngines.packageManager` 的约束，Vite+ 会发出警告。运行 `vp env doctor` 查看详情。

## 包管理器 Shim

显式的 `packageManager` 或 `devEngines.packageManager` 声明也会控制对应包管理器的 shim。例如，`packageManager: "npm@10.9.4"` 会使 `npm` 和 `npx` 使用 npm 10.9.4。

同样适用于为各包管理器生成的别名：

- pnpm: `pnpm`, `pnpx`, `pn`, and `pnx`.
- Yarn: `yarn` and `yarnpkg`.
- Bun: `bun` and `bunx`.

不匹配的工具不会被转换。在 pnpm 项目中运行 `npm` 仍会解析到 npm。要让 Vite+ 根据项目的包管理器适配操作，请使用 `vp` 包管理命令。
