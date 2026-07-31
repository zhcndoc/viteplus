# 迁移升级_vite_plus_协议_固定_npm

## `vp migrate --no-interactive`

刻意固定的 Vite+ 协议必须在引导过程中保持不变

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  npm <version>
• 依赖项：
    vite   → <version>
• 已配置包管理器设置
```

## `vpt print-file package.json`

应保留文件 pin，同时移除过时的 vitest 配置

```
{
  "name": "migration-upgrade-vite-plus-protocol-pin-npm",
  "devDependencies": {
    "vite-plus": "file:../custom-vite-plus"
  },
  "overrides": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>"
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
