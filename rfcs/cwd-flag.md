# RFC：用于切换工作目录的全局 `-C` 标志

## 总结

为 vp 添加全局 `-C <dir>` 标志，并利用它修复 monorepo 中的应用命令体验。所有改动都是新增的，并且向后兼容：

1. **`-C <dir>` 全局标志**（此功能）：对于每个 vp 命令，`vp -C <dir> <cmd>` 的行为与 `cd <dir> && vp <cmd>` 完全一致，遵循 `git -C` / `make -C` 的约定：这是 vp 所缺少的、一等公民的“在指定目录运行”形式。位置参数语义保持不变：`vp dev <path>` 继续遵循上游 Vite 语义（仅指定 `root`），而 `vp pack` 的位置参数仍作为 tsdown 条目处理。
2. **基于 `-C` 构建的应用命令 UX**：在工作区根目录直接运行 `vp dev` / `vp build` / `vp preview` / `vp pack` 时，不再静默地针对根目录运行，而是提示用户提供缺失的目标：在 TTY 中使用交互式模糊包选择器；对于只有一个指定目标的仓库，使用 `defaultPackage` 配置；在非交互环境中则清晰列出可选项并以退出码 1 退出。这三种方式都定义为隐式的 `-C <dir>`。

在常见流程中，用户无需输入 `-C`：在根目录直接运行 `vp dev` 时，会使用选择器或 `defaultPackage`；而在包目录内运行时，其行为与现在相同。`-C` 是底层明确且易于理解的形式。这些命令仍然是单数形式：`vp dev` 依然只会在一个目录中启动恰好一个 Vite 开发服务器。要同时在多个包中运行任务，仍然应使用 `vp run`（`-r`、`--filter`）。

## 动机

### 当前痛点

**1. vp 没有一等公民形式来表达“在那个目录中运行此命令”。**

对于 `dev`/`build`/`preview`，位置参数会原样转发给 Vite 的 `[root]`，这会重新确定配置查找和 `.env` 加载的基准目录，但 Vite 进程的 `process.cwd()` 仍保持为命令调用目录。即使 `root` 指向了正确的应用，任何相对于 cwd 的读取仍会产生偏差：

```ts
// apps/admin/vite.config.ts
const cert = fs.readFileSync(path.resolve('certs/dev.pem')); // 相对于 cwd
```

```
$ cd apps/admin && vp dev          # cwd = apps/admin, cert found

  VITE+ v0.2.2

  ➜  Local:   http://localhost:5173/

$ vp dev apps/admin                # root is right, cwd is still the repo root
failed to load config from /acme/apps/admin/vite.config.ts
error when starting dev server:
Error: ENOENT: no such file or directory, open '/acme/certs/dev.pem'
```

对于 `pack`，目录完全不起作用：位置参数表示入口文件/ glob（`packages/cli/src/pack-bin.ts`），而配置始终从 `process.cwd()` 解析：

```
$ vp pack packages/ui
ℹ entry: packages/ui
ℹ Build start
error: Build failed with 1 error:

[UNRESOLVED_ENTRY] Cannot resolve entry module packages/ui.
```

因此，对所有命令都有效的唯一形式是 `cd <path> && vp <cmd>`，而 vp 没有与之等价的标志。

**2. 在 monorepo 根目录下，应用命令会悄无声息地执行错误。**

工作区根目录通常没有应用，但 `vp dev` 仍会启动一个指向该目录的服务器：

```
$ vp dev

  VITE+ v0.2.2

  ➜  Local:   http://localhost:5173/        # opens to a 404, no index.html here
```

vp 不会输出任何错误或指导信息，并且服务器会暴露整个仓库目录树。修复方案必须引导用户提供缺失的目标，而这个目标需要有一个定义明确的原语来展开：`-C`。

上述所有问题均可通过 `vite-plus@0.2.2` 重现：https://github.com/why-reproductions-are-required/vite-plus-monorepo-app-commands-repro

## 提议的 UX

以下示例中始终使用的工作区：

