# IDE 集成

Vite+ 通过编辑器特定设置支持 VS Code 和 Zed，`vp create` 和 `vp migrate` 可以自动将这些设置写入你的项目。

## VS Code

要获得最佳的 VS Code 体验，请安装 [Vite Plus Extension Pack](https://marketplace.visualstudio.com/items?itemName=VoidZero.vite-plus-extension-pack)。它目前包括：

- `Oxc`：通过 `vp check` 进行格式化和代码检查
- `Vitest`：通过 `vp test` 运行测试

在创建或迁移项目时，Vite+ 会提示你是否要为 VS Code 写入编辑器配置。`vp create` 还会将 `npm.scriptRunner` 设置为 `vp`，以便 VS Code NPM 脚本面板通过 Vite+ 任务运行器运行脚本。对于迁移或现有项目，可以手动添加此设置（参见下文）。

你也可以手动设置 VS Code 配置：

```json [.vscode/extensions.json]
{
  "recommendations": ["VoidZero.vite-plus-extension-pack"]
}
```

```json [.vscode/settings.json]
{
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "[javascript]": { "editor.defaultFormatter": "oxc.oxc-vscode" },
  "[javascriptreact]": { "editor.defaultFormatter": "oxc.oxc-vscode" },
  "[typescript]": { "editor.defaultFormatter": "oxc.oxc-vscode" },
  "[typescriptreact]": { "editor.defaultFormatter": "oxc.oxc-vscode" },
  "oxc.fmt.configPath": "./vite.config.ts",
  "editor.formatOnSave": true,
  "editor.formatOnSaveMode": "file",
  "editor.codeActionsOnSave": {
    "source.fixAll.oxc": "explicit"
  }
}
```

这为项目提供了共享的默认格式化工具，并启用了由 Oxc 驱动的保存时修复操作。需要这些按语言覆盖的块（`[javascript]`、`[typescript]` 等），因为 VS Code 会优先使用用户级别的 `[language]` 设置，而不是工作区级别的 `editor.defaultFormatter`——如果没有这些设置，全局 Prettier 配置会悄悄接管。将 `oxc.fmt.configPath` 设置为 `./vite.config.ts`，可以让编辑器的保存时格式化与 Vite+ 配置中的 `fmt` 区块保持一致。Vite+ 使用 `formatOnSaveMode: "file"`，因为 Oxfmt 不支持部分格式化。

要让 VS Code NPM 脚本面板通过 `vp` 运行脚本，请在 `.vscode/settings.json` 中添加以下内容：

```json [.vscode/settings.json]
{
  "npm.scriptRunner": "vp"
}
```

这会由 `vp create` 自动包含，但不会由 `vp migrate` 自动包含，因为现有项目中可能有团队成员本地并未安装 `vp`。

## Zed

要获得最佳的 Vite+ Zed 体验，请从 Zed 扩展市场安装 [oxc-zed](https://github.com/oxc-project/oxc-zed) 扩展。它通过 `vp check` 提供格式化和代码检查。

在创建或迁移项目时，Vite+ 会提示你选择是否要为 Zed 写入编辑器配置。

你也可以手动设置 Zed 配置：

```json [.zed/settings.json]
{
  "lsp": {
    "oxlint": {
      "initialization_options": {
        "settings": {
          "run": "onType",
          "fixKind": "safe_fix",
          "typeAware": true,
          "unusedDisableDirectives": "deny"
        }
      }
    },
    "oxfmt": {
      "initialization_options": {
        "settings": {
          "configPath": "./vite.config.ts",
          "run": "onSave"
        }
      }
    }
  },
  "languages": {
    "JavaScript": {
      "format_on_save": "on",
      "prettier": { "allowed": false },
      "formatter": [{ "language_server": { "name": "oxfmt" } }],
      "code_action": "source.fixAll.oxc"
    },
    "TypeScript": {
      "format_on_save": "on",
      "prettier": { "allowed": false },
      "formatter": [{ "language_server": { "name": "oxfmt" } }]
    },
    "Vue.js": {
      "format_on_save": "on",
      "prettier": { "allowed": false },
      "formatter": [{ "language_server": { "name": "oxfmt" } }]
    }
  }
}
```

将 `oxfmt.configPath` 设置为 `./vite.config.ts`，可以让编辑器的保存时格式化与 Vite+ 配置中的 `fmt` 区块保持一致。生成的完整配置还涵盖了其他语言（CSS、HTML、JSON、Markdown 等）——运行 `vp create` 或 `vp migrate` 可自动写入完整文件。
