# IDE 集成

Vite+ 通过 [Vite Plus Extension Pack](https://marketplace.visualstudio.com/items?itemName=VoidZero.vite-plus-extension-pack) 以及 `vp create` 和 `vp migrate` 可自动写入项目设置的 VS Code 设置，支持与 VS Code 的集成。

## VS Code

要获得最佳的 VS Code 体验，请安装 [Vite Plus Extension Pack](https://marketplace.visualstudio.com/items?itemName=VoidZero.vite-plus-extension-pack)。它目前包括：

- `Oxc`：通过 `vp check` 进行格式化和代码检查
- `Vitest`：通过 `vp test` 运行测试

在创建或迁移项目时，Vite+ 会提示你是否要为 VS Code 写入编辑器配置。`vp create` 还会将 `npm.scriptRunner` 设置为 `vp`，以便 VS Code NPM 脚本面板通过 Vite+ 任务运行器运行脚本。对于迁移或现有项目，可以手动添加此设置（参见下文）。

你也可以手动设置 VS Code 配置：

`.vscode/extensions.json`

```json
{
  "recommendations": ["VoidZero.vite-plus-extension-pack"]
}
```

`.vscode/settings.json`

```json
{
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "oxc.fmt.configPath": "./vite.config.ts",
  "editor.formatOnSave": true,
  "editor.formatOnSaveMode": "file",
  "editor.codeActionsOnSave": {
    "source.fixAll.oxc": "explicit"
  }
}
```

这会为项目提供一个共享的默认格式化程序，并在保存时启用 Oxc 驱动的修复操作。将 `oxc.fmt.configPath` 设置为 `./vite.config.ts` 可使编辑器保存时的格式化与 Vite+ 配置中的 `fmt` 块保持同步。Vite+ 使用 `formatOnSaveMode: "file"`，因为 Oxfmt 不支持部分格式化。

要让 VS Code NPM 脚本面板通过 `vp` 运行脚本，请在 `.vscode/settings.json` 中添加以下内容：

```json
{
  "npm.scriptRunner": "vp"
}
```

这会由 `vp create` 自动包含，但 `vp migrate` 不会包含，因为现有项目中的团队成员可能尚未在本地安装 `vp`。