```text
acme/
├── pnpm-workspace.yaml
├── vite.config.ts
├── apps/web          (Vite 应用)
├── apps/admin        (Vite 应用)
├── packages/ui       (库)
└── packages/utils    (库)
```

### 1. `-C`：在其他目录中运行任意 vp 命令

以下两者执行效果完全相同，逐字节一致：

```bash
vp -C apps/admin dev
cd apps/admin && vp dev
```

每个 vp 命令都接受该参数，而不仅仅是应用命令：

```bash
vp -C apps/web test
vp -C apps/web run build
```

子命令之后的参数会原样透传：

```
$ vp -C apps/admin dev --port 4000

  VITE+ v0.2.2

  ➜  本地：   http://localhost:4000/
```

`-C` 也为 pack 补上了缺失的目录形式：

```
$ vp -C packages/ui pack
ℹ 入口：src/index.ts
ℹ 开始构建
ℹ dist/index.mjs  0.10 kB │ gzip：0.11 kB
✔ 构建完成，用时 9ms
```

`vp dev apps/admin`（位置参数）保持不变：会设置 `root`，但不会设置 cwd，因此问题 1 中的陷阱在这种形式下仍然存在（见“决策”）。

### 2. 工作区根目录下的 `vp dev`（交互式终端）

外观和按键绑定与 `vp run` 任务选择器相同，但列出的是包而不是任务：

```
$ vp dev
选择要运行 dev 的包（↑/↓，Enter 执行，输入进行搜索）：

  › web         apps/web
    admin       apps/admin
    ui          packages/ui
    utils       packages/utils
```

输入内容会进行模糊过滤，并以内联方式显示查询内容：

```
选择要运行 dev 的包（↑/↓，Enter 执行，输入进行搜索）：adm

  › admin       apps/admin
```

按 Enter 确认后，会打印一次教学提示，然后以隐式 `-C` 的方式运行：

```
已选择包：admin（apps/admin）
提示：可以直接使用 `vp -C apps/admin dev` 运行

  VITE+ v0.2.2

  ➜  本地：   http://localhost:5173/
  ➜  网络：使用 --host 进行公开
```

Escape 会清除搜索内容，Ctrl+C 会取消操作并以退出码 130 结束，且不会运行任何命令（与任务选择器一致）。根目录下的 `vp build`、`vp preview` 和 `vp pack` 的行为相同，分别显示 `选择要 build 的包` / `选择要 preview 的包` / `选择要 pack 的包`。

### 3. 根目录下的非交互模式（CI、管道输出、脚本）

由于无法显示选择器，命令会快速失败，并显示与选择器本应显示的相同信息：

```
$ vp build
✗ 工作区根目录下的 `vp build` 需要指定目标包。

  此工作区中的包：
    web         apps/web
    admin       apps/admin
    ui          packages/ui
    utils       packages/utils

  传入目录：  vp -C apps/web build
  或运行每个包的 build 脚本：  vp run -r build

$ echo $?
1
```

### 4. 配置了 `defaultPackage` 时

其目标仓库形态是一个框架单体仓库：Vite 应用位于一个根本不是 JS 工作区的仓库子目录中，例如带有 `frontend/` 目录的 Laravel、Rails 或 Go 服务：

```
shop/
├── app/               (PHP / Ruby / Go)
├── routes/
├── composer.json
├── vite.config.ts     (如下所示的根配置)
└── frontend/          (Vite 应用)
```

由于不存在 `pnpm-workspace.yaml` 或 `workspaces` 字段可供枚举，因此选择器无法服务于这种结构。`defaultPackage` 可以解决这一问题：

```ts
// vp 通过静态提取读取此键，且从不执行此文件，因此
// 即使根目录未安装 vite-plus 也没有问题。Vite 也不会加载此
// 配置；在此根目录下，它纯粹只是 vp 的指针。
export default {
  defaultPackage: './frontend',
};
```

此时，根目录下不带参数的应用命令会表现为 `vp -C ./frontend <cmd>`，并输出一行信息，让重定向过程保持可见：

