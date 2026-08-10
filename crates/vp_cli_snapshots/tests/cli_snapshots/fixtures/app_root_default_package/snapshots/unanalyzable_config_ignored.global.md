# unanalyzable_config_ignored

用于 spread/无法分析的配置的回归保护：一个只能解析为开放映射的配置可能会将 defaultPackage 隐藏在 spread 后面，但这不应导致命令失败。直接运行 vp build 会回退并在原地运行。

## `cd spread && vp build`

```
VITE+ - The Unified Toolchain for the Web

✓ 2 modules transformed.
computing gzip size...
dist/index.html  <size> kB │ gzip: <size> kB

✓ built in <duration>
```
