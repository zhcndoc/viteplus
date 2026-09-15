# RFC：升级检查

## 状态

草案

## 背景

Vite+ 有一个用于自我更新的 `vp upgrade` 命令，但用户只有在手动运行 `vp upgrade --check` 或从外部得知时，才会发现新版本。大多数现代 CLI 工具（npm、rustup、Homebrew）在有新版本可用时都会显示一条简短、非侵入式的提示。这有助于用户保持最新，而无需主动轮询更新。

升级命令的 RFC 明确将“每次命令调用都自动更新”列为非目标，并指出“带可选通知的周期性后台检查”是未来增强功能。本 RFC 定义了这一增强。

### 设计原则

1. **绝不阻塞用户。** 检查不能给任何命令增加延迟。
2. **绝不令人厌烦。** 提示应当罕见、单行、且容易关闭。
3. **绝不在未预期时连接外部服务。** 网络请求有频率限制，并在 CI 中跳过。

## 目标

1. 当 `vp` 有更新版本可用时显示一行升级提示
2. 对命令延迟零影响（完全异步、带缓存）
3. 合理的默认频率（每 24 小时一次）
4. 可通过环境变量轻松禁用
5. 复用升级命令中现有的 npm registry 解析逻辑。

## 非目标

1. 自动安装更新（用户必须显式运行 `vp upgrade`）
2. 检查本地 `vite-plus` 包版本（仅限全局 CLI）
3. 为预发布/测试通道版本显示提示。

## 用户故事

### 故事 1：发现新版本

```
$ vp build
...构建输出...

vp 有可用更新：0.1.0 → 0.2.0，运行 `vp upgrade`
```

### 故事 2：已经是最新版本（不提示）

```
$ vp build
...构建输出...
```

不会显示升级提示——用户只会看到自己的命令输出。

### 故事 3：CI 环境（不提示）

```
$ CI=true vp build
...构建输出...
```

在 CI 中会完全禁用升级检查。

### 故事 4：用户选择退出

```
$ VP_NO_UPDATE_CHECK=1 vp build
...构建输出...
```

不会发起网络请求，也不会显示提示。

### 故事 5：离线 / registry 不可达

```
$ vp build
...构建输出...
```

检查会静默失败。没有提示，没有错误，没有重试刷屏。

## 技术设计

### 概述

```
Foreground `vp` starts
       │
       ├── parse the requested command and read the local cache
       │          │
       │          ├── ineligible command or fresh cache → spawn nothing
       │          └── stale/missing cache → launch detached
       │                         `vp upgrade --background-check`
       │                                  │
       │                                  ├── fresh cache or lock held → exit silently
       │                                  └── acquire OS file lock → atomically write
       │                                      `unknown` cooldown → query registry
       │                                      → atomically write final status
       │
       └── run the requested command without waiting for registry I/O
                  │
                  └── if no helper was launched, optionally print a cached notice
```

前台进程在启动辅助进程前只执行参数和缓存检查，缓存有效时不会创建新进程。辅助进程会被置于独立的进程组中，并断开标准流，因此可以在前台命令及其 shell 提示符返回后继续完成。启动了辅助进程的命令不会使用其结果；之后符合条件的命令可以显示提示。

### 缓存文件

位置：

- 缓存：`~/.vite-plus/cache/upgrade-check.json`
- 跨进程锁：`~/.vite-plus/cache/upgrade-check.lock`

格式（为简单起见，每行一个 JSON）：

```json
{
  "checked_for": "0.1.0",
  "latest": "0.2.0",
  "status": "available",
  "checked_at": 1711500000,
  "prompted_at": 1711500000
}
```

- `checked_for`：此结果所适用的已安装 `vp` 版本
- `latest`：最近一次成功检查期间 npm registry 返回的版本
- `status`：`available`、`current` 或 `unknown`
- `checked_at`：最近一次检查尝试开始或完成时的 Unix 时间戳（秒）
- `prompted_at`：上一次向用户显示提示时的 Unix 时间戳（秒）

