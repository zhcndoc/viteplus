# 新建 Vite

## `vp create vite:application --no-interactive --git --editor vscode`

使用默认值创建 vite 应用


## `vpt list-dir vite-plus-application/package.json`

检查 package.json

```
vite-plus-application/package.json
```

## `vpt stat-file vite-plus-application/.vscode/settings.json --assert file`

检查 VS Code 设置已创建

```
vite-plus-application/.vscode/settings.json: file
```

## `vpt stat-file vite-plus-application/.vscode/extensions.json --assert file`

检查 VS Code 扩展已创建

```
vite-plus-application/.vscode/extensions.json: 文件
```

## `node check-trackable.cjs vite-plus-application .vscode/settings.json`

检查 VS Code 设置是否可被跟踪

```
.vscode/settings.json 可被跟踪
```

## `node check-trackable.cjs vite-plus-application .vscode/extensions.json`

检查 VS Code 扩展是否可跟踪

```
.vscode/extensions.json 可跟踪
```

## `vpt stat-file vite-plus-application/.github/workflows/copilot-setup-steps.yml --assert-not file`

默认创建不应添加 Copilot 设置工作流

```
vite-plus-application/.github/workflows/copilot-setup-steps.yml: 缺失
```

## `vp create vite:application --no-interactive --directory claude-app --agent claude`

使用非 Copilot 代理创建 vite 应用


## `vpt stat-file claude-app/.github/workflows/copilot-setup-steps.yml --assert-not file`

非 Copilot 代理不应添加 Copilot 设置工作流

```
claude-app/.github/workflows/copilot-setup-steps.yml: missing
```

## `vp create vite:application --no-interactive --directory no-agent-app --no-agent`

创建不包含 agent 设置的 vite 应用


## `vpt stat-file no-agent-app/.github/workflows/copilot-setup-steps.yml --assert-not file`

--no-agent 不应添加 Copilot 设置工作流

```
no-agent-app/.github/workflows/copilot-setup-steps.yml: 缺失
```

## `vp create vite:application --no-interactive --directory copilot-app --agent copilot`

使用 Copilot 代理设置创建 Vite 应用


## `vpt print-file copilot-app/.github/workflows/copilot-setup-steps.yml`

检查 Copilot 设置工作流

```
name: "Copilot Setup Steps"

on:
  workflow_dispatch:
  push:
    paths:
      - .github/workflows/copilot-setup-steps.yml
  pull_request:
    paths:
      - .github/workflows/copilot-setup-steps.yml

jobs:
  copilot-setup-steps:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - name: 检出代码
        uses: actions/checkout@v6
        with:
          persist-credentials: false
      - name: 设置 Vite+
        uses: voidzero-dev/setup-vp@v1
        with:
          cache: true
          run-install: true
      - name: 验证 Vite+
        run: vp --version
```

## `vp create vite:application --no-interactive --directory my-react-ts -- --template react-ts`

使用 react-ts 模板创建 vite 应用


## `vpt 列出目录 my-react-ts/package.json`

检查 package.json

```
my-react-ts/package.json
```
