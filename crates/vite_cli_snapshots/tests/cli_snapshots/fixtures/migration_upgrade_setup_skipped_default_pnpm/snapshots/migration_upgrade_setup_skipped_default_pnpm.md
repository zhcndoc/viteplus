# 迁移升级设置跳过默认 pnpm

## `vp migrate --no-interactive`

现有 Vite+ 项目：仅升级工具链版本，跳过完整设置

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖：
    vite-plus  0.1.21 → <version>
    vite              → <version>
• 已配置包管理器设置
• 已跳过编辑器、钩子和 lint 设置。运行 `vp migrate --full` 以应用这些设置。
```

## `vpt print-file package.json`

已应用 vite-plus 版本升级

```
{
  "name": "migration-upgrade-setup-skipped-default-pnpm",
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

## `vpt print-file pnpm-workspace.yaml`

通过版本升级整合的 pnpm 设置

```
overrides:
  vite: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
```

## `vpt stat-file .nvmrc --assert file`

不使用 `--full` 时，.nvmrc 保持不变

```
.nvmrc: file
```

## `vpt stat-file .node-version --assert-not file`

未写入 .node-version

```
.node-version：缺失
```

## `vpt print-file tsconfig.json`

未使用 --full 时，tsconfig 的 baseUrl 保持不变

```
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "NodeNext",
    "baseUrl": "."
  }
}
```
