# 内置脚本注释

## `vp dev --port 12312312312`

`vp dev` 指向 `dev` 脚本（无效端口会立即退出服务器）

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

note: You are running `vp dev` as a Vite+ built-in command. If you meant to run the dev npm script, use `vpr dev` instead.
error when starting dev server:
Error: No available ports found between 12312312312 and 65535
```

## `vp build`

`vp build` 指向与抑制用例相同的构建脚本

```
VITE+ - The Unified Toolchain for the Web

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
VITE+ - Web 的统一工具链

提示：您正在将 `vp lint` 作为 Vite+ 内置命令运行。如果您想运行 lint npm 脚本，请改用 `vpr lint`。
发现 0 个警告和 0 个错误。
在 <duration> 内完成：1 个文件，使用 <n> 条规则和 <n> 个线程。
```

## `cd src && vp lint .`

提示：从子目录执行时会到达包含它的包，与 `vpr` 的行为一致。

```
VITE+ - Web 统一工具链

提示：你正在将 `vp lint` 作为 Vite+ 内置命令运行。如果你想运行 lint npm 脚本，请改用 `vpr lint`。
发现 0 个警告和 0 个错误。
在 <duration> 内完成了对 1 个文件的检查，使用了 <n> 条规则和 <n> 个线程。
```

## `vp format src/`

`format` 别名会按输入内容到达本地 CLI，因此其自身的脚本会收到以下提示：

```
VITE+ - Web 的统一工具链

提示：您正在将 `vp format` 作为 Vite+ 内置命令运行。如果您想运行 format npm 脚本，请改用 `vpr format`。
已在 <duration> 内使用 <n> 个线程处理了 1 个文件。
```

## `vp fmt src/`

注意：这里仅有 `format` 脚本，而这并不是运行此命令时使用的名称

```
VITE+ - Web 的统一工具链

使用 <n> 个线程处理 1 个文件，于 <duration> 内完成。
```

## `vp help dev`

本地路径检查原始的 `help` 拼写；全局 CLI 在委托给本地命令之前渲染帮助信息

```
VITE+ - Web 的统一工具链

用法：vp dev [ROOT] [OPTIONS]

运行开发服务器。
选项会转发给 Vite。

参数：
  [ROOT]  项目根目录（默认：当前目录）

选项：
  --host [HOST]        指定主机名
  --port <PORT>        指定端口
  --open [PATH]        启动时打开浏览器
  --strictPort         如果指定端口已被占用则退出
  -c, --config <FILE>  使用指定的配置文件
  --base <PATH>        公共基础路径
  -m, --mode <MODE>    设置环境模式
  -h, --help           打印帮助信息

示例：
  vp dev
  vp dev --open
  vp dev --host localhost --port 5173

文档：https://viteplus.dev/guide/dev
```

## `vp preview --port 12312312312`

注意：此项目没有 `preview` 脚本

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error when starting preview server:
Error: No available ports found between 12312312312 and 65535
```

## `vp lint src/`

该提示仍会输出到管道输出中，例如被 AI 代理捕获的命令；它会发送到 stderr，因此解析后的 stdout 保持不变

```
发现 0 个警告和 0 个错误。
已在 <duration> 内完成对 1 个文件的检查，使用了 <n> 条规则和 <n> 个线程。
[1m[2m提示：[0m[0m 你正在将 [94m`vp lint`[39m 作为 Vite+ 内置命令运行。如果你是想运行 lint npm 脚本，请改用 [94m`vpr lint`[39m。
```
