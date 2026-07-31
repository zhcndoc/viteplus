# new_vite_monorepo_bun

## `vp create vite:monorepo --no-interactive --package-manager bun --git`

使用 bun 创建 monorepo


## `vpt list-dir vite-plus-monorepo`

检查已创建的文件

```
AGENTS.md
README.md
apps
package.json
packages
tsconfig.json
vite.config.ts
```

## `vpt print-file vite-plus-monorepo/package.json`

使用 catalog 检查 package.json

```
{
  "name": "vite-plus-monorepo",
  "version": "0.0.0",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*",
    "tools/*"
  ],
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
  "overrides": {
    "vite": "catalog:"
  },
  "devEngines": {
    "packageManager": {
      "name": "bun",
      "version": "<version>",
      "onFail": "download"
    }
  },
  "engines": {
    "node": ">=22.18.0"
  },
  "catalog": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>",
    "vite-plus": "<version>"
  }
}
```

## `vpt stat-file vite-plus-monorepo/pnpm-workspace.yaml --assert-not file`

验证不存在 pnpm 配置

```
vite-plus-monorepo/pnpm-workspace.yaml: missing
```

## `vpt stat-file vite-plus-monorepo/.yarnrc.yml --assert-not file`

验证不存在 yarn 配置

```
vite-plus-monorepo/.yarnrc.yml: missing
```

## `vpt stat-file vite-plus-monorepo/.git --assert dir`

检查 git init

```
vite-plus-monorepo/.git: dir
```

## `vpt list-dir vite-plus-monorepo/apps`

检查 apps 目录

```
website
```

## `vpt print-file vite-plus-monorepo/apps/website/package.json`

检查网站是否使用 catalog：

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
    "typescript": "^7.0.2",
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
  "description": "A starter for creating a TypeScript package.",
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
    "@types/node": "^26.1.1",
    "bumpp": "^11.1.0",
    "typescript": "^7.0.2",
    "vite-plus": "catalog:"
  }
}
```
