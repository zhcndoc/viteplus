# 新的 vite 单仓库

## `vp create vite:monorepo --no-interactive --git --editor vscode`

使用默认值创建 monorepo


## `vpt list-dir vite-plus-monorepo`

检查已创建的文件

```
AGENTS.md
README.md
apps
package.json
packages
pnpm-workspace.yaml
tsconfig.json
vite.config.ts
```

## `vpt print-file vite-plus-monorepo/package.json`

检查 package.json

```
{
  "name": "vite-plus-monorepo",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "ready": "vp check && vp run -r test && vp run -r build",
    "dev": "vp run website#dev",
    "prepare": "vp config"
  },
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "<version>",
      "onFail": "download"
    }
  },
  "engines": {
    "node": ">=22.18.0"
  }
}
```

## `vpt print-file vite-plus-monorepo/vite.config.ts`

检查 vite 配置是否启用了缓存

```
import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    cache: true,
  },
});
```

## `vpt print-file vite-plus-monorepo/pnpm-workspace.yaml`

检查工作区配置

```
packages:
  - apps/*
  - packages/*
  - tools/*

catalogMode: prefer

catalog:
  "@types/node": ^24
  typescript: ^5
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
overrides:
  vite: "catalog:"
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: "*"
```

## `vpt stat-file vite-plus-monorepo/.gitignore --assert file`

验证 gitignore 已从 _gitignore 重命名

```
vite-plus-monorepo/.gitignore: file
```

## `vpt stat-file vite-plus-monorepo/.yarnrc.yml --assert-not file`

验证没有针对 pnpm 的 yarn 配置

```
vite-plus-monorepo/.yarnrc.yml: 缺失
```

## `vpt stat-file vite-plus-monorepo/.git --assert dir`

检查 git init

```
vite-plus-monorepo/.git: dir
```

## `vp create vite:monorepo --interactive --verbose --no-git --no-hooks --no-agent --no-editor --package-manager pnpm --directory verbose-no-git-monorepo`

显式的 --no-git 应跳过 verbose monorepo 的 git 提示


## `vpt stat-file verbose-no-git-monorepo/.git --assert-not dir`

检查 verbose --no-git 是否被遵守

```
verbose-no-git-monorepo/.git: 缺失
```

## `vpt stat-file vite-plus-monorepo/.vscode/settings.json --assert file`

检查已创建的 VS Code 设置

```
vite-plus-monorepo/.vscode/settings.json: 文件
```

## `vpt stat-file vite-plus-monorepo/.vscode/extensions.json --assert file`

检查 VS Code 扩展是否已创建

```
vite-plus-monorepo/.vscode/extensions.json: file
```

## `node check-trackable.cjs vite-plus-monorepo .vscode/settings.json`

检查 VS Code 设置是否可跟踪

```
.vscode/settings.json 可跟踪
```

## `node check-trackable.cjs vite-plus-monorepo .vscode/extensions.json`

检查 VS Code 扩展是否可追踪

```
.vscode/extensions.json 可追踪
```

## `vpt list-dir vite-plus-monorepo/apps`

检查 apps 目录已创建

```
website
```

## `vpt print-file vite-plus-monorepo/apps/website/package.json`

检查 website 为 pnpm 保持了 vite 的别名（workspace 覆盖仍然有效）

```
{
  "name": "website",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vp dev",
    "build": "tsc && vp build",
    "preview": "vp preview"
  },
  "devDependencies": {
    "typescript": "~6.0.2",
    "vite": "catalog:",
    "vite-plus": "catalog:"
  }
}
```

## `vpt print-file vite-plus-monorepo/packages/utils/package.json`

检查 utils 是否将 vite-plus 规范化为 catalog：

```
{
  "name": "utils",
  "version": "0.0.0",
  "description": "用于创建 TypeScript 包的起始模板。",
  "homepage": "https://github.com/author/library#readme",
  "bugs": {
    "url": "https://github.com/author/library/issues"
  },
  "license": "MIT",
  "author": "Author Name <author.name@mail.com>",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/author/library.git"
  },
  "files": [
    "dist"
  ],
  "type": "module",
  "exports": {
    ".": "./dist/index.mjs",
    "./package.json": "./package.json"
  },
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "build": "vp pack",
    "dev": "vp pack --watch",
    "test": "vp test",
    "check": "vp check",
    "prepublishOnly": "vp run build"
  },
  "devDependencies": {
    "@types/node": "^25.6.2",
    "@typescript/native-preview": "7.0.0-dev.20260509.2",
    "bumpp": "^11.1.0",
    "typescript": "^6.0.3",
    "vite": "catalog:",
    "vite-plus": "catalog:"
  }
}
```