```
$ vp dev
vp dev：正在使用 ./frontend（vite.config.ts 中的 defaultPackage）

  VITE+ v0.2.2

  ➜  本地：   http://localhost:5173/
```

显式指定的 `-C` 仍具有优先级：`vp -C apps/admin dev` 会忽略 `defaultPackage`。

### 5. 在子包内部：不发生任何变化

```
$ cd apps/web
$ vp dev

  VITE+ v0.2.2

  ➜  本地：   http://localhost:5173/
```

根目录以下不会显示选择器。

## 命令语法

```
vp [-C <dir>] <command> [args...]
```

### `-C <dir>` 全局标志

- vp 全局标志，在子命令之前解析，类似于 `git -C` / `make -C`，绝不会转发给底层工具。它适用于所有 vp 命令。
- 语义：完全按照在 `<dir>` 中调用命令的方式运行。目录将基于调用时的 cwd 解析；目录不存在时将报错 `directory not found`。
- 名称遵循 pnpm：其全局 `-C <path>` 的文档描述为“就像 pnpm 是在 `<path>` 而不是当前工作目录中启动的一样运行”，这与该标志的语义完全一致。v1 中仅提供短格式（git 风格）；如果需要，之后可以兼容地添加 pnpm 的 `--dir` 长格式别名。
- 由于它位于子命令之前，因此不会与 Vite 或 tsdown 当前或未来的标志冲突。子命令本身不增加任何标志。

### 位置参数和转发参数：保持不变

子命令之后的所有内容都会原样转发，与现在完全一致。`vp dev <path>` 保持上游 Vite 语义（位置参数 = `root` 选项），`vp pack` 的位置参数仍然是 tsdown 的入口，且相对选项值仍然基于进程 cwd（调用目录，或 `-C` 下的 `<dir>`）解析。任何地方都不会进行目录与入口之间的消歧。

已否决的替代方案：将 app 命令的位置参数重新定义为“在那里运行”（会破坏 Vite CLI 的一致性；参见 Decisions）、强制使用 picker 的单命令标志，以及 `-F` 风格的名称过滤器（`-F` 在 `pack` 和 `run`/`exec` 中已有其他含义）。

## 行为

### 目标目录解析

当应用命令调用不包含 `-C` 且没有位置参数目标（没有 Vite `[root]`，也没有 pack 条目）时，该调用是**裸调用**。此分类方式与工具自身的 cac 解析方式一致：任何非布尔选项之后的非标记 token 都是该选项的值，包括必需值和可选值（`--port 3000`、`--host 0.0.0.0`），因为工具自身绝不会将其视为位置参数；只有没有被任何选项消费的 token 才是位置目标，而任何位置参数都会禁用交互式询问。布尔选项表来自各工具随附的 `--help`，并且按命令区分（`--minify` 对 Vite build 是可选值选项，但对 pack 是布尔选项）。pack 的目标选择器（`-W`/`--workspace`、`-F`/`--filter`、`--root`）已经定义了自己的目标，并始终禁用交互式询问。对于 `vp dev` / `build` / `preview` / `pack`，目标目录按以下顺序解析：

1. **`-C <dir>`**：在该目录运行。永远不会触发选择器。
2. **存在位置目标**：按当前方式转发，遵循上游语义，vp 不进行干预。
3. **`defaultPackage`**：当在根配置所在目录中进行裸调用时（工作区根目录，或非工作区仓库的根目录），使用该配置；隐式执行 `-C`，并打印一行提示。
4. **交互式选择器**：在工作区根目录进行裸调用、处于交互式 TTY 且不在 CI 环境中时，进行选择，打印提示，并以隐式 `-C` 运行。
5. **在工作区根目录进行非交互式裸调用**：打印包列表和 `-C` 提示，退出码为 1。
6. **其他位置**：保持当前行为，在当前目录运行。

“工作区根目录”指当前目录的包是工作区根包，由 `vite_workspace::find_workspace_root` 确定（该函数已在 `packages/cli/binding/src/cli/mod.rs` 中的每次调用中执行）。

### 等价性不变量

对于每个 vp 命令：

