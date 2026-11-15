# 运行二进制文件

使用 `vpx`、`vp exec` 和 `vp dlx` 运行软件包二进制文件和脚本，无需在本地安装、下载的包和项目特定工具之间切换。

## 概述

`vpx` 会根据第一个参数执行以下操作之一：

- [`vpx <package>`](#运行软件包二进制文件) 运行来自本地或远程 npm 包的二进制文件，类似 `npx`。
- [`vpx <file>`](#running-scripts) 运行 TypeScript 或 JavaScript 文件，类似 `tsx`；[`vpx --watch <file>`](#watch-mode) 会在文件所用内容变化时重新运行，类似 `tsx watch`。

其他命令可以更严格地控制二进制文件的来源：

- [`vp exec`](#vp-exec) 从本地 `node_modules/.bin` 目录运行命令，找不到时回退到 `PATH`。
- [`vp dlx`](#vp-dlx) 在不将软件包添加为依赖项的情况下运行软件包二进制文件。

`vpx -v` 或 `vpx --version` 会显示 Vite+ 版本，类似 `vp --version`。在 `package.json` 脚本中，`vpx` 会显示项目 `vite-plus` 包的版本。

## 运行软件包二进制文件 {#running-package-binaries}

```bash
vpx [options] <pkg[@version]> [args...]
```

`vpx` 会按顺序在本地 `node_modules/.bin` 目录、Vite+ 管理的全局软件包和系统 `PATH` 中查找二进制文件。如果都找不到，`vpx` 会下载软件包并通过 `vp dlx` 运行。使用 `pkg@version`、`--package/-p` 或 `--shell-mode` 时，则会直接通过 `vp dlx` 运行。

### 选项

- `-p, --package <name>` 在运行命令前安装一个或多个额外的包
- `-c, --shell-mode` 在 shell 中执行命令
- `-s, --silent` 抑制 Vite+ 输出，只显示命令输出

### 示例

```bash
vpx eslint .
vpx create-vue my-app
vpx oxlint@1.85.0 --version
vpx -p cowsay -c 'echo "hi" | cowsay'
```

包管理器和 `vp run` 会将 `node_modules/.bin` 放在 `PATH` 的最前面，因此 `package.json` 脚本会运行项目 `vite-plus` 包中的 `vpx` bin。该 bin 无需全局 CLI，并且只会在本地 `node_modules/.bin` 目录中查找。与全局 `vpx` 一样，已安装的二进制文件会直接运行；`pkg@version`、`--package/-p` 或 `--shell-mode` 则通过 `vp dlx` 运行。未安装二进制文件时会报错，因此脚本不会意外下载软件包：

```
error: vpx: 'eslint' is not installed in node_modules
note: Add it to devDependencies, or run `vp dlx eslint` to download and run it.
```

## 运行脚本 {#running-scripts}

```bash
vpx [--tsconfig <path>] [node options] <file> [args...]
```

`vpx` 可直接运行 TypeScript 和 JavaScript 文件，无需 `tsx` 或 `ts-node` 依赖。脚本使用项目的 Node.js 版本，即 [`vp node`](/guide/env) 选择的版本，并通过 Vite+ 捆绑的 [oxc-node](https://github.com/oxc-project/oxc-node) loader 运行。

```bash
vpx ./scripts/seed.ts --dry-run
vpx scripts/build.mts
vpx --watch ./server.ts
vpx --env-file=.env ./scripts/migrate.ts
vpx --tsconfig tsconfig.scripts.json ./tools/gen.ts
```

### 文件与软件包名称

当 `vpx` 的参数符合以下情况时，会将其作为文件运行：

- 以 `./`、`../` 或 `/` 开头的路径（Windows 上还包括 `.\`、`..\`、`C:\` 等盘符路径或 `\\`），且扩展名为 `.ts`、`.mts`、`.cts`、`.tsx`、`.js`、`.mjs`、`.cjs` 或 `.jsx`
- 具有上述扩展名且实际存在的文件名，例如 `scripts/seed.ts`
- shebang 指定由 `vpx` 运行的文件路径（参见[Shebang 脚本](#shebang-scripts)）

不存在的路径或带 TypeScript 扩展名的不存在名称会报错：`vpx` 不会为其下载软件包。Node.js 选项之后的参数（例如 `vpx --inspect seed.ts`）中，只有不存在的路径会由 `vpx` 报错；不存在的名称由 Node.js 报错。若带 JavaScript 扩展名的名称不是文件（例如 `highlight.js`），则会运行同名软件包。

### 支持的语法

- Node.js 类型剥离不支持的 TypeScript 语法：枚举、命名空间、参数属性和 JSX
- 启用 `"experimentalDecorators": true` 时支持装饰器，包括 `emitDecoratorMetadata`；暂不支持标准装饰器和 `accessor` 字段
- 对 `import` 支持 tsconfig `paths`、指向 `.ts` 文件的 `.js` 导入，以及省略扩展名的导入
- 支持 ESM 和 CommonJS，包括对 `.ts` 文件调用 `require()`；`.cts` 文件属于 CommonJS，因此使用 `import x = require('...')` 和 `export =`，其中的 `import`/`export` 声明会报错并建议改为 `.mts` 文件
- 支持发布在 `node_modules` 中的 TypeScript
- 支持 tsconfig `jsx`、`jsxImportSource`、`jsxFactory`、`jsxFragmentFactory`、`useDefineForClassFields` 和 `verbatimModuleSyntax`；默认值见 [JSX](#jsx) 和 [tsconfig](#tsconfig)

`vpx` 不会执行类型检查。请运行 [`vp check`](/guide/check) 进行类型检查。

### 选项

- `--tsconfig <path>` 对每个文件应用同一个 tsconfig（参见 [tsconfig](#tsconfig)）
- `--watch` 在文件所用内容变化时重新运行该文件（参见[监视模式](#watch-mode)）
- 文件之前的 Node.js 选项（例如 `--inspect`、`--test`、`--env-file`、`--require` 和 `--import`）会传给 Node.js；通过 `--require` 和 `--import` 加载的模块也可以是 TypeScript
- 文件之后的所有内容（包括 `--`）都会传给脚本

### Shebang 脚本

脚本可以将 `vpx` 作为解释器。请赋予文件可执行权限并保留扩展名：

```ts
#!/usr/bin/env vpx
// scripts/release.ts
```

### 在 `package.json` 脚本中使用

`vite-plus` 包中的 `vpx` bin 可以独立运行脚本，因此在 `package.json` 中使用 `"seed": "vpx ./scripts/seed.ts"` 无需全局 CLI。它会使用启动自身的 Node.js；在 `vp run` 和包管理器脚本中，这就是项目所用的 Node.js 版本。

### 直接使用 Node.js {#using-nodejs-directly}

要使用 `node` 运行 TypeScript，请传入 `--import vite-plus/register`。该参数会在脚本运行前注册 Vite+ TypeScript loader：

```bash
node --import=vite-plus/register ./scripts/seed.ts
node --import vite-plus/register --test ./test/example.test.ts
NODE_OPTIONS='--import=vite-plus/register' node ./scripts/seed.ts
```

请先在项目中安装 `vite-plus`。Node.js 会从项目解析 `vite-plus/register`。此 loader 提供与 `vpx` 相同的 TypeScript 转换、tsconfig 解析和 source map，并且要求使用相同的 Node.js 版本。

如果工具会自行启动 Node.js，请将 `--import vite-plus/register` 添加到其 Node.js 参数或 `NODE_OPTIONS`。将现有的 `--import tsx` 参数替换为 `--import vite-plus/register`。例如，AVA 配置可以这样设置：

```json
{
  "ava": {
    "nodeArguments": ["--import=vite-plus/register"]
  }
}
```

保留工具现有的 TypeScript 文件模式和其他设置。JavaScript 启动器也可以先运行 `await import('vite-plus/register')`，再动态导入 TypeScript 文件。启动器中的静态 TypeScript 导入会在注册前解析，因此静态导入需要使用 `--import`。

`fork()` 和 worker 会通过 Node.js 参数继承 `--import` 选项。`NODE_OPTIONS` 也会将该选项传给派生的 Node.js 进程。替换子进程参数或环境时，遵循 Node.js 的常规继承规则。

要选择 tsconfig，请设置 `VP_SCRIPT_TSCONFIG=tsconfig.scripts.json`。现有的 `TSX_TSCONFIG_PATH` 变量也有效，但优先级低于 `VP_SCRIPT_TSCONFIG`。否则会按[常规 tsconfig 查找方式](#tsconfig)处理。每个 worker 都会根据自己的环境选择配置，因此不同 worker 可以使用不同 tsconfig，而不改变父进程。

Node.js 负责处理自身的标志、测试发现和原生监视模式。eval 和 stdin 可以导入 TypeScript 文件，但输入文本本身不会被转换。通过 `--require` 加载的模块先于通过 `--import` 加载的模块运行。要加载 TypeScript 设置文件，请在 `--import vite-plus/register` 之后添加 `--import ./setup.ts`。重复导入 `vite-plus/register` 不会产生问题，包括工具已通过 `vpx` 运行的情况。

使用 `vite-plus/register` 时也适用[与 tsx 的编译差异](#coming-from-tsx)。

### 监视模式 {#watch-mode}

```bash
vpx --watch [watch options] [node options] <file> [args...]
```

`vpx --watch` 会运行文件，并在文件所用内容变化时重新运行，类似 `tsx watch`。它不是 Node.js 自带的监视模式：`vpx` 会运行 oxc-node 的监视器（`oxnode watch`），并使用 `vpx` loader 执行文件。

```bash
vpx --watch ./src/server.ts --port 3000
vpx --watch --include "./config/*.json" --exclude "src/**/*.test.ts" ./src/server.ts
vpx --watch --inspect --clear-screen=false ./src/index.ts
```

它会监视脚本导入或 require 的所有文件（Node.js 24 及更高版本也包括 worker 线程）、`vpx` 读取的 tsconfig 文件及其 `extends` 文件、失败导入所查找的文件（创建这些文件后会重新运行），以及 `--env-file` 文件。除非 `--include` 指定，否则不会监视 `node_modules`。按 Return 可立即重新运行。Ctrl+C 会停止脚本和监视器；再次按下可强制结束。运行 `vpx --watch --help` 查看选项：

- `--include <glob>` 也会监视匹配的文件；`--exclude <glob>` 则始终排除匹配文件
- `--clear-screen=false`（或 `--no-clear-screen`）会保留先前运行的输出；仅在终端中才会清屏
- `--kill-signal <signal>` 会在重新运行前停止脚本（默认 `SIGTERM`）；`--kill-timeout <ms>` 会在指定时间后强制结束（默认 5000）
- `--rerun-on-enter=false`（或 `--no-rerun-on-enter`）会将 stdin 留给脚本使用
- `--poll[=<ms>]` 会改用轮询而非文件系统事件，适用于 Docker、WSL 和网络驱动器
- `--tsconfig <path>` 对所有文件应用同一个 tsconfig，与 `vpx <file>` 一样

`tsx watch` 的 `--ignore`、`--no-cache` 及 `CHOKIDAR_USEPOLLING` 变量也有效（`--no-cache` 不起作用：`vpx` 没有转换缓存）。Node.js 监视选项 `--watch-preserve-output` 和 `--watch-kill-signal` 也有效，因此为 `tsx watch` 或 `node --watch` 编写的脚本可以迁移。会启动 Node.js 监视模式的 `--watch-path` 会报错并提示使用 `--include`；`--test`、`--eval` 和其他不会运行文件的选项也一样。其他 Node.js 选项应放在文件之前。

### tsconfig {#tsconfig}

`vpx` 会读取 tsconfig 编译选项，但不会据此执行类型检查。每个文件会使用其上方最近的、通过 `files`、`include`、`exclude` 或项目 `references` 包含该文件的 `tsconfig.json`，与 `tsc` 一致，并会解析 `extends`。`node_modules` 中的文件不使用 tsconfig；没有被任何 tsconfig 包含的文件也一样，因此会使用下方默认值。不过，这类文件仍会像 tsx 一样，通过上方最近的 `tsconfig.json` 解析 `paths` 别名：例如，根 tsconfig 的 `include` 为 `["src"]` 时，`scripts/` 中的脚本仍可导入与 `src/` 相同的别名。配置取决于文件的位置，而非工作目录，因此 `vpx` 无论从哪里运行，都会以相同方式编译该文件。

`--tsconfig <path>` 会对每个文件应用指定配置，包括该配置未包含的文件。不使用 `--tsconfig` 时，可按优先顺序通过 `TSX_TSCONFIG_PATH`、`TS_NODE_PROJECT` 或 `OXC_TSCONFIG_PATH` 选择配置。如果指定的文件不存在或 tsconfig 解析失败，`vpx` 会发出警告，并在不使用该配置的情况下运行。

没有适用 tsconfig 的文件会将 `compilerOptions` 视为空对象：

| 选项                              | 未使用 tsconfig 时的行为                                                                                                                                                                                                                                                                                |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `module`                          | 模块格式由 `package.json` 的 `"type"` 决定：`"module"` 时使用 ESM，否则使用 CommonJS。`.mts` 始终为 ESM，`.cts` 始终为 CommonJS。若 tsconfig 的 `module` 为 `node16`、`node18`、`nodenext`、`es2015` 或更高版本，则 `.ts` 和 `.tsx` 文件会作为 ESM 运行，不受 `"type"` 影响；对于 `node*` 值，`tsc` 和 tsx 则会遵循 `"type"`。 |
| `paths`、`baseUrl`                  | 无。导入按照 Node.js 规则解析，此外还支持 `.js` 指向 `.ts` 或 `.tsx`、`.mjs` 指向 `.mts`、`.cjs` 指向 `.cts`，以及省略扩展名的导入。                                                                                                                         |
| `useDefineForClassFields`         | `true`：类字段使用 `[[Define]]` 语义并原生运行，与 `target` 为 `ES2022` 或更高版本时相同。较低的 `target` 会像 `tsc` 一样切换到 `[[Set]]` 语义。                                                                                                              |
| `experimentalDecorators`          | `false`：装饰器会报错并要求设置此选项。                                                                                                                                                                                                                                                                   |
| `emitDecoratorMetadata`           | `false`。                                                                                                                                                                                                                                                                                                |
| `jsx`、`jsxImportSource`           | 自动运行时，从 `react/jsx-runtime` 导入（参见 [JSX](#jsx)）。                                                                                                                                                                                                                                            |
| `verbatimModuleSyntax`            | `false`：运行时未使用绑定的导入会被移除，同时保留其副作用。                                                                                                                                                                                                                                               |
| `rewriteRelativeImportExtensions` | `false`。无论是否启用，`./file.ts` 导入都有效。                                                                                                                                                                                                                                                           |

无论 tsconfig 如何设置，类型都会被移除，枚举、命名空间和参数属性都会被编译。`strict`、`lib` 等类型检查选项不起作用；`target` 只会影响类字段的默认行为。

### JSX {#jsx}

`.jsx` 和 `.tsx` 文件会编译为 JSX 运行时调用，默认为 React。请安装所用的运行时（`react` 或 `jsxImportSource` 指定的软件包）；Vite+ 不会捆绑 JSX 运行时。tsconfig 选项会选择运行时：

| tsconfig `jsx`                  | 输出                                                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| 未设置或为 `"react-jsx"`        | 自动运行时：从 `<jsxImportSource>/jsx-runtime` 导入 `jsx()` 和 `jsxs()`；`jsxImportSource` 默认为 `react`                             |
| `"react-jsxdev"`                | 开发运行时：从 `<jsxImportSource>/jsx-dev-runtime` 导入 `jsxDEV()`，并传入每个元素的文件名、行号和列号                               |
| `"react"`                       | 经典运行时：使用 `React.createElement()` 或 `jsxFactory`；片段使用 `React.Fragment` 或 `jsxFragmentFactory`                           |
| `"preserve"`、`"react-native"` | 自动运行时，因为 Node.js 无法直接运行 JSX                                                                                             |

即使文件导入的经典工厂函数（例如 `import { h, Fragment } from 'my-jsx'`）仅供 JSX 使用，该导入仍会保留。

文件中的 pragma 注释会覆盖 tsconfig：

```tsx
/** @jsxImportSource my-jsx */
```

```tsx
/** @jsxRuntime classic */
/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from 'my-jsx';
```

文件同时包含 `@jsx` 和 `@jsxImportSource` 时，`@jsxImportSource` 会选择自动运行时，`@jsx` 则被忽略。所有注释中的 pragma 都会被读取，因此普通注释中的说明文字（例如 `// @jsxImportSource is set above`）也会更改运行时。

只有在 tsconfig 设置了 `"allowJs": true` 时，`.jsx` 文件才会使用其中的 JSX 选项，与 `tsc` 和 tsx 一致。否则会使用上述默认值。

不支持依赖编译器插件的 JSX。`vpx` 只会将 JSX 编译为运行时导出的 `jsx()`、`jsxs()`、`jsxDEV()` 调用或经典工厂函数。若配置依赖 Babel 或打包工具插件转换 JSX（通常设置为 `"jsx": "preserve"`），则运行时会失败，或丢失插件添加的功能。

### 从 tsx 迁移 {#coming-from-tsx}

`vp migrate` 会将 `package.json` 脚本中的 tsx 命令改写为 `vpx`，并在不再使用时移除 `tsx` devDependency；参见[tsx 到 `vpx`](/guide/migrate-rules#tsx-to-vpx)。大多数可通过 tsx 运行的脚本也可原样通过 `vpx` 运行。以下差异可能需要调整：

- **JSX 默认值：** 未设置 tsconfig `jsx` 选项时，tsx 会将 JSX 编译为 `React.createElement()`，这要求 `React` 在作用域中；`vpx` 则使用自动运行时。要保留经典输出，请设置 `"jsx": "react"`。由于默认行为不同，除非文件包含 `/** @jsxRuntime automatic */` 或 tsconfig 设置为 `"jsx": "react-jsx"`，tsx 也会忽略单独的 `/** @jsxImportSource … */` 注释；`vpx` 会直接应用该注释。
- **`.cts` 文件中的 `import` 或 `export`：** tsx 会将其编译为 CommonJS，`vpx` 则会报错。请将文件改名为 `.mts`，或使用 `import x = require()` 和 `export =`。
- **CommonJS 包中的 `import`：** 对于没有 `"type": "module"` 的包，tsx 会将使用 `import`、`export` 或 `import.meta` 的 `.ts` 或 `.js` 文件编译为 CommonJS，因此 `__filename`、`__dirname` 和 `require` 仍有效。`vpx` 会像 Node.js 一样将此类文件作为 ES module 运行，因此这些变量未定义；从 ES module 默认导入时也只会取得该模块的 default export，而非整个模块。请改用 `import.meta.filename`、`import.meta.dirname` 和 `createRequire(import.meta.url)`。
- **`require()` 解析：** tsx 会将 `require('./a.js')` 映射到 `a.ts`，并对 `require()` 应用 tsconfig `paths`。`vpx` 按 Node.js 规则解析 `require()`，因此请写出 `.ts` 扩展名，并且只在 `import` 中使用 `paths` 别名。
- **信号：** tsx 会将 `SIGINT` 和 `SIGTERM` 转换为退出码 130 和 143，并先运行 `process.on('exit')` 处理器。`vpx` 中信号会像 Node.js 一样结束脚本，因此请在 `process.on('SIGINT')` 或 `process.on('SIGTERM')` 处理器中清理资源。
- **Node.js 版本：** `vpx` 需要 Node.js `^22.18.0 || ^24.11.0 || >=26.0.0`；tsx 也支持更旧版本。
- **监视模式：** `tsx watch` 改为 `vpx --watch`，并支持 tsx watch 的选项（参见[监视模式](#watch-mode)）。tsconfig 修改或创建失败导入所查找的文件时，`vpx` 也会重新运行脚本；tsx watch 不会检测这些情况。
- **Eval、REPL 和 `--check`：** `vpx --eval`、REPL 和 `vpx --check` 不会转换 TypeScript。
- **`node --import tsx`：** 请改用 [`node --import vite-plus/register`](#using-nodejs-directly)，包括工具设置和 `NODE_OPTIONS` 中的配置。
- **其他 loader：** 将 `--import tsx` 改为 `--import vite-plus/register`。同时注册两个 TypeScript loader 会让它们争相处理相同文件。

### 从 oxnode 迁移 {#coming-from-oxnode}

`vp migrate` 可以将 `oxnode <file>` 替换为 `vpx <file>`，并将 `oxnode watch <file>` 替换为 `vpx --watch <file>`。二者都使用 oxc-node 的转换器和监视器。加载 `@oxc-node/core/register` 的 Node.js 命令和字面量 `NODE_OPTIONS` 赋值会改用 `vite-plus/register`。只有在没有剩余命令或导入需要时，迁移才会移除独立的开发依赖。参见 [oxnode 到 `vpx`](/guide/migrate-rules#oxnode-to-vpx)。

### 从 ts-node 迁移 {#coming-from-ts-node}

`vp migrate` 可以将受支持的 transpile-only ts-node 命令替换为 `vpx`。受支持的 Node.js preload 和字面量 `NODE_OPTIONS` 赋值会使用 `vite-plus/register`。由于两种替代方式都不执行类型检查，仍会进行类型检查的命令会保留。自定义编译器设置以及剩余 loader 或 API 用法也可能要求保留 `ts-node`。参见 [ts-node 到 `vpx`](/guide/migrate-rules#ts-node-to-vpx)。

## `vp exec`

使用 `vp exec` 运行已安装在项目中或可在环境中使用的工具。

```bash
vp exec <command> [args...]
```

示例：

```bash
vp exec eslint .
vp exec tsc --noEmit
```

## `vp dlx`

使用 `vp dlx` 在不将包添加到项目依赖项的情况下执行一次性包。

```bash
vp dlx <package> [args...]
```

示例：

```bash
vp dlx create-vite
vp dlx oxlint@1.85.0 --version
```
