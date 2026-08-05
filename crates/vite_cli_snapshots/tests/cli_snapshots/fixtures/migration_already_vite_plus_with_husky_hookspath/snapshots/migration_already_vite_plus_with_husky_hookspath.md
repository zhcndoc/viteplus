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
    vite-plus  最新 → <version>
    vite              → <version>
• 已配置包管理器设置
• 已跳过编辑器、钩子和 lint 设置。运行 `vp migrate --full` 以应用这些设置。
```

## `git config --local core.hooksPath`

仍然是 Husky 的 .husky/_（未被覆盖）

```
.husky/_
```

## `vp migrate --hooks --no-interactive`

--hooks 仍会保留检测到的 Husky 设置

```
VITE+ - Web 的统一工具链

⚠ 检测到 Husky — 将保持其钩子、配置和依赖不变。在启用 Vite+ 钩子之前，请先手动迁移 Husky。
此项目已经在使用 Vite+！祝编码愉快！
```

## `vpt print-file package.json`

Husky 和 lint-staged 元数据应予以保留

```
{
  "name": "migration-already-vite-plus-with-husky-hookspath",
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

## `git config --local core.hooksPath`

Husky 的 hooksPath 应保持为

```
.husky/_
```
