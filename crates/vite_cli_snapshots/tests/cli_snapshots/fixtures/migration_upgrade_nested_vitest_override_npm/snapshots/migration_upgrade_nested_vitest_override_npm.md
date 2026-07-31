# migration_upgrade_nested_vitest_override_npm

## `vp migrate --no-interactive`

嵌套的 Vitest 覆盖配置由用户管理，暂无移除计划

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  npm <version>
• 依赖：
    vite-plus  latest → <version>
    vite              → <version>
• 包管理器设置已配置
```

## `vpt print-file package.json`

对象值 override 得以保留

```
{
  "name": "migration-upgrade-nested-vitest-override-npm",
  "devDependencies": {
    "vite-plus": "<version>"
  },
  "overrides": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>",
    "vitest": {
      "@vitest/runner": "<version>"
    }
  },
  "devEngines": {
    "packageManager": {
      "name": "npm",
      "version": "<version>",
      "onFail": "download"
    }
  }
}
```

## `vp migrate --no-interactive`

嵌套覆盖不应导致迁移永久处于待处理状态

```
VITE+ - 面向 Web 的统一工具链

此项目已在使用 Vite+！祝编码愉快！
```
