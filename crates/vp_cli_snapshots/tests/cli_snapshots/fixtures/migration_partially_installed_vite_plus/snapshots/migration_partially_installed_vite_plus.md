# migration_partially_installed_vite_plus

## `vp migrate --no-interactive --no-hooks --no-agent --no-editor`

即使 Vite+ 已安装在 pnpm 项目中，也应完成核心重写

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖项：
    vite-plus  0.1.24 → <version>
    vite              → <version>
• 已重写 1 个文件中的导入
• 已配置包管理器设置
```

## `vpt print-file package.json`

应重写 scripts，不添加 package.json overrides

```
{
  "name": "manual-vp-migrate",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vp dev",
    "build": "tsc -b && vp build",
    "lint": "vp lint .",
    "preview": "vp preview"
  },
  "dependencies": {
    "react": "^19.2.6",
    "react-dom": "^19.2.6"
  },
  "devDependencies": {
    "@types/node": "^24.12.3",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "globals": "^17.6.0",
    "typescript": "~6.0.2",
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

应配置 pnpm overrides 和 peerDependencyRules

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

## `vpt print-file vite.config.ts`

vite 导入应被重写

```
import { defineConfig } from 'vite-plus'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

## `vpt print-file tsconfig.app.json`

vite/client 已保留（问题 #2004：tsconfig 不是 vite.config）

```
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

## `vpt stat-file AGENTS.md --assert-not file`

已禁用的代理设置不应写入指令

```
AGENTS.md: missing
```

## `vpt stat-file .vite-hooks --assert-not dir`

已禁用的钩子设置不应写入钩子

```
.vite-hooks：缺失
```

## `vpt stat-file .vscode --assert-not dir`

已禁用的编辑器设置不应写入编辑器配置

```
.vscode: missing
```
