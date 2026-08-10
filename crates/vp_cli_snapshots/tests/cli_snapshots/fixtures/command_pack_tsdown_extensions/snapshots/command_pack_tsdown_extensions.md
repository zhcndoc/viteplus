# command_pack_tsdown_extensions

## `node verify-extensions.mjs`

捆绑的 @tsdown/exe 和 @tsdown/css 无需顶层 tsdown 即可加载（问题 #1586）

```
tsdown-exe.js: getCacheDir, getCachedBinaryPath, getTargetSuffix, resolveNodeBinary
tsdown-css.js: CssPlugin, resolveCssOptions
```
