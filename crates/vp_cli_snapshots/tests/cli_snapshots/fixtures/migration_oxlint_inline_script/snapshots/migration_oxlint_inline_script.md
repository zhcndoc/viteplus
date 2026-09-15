# migration_oxlint_inline_script

## `vp migrate --no-interactive --no-hooks --no-agent --no-editor`


## `vpt print-file package.json`

未更改的内联脚本仍需要直接依赖 @oxlint/plugins。

```
{
  "name": "migration-oxlint-inline-script",
  "private": true,
  "scripts": {
    "check-plugin": "node -e \"console.log(typeof require('@oxlint/plugins').defineRule)\""
  },
  "devDependencies": {
    "@oxlint/plugins": "1.79.0",
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "packageManager": "pnpm@11.24.0"
}
```

## `vpt rm -rf node_modules`


## `vp install --ignore-scripts`


## `vp run check-plugin`

严格重新安装 pnpm 后，脚本解析其插件 API。

```
VITE+ - The Unified Toolchain for the Web

$ node -e "console.log(typeof require('@oxlint/plugins').defineRule)" ⊘ cache disabled
function
```
