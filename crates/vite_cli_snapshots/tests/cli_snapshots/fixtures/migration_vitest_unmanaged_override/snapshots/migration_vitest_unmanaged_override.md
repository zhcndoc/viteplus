# 迁移_vitest_非托管_覆盖

## `vp migrate --no-interactive`

未包含在托管覆盖配置中的 vitest 必须仍归用户所有

```
VITE+ - Web 统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
```

## `vpt print-file package.json`

用户的 Vitest 和 @vitest/ui 保持为直接的 devDependencies（未转换为 catalog:），因此它们仍由用户管理

```
{
  "name": "migration-vitest-unmanaged-override",
  "scripts": {
    "test": "vp test",
    "prepare": "vp config"
  },
  "devDependencies": {
    "@vitest/ui": "<version>",
    "vite": "catalog:",
    "vitest": "<version>",
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

不应引入 vitest catalog 或 override

```
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@latest
  vite-plus: <version>
overrides:
  vite: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```

## `vp migrate --no-interactive`

未受管理的 Vitest 生态系统版本在重新运行时保持稳定

```
VITE+ - 面向 Web 的统一工具链

此项目已在使用 Vite+！祝编码愉快！
```
