# 迁移：保留编辑器 JSONC 注释

## `vp migrate --no-interactive --no-hooks --editor vscode`

合并必须保留现有 `.vscode` JSONC 注释

```
VITE+ - The Unified Toolchain for the Web

◇ Migrated . to Vite+ <version>
• Node <version>  pnpm <version>
```

## `vpt print-file .vscode/settings.json`

顶层和嵌套注释均得以保留；添加 oxc 设置时不会覆盖现有值

```
{
  // 使用项目的 typescript 版本
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.codeActionsOnSave": {
    // 保留我的导入整理设置
    "source.organizeImports": "explicit",
    "source.fixAll.oxc": "explicit",
  },
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "oxc.oxc-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "oxc.oxc-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "oxc.oxc-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "oxc.oxc-vscode"
  },
  "oxc.disableNestedConfig": true,
  "oxc.fmt.disableNestedConfig": true,
  "editor.formatOnSave": true,
  "editor.formatOnSaveMode": "file",
}
```

## `vpt print-file .vscode/extensions.json`

现有的推荐项和注释保留；vite-plus 扩展仅追加一次

```
{
  "recommendations": [
    // 保留我最喜欢的扩展
    "dbaeumer.vscode-eslint",
    "VoidZero.vite-plus-extension-pack",
  ],
}
```
