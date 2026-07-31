# RFC：交互式 CLI 快照测试

## 总结

用一个新的快照测试方案替换当前的 snap-test 运行器：该方案将每个测试用例都运行在一个真实的伪终端（PTY）中，并由 vt100 屏幕模拟器提供支持。测试用例可以脚本化完整的交互会话：它们发送按键（方向键、回车、Ctrl-C、自由文本），并基于 CLI 发出的渲染里程碑进行同步，因此提示符、选择器、加载动画和监视模式都变成了可直接测试的一等对象。快照是 Markdown 文件，内容为渲染后的终端屏幕，并使用真实的通过/失败语义进行比较（通过 `UPDATE_SNAPSHOTS=1` 接受变更），而不是当前那种重新生成后再检查 git diff 的模式。

该运行器复用了 vite-task 仓库中已经存在的 PTY/终端模拟/里程碑/快照相关 crate（`pty_terminal`、`pty_terminal_test`、`pty_terminal_test_client`、`snapshot_test`），而 vite-plus 也已经将它们作为其他 crate 的 git 依赖在使用。现有的两个目录树（`snap-tests/` 和 `snap-tests-global/`）将合并为一个统一的 fixture 目录树，其中每个用例都会声明它是在全局 Rust `vp` 二进制下运行，还是在本地 JS CLI 下运行（或两者都运行）。

这是一项彻底切换：新的格式与旧的 `steps.json`/`snap.txt` 格式不兼容，也不会尝试兼容。一个迁移工具可以在一次命令中把旧的用例目录转换为新的 fixture；当整个测试集完成迁移后，旧运行器就会被删除。

## 动机

### 交互空白

当前运行器完全无法测试交互行为：

- 每条命令都以 `stdin: null` 和 `CI=true` 运行，因此 CLI 总是走非交互路径。
- 364 个 fixture 显式传入了 `--no-interactive`；没有任何 fixture 驱动过提示。
- 交互式 UX 回归（spinner 覆盖 prompt 的渲染、选择器导航、ctrl-c 取消）只能通过人工、借助基于 tmux 的手动流程来捕获。

这阻碍了当前工作真正需要的覆盖率。PR #2031（`vp -C` 和 app-root 解析）把其交互式包选择器列为一个无法测试的后续项，而它在“交互式终端中单个可运行项自动选择”分支中发布时，也没有在交互式终端里运行测试。`vp create` 和 `vp migrate` 的提示流程（模板选择、approve-builds 确认、覆盖提示）对实际的提示循环都没有自动化覆盖。暂存的 `snap-tests-todo/command-pack-watch-restart` 用例之所以存在，正是因为 watch 模式重启需要一个可以输入内容的终端。

### 当前运行器中的结构性问题

对 `packages/tools/src/snap-test.ts` 和约 529 个用例的审计暴露出一些补丁无法很好修复的问题：

1. **没有断言。** 运行器总是覆盖 `snap.txt` 并以 0 退出。失败检测发生在运行器之外（CI 中的 `git diff`，本地则依赖人工自觉）。AGENTS.md 不得不对此警告两次。
2. **没有终端。** 输出是从重定向的管道中捕获的，因此任何依赖 TTY 的内容（提示渲染、spinner 行为、颜色选择、终端宽度）都未被测试，或者测试的是用户永远看不到的模式。
3. **规范化债务。** `replaceUnstableOutput` 有大约 50 条正则替换，用来掩盖 spinner 帧、按包管理器划分的进度行、ANSI 残留、持续时间等内容。其中很多都存在于此，是因为并发写入者产生的原始字节流本身就不稳定。渲染后的屏幕网格能消除整类问题。
4. **超时泄漏。** 超时的命令不会被杀死；进程之所以还能存活，只是因为运行器最后调用了 `process.exit(0)`。
5. **共享全局状态。** 所有用例共享 `VP_HOME=~/.vite-plus`，这迫使 19 个用例使用 `serial: true`，并让其余用例潜藏跨用例干扰。全局运行器还强制要求在每次运行前执行 `pnpm bootstrap-cli`，以便安装好的二进制与检出内容逐字节匹配。
6. **Shell 语义漂移。** 命令通过 `@yarnpkg/shell` 运行，这是一个进程内 JS shell，拥有自己的一套注释剥离和无 glob 规则。182 个 fixture 跳过了 Windows，而 shell/工具差异是主要原因之一。
7. **不稳定性只是被管理，而非被消除。** CI 最多会对变更过的用例重跑两次（`retry-failed-snap-tests.sh`），并在 diff 停止变化时接受结果。

### 为什么不扩展旧运行器

给 `snap-test.ts` 增加 PTY 模式，会保留无断言模型、shell 层、共享的 `VP_HOME` 和双树分离，同时还要叠加最难的部分（确定性的交互同步）；而这又建立在一个 Node PTY 栈之上，它还得重新学习平台层面的经验教训（ConPTY 输出重排、musl PTY 崩溃、macOS EIO 截断），而这些教训已经被 vite-task crates 编码好了。带迁移路径的干净第二套系统，比就地重建更便宜。

## 先例：vite-task 的快照套件

vite-task 仓库已经实现了与此设计完全相同的可用方案，如今被大约 190 个快照文件使用，包括交互式选择器导航和 ctrl-c 取消等场景。其组成如下：

