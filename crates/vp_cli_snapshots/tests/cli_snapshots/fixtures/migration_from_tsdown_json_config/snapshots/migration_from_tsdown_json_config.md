# 从 tsdown JSON 配置迁移

## `vp migrate --no-interactive`

迁移应将导入重写为 vite-plus

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <版本>
• Node <版本>  pnpm <版本>
• 已应用 2 项配置更新
```

## `vpt stat-file tsdown.config.json --assert-not file`

检查是否应删除 tsdown.config.json

```
tsdown.config.json: missing
```

## `vpt print-file vite.config.ts`

检查 vite.config.ts

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    "*": "vp check --fix"
  },
  pack: {
    "entry": "src/index.ts",
    "outDir": "dist",
    "format": ["esm", "cjs"],
    "dts": true,
    "inputOptions": {
      "cwd": "./src"
    }
  },
  fmt: {},
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
  server: {
    port: 3000,
  },
});
```

## `vpt print-file package.json`

检查 package.json

```
{
  "name": "migration-from-tsdown-json-config",
  "scripts": {
    "build": "vp pack",
    "build:watch": "vp pack --watch",
    "build:dts": "vp pack --dts",
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
  }
}
```

## `vpt print-file pnpm-workspace.yaml`

检查 pnpm-workspace.yaml 是否包含 overrides 和 catalog

```
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
overrides:
  vite@*: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```

## `vp migrate --no-interactive`

再次运行迁移，以检查其是否具有幂等性

```
VITE+ - Web 的统一工具链

此项目已经在使用 Vite+！祝编码愉快！
```

## `vpt print-file vite.config.ts`

检查 vite.config.ts

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    "*": "vp check --fix"
  },
  pack: {
    "entry": "src/index.ts",
    "outDir": "dist",
    "format": ["esm", "cjs"],
    "dts": true,
    "inputOptions": {
      "cwd": "./src"
    }
  },
  fmt: {},
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
  server: {
    port: 3000,
  },
});
```

## `vpt print-file package.json`

检查 package.json

```
{
  "name": "migration-from-tsdown-json-config",
  "scripts": {
    "build": "vp pack",
    "build:watch": "vp pack --watch",
    "build:dts": "vp pack --dts",
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
  }
}
```