```
vp -C <dir> <cmd> [args...]  ===  cd <dir> && vp <cmd> [args...]
```

子进程的生成工作目录是 `<dir>`，因此配置查找、`.env` 加载、配置和插件中的 `process.cwd()` 读取，以及相对 CLI 参数的行为，都与用户执行 `cd` 后的效果一致。POSIX `PWD` 环境变量也会被刷新（入口点和重新定位到目标目录的交互式询问工具都会刷新），因此读取 `process.env.PWD` 的代码与 `cd` 形式保持一致。两个入口点都会在启动时通过修改自身进程的 cwd 来应用 `-C`，并且发生在任何参数规范化、选择器或命令逻辑运行之前，这与从 `<dir>` 启动没有区别：全局二进制在 `main` 中第一时间消费该选项（因此命令别名、无命令选择器，以及读取进程 cwd 的进程内辅助函数都涵盖在内），本地 `vp` 二进制也会在分发之前执行相同操作。

全局二进制还会从 `<dir>` 解析本地 `vite-plus` 安装，与 `cd` 后的行为完全一致；通过包自身的 `vp` 二进制时，执行中的 CLI 已经被选定，因此这里的不变量假定每个工作区只有一个 Vite+ 版本（受支持的 monorepo 模型）。隐式 `-C` 形式（选择器、自动选择、`defaultPackage`）会在已选定的 CLI 中运行，并基于相同假设：生成的工具进程获得目标目录的 cwd 和 `PWD`，但执行中的 CLI 及其运行时是在调用目录解析的。在同一个工作区中二者一致；带有自身 Vite+ 安装或运行时固定版本的 `defaultPackage` 目标，目前由调用 CLI 解析（完整的重新委托将在后续工作中跟进）。

### 入口点和版本假设

- `-C` 由全局二进制和本地二进制共同解析；选择器和 `defaultPackage` 位于本地 CLI 的 NAPI 绑定（`execute_direct_subcommand`）中，每个入口点都会执行该绑定。在根目录执行裸 `vp dev` 主要是全局 CLI 的使用场景，但根级 `"dev": "vp dev"` 脚本也会经过相同逻辑。
- 在 1.0 版本之前，假定全局 CLI 和任何本地安装都会提供此功能；不规定与旧版 CLI 进行版本协商。在非工作区结构中，根目录没有本地安装，因此整个过程由内置 CLI 执行，在此假设下两者等价。

### 选择器内容

- 每个工作区包一行：名称加相对路径。不筛除任何内容；可能可运行的包（见下方规则）优先排序，然后按路径排序，因此应用会显示在顶部，同时所有内容仍可搜索。
- 通过 `vite_select::fuzzy_match` 对名称和路径进行模糊搜索，分页方式与任务选择器完全相同。
- 可运行的工作区根目录完全不会触发交互式询问：无论是否为 TTY，都直接在原处运行，与本 RFC 之前的行为完全一致。调用已经拥有其配置的目标：根应用，或 `pnpm-workspace.yaml` 仅携带设置（catalog、`minimumReleaseAge`）的单个包。仅当根目录不是合理目标时才进行询问，这使该功能完全保持增量式。根目录需要比成员包更强的可运行信号：对于 `dev`/`build`/`preview`，需要 `index.html`（共享根配置是常见的 monorepo 设置，但不会使根目录成为应用）；对于 `pack`，则需要通常的显式 `pack` 或默认入口规则。
- 当恰好有一个可能可运行的包时，选择器会自动选择该包，只打印 `Selected package:` 行和提示。

### 可能可运行的启发式规则

仅用于排序和单候选自动选择，绝不会用于隐藏包：即使判断错误，包仍会出现在选择器和列表中，只是排序更靠后。根据文件是否存在和静态配置提取结果，针对每个包目录分别判断；不会执行任何内容，父目录也不计入。

