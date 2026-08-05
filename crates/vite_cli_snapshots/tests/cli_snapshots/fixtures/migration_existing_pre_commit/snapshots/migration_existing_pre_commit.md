# 迁移现有的 pre-commit

## `git init`


## `vpt mkdir -p .husky`


## `vpt write-file .husky/pre-commit '#'\!'/usr/bin/env sh
npm test
secret-scan
'`


## `vpt chmod 755 .husky/pre-commit`


## `vpt print-file .husky/pre-commit`

迁移前检查现有的 pre-commit 钩子

```
#!/usr/bin/env sh
npm test
secret-scan
```

## `vp migrate --no-interactive`

迁移应保持现有的 Husky 钩子不变

```
VITE+ - Web 的统一工具链

⚠ 检测到 Husky — 保持其钩子、配置和依赖不变。启用 Vite+ 钩子前，请手动迁移 Husky。
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file .husky/pre-commit`

原始的 hook 路径和命令应保持不变

```
#!/usr/bin/env sh
npm test
secret-scan
```

## `vpt stat-file .vite-hooks --assert-not dir`

不应创建 Vite+ hook 树

```
.vite-hooks: 缺失
```
