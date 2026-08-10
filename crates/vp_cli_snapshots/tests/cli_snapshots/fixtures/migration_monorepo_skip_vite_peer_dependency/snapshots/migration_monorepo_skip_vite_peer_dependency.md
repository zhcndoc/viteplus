# 迁移 monorepo 跳过 Vite 对等依赖

## `vp migrate --no-interactive`

迁移应保留工作区包中的 Vite 对等依赖契约

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <版本>
• Node <版本>  pnpm <版本>
• 已应用 2 项配置更新，已重写 1 个文件中的导入
```

## `vpt print-file packages/vite-plugin/src/index.ts`

vite-plugin 将 vite 作为 peerDeps：vite 的导入保持公开，vitest 会进行重写

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

检查根目录的 package.json（没有 peerDependencies）

```
{
  "name": "migration-monorepo-skip-vite-peer-dependency",
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
  "scripts": {
    "prepare": "vp config"
  }
}
```

## `vpt print-file packages/vite-plugin/package.json`

Vite 对等依赖版本范围得以保留

```
{
  "name": "my-vite-plugin",
  "peerDependencies": {
    "vite": "^6.0.0"
  },
  "devDependencies": {
    "vite-plus": "catalog:"
  }
}
```