| 命令                     | 当包满足以下条件时，认为其可能可运行                                                                                                                                                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dev` / `build` / `preview` | 其目录直接包含 Vite 的某个配置文件名（`vite.config.{js,mjs,ts,cjs,mts,cts}`，即 Vite 探测的完整列表），**或**包根目录存在 `index.html`（Vite 的默认应用入口）                                   |
| `pack`                      | 其 `vite.config.*` 显式声明了 `pack` 块（通过静态提取读取；没有 `pack` 的配置，以及仅可能通过展开运算符包含它的配置，都不计入），**或**存在 `src/index.ts`（tsdown 唯一的默认入口） |

这两种基于文件的信号都是上游默认行为，并非 vp 自创：项目根目录的 `index.html` 是 Vite 的入口点（[index.html 和项目根目录](https://vite.dev/guide/#index-html-and-project-root)），配置文件名是 Vite 解析的列表（[配置 Vite](https://vite.dev/config/)，由 `vite_static_config::CONFIG_FILE_NAMES` 镜像，并附带上游源码链接），而 `src/index.ts` 是未配置入口时 tsdown 的默认入口（[tsdown 入口](https://tsdown.dev/options/entry)；tsdown 中的 `src/features/entry.ts` 正好解析这一路径）。

“恰好一个可能可运行的包”意味着：按可运行优先排序后，第一行可运行而第二行不可运行。自动选择还要求终端处于交互模式。

以下权衡是可以接受的，因为该信号不会隐藏任何内容，错误的自动选择也会立即可见（`Selected package:` 行，以及显示显式 `-C` 形式的 `Tip:` 行）：

- 仅为 Vitest 或 lint 设置而存在 `vite.config.*` 的库，会被 `dev`/`build`/`preview` 认为是可运行的。可以通过相同的静态提取方式，将仅包含工具块的配置顶层键降级；在实际遇到问题之前暂不处理。
- `index.html` 位于包根目录之外的应用（自定义 Vite `root`），或其配置继承自父目录的应用，不会排在首位，也永远不会被自动选择。

### `defaultPackage` 配置

```ts
export default defineConfig({
  // 相对于配置文件所在目录。与此配置相邻进行裸调用时，
  // 供 vp dev/build/preview/pack 使用：隐式执行 -C。
  defaultPackage: './frontend',
});
```

- 类型：`string`（四个命令共用一个目录），或按命令分别配置的对象（`{ dev: './apps/web', pack: './packages/ui' }`，根据评审要求添加）。对象中未出现的命令会继续执行选择器/列表解析。
- 当应用命令在根配置所在目录进行裸调用时读取：该目录可以是工作区根目录，也可以是非工作区仓库根目录。非工作区结构没有包列表，因此 `defaultPackage` 是覆盖该场景的唯一机制。显式 `-C` 始终优先。
- 目录不存在时报错：`defaultPackage points to a missing directory: ./frontend`。
- 通过静态提取读取（`vite_static_config` 以及 `packages/cli/binding/src/cli/handler.rs` 中的加载器），与 `run` 配置相同。在非工作区根目录没有可用于执行配置的安装，因此该文件必须在不执行的情况下也能工作：使用包含静态字符串值的普通默认导出对象。
- 只有显式声明的 `defaultPackage` 才会改变行为。已声明但不是静态值的内容（例如 `process.env.DIR`）会报错；无法分析的配置，或通过展开运算符隐藏字段的配置，会被视为未声明该键，并继续使用选择器或当前目录解析，因此特殊配置永远不会破坏无关的裸调用。
- 仅在调用根目录读取（工作区根目录、独立包根目录，或不存在 `package.json` 祖先目录的目录）。在工作区根目录以下时，当前目录已经标识了目标，因此成员包自身的配置不会重定向目标。

## 决策

### 保持 Vite CLI 的兼容性；由 `-C` 承载 `cd` 语义

核心矛盾在于：`vite <path>` 的行为（位置参数仅设置 `root`，不改变 cwd）与 `cd <path> && vp dev` 的行为无法在同一个位置参数上同时成立。早期草案重新定义了位置参数的用途，并接受了与上游 CLI 永久偏离的结果。本 RFC 保持位置参数与 Vite 兼容，并将 `cd` 语义放到一个新的、名称明确的通道中。因此不会改变任何现有含义，`pack` 不需要目录与入口之间的启发式判断，而且这一原语可以泛化到所有 vp 命令，而不只是四个命令。

所接受的代价是：传递目录时存在两种语义不同的方式。缓解措施是：用户很少需要手动输入这两种方式（裸用 `vp dev` 加选择器，或使用 `defaultPackage`，已经覆盖了常见流程），并且所有提示、错误和文档都只介绍 `-C`。

具体机制：不采用 CLI 进程中的 `process.chdir()`，因为这会产生全局变更，并泄漏到所有共享该进程的内容中。vp 是一个启动器：NAPI 绑定始终将工具作为一个全新的子进程启动（`packages/cli/binding/src/cli/execution.rs`），因此可以自由设置子进程的启动 cwd，而无需修改上游。

### 仅在根目录进行交互

在根目录以下，cwd 已经能够标识项目，因此提示用户只会造成干扰。在根目录中，命令目前存在歧义，并且可能静默地执行错误；这正是提示有价值的地方。与裸用 `vp run` 时的信息性列表不同，在非交互模式下，应用命令会以 1 退出，因为构建或服务于错误目录的后果比直接明确失败更糟糕。

### 询问范围

`-C` 是全局选项，可用于每个命令。询问行为（选择器、`defaultPackage`、根目录错误）仅适用于单目标应用命令，因为只有这些命令在根目录下存在歧义。树范围命令（`test`、`lint`、`fmt`、`check`）在此处表示“整个仓库”，这正是它们所需的行为。工作区状态命令（`install`、`add`、`outdated` 等）以根目录作为其自然工作目录。编排器（`run`、`exec`）拥有自己的选择模型，仍然是跨多个包运行单个任务的方式。未来的命令只有在其操作对象是某个包目录时，才会加入询问集合。

## 实现架构

所有更改都位于 Rust 层；无需对上游 Vite 或 tsdown 进行更改。

- `crates/vite_global_cli/src/cli.rs`：解析全局 `-C <dir>`；从 `<dir>` 解析本地安装，并将 `<dir>` 作为有效 cwd 委托执行。
- `packages/cli/binding/src/cli/types.rs` / `mod.rs`：在本地二进制路径上解析 `-C`；在 `execute_direct_subcommand` 中添加无参数调用时的解析顺序（工作区根目录检测已在此处完成）。
- `packages/cli/binding/src/cli/execution.rs`：将 cwd 设置为目标目录后生成子进程。
- Picker：复用 `vite_select` 和 `vite_workspace`，它们已通过 `vite_task` crates 成为依赖项。
- `defaultPackage`：以加载 `run` 配置的相同方式扩展 `VitePlusConfigLoader` 的静态提取，并在 `packages/cli/src/define-config.ts` 中添加 `defaultPackage?: string`。
- `packages/cli/src/pack-bin.ts` 无需更改：位置参数处理保持不变，且 `-C` 永远不会传递到其中。
- 文档：在全局 CLI 文档、`docs/guide/monorepo.md` 的“应用命令”部分，以及 `docs/config/` 中新增一个介绍该键的页面。

## 兼容性

所有现有调用均保持不变。唯一的行为变化是：在工作区根目录执行不带参数的应用命令时，行为从“静默地提供服务或构建根目录”变为选择器 / 配置 / 明确报错。可运行的根目录仍会作为选择器条目提供，而 `defaultPackage: '.'` 可无条件恢复旧行为。

## Snap 测试

非交互式分支通过 Snap 测试覆盖：

- `vp -C <dir> build` / `vp -C <dir> pack` / `vp -C <dir> run <task>`，以及使用不存在目录的 `-C`。
- 一致性回归：`vp dev <dir>` 仍将位置参数作为 Vite 的 `root` 转发，同时保持 cwd 不变。
- 在没有 TTY 的工作区根目录中执行裸应用命令：验证包列表和退出代码。
- `defaultPackage`：正常路径和目录不存在错误。
- 等价性检查：在配置读取 `process.cwd()` 的 fixture 中，`vp -C <dir> build` 和 `cd <dir> && vp build` 产生相同的输出。

交互式选择器将在 `vite_task` 仓库风格中获得 pty 快照覆盖（`task_select` fixtures）（如果选择器最终位于 `vite_select` 附近），否则通过 tmux 驱动的交互式运行进行手动验证。

## 待解决问题

1. 排名加搜索是否足够，还是有时确实需要直接过滤掉不可运行的软件包？
2. 之后是否添加 `VP_DEFAULT_PACKAGE` 环境变量覆盖？环境变量配套项已有成熟模式（`NX_DEFAULT_PROJECT`）；已从 v1 延后。
3. `vp test` 是否应加入询问集合？可能不应：Vitest 已在根目录提供一流的 `projects` 语义（无论是否配合 `-C` 使用都有效）。
4. 精确的非交互式判定：使用 `vp run` 选择器的 TTY 检查，加上全局命令选择器使用的 `CI` 检查？
5. 评审期间已解决：`vp dev <dir>` 搭配目录位置参数时，会打印一行提示，指向 `vp -C <dir> dev`（仅适用于 dev/build/preview；pack 的位置参数是条目，仅包含标志或帮助的调用保持静默）。

## 附录：`defaultPackage` 命名调研

类似工具如何命名“当未指定目标时，根级命令所针对的成员”：

| 工具                       | 字段                                | 备注                                                |
| -------------------------- | ------------------------------------ | ---------------------------------------------------- |
| Ionic CLI                  | `defaultProject`                     | 当前使用中；根配置中包含一个 `projects` 映射            |
| Nx                         | `defaultProject`                     | 已弃用，建议改用 `NX_DEFAULT_PROJECT` 环境变量  |
| Angular CLI                | `defaultProject`                     | 已弃用，建议改用基于当前工作目录的推断                 |
| Cargo                      | `workspace.default-members`          | 复数形式：根级 `cargo build` 会构建所有列出的成员 |
| Salesforce DX              | 成员上的 `default: true`        | 标记模式；需要枚举成员             |
| Vercel / Netlify / Amplify | `rootDirectory` / `base` / `appRoot` | 每个应用的部署配置，而不是多个应用中的默认项      |
| GitHub Actions             | `defaults.run.working-directory`     | 直接命名了该机制（当前工作目录）                            |

其模式是使用 `default` 加上工具对该单元所采用的名词：Angular、Nx 和 Ionic 使用“project”，Cargo 使用“members”，Salesforce 使用“package directories”。vp 使用的名词是“package”（选择器、`vp run` 文档、`vite_workspace`、pnpm 词汇均如此），因此是 `defaultPackage`。

排除的选项：`defaultProject`（与 Vitest 的 `test.projects` 冲突，并且选择器使用的是“package”），`defaultWorkspace`（在 vp/pnpm 词汇中，“workspace”表示整个 monorepo），`defaultMembers`（复数形式，暗示要在多个 package 中运行；没有 workspace 时没有意义），`appRoot`/`rootDirectory`/`base`（与 Vite 的 `root`/`base` 选项冲突），成员标记（需要枚举成员，而没有 workspace 元数据时无法实现）。Angular 和 Nx 的弃用情况不适用于此处：当前工作目录推断已内置于解析顺序中，而每个环境的灵活性属于问题 2 的待决事项。

`-C` 方案不会改变这一结论。采用 `-C` 风格标志的工具（git、make、tar、ninja、terraform、pnpm、yarn、bun）提供该标志时，完全没有配置文件级默认值；而确实提供目录配置的工具，会按照该机制命名它，正是因为它适用于它们运行的所有内容（just 的 `set working-directory`、GitHub Actions 的 `defaults.run.working-directory`、vp 自身 `run.tasks` 中按任务设置的 `cwd`）。`defaultPackage` 两者都不是：它选择一个成员，仅适用于应用命令，并且只在根目录下未指定成员时生效。像 `defaultCwd` 或 `defaultDir` 这样的机制名称，会让人以为它对 vp 的全部功能都生效，但实际并非如此；成员选择名称与其成员选择的适用范围相匹配。
