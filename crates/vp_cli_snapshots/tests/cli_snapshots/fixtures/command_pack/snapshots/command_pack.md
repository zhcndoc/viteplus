# 命令包

## `vp pack -h`

应打印帮助信息

```
VITE+ - Web 的统一工具链

用法: vp pack [...files] [选项]

构建库。
选项将传递给 Vite+ Pack。

参数:
  [...files]  打包文件

Options:
  --no-config                   Disable config file
  -f, --format <format>         Bundle format: esm, cjs, iife, umd (default: esm)
  --clean                       Clean output directory, --no-clean to disable
  --deps.never-bundle <module>  Mark dependencies as external
  --minify                      Minify output
  --devtools                    Enable devtools integration
  --debug [feat]                Show debug logs
  --target <target>             Bundle target, e.g "es2015", "esnext"
  -l, --logLevel <level>        Set log level: info, warn, error, silent
  --fail-on-warn                Fail on warnings (default: true)
  --no-write                    Disable writing files to disk, incompatible with watch mode (default: true)
  -d, --out-dir <dir>           Output directory (default: dist)
  --treeshake                   Tree-shake bundle (default: true)
  --sourcemap                   Generate source map (default: false)
  --shims                       Enable cjs and esm shims (default: false)
  --platform <platform>         Target platform (default: node)
  --dts                         Generate dts files
  --publint                     Enable publint (default: false)
  --attw                        Enable Are the types wrong integration (default: false)
  --unused                      Enable unused dependencies check (default: false)
  -w, --watch [path]            Watch mode
  --ignore-watch <path>         Ignore custom paths in watch mode
  --from-vite [vitest]          Reuse config from Vite or Vitest
  --report                      Size report (default: true)
  --env.* <value>               Define compile-time env variables
  --env-file <file>             Load environment variables from a file, when used together with --env, variables in --env take precedence
  --env-prefix <prefix>         Prefix for env variables to inject into the bundle (default: TSDOWN_)
  --on-success <command>        Command to run on success
  --copy <dir>                  Copy files to output dir
  --public-dir <dir>            Alias for --copy, deprecated
  --tsconfig <tsconfig>         Set tsconfig path
  --unbundle                    Unbundle mode
  --root <dir>                  Root directory of input files
  --exe                         Bundle as executable
  -W, --workspace [dir]         Enable workspace mode
  --concurrency <count>         Maximum number of Rolldown builds to run in parallel
  -F, --filter <pattern>        Filter configs (cwd or name), e.g. /pkg-name$/ or pkg-name
  --exports                     Generate export-related metadata for package.json (experimental)
  -h, --help                    Display this message

示例:
  vp pack
  vp pack src/index.ts --dts
  vp pack --watch

文档：https://viteplus.dev/guide/pack
```

## `vp run pack`

应构建该库

```
$ vp pack src/index.ts
ℹ 入口：src/index.ts
ℹ 构建开始
ℹ dist/index.mjs  <大小> kB │ gzip：<大小> kB
ℹ 1 个文件，总计：<大小> kB
✔ 构建完成，用时 <时长>
```

## `vpt list-dir dist`

应包含库文件

```
index.mjs
```

## `vp run pack`

应命中缓存

```
$ vp pack src/index.ts ◉ 命中缓存，正在重放
ℹ 入口：src/index.ts
ℹ 开始构建
ℹ dist/index.mjs  <size> kB │ gzip：<size> kB
ℹ 1 个文件，总计：<size> kB
✔ 构建在 <duration> 内完成

---
vp run：命中缓存，节省 <duration>。
```