| Crate                      | 角色                                                                                                                                                                                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pty_terminal`             | Spawns a child in a PTY (`portable-pty`), feeds output through a `vt100` emulator, answers cursor-position queries, handles resize and ctrl-c. Encodes platform workarounds: ConPTY on Windows, a global lock for musl PTY crashes, macOS slave-fd lifetime for EIO truncation. |
| `pty_terminal_test`        | `TestTerminal` wrapper plus `Reader::expect_milestone(name)`: block until the child emits a named milestone, then return the rendered screen.                                                                                                                                   |
| `pty_terminal_test_client` | Child-side helper that encodes milestones as window-title updates (`OSC 2 ; pty-terminal-test:<32-hex-id>:<base64url(name)>`, a fresh id per emission), which survive both Unix PTYs and Windows ConPTY and arrive in-order with the output they mark.                          |
| `snapshot_test`            | Minimal snapshot store: compare or update via `UPDATE_SNAPSHOTS=1`, write `<name>.new` on mismatch, return a unified diff as the failure message.                                                                                                                               |

在此基础上，`vite_task_bin/tests/e2e_snapshots` 实现了一个 `libtest-mimic` 自定义测试目标：fixture 在 `snapshots.toml` 中声明用例，步骤采用 argv 数组（不使用 shell），交互步骤携带有序的 `interactions` 列表，并且每个用例都会生成一个 Markdown 快照，其中包含命令行、交互日志，以及在每个里程碑和退出时捕获的带围栏终端截图。

vite-plus 已经通过 git 依赖了 vite-task 的 crate（`fspy`、`vite_glob`、`vite_path`、`vite_str`、`vite_task`、`vite_workspace`），而 Rust CLI 的交互式选择器工作计划基于 `vite_select`，它已经暴露了里程碑发送所需的 `after_render` 钩子。重用这套栈是实现确定性交互测试的最低风险路径。

## 目标

- 以确定性方式测试交互式会话：脚本化按键输入，基于明确的渲染里程碑进行同步，绝不依赖睡眠或输出轮询。
- 真正的断言：快照不匹配会以统一 diff 使测试失败；更新是显式的可选操作。
- 一个 fixture 树；每个用例声明 `vp` 变体（全局 Rust 二进制、本地 JS CLI，或两者都有）。
- 完整的进程隔离：每个用例独立的 `VP_HOME`、清理后的环境、受控的 `PATH`、超时后杀死子进程。
- 保留目前行之有效的部分：fixture 目录模型、本地 npm 仓库集成、平台过滤、分片 CI。
- 一个用于现有 `steps.json` 语料库的一键迁移工具，并提供一份明确的需要人工处理的报告。

## 非目标

- 与旧的 `steps.json`/`snap.txt` 格式兼容。旧快照不会被翻译；会记录并审查新的基线。
- 替换单元测试或 ecosystem-ci/e2e 测试套件。此 RFC 只替换 snap-test 层。
- 测试真实终端模拟器（iTerm、Windows Terminal）。vt100 模拟是契约，与 vite-task 相同。

## 设计概览

新布局（名称仍可继续讨论）：

```
crates/vite_cli_snapshots/          # 仅用于开发的 crate，绝不发布或打包
├── Cargo.toml                      # publish = false；dev 依赖：libtest-mimic、
│                                   #   pty_terminal_test、snapshot_test
├── src/bin/vpt.rs                  # 测试工具多合一入口（独立 bin target）
└── tests/cli_snapshots/
    ├── main.rs                     # libtest-mimic 运行器（harness = false）
    ├── redact.rs                   # 输出规范化
    ├── flavor.rs                   # 全局/本地 vp 提供
    └── fixtures/
        └── <case-dir>/
            ├── snapshots.toml      # case 声明
            ├── package.json        # fixture 文件，原样复制
            ├── ...
            ├── mock-manifest.json  # 可选，本地 registry cases
            ├── tarballs/           # 可选，本地 registry cases
            └── snapshots/
                └── <case>.md       # 记录的快照
```

运行器是一个独立的 workspace crate，而不是 `crates/vite_global_cli` 的测试目标。产品 crate 保持不变：目标列表里没有仅用于测试的 bin，依赖图里没有 `vpt` 依赖，也无需维护打包排除项。`vpt` 是运行器 crate 自身的 bin target，因此 `CARGO_BIN_EXE_vpt` 仍然可以免费解析到它。

这种布局唯一放弃的是 `CARGO_BIN_EXE_vp`（Cargo 只会为定义了该 binary 的 package 的测试设置它）。取而代之的是，运行器会在运行时从自身可执行文件位置解析 `vp`：测试二进制运行在 `target/<profile>/deps/` 下，因此全局 binary 位于父目录中（这也是 `assert_cmd::cargo_bin` 使用的同样技巧）。运行时查找对 Windows CI 流程也更友好；nextest 归档是在 Linux 上构建、再到另一台机器上运行，而不是像 `env!` 那样在编译期烘焙一个绝对路径。构建顺序由入口 recipe 处理（`just snapshot-test` 和 pnpm 包装器会在 `cargo test -p vite_cli_snapshots` 之前先执行 `cargo build -p vite_global_cli`）；如果 binary 缺失，运行器会立即失败并给出该说明，而不是去测试一个过期的构建产物。

每个 case 的执行流程：

1. 将 fixture 目录复制到一个新的临时目录（这样 workspace-root 发现会在此停止，且 case 可以自由修改文件）。
2. 配置 case 环境：临时 `VP_HOME`、临时 npm 全局前缀、基于固定基线重建的已清空 env、`PATH` 由每个 case 的 bin 目录（所选 `vp` flavor、`vpt`、node）加上最小系统目录组成。
3. 对每一步：在新的 PTY 中启动 argv（500x500 网格，`TERM=xterm-256color`），运行其 `interactions`（每个 `expect-milestone` 捕获一次屏幕），等待退出或在超时后杀死，捕获最终屏幕，进行脱敏，并追加到 case 的 Markdown 文档中。
4. 将文档与 `snapshots/<case>.md` 比较；若不匹配，则写出 `<case>.md.new` 并用统一 diff 失败退出。若设置了 `UPDATE_SNAPSHOTS=1`，则直接写入快照。

trial 名称格式为 `<fixture-dir>::<case>[::<flavor>]`，因此 `cargo test --test cli_snapshots -- create` 的筛选方式和今天的子串筛选类似，而 `libtest-mimic` 则免费提供了并行执行、`--ignored` 以及精确名称选择。

## 测试用例格式

每个 fixture 目录都包含一个 `snapshots.toml`，其中声明一个或多个 case。

### Case 字段

```toml
[[case]]
name = "create_interactive_template_pick"   # [A-Za-z0-9_]+，命名快照文件
vp = "local"                                # "local" | "global" | ["local", "global"]
comment = """
在模板选择器中按下向下箭头会选中第二个模板。
"""
cwd = "packages/app"                        # 可选，相对于 fixture 根目录
skip-platforms = ["windows"]                # 可选；取值："windows"、"linux"、
                                            #   "macos"、{ os = "linux", libc = "musl" }
