# 迁移_跳过_Vite_依赖

## `vp migrate --no-interactive`

当 vite 位于依赖项中时，迁移应跳过重写 vite 导入

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新，已重写 1 个文件中的导入
```

## `vpt print-file src/index.ts`

Vite 的导入不应被重写，Vitest 的导入应被重写

```
import { defineConfig, type Plugin } from 'vite';
import { describe, it, expect } from 'vite-plus/test';

export function myApp(): Plugin {
  return {
    name: 'my-app',
    configResolved(config) {
      console.log(config);
    },
  };
}

describe('myApp', () => {
  it('should work', () => {
    expect(myApp()).toBeDefined();
  });
});

export default defineConfig({
  plugins: [myApp()],
});
```

## `vpt print-file package.json`

检查 package.json

```
{
  "name": "migration-skip-vite-dependency",
  "dependencies": {
    "vite": "catalog:"
  },
  "devDependencies": {
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
  vite-plus: <version>
overrides:
  vite@*: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```
