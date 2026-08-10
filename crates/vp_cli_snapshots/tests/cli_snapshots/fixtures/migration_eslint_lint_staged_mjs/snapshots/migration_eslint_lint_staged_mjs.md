# 将 ESLint 迁移至 lint-staged（MJS）

## `vp migrate --no-interactive`

未请求配置钩子时，迁移应保留非 JSON 格式的 lint-staged 配置

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

## `vpt print-file lint-staged.config.mjs`

验证非 JSON 的 lint-staged 配置保持不变

```
export default {
  '*.ts': ['eslint --fix'],
};
```
