# 迁移_重写_声明_模块

## `vp migrate --no-interactive`

保留的 vitest 增强功能应使用包本地的 vitest

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
```

## `vpt print-file src/index.ts`

配置文件之外的 `vite`/`vitest` 模块声明会被保留：通过核心别名，对 `vite` 的扩展可以到达为 vite-plus `defineConfig` 提供类型的 `UserConfig`，而 vite-plus 没有导出 `UserConfig` 符号，无法与重写后的扩展声明合并

```
import type { RuntimeEnvConfig } from './runtime.env.config.js';
import type { RuntimeHtmlConfig } from './runtime.html.config.js';

declare module 'vite' {
  interface UserConfig {
    /**
     * vite-plugin-runtime-env 的选项
     */
    runtimeEnv?: RuntimeEnvConfig;
    /**
     * vite-plugin-runtime-html 的选项
     */
    runtimeHtml?: RuntimeHtmlConfig;
  }
}

declare module 'vitest' {
  export const describe: any;
  export const it: any;
  export const expect: any;
  export const beforeAll: any;
  export const afterAll: any;
}

declare module 'vitest/config' {
  export function defineConfig(config: any): any;
  const _default: typeof defineConfig;
  export default _default;
}
```

## `vpt print-file package.json`

检查 package.json

```
{
  "name": "migration-rewrite-declare-module",
  "devDependencies": {
    "vite": "catalog:",
    "vitest": "catalog:",
    "vite-plus": "catalog:"
  },
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "<version>",
      "onFail": "download"
    }
  },
  "scripts": {
    "prepare": "vp config"
  }
}
```

## `vpt print-file pnpm-workspace.yaml`

检查 pnpm-workspace.yaml 是否包含 overrides 和 catalog

```
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vitest: <version>
  vite-plus: <version>
overrides:
  vite@*: 'catalog:'
  vitest@*: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
    - vitest
  allowedVersions:
    vite: '*'
    vitest: '*'
```
