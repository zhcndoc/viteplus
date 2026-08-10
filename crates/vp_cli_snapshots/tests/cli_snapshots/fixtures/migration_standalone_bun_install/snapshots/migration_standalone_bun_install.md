# 迁移独立 Bun 安装

## `vp migrate --no-interactive --no-hooks`

独立（非工作区）bun 升级必须保留具体版本规格，以便 `bun install` 能够解析，而不是失败并显示 `vite@catalog: failed to resolve`

```
VITE+ - The Unified Toolchain for the Web

Formatting code...

Code formatted
◇ Updated . to Vite+ <version>
• Node <version>  bun <version>
• Dependencies:
    vite-plus  0.1.24 → <version>
    vite              → <version>
✓ Dependencies installed in <duration>
• Package manager settings configured
```

## `vpt print-file package.json`

vite/vite-plus 保持具体值（vite 通过 @voidzero-dev/vite-plus-core 别名）；不会写入顶层 catalog 字段

```
{
  "name": "migration-standalone-bun-install",
  "private": true,
  "devDependencies": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>",
    "vite-plus": "<version>"
  },
  "overrides": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>"
  },
  "devEngines": {
    "packageManager": {
      "name": "bun",
      "version": "<version>",
      "onFail": "download"
    }
  }
}
```
