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
  "oxc.disableNestedConfig": true,
  "oxc.fmt.disableNestedConfig": true,
  "editor.formatOnSave": true,
  "editor.formatOnSaveMode": "file",
  "editor.codeActionsOnSave": {
    "source.fixAll.oxc": "explicit"
  }
}
```

这会为项目设置共享的默认格式化程序，并启用由 Oxc 驱动的保存时修复操作。语言特定的覆盖块（`[javascript]`、`[typescript]` 等）是必需的，因为 VS Code 会优先使用用户级别的 `[language]` 设置，而不是工作区级别的 `editor.defaultFormatter`——没有这些设置，全局 Prettier 配置会悄然接管。设置 `oxc.disableNestedConfig` 和 `oxc.fmt.disableNestedConfig` 可以防止嵌套的 Oxlint 和 Oxfmt 配置偏离根目录中的 Vite+ 配置。Vite+ 使用 `formatOnSaveMode: "file"`，因为 Oxfmt 不支持部分格式化。

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
          "fmt.configPath": "./vite.config.ts",
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

将 `oxfmt.fmt.configPath` 设置为 `./vite.config.ts`，可以让编辑器的保存时格式化设置与 Vite+ 配置中的 `fmt` 块保持一致。完整生成的配置还涵盖其他语言（CSS、HTML、JSON、Markdown 等）——运行 `vp create` 或 `vp migrate` 即可自动写入完整文件。

## JetBrains（IntelliJ、WebStorm 等）

要在 IntelliJ 和 WebStorm 等 JetBrains IDE 中获得最佳的 Vite+ 体验，请从 JetBrains 插件市场安装 [Oxc](https://plugins.jetbrains.com/plugin/27061-oxc) 插件。

创建或迁移项目时，Vite+ 会提示你选择是否为 JetBrains IDE 写入编辑器配置。

::: tip Vite+ 不会与现有配置文件合并
由于合并 XML 文件较为复杂，Vite+ 目前不会在文件已存在时合并你当前的文件。
你将有机会替换任何现有文件，而不是进行合并。
:::

你也可以手动设置 IDE 配置，使其与 Vite+ 设置保持一致：

```xml [.idea/externalDependencies.xml]
<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="ExternalDependencies">
    <plugin id="com.github.oxc.project.oxcintellijplugin" />
  </component>
</project>
```

```xml [.idea/workspace.xml]
<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <!-- 其他设置…… -->
  <component name="PropertiesComponent">
    <![CDATA[{
      "keyToString": {
        // 其他设置
        "javascript.nodejs.core.library.configured.version": "24.18.0", // 替换为你选择的 Node.js 版本
        "javascript.nodejs.core.library.typings.version": "24.13.3", // 替换为与你的运行时对应的 @types/node 版本（如果不需要，也可以省略）
        "javascript.preferred.runtime.type.id": "node",
        "nodejs_interpreter_path": "$USER_HOME$/.vite-plus/bin/node",
        "nodejs_package_manager_path": "pnpm" // 替换为你选择的包管理器
      }
    }]]>
  </component>
</project>
```

```xml [.idea/OxfmtSettings.xml]
<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="OxfmtSettings">
    <option name="preferOxfmtCodeStyleSettings" value="true" />
  </component>
</project>
```

通常，项目中的 `.idea` 文件夹会被加入 Git 忽略列表，甚至包括用于告知 IDE 工作区应使用哪些插件的 `externalDependencies.xml` 文件。

请确保将以下行添加到主 `.gitignore` 文件中，以确保该文件会被包含：

```gitignore [.gitignore]
!.idea/externalDependencies.xml
```
