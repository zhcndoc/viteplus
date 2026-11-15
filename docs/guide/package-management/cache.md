# vp pm cache

查看或清理包管理器的下载缓存或存储区。这与管理任务结果的 [`vp cache`](/guide/cache) 不同。

```bash
vp pm cache dir
vp pm cache clean
```

## 选项

- `dir` 和 `path` 会显示缓存或存储区位置。
- `clean` 会请求原生缓存清理操作。

其他子命令会发出警告并成功退出，不运行任何命令。Vite+ 没有额外选项。

### `dir`

显示缓存或存储区位置。别名：`path`。没有该命令专用的选项。

### `clean`

请求原生缓存清理操作。没有该命令专用的选项。

## 兼容性

### `dir`

- **npm:** `npm config get cache`.
- **pnpm:** `pnpm store path`.
- **经典版 Yarn：** `yarn cache dir`。
- **现代版 Yarn：** `yarn config get cacheFolder`。
- **Bun：** `bun pm cache`。

### `clean`

- **npm:** `npm cache clean`.
- **pnpm：** `pnpm store prune`。会修剪存储区，而不是删除所有内容。
- **经典版 Yarn：** `yarn cache clean`。
- **现代版 Yarn：** `yarn cache clean`。
- **Bun：** `bun pm cache rm`。

npm 通常要求显式传入原生 `--force` 才会删除缓存：

```bash
vp pm cache clean -- --force
```

此示例仅适用于 npm。Vite+ 没有单独提供 `vp pm store` 命令。

## 原生选项

原生选项请参阅 [npm config](https://docs.npmjs.com/cli/v11/commands/npm-config)、[npm cache](https://docs.npmjs.com/cli/v11/commands/npm-cache)、[pnpm store](https://pnpm.io/cli/store)、[Yarn config get](https://yarnpkg.com/cli/config/get)、[Yarn cache clean](https://yarnpkg.com/cli/cache/clean)、[Yarn Classic cache](https://classic.yarnpkg.com/en/docs/cli/cache) 和 [Bun pm cache](https://bun.com/docs/pm/cli/pm)。要通过 Vite+ 传递这些选项，请参阅[原生命令参数](./#native-arguments)。
