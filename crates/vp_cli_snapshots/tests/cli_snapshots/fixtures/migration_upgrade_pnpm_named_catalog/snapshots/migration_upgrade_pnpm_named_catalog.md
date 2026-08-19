# 迁移_升级_pnpm_命名_目录

## `vp migrate --no-interactive`

复用现有的仅命名 Vite 技术栈目录

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖项：
    vite-plus  0.1.21 → <version>
    vite              → <version>
• 已配置包管理器设置
```

## `vpt print-file package.json`

catalog:vite-stack 依赖引用得以保留

```
{
  "name": "migration-upgrade-pnpm-named-catalog",
  "devDependencies": {
    "vite": "catalog:vite-stack",
    "vite-plus": "catalog:vite-stack"
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

桥接提交版本会写入 vite-stack

```
packages:
  - .

catalogs:
  repo-tooling:
    prettier: 3.8.3
  vite-stack:
    vite: npm:@voidzero-dev/vite-plus-core@<version>
    vitest: <version>
    vite-plus: <version>
overrides:
  vite@*: catalog:vite-stack
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```

## `vp migrate --no-interactive`

仅命名目录迁移具有幂等性

```
VITE+ - 面向 Web 的统一工具链

此项目已在使用 Vite+！祝编码愉快！
```

## `vpt print-file package.json`

重新运行后 package.json 保持不变

```
{
  "name": "migration-upgrade-pnpm-named-catalog",
  "devDependencies": {
    "vite": "catalog:vite-stack",
    "vite-plus": "catalog:vite-stack"
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

重新运行不会改变 catalog 的位置

```
packages:
  - .

catalogs:
  repo-tooling:
    prettier: 3.8.3
  vite-stack:
    vite: npm:@voidzero-dev/vite-plus-core@<version>
    vitest: <version>
    vite-plus: <version>
overrides:
  vite@*: catalog:vite-stack
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```
