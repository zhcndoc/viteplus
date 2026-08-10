# default_package_define_config_wrapper

`defineConfig({ ... } satisfies UserConfig)` 内部的 defaultPackage 也会生效：  
defineConfig 参数上的包装器同样会被解包。

## `cd dc_wrapper && vp build`

```
VITE+ - The Unified Toolchain for the Web

note: vp build: using ./frontend (defaultPackage in vite.config.ts)
✓ 2 modules transformed.
computing gzip size...
dist/index.html  <size> kB │ gzip: <size> kB

✓ built in <duration>
```
