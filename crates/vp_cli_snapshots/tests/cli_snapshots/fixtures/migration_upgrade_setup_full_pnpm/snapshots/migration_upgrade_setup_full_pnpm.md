# migration_upgrade_setup_full_pnpm

## `vpt chmod +x fix-baseurl.mjs`

将 baseUrl 修复器替换为桩，以便 dlx 保持离线

```
```

## `vp migrate --full --no-interactive`

现有的 Vite+ 项目：升级并完成完整设置

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖：
    vite-plus  0.1.21 → <version>
    vite              → <version>
• 已应用 2 项配置更新
• Node 版本管理器文件已迁移为 .node-version
• 已配置包管理器设置
```

## `vpt print-file package.json`

已应用 vite-plus 版本升级

```
{
  "name": "migration-upgrade-setup-full-pnpm",
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
  },
  "scripts": {
    "prepare": "vp config"
  }
}
```

## `vpt print-file .node-version`

完整设置过程会将 .nvmrc 迁移为 .node-version

```
20.19.0
```

## `vpt stat-file .nvmrc --assert-not file`

原始的 .nvmrc 已被移除

```
.nvmrc: missing
```

## `vpt print-file tsconfig.json`

完整设置会移除 tsconfig 中的 baseUrl

```
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "NodeNext"
  }
}
```
