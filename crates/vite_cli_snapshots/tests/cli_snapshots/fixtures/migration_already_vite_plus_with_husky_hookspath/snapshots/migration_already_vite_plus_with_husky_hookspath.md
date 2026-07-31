# 迁移_已使用_Vite Plus_并配置_Husky_hooksPath

## `git init`


## `git config core.hooksPath .husky/_`


## `vp migrate --no-interactive`

版本更新会将旧版 husky 钩子延迟到 `--full`

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖：
    vite-plus  latest → <version>
    vite              → <version>
• 已配置包管理器设置
• 已跳过编辑器、钩子和 lint 设置。运行 `vp migrate --full` 以应用这些设置。
```

## `git config --local core.hooksPath`

仍然是 husky 的 .husky/_（未被覆盖）

```
.husky/_
```

## `vp migrate --hooks --no-interactive`

--hooks 覆盖 husky 的 core.hooksPath 并迁移钩子

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖项：
    vite   → <version>
• 已应用 2 项配置更新
• 已配置 Git 钩子
```

## `vpt print-file package.json`

应移除 husky/lint-staged，prepare 应为 vp config

```
{
  "name": "migration-already-vite-plus-with-husky-hookspath",
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

pre-commit 钩子应被重写为

```
vp staged
```

## `git config --local core.hooksPath`

应为 .vite-hooks/_

```
.vite-hooks/_
```
