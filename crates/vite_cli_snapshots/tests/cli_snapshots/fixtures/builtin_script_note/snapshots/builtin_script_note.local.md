# 内置脚本说明

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
注意：您正在将 `vp help` 作为 Vite+ 内置命令运行。如果您想运行 help npm 脚本，请改用 `vpr help`。
vp/<version>

用法：
  $ vp [root]

命令：
  [root]           启动开发服务器
  build [root]     构建生产版本
  optimize [root]  预捆绑依赖（已弃用，预捆绑过程会自动运行，无需调用）
  preview [root]   在本地预览生产构建

如需更多信息，请使用 `--help` 标志运行任意命令：
  $ vp --help
  $ vp build --help
  $ vp optimize --help
  $ vp preview --help

选项：
  --host [host]            [string] 指定主机名
  --port <port>            [number] 指定端口
  --open [path]            [boolean | string] 启动时打开浏览器
  --cors                   [boolean] 启用 CORS
  --strictPort             [boolean] 如果指定的端口已被占用则退出
  --force                  [boolean] 强制优化器忽略缓存并重新捆绑
  --experimentalBundle     [boolean] 使用实验性的完整捆绑模式（此功能高度实验性）
  -c, --config <file>      [string] 使用指定的配置文件
  --base <path>            [string] 公共基础路径（默认：/）
  -l, --logLevel <level>   [string] info | warn | error | silent
  --clearScreen            [boolean] 启用/禁用日志记录时清屏
  --configLoader <loader>  [string] 使用 'bundle' 通过 Rolldown 捆绑配置，或使用 'runner'（实验性）即时处理配置，或使用 'native'（实验性）通过原生运行时加载配置（默认：bundle）
  -d, --debug [feat]       [string | boolean] 显示调试日志
  -f, --filter <filter>    [string] 筛选调试日志
  -m, --mode <mode>        [string] 设置环境模式
  -h, --help               显示此消息
  -v, --version            显示版本号
```

## `vp preview --port 12312312312`

注意：此项目没有 `preview` 脚本

**退出代码：** 1

```
error when starting preview server:
Error: No available ports found between 12312312312 and 65535
```

## `vp lint src/`

该提示仍会输出到管道中，例如被 AI 代理捕获的命令；它会发送到 stderr，因此解析后的 stdout 保持不变

```
发现 0 个警告和 0 个错误。
使用 <n> 条规则和 <n> 个线程，在 <duration> 内完成对 1 个文件的处理。
[1m[2m提示：[0m[0m 你正在将 [94m`vp lint`[39m 作为 Vite+ 内置命令运行。如果你想运行 lint npm 脚本，请改用 [94m`vpr lint`[39m。
```
