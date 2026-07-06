# RFC：初始化编辑器配置

## 摘要

将编辑器配置文件生成（从 VSCode 开始）添加到 `vp create` 和 `vp migrate` 流程中。

这遵循与代理指令（`--agent` / `--no-agent`）相同的模式，提供 `--editor` / `--no-editor` 选项。

## 动机

像 VSCode 这样的 IDE 配置需要复杂的 JSON，用户必须手动设置。
由于 Vite+ 使用 Oxc 作为其格式化器，项目可以从以下内容中受益：

- `.vscode/settings.json` — 将 Oxc 作为默认格式化器、保存时格式化等。
- `.vscode/extensions.json` — 推荐的扩展（oxc-vscode）

目前，用户必须手动创建这些文件。
Vite+ 应该在项目创建和迁移期间自动生成它们，就像它已经为 agent instructions 所做的那样。

## 命令语法

```bash
# 使用编辑器配置创建
vp create vite:application --editor vscode

# 使用编辑器配置迁移
vp migrate --editor vscode

# 跳过编辑器配置（仅迁移）
vp migrate --no-editor
```

在交互模式下，用户会在代理选择提示之后，被提示选择他们的编辑器（无 / VSCode）。

## 生成的文件

### `.vscode/settings.json`

基于 [oxc-vscode 自身的 `.vscode/settings.json`](https://github.com/oxc-project/oxc-vscode/blob/main/.vscode/settings.json)。

```json
{
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnSaveMode": "file",
  "editor.codeActionsOnSave": {
    "source.fixAll.oxc": "explicit"
  },
  "oxc.typeAware": true
}
```

### `.vscode/extensions.json`

```json
{
  "recommendations": ["VoidZero.vite-plus-extension-pack"]
}
```

## 行为

### 现有文件处理

当配置文件已存在时：

- **交互模式**：提示选择合并 / 跳过选项
  - 合并：添加新键而不覆盖现有用户设置。对于 `extensions.json`，对推荐数组去重。
  - 跳过：保持不变
- **非交互模式**：自动合并（安全，因为现有键永远不会被覆盖）

### 非交互默认值

- `--editor vscode`：写入配置
- `--no-editor`：跳过
- 未指定任一项：跳过（保守默认值）

## 实现架构

### 新文件：`packages/cli/src/utils/editor.ts`

结构与 `packages/cli/src/utils/agent.ts` 保持一致：

| agent.ts                           | editor.ts                 |
| ---------------------------------- | ------------------------- |
| `AGENTS` 数组                     | `EDITORS` 数组           |
| `selectAgentTargetPaths()`         | `selectEditors()`         |
| `detectExistingAgentTargetPaths()` | `detectExistingEditors()` |
| `writeAgentInstructions()`         | `writeEditorConfigs()`    |

与 agent.ts 的关键区别：使用 JSON 合并（通过 `utils/json.ts`），而不是文件复制/追加，因为 IDE 配置是结构化 JSON。

### 集成到 `create/bin.ts`

- 在 `Options` 接口中添加 `editor?: string`
- 在 mri `string` 数组中添加 `'editor'`
- 在帮助文本中添加 `--editor NAME`
- 在每个写入位置于 agent instructions 之后调用 `selectEditor()` 和 `writeEditorConfigs()`（monorepo 路径约 ~L535，单项目路径约 ~L588）

### 集成到 `migration/bin.ts`

- 在 `MigrationOptions` 接口中添加 `editor?: string | false`
- 在帮助文本中添加 `--editor NAME` 和 `--no-editor`
- 在 agent instructions 之后调用 `selectEditor()` 和 `writeEditorConfigs()`（约 ~L225）

### 合并策略

- `settings.json`：2 级深度合并。保留现有键，添加新键。嵌套对象（例如 `[typescript]`）也会与现有内容合并并保留现有键。
- `extensions.json`：`recommendations` 数组去重合并。

### 需要修改的关键文件

1. `packages/cli/src/utils/editor.ts` — 新文件，核心逻辑
2. `packages/cli/src/create/bin.ts` — 添加选项和集成
3. `packages/cli/src/migration/bin.ts` — 添加选项和集成

### 复用的工具

- `packages/cli/src/utils/json.ts` — `readJsonFile`、`writeJsonFile`
- `@voidzero-dev/vite-plus-prompts` — `select`、`isCancel`、`log`

## 可扩展性

`EDITORS` 数组的设计旨在支持未来添加更多编辑器：

```typescript
export const EDITORS = [
  {
    id: 'vscode',
    label: 'VSCode',
    targetDir: '.vscode',
    files: ['settings.json', 'extensions.json'],
  },
  // 未来：{ id: 'jetbrains', label: 'JetBrains', targetDir: '.idea', files: [...] },
] as const;
```

## 快照测试

现有的与帮助相关的快照测试会在帮助文本更改时自动更新。可为以下内容添加专门的快照测试：

- `migration-editor-vscode` — 验证迁移期间 `.vscode/` 的生成
- `migration-no-editor` — 验证 `--no-editor` 会跳过生成
