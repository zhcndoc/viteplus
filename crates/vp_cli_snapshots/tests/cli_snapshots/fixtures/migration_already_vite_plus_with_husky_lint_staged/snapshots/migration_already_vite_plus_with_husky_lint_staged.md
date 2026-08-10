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

--hooks 仍会保留检测到的 Husky 配置

```
VITE+ - Web 统一工具链

⚠ 检测到 Husky — 保持其 hooks、配置和依赖不变。在启用 Vite+ hooks 前，请手动迁移 Husky。
此项目已经在使用 Vite+！祝编码愉快！
```

## `vpt print-file package.json`

Husky 和 lint-staged 元数据应保留

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

## `vpt print-file .husky/pre-commit`

Husky 钩子应保持不变

```
npx lint-staged
```

## `vpt stat-file .husky --assert dir`

.husky 应保持不变

```
.husky: dir
```