## `cd vite-plus-monorepo && vp create --no-interactive vite:application`

以非交互模式创建应用


## `vpt list-dir vite-plus-monorepo/apps`

检查 apps 目录是否已创建

```
vite-plus-application
website
```

## `vpt list-dir vite-plus-monorepo/apps/vite-plus-application/package.json`

检查 vite-plus-application 的 package.json

```
vite-plus-monorepo/apps/vite-plus-application/package.json
```

## `vpt stat-file vite-plus-monorepo/apps/vite-plus-application/.vscode --assert missing`

在没有 `--editor` 的情况下创建 monorepo 包时，不应写入 VS Code 配置

```
vite-plus-monorepo/apps/vite-plus-application/.vscode: 缺失
```

## `cd vite-plus-monorepo && vp create --no-interactive vite:application --directory apps/no-editor --no-editor`

在 monorepo 中创建明确选择不使用编辑器的应用


## `vpt stat-file vite-plus-monorepo/apps/no-editor/.vscode --assert missing`

--no-editor 不应写入 VS Code 配置

```
vite-plus-monorepo/apps/no-editor/.vscode: missing
```

## `cd vite-plus-monorepo && vp create --no-interactive vite:application --directory apps/editor-opt-in --editor vscode`

在 monorepo 中创建显式选择编辑器的应用


## `vpt stat-file vite-plus-monorepo/apps/editor-opt-in/.vscode/settings.json --assert file`

显式指定 --editor 应写入 VS Code 设置

```
vite-plus-monorepo/apps/editor-opt-in/.vscode/settings.json: file
```

## `vpt stat-file vite-plus-monorepo/apps/editor-opt-in/.vscode/extensions.json --assert file`

显式的 --editor 应该写入 VS Code 扩展

```
vite-plus-monorepo/apps/editor-opt-in/.vscode/extensions.json: file
```

## `cd vite-plus-monorepo && vp create --no-interactive vite:library`

以非交互模式创建库


## `vpt list-dir vite-plus-monorepo/packages/vite-plus-library/package.json`

检查 vite-plus-library 的 package.json

```
vite-plus-monorepo/packages/vite-plus-library/package.json
```

## `vpt stat-file vite-plus-monorepo/packages/vite-plus-library/.vscode --assert missing`

monorepo 包创建时不带 --editor 不应写入 VS Code 配置

```
vite-plus-monorepo/packages/vite-plus-library/.vscode: 缺失
```

## `cd vite-plus-monorepo && vp create --no-interactive vite:generator`

以非交互模式创建生成器


## `vpt list-dir vite-plus-monorepo/tools`

检查 tools 目录是否已创建

```
vite-plus-generator
```

## `vpt print-file vite-plus-monorepo/tools/vite-plus-generator/package.json`

检查 vite-plus-generator 的 package.json

```
{
  "name": "vite-plus-generator",
  "version": "0.0.0",
  "private": true,
  "description": "用于创建 Vite+ 代码生成器的起始模板。",
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

## `vp create vite:monorepo --no-interactive --directory my-vite-plus-monorepo`

使用自定义目录创建 monorepo


## `vpt list-dir my-vite-plus-monorepo`

检查已创建的文件

```
AGENTS.md
README.md
apps
package.json
packages
pnpm-workspace.yaml
tsconfig.json
vite.config.ts
```

## `vpt print-file my-vite-plus-monorepo/package.json`

检查 package.json

```
{
  "name": "my-vite-plus-monorepo",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "ready": "vp check && vp run -r test && vp run -r build",
    "dev": "vp run website#dev",
    "prepare": "vp config"
  },
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "<version>",
      "onFail": "download"
    }
  },
  "engines": {
    "node": ">=22.18.0"
  }
}
```
