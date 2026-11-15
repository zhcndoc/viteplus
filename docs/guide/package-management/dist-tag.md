# vp pm dist-tag

管理将 `my-package@next` 等软件包名称映射到已发布版本的标签。

```bash
vp pm dist-tag list my-package
vp pm dist-tag add my-package@2.0.0 next
vp pm dist-tag rm my-package next
```

## 选项

- `list [package]` 列出标签。别名：`ls`。
- `add <package@version> <tag>` 分配标签。
- `rm <package> <tag>` 移除标签。

这些子命令没有额外的 Vite+ 选项，也不接受原生透传参数。更改标签会改变该标签后续安装时解析到的版本，但不会删除已发布的版本。

### `list`

没有该命令专用的选项。

### `add`

没有该命令专用的选项。

### `rm`

没有该命令专用的选项。

## 兼容性

### `list`

- **npm:** `npm dist-tag list`.
- **pnpm：** 11 或更高版本使用 `pnpm dist-tag list`。较早版本会回退到 `npm dist-tag list`。
- **经典版 Yarn：** `yarn tag list`。
- **现代版 Yarn：** `yarn npm tag list`。
- **Bun：** 回退到 `npm dist-tag list`。

### `add`

- **npm:** `npm dist-tag add`.
- **pnpm：** 11 或更高版本使用 `pnpm dist-tag add`。较早版本会回退到 `npm dist-tag add`。
- **经典版 Yarn：** `yarn tag add`。
- **现代版 Yarn：** `yarn npm tag add`。
- **Bun：** 回退到 `npm dist-tag add`。

### `rm`

- **npm:** `npm dist-tag rm`.
- **pnpm：** 11 或更高版本使用 `pnpm dist-tag rm`。较早版本会回退到 `npm dist-tag rm`。
- **经典版 Yarn：** `yarn tag rm`。
- **现代版 Yarn：** `yarn npm tag rm`。
- **Bun：** 回退到 `npm dist-tag rm`。

使用 pnpm 原生命令时，Vite+ 不会为 `list` 补上缺失的软件包、不为 `add` 解析版本范围，也不会绕过移除 `latest` 的限制。pnpm 会自行验证这些请求并返回对应错误。

## 原生选项

原生选项请参阅 [npm dist-tag](https://docs.npmjs.com/cli/v11/commands/npm-dist-tag)、[pnpm dist-tag](https://pnpm.io/cli/dist-tag)、[Yarn npm tag list](https://yarnpkg.com/cli/npm/tag/list)、[Yarn npm tag add](https://yarnpkg.com/cli/npm/tag/add)、[Yarn npm tag remove](https://yarnpkg.com/cli/npm/tag/remove) 和 [Yarn Classic tag](https://classic.yarnpkg.com/en/docs/cli/tag)。上游命令可能提供此 Vite+ 接口不接受的其他选项。
