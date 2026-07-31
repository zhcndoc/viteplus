# 独立 npm 迁移

## `vp migrate --no-interactive --no-hooks`

迁移应适用于 npm，添加 overrides，并更新锁文件

```
VITE+ - 面向 Web 的统一工具链

正在格式化代码...

代码格式化完成
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  npm <version>
✓ 已在 <duration> 内安装依赖
• 已应用 1 项配置更新
```

## `vpt print-file package.json`

检查 package.json 是否包含 overrides 字段（而不是 pnpm.overrides）

```
{
  "name": "migration-standalone-npm",
  "devDependencies": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>",
    "vite-plus": "<version>"
  },
  "overrides": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>"
  },
  "packageManager": "npm@10.9.2"
}
```

## `vpt grep-file package-lock.json @voidzero-dev/vite-plus-core`

锁文件已更新，并添加了 vite 覆盖（别名为 @voidzero-dev/vite-plus-core）

```
package-lock.json: found "@voidzero-dev/vite-plus-core"
```