缓存写入使用临时文件加原子替换。OS 文件锁用于串行化工作进程和提示时间戳更新，进程退出时会自动释放，并存储一个生成令牌，以确保请求进行期间被移除或替换的安装不会被工作进程写入。工作进程会在第一次网络 await 之前写入带有最新 `checked_at` 的 `unknown` 结果，因此取消操作、离线 registry 以及 shell 突然退出都不会导致每次调用都发起请求。

### 检查逻辑（伪代码）

有两个独立的频率限制共同控制行为：

1. **`checked_at`** —— 控制查询 registry 的频率（每 24 小时一次）
2. **`prompted_at`** —— 控制显示提示的频率（每 24 小时一次）

这意味着：registry 最多每天查询一次；即使有更新存在，用户看到提示也最多每天一次。显示后会更新 `prompted_at`，因此 24 小时内的后续运行都会保持静默。

### 显示

升级提示会打印到 **stderr**（像 tip 一样），在命令输出之后、tip 行之前：

```
vp 有可用更新：0.1.0 → 0.2.0，运行 `vp upgrade`
```

样式：

- 单行，无缩进
- 使用暗淡文本，版本号高亮（当前版本为暗淡，新版本为绿色加粗），并高亮 `vp upgrade`

提示会在命令输出之后、任何 tip 之前打印，因此更像是自然的后记，而不是一次打断。

### 抑制规则

在以下情况下**不会**显示提示：

| 条件                            | 原因                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| `VP_NO_UPDATE_CHECK=1`          | 显式退出                                                   |
| 设置了 `CI`                     | CI 环境不应看到升级提示                                     |
| 设置了 `VP_CLI_TEST`            | 测试环境                                                   |
| 安静/机器可读标志                | `--silent`, `-s`, `--json`, `--parseable`, `--format json/list` |
| 正在运行 `vp upgrade`           | 已经在升级，不需要再提示                                    |
| 正在运行 `vp upgrade --check`   | 已经在检查，不要重复                                        |
| stderr 不是 TTY                 | 非交互式 / 管道 / 重定向输出                                |
| 24 小时内已经提示过             | 每天最多一次，不要每次运行都提示                            |

### 检查触发条件和前台抑制

解析符合条件的前台命令后，`vp` 会检查退出选择和 CI 状态，以及本地缓存。只有当缓存已过期或不存在时，才会启动分离的工作进程。工作进程启动后会重复缓存检查，然后使用跨进程锁和另一次缓存检查来协调并发调用。其标准流会被丢弃，前台命令永远不会等待其 registry 请求。

以下情况不会显示缓存提示：

- `vp upgrade`（已经处理版本检查）
- `vp implode`（移除工具）
- `vp lint` / `vp fmt`（太快了，后台检查收益不大）
- `vp --version` / `vp -V`（版本显示，保持快速）
- 任何带安静/机器可读标志的命令（`--silent`, `-s`, `--json`, `--parseable`, `--format json/list`）
- 通过 vp 调用的 shim（`node`、`npm`、`npx`）

Shim 调用不会经过前台提示路径。

### 文件结构

```
crates/vp_global_cli/src/
├── upgrade_check.rs        # New: cache read/write, background check, display
├── main.rs                # Modified: conditionally launch helper and display cached result
└── cli.rs                 # Modified: hidden background-check option
```

无需新增 crate——这是现有 `vp_global_cli` crate 中一个小而专注的模块。它从现有的 `commands/upgrade/registry.rs` 中导入 `resolve_version`。

### 实现细节

#### 后台检查命令

```rust
if options.background_check {
    run_background_check().await;
    return Ok(ExitStatus::default());
}
```

`--background-check` 被隐藏，因为它是前台启动器的实现细节。前台 `vp` 进程会在运行请求的命令前，将此命令配置并作为分离的子进程启动。隐藏命令会重复执行开销很低的策略和缓存检查，以解决并发前台调用之间的竞争。