ignore = false                              # 可选；将该 trial 注册为 #[ignore]
local-registry = false                      # 可选；通过本地 npm registry 提供 checkout 包 + fixture
                                            #   tarball
seed-runtime = true                         # 默认；将预置的受管 JS
                                            #   runtime 符号链接到 case 的 VP_HOME 中（对于
                                            #   runtime-provisioning 测试则为 false）
env = { VITE_DISABLE_AUTO_INSTALL = "1" }   # 可选；为整个 case 额外添加 env
unset-env = ["GITHUB_ACTIONS"]              # 可选；从基础 env 中移除
steps = [ ... ]
after = [ ... ]                             # 可选的清理步骤，绝不会被快照记录
```

说明：

- `vp` 替代了树分裂。`"local"` 会将 JS CLI（`packages/cli/bin`）放在 `PATH` 的最前面；`"global"` 则使用新构建的 Rust 二进制。列表形式会为每种 flavor 注册一个 trial，并生成各自独立的快照文件（`<case>.local.md`、`<case>.global.md`）；它存在的目的是为了像命令路由这类一致性用例，其中 global 和 local 必须表现完全相同，共享 fixture 能保证它们保持一致。
- `skip-platforms` 保留了当前 `ignoredPlatforms` 的排除语义（来自 vite-task 的包含式 `platform` 字段对这个语料库来说不那么方便，因为 Windows 排除占主导）。
- 不再有 `serial` 字段。按 case 隔离的 `VP_HOME` 和 npm-prefix 隔离消除了旧 runner 中强制需要它的共享状态；迁移工具会删除旧的 `serial: true` 标记并进行报告。

### Step 字段

一个 step 要么是裸 argv 数组，要么是一个表：

```toml
steps = [
  ["vp", "check"],                                # 简写
  { argv = ["vp", "create"],
    cwd = "sub",                                  # 可选，相对于 staged root
    comment = "第二次运行命中缓存",                 # 可选，会渲染到快照中
    envs = [["ADBLOCK", "1"]],                    # 可选的每步 env
    timeout = 120000,                             # 可选，毫秒；默认 50s（local-registry 时为 120s）
    snapshot = true,                              # false：运行但不将屏幕纳入快照
    tty = true,                                   # false：pipe 模式（无 PTY），用于显式测试
                                                  #   “stdout 不是 TTY” 的行为
    formatted-snapshot = false,                   # true：保留 SGR 颜色/样式转义
    interactions = [ ... ] },
]
```

语义：

- `argv[0]` 可以是 `vp`、`vpr`、`vpx`、`vpt`，或者允许列表中的真实工具（`node`、`git`、`npm`、`pnpm`、`yarn`、`bun`）。其他所有内容（文件检查、设置、断言）都通过 `vpt` 进行，这样在 Windows 上的行为就一致。这里没有 shell：没有 `&&`、没有重定向、没有注释剥离、没有 glob 意外。
- Steps 按顺序执行。非零退出码会记录在快照中（`**Exit code:** N`），并继续执行；某个 step 超时会杀掉子进程，记录 `timeout`，并跳过剩余步骤。
- `snapshot = false` 用同样的“仅在成功时省略输出”语义替代了当前的 `ignoreOutput`：step 标题和退出码仍会出现，而失败 step 会保留其屏幕用于诊断；只有成功输出会被省略。
- `tty = false` 会使用管道而不是 PTY 启动，适用于专门测试被管道/CI 风格输出的用例。默认是真正的 PTY，这与当前默认相反：被测试的 CLI 会看到一个 TTY，除非 case 另有说明，这与用户看到的行为一致。

### 交互

交互式 step 携带一个有序的 `interactions` 列表，并在 PTY 上执行：

```toml
interactions = [
  { "expect-milestone" = "text:project-name" },      # 等待，然后捕获屏幕
  { write = "my-app" },                              # 原始字节，不带换行
  { "expect-milestone" = "text:project-name:my-app" },
  { "write-key" = "enter" },
  { "expect-milestone" = "select:template:0" },
  { "write-key" = "down" },
  { "expect-milestone" = "select:template:1" },
  { "write-key" = "enter" },
]
```

- `expect-milestone` 会阻塞，直到 CLI 发出指定的 milestone，然后将渲染后的屏幕捕获到快照中。如果在到达 milestone 之前发生 EOF，则该 step 失败，并在错误中包含屏幕内容。
- `write` / `write-line` 发送文本（`write-line` 会附加平台换行）。
- `write-key` 发送一个命名按键：`up`、`down`、`left`、`right`、`enter`、`escape`、`space`、`tab`、`backspace`、`ctrl-c`。随着提示组件的需要，这个集合会扩展（例如 clack multiselect 会使用 `space`）。

等待是基于事件驱动的，只依赖显式 milestone。没有 wait-for-text，没有 idle detection，也没有 sleep 原语；这些机制正是让基于 PTY 的测试在其他地方普遍不稳定的原因。

### 示例：PR #2031 的后续

PR #2031 无法测试的交互式包选择器将变为：

```toml
[[case]]
name = "app_root_interactive_picker"
vp = "global"
comment = "在工作区根目录直接运行 `vp dev` 会打开包选择器；按下向下箭头会选中 web app，在下一个提示处按 ctrl-c 会干净退出。"
steps = [
  { argv = ["vp", "dev"], interactions = [
    { "expect-milestone" = "select:app-target:0" },
    { "write-key" = "down" },
    { "expect-milestone" = "select:app-target:1" },
    { "write-key" = "ctrl-c" },
  ] },
]
```

随后快照会包含光标位置为 0 时的渲染选择器、光标位置为 1 时的渲染选择器，以及取消输出，全部都是纯文本屏幕。

## 选择并配置 vp 变体

### 全局（`vp = "global"`）

运行器运行的是新构建的 Rust 二进制文件，它从测试可执行文件旁边的目标目录中解析出来（见设计概览），并以 `vp`、`vpr` 和 `vpx` 的名称链接到每个用例的 bin 目录中。`VITE_GLOBAL_CLI_JS_SCRIPTS_DIR` 指向当前检出的 `packages/cli/dist`，与现在一致。

这消除了当前全局运行器的两个固定成本：

- 不再需要 `pnpm bootstrap-cli`，也不再需要对 `~/.vite-plus/bin/vp` 做字节级匹配断言；被测试的二进制始终是当前检出版本构建出来的。
- 不再共享 `~/.vite-plus`。每个用例都有一个临时的 `VP_HOME`，因此 `vp env` 的修改、全局安装以及默认版本变更都不会在不同用例之间相互干扰，`serial` 也随之消失。由于空的 home 目录会让任何会触及运行时的命令下载一个约 50MB 的托管 Node 归档，运行器会为每个用例的 `VP_HOME/js_runtime` 预先建立一个符号链接，指向一个已预配置好的运行时：如果设置了 `VP_SNAP_JS_RUNTIME_DIR` 就使用它（CI 会在该位置恢复缓存的运行时），否则使用开发者真实的 `~/.vite-plus/js_runtime`。这个预置内容主要用于读取；测试运行时配置本身的用例可以通过 `seed-runtime = false` 选择不使用，并承担下载成本。

### 本地（`vp = "local"`）

每个用例的 bin 目录前置的是 `packages/cli/bin`（JS 分发入口），这要求 `PATH` 上有 `node`，并且 `packages/cli` 已构建，这两者本来就是当前本地运行器的前置条件。`VP_SNAP_LOCAL_CLI_BIN_DIR` 会在构建后的 `dist/` 位于其他位置时覆盖默认的 `<repo>/packages/cli/bin`（例如另一个检出目录、CI 工件目录）；如果缺少 dist 条目，运行器会快速失败，并提示执行 `pnpm build`。

### 两者都用

`vp = ["local", "global"]` 是用于对齐验证的工具。它会从一个 fixture 生成两个试验和两份快照。命令面向的用例（帮助输出、路由、`-C` 处理、错误信息）是它的目标使用场景；重量级用例应当只选择一种变体。

## 执行模型

- **PTY 和屏幕。** 每一步都会在一个新的 PTY 中启动，使用 500x500 的网格（足够大，不会因换行和滚动扭曲输出；超过 500 行的输出是否捕获回滚内容仍是一个未决问题）。输出会持续流入 vt100 模拟器；屏幕内容始终从模拟器读取，而不是直接从原始字节读取。普通捕获会去除所有样式；`formatted-snapshot = true` 会保留 SGR 颜色代码（以转义后的 `\x1b[31m` 文本形式呈现），用于断言颜色行为的场景，并继承自 `pty_terminal` 的 ConPTY 一致性修复（去除裸 SGR-reset）。  
- **环境。** 子进程环境会被清空并重建：固定基线（`VP_CLI_TEST=1`、`VP_EMIT_MILESTONES=1`、`TERM=xterm-256color`、git 身份、临时 `VP_HOME`、临时 `NPM_CONFIG_PREFIX`、受控的 `HOME`），一小组平台允许列表（Windows 需要 `SYSTEMROOT`、`APPDATA` 等），然后是用例级 `env`/`unset-env`，最后是步骤级 `envs`。今天那种约 40 条模式的透传允许列表及其泄漏风险将不复存在。基线中明确不包含：`CI=true` 和 `NO_COLOR`（PTY 让真实的交互行为成为默认，网格渲染也使颜色剥离变得不必要）。  
- **超时。** 每一步默认 50 秒（`local-registry` 用例为 120 秒），可按步骤覆盖。超时时会杀死子进程，将退出状态记录为 `timeout`，并跳过剩余步骤。不会遗留进程。  
- **退出码。** 非零时会记录在快照中。失败时，执行会跳过该步骤“行”的其余部分（直到并包括下一个 `continue-on-failure = true` 步骤之前的所有内容），并在其后恢复；如果前方没有边界，则按 shell 风格直接停止整个用例。迁移器会精确复现旧语义：`&&` 链中的成员保持默认的停止行为，每个旧命令行的最后一步都会携带边界标记，因此链中间失败会跳过该行，而下一行仍会运行；后续步骤也不会为同一行中已损坏的前置设置生成输出背书。  
- **并发。** `libtest-mimic` 会并行运行测试。vite-task 在 Linux 上串行执行，是因为并行 PTY 测试中 ctrl-c 信号路由存在不稳定性；在这么大的语料规模下，我们应当把这种串行化限定到对信号敏感的用例（一个 `serial-signals` 标记或一个专用分片），而不是整个测试套件。这个问题需要在实现过程中通过测量来决定。

## 里程碑协议和 CLI 仪器化

里程碑是 CLI 在确定性的渲染点写入其输出流中的不可见标记。其编码采用 vite-task 协议：更新窗口标题（`OSC 2 ; pty-terminal-test:<32-hex-id>:<base64url(name)>`），每次发出时使用一个全新的随机 id，因此重复的名称仍可作为不同的标题变更被观察到。它可在 Unix PTY 和 Windows ConPTY 中传递，与其标记的输出按顺序到达，并且在真实终端的屏幕内容中不会渲染出任何内容。

只有在 `VP_EMIT_MILESTONES=1` 时才会发出该标记，而只有 runner 会设置这个变量。vp 是一个广泛分发的 CLI，其输出会被管道传递到日志和其他工具中，因此像 vite-task 那样无条件发出并不适合这里。

仪器化点：

- **Rust 提示**（`crates/vite_global_cli`、`crates/vite_shared`）：通过 `pty_terminal_test_client` 发出（一个新的 git 依赖，来源与现有的 vite-task crates 相同）。计划中的交互式包选择器基于 `vite_select`，其 `after_render(RenderState)` 钩子正是为此设计的；选择器每次渲染都会发出 `select:app-target:<index>`。
- **TS 提示**（`packages/prompts`）：一个小型辅助函数（`emitMilestone(name)`）写入相同的字节序列，并接入每个 prompt 组件的渲染循环。命名约定：`<kind>:<id>:<state>`，例如 `text:project-name:my-app`、`select:template:1`、`confirm:approve-builds:yes`、`spinner:install:stop`。prompt 调用点会获得一个稳定的 `id`（组件种类加上一个在有歧义时显式指定的名称）。
- **非 prompt 的同步点**：长时间运行的命令可以标记稳定的生命周期点（`dev-server:ready`、`watch:rebuilt`），这样服务器和 watch 模式的测试在发送下一个按键或 ctrl-c 之前就有东西可等待。这就是解除搁置的 `command-pack-watch-restart` 用例的关键。

里程碑名称会刻意编码渲染后的状态（查询文本、光标索引、选择项），而不只是一个事件名。在按下 `down` 后等待 `select:template:1`，意味着屏幕截图不会与渲染发生竞争。

## 快照格式和更新工作流

每个用例（每种 flavor）对应一个 Markdown 文件，参照 vite-task：

````markdown
# create_interactive_template_pick

在模板选择器中按下箭头向下键会选中第二个模板。

## `vp create`

**→ expect-milestone:** `select:template:0`

```
◆  选择一个模板：
│  › vite-react
│    vite-vue
│    library
```

**← write-key:** `down`

**→ expect-milestone:** `select:template:1`

```
◆  选择一个模板：
│    vite-react
│  › vite-vue
│    library
```

**← write-key:** `enter`

```
◇  选择一个模板：
│  vite-vue
...退出后的最终界面...
```
````

步骤标题包含 `cd <cwd> &&` 和 `ENV=val` 前缀，因此快照本身是自描述的；非零退出会显示为 `**Exit code:** N`。

比较语义来自 `snapshot_test` crate：

- 默认运行：不匹配会写入 `snapshots/<case>.md.new` 并使该次测试失败；失败信息是统一 diff，会由 `cargo test` 输出到失败汇总中。
- `UPDATE_SNAPSHOTS=1 just snapshot-test`：写入快照，删除过时的 `.new` 文件。
- 缺少快照会导致失败，并写出 `.new` 文件供审查，因此全新的用例会走同样的审查流程。

这取代了“始终重新生成”的模式。CI 不再为了正确性依赖对 `snap.txt` 做 `git diff`，也不再依赖重试脚本；快照失败就意味着测试失败。

## 输出规范化

在截图进入快照之前，会先对捕获到的屏幕内容进行脱敏处理，这部分移植自 vite-task 的 `redact.rs`，并扩展了仍然有必要的、vp 特定的规则：

- 路径：临时 staging 根目录、`VP_HOME`、home 目录、workspace 根目录、Windows 分隔符以及 `\\?\` 前缀。
- 持续时间、大小、线程数、UUID、内容哈希。
- 在与版本无关的场景中，打包工具所带版本号。
- 注册表主机（npmjs 与 mirror）。
- 无序的诊断块（按排序处理，就像 vite-task 对多线程 lint 输出所做的那样）。

相对于目前大约 50 个正则表达式，应该缩减或消失的内容包括：spinner 帧遮罩（网格显示的是渲染后的最终状态，而不是动画帧）、ANSI 清理（普通捕获会去除样式）、包管理器进度行遮罩（进度是在网格上原地渲染，而不是在字节流中累积），以及 stdout/stderr 交错处理的技巧（两者都输入同一个终端，这本来就是用户看到的效果）。脱敏模块应从最小集合开始，只在确有需要时才增长；每新增一个正则，都是一个值得先弄清楚的确定性问题。

## vpt 测试工具

`vpt` 是一个小型 Rust 多功能工具（`crates/vite_cli_snapshots` 的一个 bin 目标，因此它的依赖永远不会触及产品 crate），用于替代旧语料库中占主导地位的 shell 内建命令（427 个 `cat`、141 个 `test`，以及 `mkdir`/`rm`/`ls`/`echo`/`cp`/`chmod`/`printf` 和 `json-edit`）。

它刻意不是一种新设计。vite-task 的 `vtt` 多功能工具已经覆盖了这部分几乎全部能力，并提供了 20 个子命令，因此 `vpt` 在重叠之处直接采用 `vtt` 的子命令名称和语义，并移植其实现（它们按设计只依赖 std，每个只有几十行）。保持契约完全一致意味着 fixtures、快照和使用习惯可以在两个仓库之间直接迁移。

用于设置和断言的子命令（替代旧案例中的 shell 内建命令），全部与 `vtt` 对齐：

| 子命令                                                       | 替代                                          |
| ------------------------------------------------------------ | --------------------------------------------- |
| `vpt print-file <file>`                                      | `cat`（快照文件内容）                         |
| `vpt stat-file <path>`                                       | `test -f x && echo ...` 存在性检查            |
| `vpt write-file` / `vpt touch-file` / `vpt replace-file-content` | `echo`/`printf` 重定向、就地修改 fixture     |
| `vpt list-dir` / `vpt mkdir` / `vpt rm` / `vpt cp`           | coreutils 用法                                 |
| `vpt grep-file <pattern> <file>`                             | 内容断言                                       |
| `vpt pipe-stdin <data> -- <argv>...`                         | 无需 shell 的管道 stdin 场景                  |

有效载荷子命令，适用于被测试命令会启动其他命令的情况（`vp run` 任务执行、缓存、取消、stdio 透传），与它们在 `vtt` 中的对应命令相同：

| 子命令                                                          | 用途                                                               |
| --------------------------------------------------------------- | ------------------------------------------------------------------ |
| `vpt print` / `vpt print-color` / `vpt print-env` / `vpt print-cwd` | 确定性的任务输出；颜色、环境变量和 cwd 传递到任务中 |
| `vpt check-tty` / `vpt read-stdin`                              | 启动任务的 stdio 连接                                             |
| `vpt exit <code>` / `vpt exit-on-ctrlc` / `vpt barrier`         | 退出码处理、取消、并发同步                                         |

`vtt` 中没有对应项的 vp 专属新增命令：`vpt json-edit <file> <dot-path> <value>`（现有 snap-tests 中用于 fixture manifest 编辑的 `json-edit` 辅助工具）以及 `vpt chmod`。

曾考虑复用 `vtt` 本身，但最终否决。Cargo git 依赖只提供库代码，绝不会提供某个依赖的二进制文件，因此获取 `vtt` 可执行文件就需要通过仓库外的 `cargo install --git`，并且要与本地开发、CI 和 nextest 归档中的其他 vite-task git 依赖保持锁步更新。将其作为库复用则意味着要依赖 `vite_task_bin`，并把整个 `vt` 产品树（任务引擎、TUI、服务器、fspy）拖入 runner 构建，只为了几个非常简单的辅助工具。这样一来，vp 专属子命令还必须先提上游 PR 并更新依赖，测试才能在这里使用它们。如果将来重复代码真的变成维护负担，预定路径是上游提取：vite-task 将这些子命令移入一个小型库 crate（就像 `pty_terminal` 目前为模拟器所做的那样），然后 `vtt`/`vpt` 变成其薄薄的 bin 包装器。

`vpt` 打印的一切都是确定性的，并且在各平台上完全一致，这直接针对造成 182 个 Windows 跳过案例的最大原因。随着迁移不断发现值得一等化的模式，子命令列表会继续扩展；任何不值得做成子命令的东西，都说明旧案例测试的是 shell，而不是 vp。

## 本地注册表集成

在某个用例中设置 `local-registry = true` 会同时替代 `localVitePlusPackages` 和 `node $SNAP_LOCAL_REGISTRY -- ...` 包装约定：

- 运行器会在每次运行时打包一次检出版本中的 `vite-plus` 和 `@voidzero-dev/vite-plus-core`（复用 `packages/tools/src/pack-local-vite-plus.ts`）。
- 对于每个用例，它会启动 `packages/tools/src/local-npm-registry.ts`，并将按包管理器区分的注册表环境变量（npm/pnpm/yarn/bun）注入到每一步中，因此夹具命令会直接是普通的 `vp migrate ...`，而不是通过包装器调用。
- 对于组织包夹具，`mock-manifest.json` + `tarballs/` 的旁车约定保持不变。

注册表工具本身没有变化；它已经能够在上游 packuments 之上提供打包好的 tarball，并带有正确的完整性信息和适用于最小发布年龄安全策略的发布时间，而且它仍然与 ecosystem-ci 以及本地 `vp create`/`vp migrate` 迭代共享。

## CI 集成

- 该测试套件是一个 cargo test 目标：先执行 `cargo build -p vite_global_cli`，再执行 `cargo test -p vite_cli_snapshots --test cli_snapshots`，并封装在 `just snapshot-test` 配方中。分片使用 `cargo nextest --partition`，而不是自定义的 `--shard=i/n` 逻辑。
- 两种 flavor 从第一天起就在 CI 中运行，且位于独立的作业中。`cli-snapshot-test`（Linux 和 macOS，每个 OS 一个执行分支）会构建 `packages/cli/dist`，安装发布版二进制文件，并使用全局 flavor 通过 `VP_SNAP_GLOBAL_VP` 指向已安装的二进制文件来运行完整套件，因此不需要第二次编译 `vite_global_cli`。（对于无法提供其中一种 flavor 的环境，`VP_SNAP_SKIP_FLAVORS` 仍然可用，例如本地运行且未构建 `dist/` 的情况。）
- Windows 方案复用了现有的跨编译基础设施：`build-windows-tests` 生成一个专用的 `-p vite_cli_snapshots` nextest archive（包含测试二进制和 `vpt`），而 `cli-snapshot-test-windows` 作业在 `windows-latest` 上运行它，且不需要 Rust toolchain。全局 `vp` 通过 `VP_SNAP_GLOBAL_VP` 由 `build-windows-cli` 预构建提供，JS CLI 则在运行器上为本地 flavor 构建，nextest 的 `--workspace-remap` 会在运行时重写 `CARGO_MANIFEST_DIR`/`CARGO_BIN_EXE_vpt`，从而让重定位后的二进制在检出目录中找到 fixtures 和辅助程序（运行器之所以优先使用这些运行时值而不是编译期路径，正是因为这个原因）。
- musl 覆盖保留其 Alpine 容器执行分支；`pty_terminal` 已经在 musl 内部对 PTY 启动做了串行化处理。
- 通过测试退出码判断通过/失败。`git diff` gate 和 `retry-failed-snap-tests.sh` 不适用于这个新套件。若某个用例被证明是不稳定的，修复方式应是设定里程碑或添加脱敏规则，而不是重跑；临时隔离（`ignore = true` 加上一个 issue）是缓冲阀。

开发者命令：

```bash
just snapshot-test                                                  # 构建 vp，运行全部
just snapshot-test create                                           # 子字符串过滤
UPDATE_SNAPSHOTS=1 just snapshot-test create_basic                  # 接受变更
cargo test -p vite_cli_snapshots --test cli_snapshots -- create     # 直接运行，前提是 vp 已构建
```

轻量的 pnpm 包装器（`pnpm snapshot-test [filter]`）保持与当前脚本一致的 DX 体验。

## 迁移工具

一个一条命令的转换器 `tool migrate-snap-tests` 位于 `packages/tools` 中旧运行器旁边（TypeScript，因为旧格式的 shell 字符串会被 `@yarnpkg/parsers` 解析，这是旧运行器实际使用的语法）：

```bash
tool migrate-snap-tests packages/cli/snap-tests --vp local [name-filter]
tool migrate-snap-tests packages/cli/snap-tests-global --vp global [name-filter]
```

对于每个旧的 case 目录，它会在 `crates/vite_cli_snapshots/tests/cli_snapshots/fixtures/` 下生成一个新的 fixture，并追加到迁移报告中。

### 字段映射

| 旧 (`steps.json`)                                 | 新 (`snapshots.toml`)                                       |
| -------------------------------------------------- | ------------------------------------------------------------ |
| 树位置（`snap-tests` / `snap-tests-global`）      | `vp = "local"` / `vp = "global"`（来自 `--vp`）              |
| `commands: [...]`                                  | 通过命令转换得到 `steps = [...]`（见下文）                   |
| `env`（值为 `""`）                                 | `env` 表（`unset-env` 条目）                                 |
| `ignoredPlatforms: ["win32", {os, libc}]`          | `skip-platforms`（`win32` 映射为 `windows`，`darwin` 映射为 `macos`） |
| `ignoreOutput: true`                               | `snapshot = false`                                           |
| `timeout`                                          | `timeout`                                                    |
| `serial: true`                                     | 丢弃，并报告（由隔离机制取代）                               |
| `localVitePlusPackages: true`                      | `local-registry = true`                                      |
| `linkCheckoutPackages: true`                       | case 标志，原样保留                                          |
| `after: [...]`                                     | `after` 步骤                                                 |
| fixture 文件、`mock-manifest.json`、`tarballs/`   | 原样复制                                                     |
| 命令上的 ` # trailing comment`                    | step 的 `comment`                                            |

### 命令转换

每个旧命令字符串都会被解析为 shell AST 并转换：

- 简单命令：一个 argv step。
- `a && b && c`：连续 steps（快照记录的退出码现在携带“必须成功”的断言；粒度变化没问题，因为快照无论如何都会重新记录）。
- coreutils 和辅助工具（`cat`、`test -f ... && echo`、`mkdir`、`rm`、`ls`、`cp`、`chmod`、`echo`/`printf` 重定向、`json-edit`）：映射为 `vpt` 等价物。
- `node $SNAP_LOCAL_REGISTRY -- <cmd>`：设置 `local-registry = true` 并展开为 `<cmd>`。
- 其他任何内容（管道、`||`、子 shell、无法识别的重定向）：作为带有 `TODO(migrate)` 注释的 step 输出，并列入报告以便手工转换。

这个语料库使这项工作变得可行：在 2,343 条命令中，有 1,403 条以 `vp` 开头，而剩余长尾主要正是上面列出的 coreutils 模式。

### 快照重新定基线

旧的 `snap.txt` 文件不会被转换；这些格式衡量的内容不同（字节流 vs 渲染后的屏幕）。每批次的迁移流程如下：

1. `tool migrate-snap-tests <old-dir> --vp <flavor> <filter>`
2. `UPDATE_SNAPSHOTS=1 just snapshot-test <filter>` 记录基线
3. 将新的 `.md` 与旧的 `snap.txt` 逐个审查对比（这一步很适合由 agent 执行：相同的命令、相同的 fixture、“新的快照是否断言了旧的快照所断言的一切”）
4. 在同一个 PR 中删除已迁移的旧 case 目录，这样任何时刻每个 case 都只存在于一棵目录树中。

## 决策

### 重用 vite-task crates 的 Rust runner，而不是重新实现一个 Node 版本

曾考虑过使用 TypeScript runner（node-pty 加上一个 JS vt100，例如 `@xterm/headless`），因为当前 runner 和本地 CLI 都是 TS。之所以否决，是因为：里程碑协议、ConPTY 的顺序怪癖、musl 下的 PTY 崩溃、macOS 的 EIO 截断，以及 snapshot/diff 机制，这些在本仓库可通过现有依赖模式（指向 vite-task 的 git 依赖）直接复用的 crates 中都已经解决并经过实战检验；node-pty 是一个带有自身构建/预编译矩阵的原生模块；而 Rust 的 `libtest-mimic` 目标可以与工作区现有的 `just test` / nextest / xwin CI 机制集成。TS 端仍然会参与其中（`packages/prompts` 中的里程碑发出、迁移工具、本地 registry），但进程编排由 Rust 负责。

### 独立的 runner crate，而不是 `vite_global_cli` 的测试目标

vite-task 将其 runner 放在产品二进制 crate（`vite_task_bin`）内部，这也是它的测试可以使用 `CARGO_BIN_EXE_vt` 的原因。这里曾考虑照搬这种做法，但最终否决。二进制目标不能使用 dev-dependencies，因此 `vpt` 的依赖会变成 `vite_global_cli` 的普通依赖，把仅用于测试的代码一起带进产品构建图；该包的每次发布构建都会多产出一个二进制，打包层必须永远将其排除；并且产品 crate 的 manifest 将不再真正描述这个产品本身。单独的 `crates/vite_cli_snapshots`（`publish = false`，并且完全从发布构建中排除）可以把这些全部隔离在产品之外。代价是在运行时从目标目录解析 `vp`，而不是使用 `env!("CARGO_BIN_EXE_vp")`，再加上一个用于构建顺序的包装 recipe；不过，对于 Windows 上重定位后的 nextest archives，运行时查找也是更稳妥的选择。

### 使用 argv 步骤和 `vpt`，而不是 shell

进程内 JS shell 是旧 runner 最大的平台漂移和隐藏语义来源之一。使用 argv 数组加上一个确定性的 multitool，可以让每一步在各个平台上的行为完全一致，并使 snapshot 的命令标题真实可信。代价是要把现有的 shell 单行命令翻译过来，不过这个成本只需由迁移工具承担一次。

### 使用里程碑，而不是等待文本或空闲检测

等待文本会与部分渲染发生竞态（文本可能在帧完成前就出现），并且在复制内容变化时会悄无声息地失效。空闲检测从定义上就依赖时序。里程碑只需少量 CLI 仪表化工作，却能在命名的渲染状态上实现精确同步；vite-task 的 selector 测试证明了它在所有三大操作系统家族上都能做到逐按键级别的确定性。

### 通过环境变量控制里程碑发出

vite-task 会无条件发出里程碑（它们在真实终端里不可见）。vp 通过 `VP_EMIT_MILESTONES=1` 来控制发出，因为它的输出经常会被管道传输、记录日志，并被其他工具解析；“在终端中不可见”并不等同于“在字节流中不存在”。这个开关只是在每次渲染时进行一次环境变量检查。

### 使用 `UPDATE_SNAPSHOTS` 进行真正的断言，而不是始终重新生成

重新生成模型让每次运行都“通过”，而把正确性外包给 `git diff` 的纪律和 CI 重试循环。默认进行比较、显式提供更新开关，这正是所有主流 snapshot 工具的做法，也使 CI 可以彻底移除这个测试套件的重试脚本。

### 一棵树按 case 区分风格，再加上一个双风格矩阵

global/local 的拆分重复了 fixture，并让两个表面逐渐漂移（PR #2031 先提交了 local snap tests，并把 global 的留到后续）。按 case 提供 `vp` 字段可以消除重复；`["local", "global"]` 这种形式则把一致性从约定变成了测试。

### 每个 case 独立的 VP_HOME，而不是共享的 `~/.vite-plus`

共享的全局状态迫使使用 `serial`、带来顺序风险，以及 bootstrap 的字节级匹配检查。基于每次运行模板克隆出来的每个 case 独立 home，使 case 之间与顺序无关，并让被测二进制的目标对象清晰明确。代价是每次运行时要预先提供一次模板，但这取代了 `pnpm bootstrap-cli` 前置步骤，而不是增加它。

## 备选方案

- **为 `snap-test.ts` 扩展一个 PTY 模式。** 保留所有结构性问题（没有断言、shell 语义、共享 home、两棵树），并且仍然需要从头在 node-pty 上解决交互式同步这一最难的部分。
- **基于 tmux 的测试。** 适合手动验证（这也是目前捕获交互式 bug 的方式），但依赖宿主机上的 tmux，额外引入一层带有自身时序的模拟层，并且在 Windows CI 上没有跨平台方案。
- **`expect`/`expectrl` 风格的模式等待。** 基于字节流的模式匹配本质上就是带额外步骤的文本等待；同样存在非确定性，而且没有渲染后的屏幕快照。
- **保留两棵树，只为新用例增加交互性。** 会无限期保留 fixture 的重复和漂移，并让旧语料继续停留在重试循环模型上；而迁移工具已经足够便宜，不值得这样做。

## 发布计划

阶段 1，runner：添加 git 依赖（`pty_terminal_test`、`pty_terminal_test_client`、`snapshot_test`）、包含其 `cli_snapshots` 测试目标和 `vpt` bin 的 `crates/vite_cli_snapshots` crate、flavor 供应、脱敏、`just snapshot-test` 配方，以及 CI 集成。先提交一些手写用例，覆盖两种 flavor、一个交互式用例和一个 `local-registry` 用例。

阶段 2，instrumentation：在 `packages/prompts`（clack 组件）以及 Rust 的 prompt/selector 路径中发出里程碑事件。先落地 PR #2031 的后续 picker 测试和一个 `vp create` 交互流程作为验证用例，并补上已暂存的 watch-restart 用例。

阶段 3，迁移：先落地 `tool migrate-snap-tests`，然后分批迁移到可审查的批次中（建议顺序：先迁移 `snap-tests-global`，因为它从 VP_HOME 隔离中受益最大，然后再迁移 `snap-tests`）。在此阶段，旧套件和新套件会在 CI 中并行运行；每个批次 PR 都会删除它所迁移的旧用例。

阶段 4，移除：删除 `snap-test.ts`、重试脚本、`snap-test*` 包脚本、旧的 CI 任务，以及 `snap-tests*/` 目录树。更新 `AGENTS.md` 和 `CONTRIBUTING.md`。

从阶段 1 落地的那一刻起，新测试就会以新格式编写。

## 未决问题

1. **滚动回溯捕获。** 一个 500 行的网格已覆盖几乎所有情况；对于少数输出更长的命令，我们是把 vt100 的滚动回溯捕获到快照中，还是将过长输出视为一个案例气味？
2. **Linux 并行性。** vite-task 为了解决 ctrl-c 测试中的信号路由不稳定问题，在 Linux 上强制使用 `--test-threads=1`。在约 529 个用例的情况下，我们需要将其限定作用域（只序列化对信号敏感的用例）或者彻底解决；这需要在 Phase 1 中测量。
3. **运行时下载用例。** 已在 Phase 1 中解决：每个用例的 `VP_HOME/js_runtime` 通过从 `VP_SNAP_JS_RUNTIME_DIR`（或真实的 `~/.vite-plus/js_runtime`）建立符号链接进行预置，而 `seed-runtime = false` 会让某个用例选择真正空的 home。剩下未决的是，运行时提供类用例是否应该在 CI 中从网络下载，还是从本地归档 fixture 下载。
4. **构建配置。** 包装器 recipe 决定 `vp` 使用哪个 profile 构建；如果调试构建的 vp 对安装密集型用例来说太慢，那么让它使用 `--release`（或专用 profile）构建，而 runner 本身仍保持在测试 profile 上，可能是正确答案。此时运行时查找必须从匹配的 profile 目录解析二进制文件。
5. **Prompt ids。** `<kind>:<id>:<state>` 这种命名需要为 `packages/prompts` 和 Rust prompts 中的每个交互式调用点提供稳定的 `id`；这些 id 是在所有地方显式传入，还是通过派生并可覆盖的方式生成，是需要在 Phase 2 中确定的实现细节。
