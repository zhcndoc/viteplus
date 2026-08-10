# 内置脚本说明。

## `vp dev --port 12312312312`

`vp dev` 指向 `dev` 脚本（无效端口会使服务器立即退出）

**退出代码：** 1

```
note: You are running `vp dev` as a Vite+ built-in command. If you meant to run the dev npm script, use `vpr dev` instead.
error when starting dev server:
Error: No available ports found between 12312312312 and 65535
```

## `vp build`

`vp build` 指向与抑制用例相同的构建脚本

```
note: You are running `vp build` as a Vite+ built-in command. If you meant to run the build npm script, use `vpr build` instead.
✓ 4 modules transformed.
computing gzip size...
dist/index.html                <size> kB │ gzip: <size> kB
dist/assets/index-<hash>.js  <size> kB │ gzip: <size> kB

✓ built in <duration>
```

## `vp lint src/`

每个可能被误认为脚本的内置命令都会显示相同的提示

```
提示：您正在将 `vp lint` 作为 Vite+ 内置命令运行。如果您想运行 lint npm 脚本，请改用 `vpr lint`。
发现 0 个警告和 0 个错误。
使用 <n> 个规则和 <n> 个线程在 1 个文件上完成，耗时 <duration>。
```

## `cd src && vp lint .`

注意：您正在将 `vp lint` 作为 Vite+ 内置命令运行。如果您想运行 lint npm 脚本，请改用 `vpr lint`。

```
注意：您正在将 `vp lint` 作为 Vite+ 内置命令运行。如果您想运行 lint npm 脚本，请改用 `vpr lint`。
发现 0 个警告和 0 个错误。
在 <duration> 内完成：1 个文件，使用 <n> 条规则和 <n> 个线程。
```

## `vp format src/`

`format` 别名会按输入内容传递给本地 CLI，因此其自身的脚本会收到以下提示：

```
提示：您正在将 `vp format` 作为 Vite+ 内置命令运行。如果您想运行 format npm 脚本，请改用 `vpr format`。
已使用 <n> 个线程处理 1 个文件，耗时 <duration>。
```

## `vp fmt src/`

注意：此处只有 `format` 是一个脚本，而这并不是该脚本运行时所使用的名称

```
Finished in <duration> on 1 files using <n> threads.
```

## `vp help dev`

本地路径检查原始的 `help` 拼写；全局 CLI 会在委托给本地命令之前渲染帮助信息

```
VITE+ - The Unified Toolchain for the Web

Usage: vp dev [ROOT] [OPTIONS]

Run the development server.
Options are forwarded to Vite.

Arguments:
  [ROOT]  Project root directory (default: current directory)

Options:
  --host [host]           [string] specify hostname
  --port <port>           [number] specify port
  --open [path]           [boolean | string] open browser on startup
  --cors                  [boolean] enable CORS
  --strictPort            [boolean] exit if specified port is already in use
  --force                 [boolean] force the optimizer to ignore the cache and re-bundle
  --experimentalBundle    [boolean] use experimental full bundle mode (this is highly experimental)
  --base <path>           [string] public base path (default: /)
  -l, --logLevel <level>  [string] info | warn | error | silent
  --clearScreen           [boolean] allow/disable clear screen when logging
  -d, --debug [feat]      [string | boolean] show debug logs
  -f, --filter <filter>   [string] filter debug logs
  -m, --mode <mode>       [string] set env mode
  -h, --help              Display this message

Examples:
  vp dev
  vp dev --open
  vp dev --host localhost --port 5173

Documentation: https://viteplus.dev/guide/dev
```

## `vp preview --port 12312312312`

注意：此项目没有 `preview` 脚本

**退出代码：** 1

```
启动预览服务器时出错：
错误：在 12312312312 到 65535 之间未找到可用端口
```

## `vp lint src/`

该提示仍会输出到管道中，例如被 AI 代理捕获的命令；它会发送到 stderr，因此解析后的 stdout 保持不变

```
发现 0 个警告和 0 个错误。
使用 <n> 条规则和 <n> 个线程，在 <duration> 内完成对 1 个文件的处理。
[1m[2m提示：[0m[0m 你正在将 [94m`vp lint`[39m 作为 Vite+ 内置命令运行。如果你想运行 lint npm 脚本，请改用 [94m`vpr lint`[39m。
```
