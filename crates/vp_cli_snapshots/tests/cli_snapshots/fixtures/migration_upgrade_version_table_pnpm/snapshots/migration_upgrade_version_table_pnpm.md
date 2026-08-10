# 迁移_升级_版本_表_pnpm

## `vpt write-file node_modules/vite/package.json '{"name":"@voidzero-dev/vite-plus-core","version":"0.1.21","bundledVersions":{"vite":"8.0.0"}}'`

为已安装的 vite-plus-core 别名创建存根，以便读取上游 Vite 的原始版本


## `vp migrate --no-interactive`

现有 Vite+ 升级会显示工具链版本变更表，其中包含原始的 vite 行

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖：
    vite-plus            0.1.21 → <version>
    vite                 8.0.0  → <version>
    vitest               3.2.4  → <version>
    @vitest/coverage-v8  3.2.4  → <version>
• 已配置包管理器设置
```
