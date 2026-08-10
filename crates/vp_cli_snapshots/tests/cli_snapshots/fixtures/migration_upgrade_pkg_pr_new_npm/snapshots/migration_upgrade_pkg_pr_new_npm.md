# migration_upgrade_pkg_pr_new_npm

## `vp migrate --no-interactive`

桥接提交构建会替换所有过时的受管理规范

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  npm <version>
• 依赖项：
    vite-plus  0.1.20 → <version>
    vite              → <version>
• 已配置包管理器设置
```

## `vpt print-file package.json`

直接依赖和 npm 覆盖使用相同的不可变提交版本

```
{
  "name": "migration-upgrade-pkg-pr-new-npm",
  "devDependencies": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>",
    "vite-plus": "<version>"
  },
  "overrides": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>"
  },
  "packageManager": "npm@11.11.1"
}
```

## `vp migrate --no-interactive`

桥接提交迁移具有幂等性

```
VITE+ - Web 的统一工具链

此项目已经在使用 Vite+！祝编码愉快！
```

## `vpt print-file package.json`

重新运行后 package.json 保持不变（与第一次迁移结果完全相同）

```
{
  "name": "migration-upgrade-pkg-pr-new-npm",
  "devDependencies": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>",
    "vite-plus": "<version>"
  },
  "overrides": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>"
  },
  "packageManager": "npm@11.11.1"
}
```