未启动辅助进程的前台命令会在完成后调用 `display_cached_upgrade_notice`。此路径不会执行网络操作，并且只有在存在可用且尚未提示的缓存结果时才会获取锁。

## 设计决策

### 1. 基于缓存的频率限制（而非概率）

**决策**：每 24 小时检查一次，并缓存到磁盘。

**备选方案**：

- 概率式（每次调用有 1/N 的机会）——更简单，但不一致；倒霉的用户可能永远看不到提示
- 无缓存的基于定时器——需要后台守护进程或 cron 任务

**理由**：行为确定，不会有意外。缓存文件很小，读取成本低。24 小时足够避免打扰，也足够实用。

### 2. 分离的后台进程（而非进程内任务）

**决策**：允许符合条件的前台 `vp` 命令以分离进程的方式启动隐藏的 Rust 检查命令，但仅在确定缓存已过期后执行。

**备选方案**：

- 在命令完成后检查——会增加可见延迟
- 让 shell 集成启动工作进程——不支持未集成的 shell，并且缓存有效时仍会启动不必要的进程
- 在前台 CLI 中生成 Tokio 任务——CLI 退出时，其运行时必须等待或取消请求
- 独立的后台守护进程——重量级且更难管理

**理由**：前台进程通过低成本的缓存读取，可以避免几乎所有辅助进程的启动；而分离进程不会产生 registry 请求的延迟尾部。将启动器保留在 `vp` 中，还能在无需维护守护进程的情况下，为不同 shell 提供一致的行为。

### 3. 将提示输出到 stderr

**决策**：输出到 stderr，而不是 stdout。

**理由**：与提示系统一致。不会污染 stdout，避免影响管道或解析。捕获 stdout 的工具（例如 `result=$(vp ...)`）不会受影响。

### 4. 不需要显式选择加入

**决策**：默认启用，并可通过 `VP_NO_UPDATE_CHECK=1` 轻松退出。

**备选方案**：

- 仅主动选择加入——大多数用户永远不会发现它
- 首次运行时询问——增加安装摩擦

**理由**：大多数 CLI 工具（npm、pip、gh）都默认启用更新检查。该检查不会阻塞，而且提示很少见（最多每 24 小时一次，且仅在确实有更新时）。不想要的用户可以设置一个环境变量。

### 5. Semver 比较（而非字符串相等）

**决策**：仅当 `latest` 按 Semver 严格大于 `current` 时才显示提示。

**理由**：字符串不相等会让预发布版或 alpha 用户被提示“降级”到更旧的稳定版。Semver 比较可确保提示只在真正升级时出现。开发构建（`0.0.0`）会被完全跳过。

## 测试策略

### 单元测试

- 缓存读写：有效 JSON、原子替换、损坏/缺失文件
- OS 文件锁互斥、自动释放和安装生成失效
- `should_check`：遵循环境变量、缓存新鲜度、TTY 检测
- 版本比较：相同版本、不同版本、预发布版本

### 集成测试

- 模拟返回某个版本的 registry 服务器，验证是否显示提示
- 验证缓存有效时不显示提示
- 验证 CI 模式下不显示提示
- 针对缓慢的模拟 registry 服务器启动并发检查；验证请求恰好执行一次，并且冷却状态在响应前持久化
- 验证符合条件的前台命令仅在缓存过期时启动分离检查

### 手动测试

```bash
# Clear cache to force a fresh check
rm ~/.vite-plus/cache/upgrade-check.json

# Run an eligible foreground command to launch the check
vp build

# Run again after the background request completes — should not re-query (cached)
vp build

# 禁用并验证
VP_NO_UPDATE_CHECK=1 vp build
```

## 参考资料

- [RFC：自更新命令](./upgrade-command.md)
- [npm update-notifier 模式](https://github.com/yeoman/update-notifier)
- [Rust CLI 更新检查（cargo-update）](https://github.com/nabijaczleweli/cargo-update)
