# 迁移_跳过_Vite_对等依赖

## `vp migrate --no-interactive`

迁移应保留 Vite 的同级依赖契约

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新，已重写 1 个文件中的导入
```

## `vpt print-file src/index.ts`

Vite 导入保持公开，Vitest 导入重写

```
import { defineConfig, type Plugin } from 'vite';
import { describe, it, expect } from 'vite-plus/test';

export function myVitePlugin(): Plugin {
  return {
    name: 'my-vite-plugin',
    configResolved(config) {
      console.log(config);
    },
  };
}

describe('myVitePlugin', () => {
  it('should work', () => {
    expect(myVitePlugin()).toBeDefined();
  });
});

export default defineConfig({
  plugins: [myVitePlugin()],
});
```

## `vpt print-file package.json`

vite 对等依赖范围得以保留

```
{
  "name": "migration-skip-vite-peer-dependency",
  "peerDependencies": {
    "vite": "^6.0.0"
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
