# 迁移_组合式_Husky_自定义目录

## `git init`


## `vpt mkdir -p .config/husky/_`


## `vpt write-file .config/husky/pre-commit '#'\!'/usr/bin/env sh
npx lint-staged
'`


## `vpt write-file .config/husky/_/h '#'\!'/usr/bin/env sh
echo custom dispatcher
'`


## `vp migrate --no-interactive`

迁移应跳过自定义 Husky 配置

```
VITE+ - Web 的统一工具链

⚠ 检测到 Husky — 保持其钩子、配置和依赖不变。请先手动迁移 Husky，然后再启用 Vite+ 钩子。
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file package.json`

应保留 prepare 和 Husky 依赖

```
{
  "name": "migration-composed-husky-custom-dir",
  "scripts": {
    "prepare": "npm run build && husky install .config/husky"
  },
  "devDependencies": {
    "husky": "^9.1.7",
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
  vite: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```

## `vpt print-file .config/husky/pre-commit`

自定义钩子应保持不变

```
#!/usr/bin/env sh
npx lint-staged
```

## `vpt print-file .config/husky/_/h`

自定义调度器应保持不变

```
#!/usr/bin/env sh
echo custom dispatcher
```

## `vpt stat-file .vite-hooks --assert-not dir`

不应创建 Vite+ hook 树

```
.vite-hooks: missing
```
