# 已迁移至 Vite Plus 并配置 Husky lint-staged

## `git init`


## `vp migrate --no-interactive`

版本更新将旧版 husky/lint-staged 配置延后至 `--full`

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖：
    vite-plus  最新版 → <version>
    vite              → <version>
• 已配置包管理器设置
• 已跳过编辑器、钩子和 lint 设置。运行 `vp migrate --full` 以应用这些设置。
```

## `vpt print-file package.json`

husky/lint-staged 和 prepare 保持不变

```
{
  "name": "migration-already-vite-plus-with-husky-lint-staged",
  "scripts": {
    "prepare": "husky"
  },
  "devDependencies": {
    "husky": "^9.1.7",
    "lint-staged": "^16.2.7",
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "lint-staged": {
    "*": "vp check --fix"
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

## `vpt stat-file .husky --assert dir`

.husky 已保留

```
.husky: dir
```

## `vp migrate --hooks --no-interactive`

--hooks 选择迁移旧版 husky/lint-staged

```
VITE+ - Web 统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖：
    vite   → <version>
• 已应用 2 项配置更新
• Git hooks 已配置
```

## `vpt print-file package.json`

应移除 husky/lint-staged，prepare 应设置为 vp config

```
{
  "name": "migration-already-vite-plus-with-husky-lint-staged",
  "scripts": {
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

## `vpt print-file .vite-hooks/pre-commit`

pre-commit 钩子应重写为

```
vp staged
```

## `vpt stat-file .husky --assert-not dir`

应移除 .husky

```
.husky: missing
```
