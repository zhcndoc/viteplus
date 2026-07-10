# 创建_monorepo_本地模板简写

## `vp create starter --no-interactive --no-agent -- --directory my-app`

运行本地 create.templates 条目；生成的 pkg 通过简写声明 fmt/lint

```

正在生成项目…

正在运行：node <workspace>/packages/starter-template/bin/index.mjs --directory my-app
已将 starter-template 克隆到 my-app

正在进行 Monorepo 集成...

packages/my-app/vite.config.ts 中已存在 lint 配置 — 已移除多余的 packages/my-app/.oxlintrc.json

packages/my-app/vite.config.ts 中已存在 fmt 配置 — 已移除多余的 packages/my-app/.oxfmtrc.json

正在格式化代码...

代码已格式化
◇ 已搭建 packages/my-app
• Node <version>  pnpm <version>
→ 下一步：cd packages/my-app && vp run
```

## `vpt print-file packages/my-app/vite.config.ts`

fmt/lintr 保持简写即可，不要注入重复的内联 fmt:/lint: 块（#1836）

```
import { defineConfig } from "vite-plus";

import { fmt } from "./tooling/format";
import { lint } from "./tooling/lint";

export default defineConfig(({ mode }) => {
  return {
    server: { port: 3000 },
    fmt,
    lint,
  };
});
```

## `vpt stat-file packages/my-app/.oxlintrc.json --assert-not file`

独立的 lint 配置合并已跳过且已移除

```
packages/my-app/.oxlintrc.json: 缺失
```

## `vpt stat-file packages/my-app/.oxfmtrc.json --assert-not file`

独立 fmt 配置合并已跳过并已移除

```
packages/my-app/.oxfmtrc.json: 缺失
```
