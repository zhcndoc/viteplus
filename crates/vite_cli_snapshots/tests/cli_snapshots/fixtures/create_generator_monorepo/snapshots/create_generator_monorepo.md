# create_generator_monorepo

搭建一个生成器，安装其依赖（这样其 `bin/index.ts` 就可以导入
`bingo`），然后通过已注册的 `create.templates` 条目运行它。
`vp install` 步骤使搭建出的产物能够在隔离运行器中运行，而无需采用旧版的
symlink-all-node_modules 行为。

## `vp create vite:generator --no-interactive --directory tools/my-generator`

构建一个生成器；自动将其注册到 create.templates

```
◇ 已使用生成器脚手架构建 tools/my-generator
• Node <version>  pnpm <version>
✓ 已在 <duration> 内安装依赖
→ 下一步：cd tools/my-generator && vp run
```

## `vpt print-file vite.config.ts`

已追加 create.templates 条目，保留现有的 defaultTemplate

```
import { defineConfig } from "vite-plus";

export default defineConfig({
  create: {
    defaultTemplate: "@acme",
    templates: [
      {
        name: "my-generator",
        description: "A starter for creating a Vite+ code generator.",
        template: "./tools/my-generator",
      },
    ],
  },
});
```

## `vpt print-file tools/my-generator/package.json`

生成器包（bingo 依赖是运行提示；没有标记关键字）

```
{
  "name": "my-generator",
  "version": "0.0.0",
  "private": true,
  "description": "A starter for creating a Vite+ code generator.",
  "keywords": [
    "vite-plus-generator"
  ],
  "bin": "./bin/index.ts",
  "type": "module",
  "scripts": {
    "test": "vp test",
    "dev": "node bin/index.ts"
  },
  "dependencies": {
    "bingo": "^0.9.3",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@types/node": "catalog:",
    "typescript": "catalog:"
  },
  "engines": {
    "node": ">=22.18.0"
  }
}
```

## `vp install`

安装工作区依赖，以便生成器的 bin 可以导入 bingo


## `vp create my-generator --no-interactive -- --name demo-pkg --directory demo-pkg --offline`

通过已注册的 create.templates 条目解析

```

正在生成项目……

运行：node <workspace>/tools/my-generator/bin/index.ts --name demo-pkg --directory demo-pkg --offline --skip-requests
┌  my-generator@0.0.0 │
◇  以 --setup 模式运行
│
│  已启用 --offline。你需要手动 git push 任何更改。
│
◇  从系统推断默认选项
│
◇  已运行 my-generator 模板
│
◇  已准备本地 Git 仓库
│
●  在 ./demo-pkg 中运行 npx index.ts --remote
│  以在 GitHub 上创建并同步远程仓库。
│
└  感谢使用 my-generator！💝

Monorepo 集成中……

正在安装依赖……

依赖已安装

正在格式化代码……

代码已格式化
◇ 已搭建 tools/demo-pkg
• Node <version>  pnpm <version>
✓ 依赖已安装（耗时 <duration>）
→ 下一步：cd tools/demo-pkg && vp run
```

## `vpt print-file tools/demo-pkg/package.json`

生成在 tools/ 下生成器旁边，而不是 apps/ 父目录中

```
{
  "name": "demo-pkg",
  "version": "0.0.0",
  "type": "module"
}
```

## `vpt print-file tools/demo-pkg/src/index.ts`

```
export const name = "demo-pkg";
```
