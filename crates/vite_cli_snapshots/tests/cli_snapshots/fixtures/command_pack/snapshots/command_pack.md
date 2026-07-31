# 命令包

## `vp pack -h`

应打印帮助信息

```
vp pack

用法：
  $ vp pack [...files]

命令：
  [...files]  打包文件

如需了解更多信息，请使用 `--help` 标志运行任意命令：
  $ vp pack --help

选项：
  --config-loader <loader>      要使用的配置加载器：auto、native、tsx、unrun（默认：auto）
  --no-config                   禁用配置文件（默认：true）
  -f, --format <format>         打包格式：esm、cjs、iife、umd（默认：esm）
  --clean                       清理输出目录，使用 --no-clean 禁用
  --deps.never-bundle <module>  将依赖标记为外部依赖
  --minify                      压缩输出
  --devtools                    启用 devtools 集成
  --debug [feat]                显示调试日志
  --target <target>             打包目标，例如 "es2015"、"esnext"
  -l, --logLevel <level>        设置日志级别：info、warn、error、silent
  --fail-on-warn                警告时失败（默认：true）
  --no-write                    禁止将文件写入磁盘，与 watch 模式不兼容（默认：true）
  -d, --out-dir <dir>           输出目录（默认：dist）
  --treeshake                   对打包结果进行 Tree Shaking（默认：true）
  --sourcemap                   生成源映射（默认：false）
  --shims                       启用 cjs 和 esm shims（默认：false）
  --platform <platform>         目标平台（默认：node）
  --dts                         生成 dts 文件
  --publint                     启用 publint（默认：false）
  --attw                        启用 Are the types wrong 集成（默认：false）
  --unused                      启用未使用依赖检查（默认：false）
  -w, --watch [path]            监视模式
  --ignore-watch <path>         在监视模式下忽略自定义路径
  --from-vite [vitest]          复用 Vite 或 Vitest 的配置
  --report                      大小报告（默认：true）
  --env.* <value>               定义编译时环境变量
  --env-file <file>             从文件加载环境变量，与 --env 一起使用时，--env 中的变量优先级更高
  --env-prefix <prefix>         要注入到打包结果中的环境变量前缀（默认：VITE_PACK_、TSDOWN_）
  --on-success <command>        成功时要运行的命令
  --copy <dir>                  将文件复制到输出目录
  --public-dir <dir>            --copy 的别名，已弃用
  --tsconfig <tsconfig>         设置 tsconfig 路径
  --unbundle                    取消打包模式
  --root <dir>                  输入文件的根目录
  --exe                         打包为可执行文件
  -W, --workspace [dir]         启用工作区模式
  --concurrency <count>         并行运行的 Rolldown 构建任务的最大数量
  -F, --filter <pattern>        筛选配置（cwd 或名称），例如 /pkg-name$/ 或 pkg-name
  --exports                     为 package.json 生成与导出相关的元数据（实验性）
  -h, --help                    显示此消息
```

## `vp run pack`

应构建该库

```
$ vp pack src/index.ts
ℹ entry: src/index.ts
ℹ Build start
ℹ dist/index.mjs  <size> kB │ gzip: <size> kB
ℹ 1 files, total: <size> kB
✔ Build complete in <duration>
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
