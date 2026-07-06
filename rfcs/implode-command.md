# RFC：Implode（自卸载）命令

## 状态

已实现

## 背景

Vite+ 目前没有内置的卸载方式。用户必须手动删除 `~/.vite-plus/`，并逐个检查 shell 配置文件（`.zshrc`、`.bashrc`、`.profile`、`config.fish` 等），移除 `install.sh` 添加的 source 语句。这很容易出错，而且会留下残留文件。

原生的 `vp implode` 命令可以一步清理系统中的所有 Vite+ 相关内容。

### 安装脚本写入的内容

`install.sh` 脚本会向 shell 配置文件添加以下内容：

```
<blank line>
# Vite+ bin (https://viteplus.dev)
. "$HOME/.vite-plus/env"
```

对于 fish shell：

```
<blank line>
# Vite+ bin (https://viteplus.dev)
source "$HOME/.vite-plus/env.fish"
```

在 Windows 上，`install.ps1` 会将 `~/.vite-plus/bin` 添加到用户的 PATH 环境变量中。

## 目标

1. 提供一个单一命令，彻底从系统中移除 Vite+
2. 清理 shell 配置文件（移除 source 行及相关注释）
3. 删除 `~/.vite-plus/` 目录及其所有内容
4. 处理 Windows 特定的清理（用户 PATH、被锁定的二进制文件）
5. 要求显式确认，以防止意外卸载

## 非目标

1. 选择性移除（例如，保留已下载的 Node.js 版本）
2. 移除前备份
3. 删除项目级别的 `vite-plus` npm 依赖

## 用户故事

### 故事 1：交互式卸载

```bash
$ vp implode
warn: 这将从你的系统中完全移除 vite-plus！

  目录：/home/user/.vite-plus
  需要清理的 Shell 配置文件：
    - ~/.zshenv
    - ~/.bashrc

输入 uninstall 以确认：
uninstall
✓ 已清理 ~/.zshenv
✓ 已清理 ~/.bashrc
✓ 已移除 /home/user/.vite-plus

✓ vite-plus 已从你的系统中移除。
note: 重启终端以应用 shell 更改。
```

### 故事 2：非交互式卸载（CI）

```bash
$ vp implode --yes
✓ 已清理 ~/.zshenv
✓ 已清理 ~/.bashrc
✓ 已移除 /home/user/.vite-plus

✓ vite-plus 已从你的系统中移除。
note: 重启终端以应用 shell 更改。
```

### 故事 3：未安装

```bash
$ vp implode --yes
info: vite-plus 未安装（目录不存在）
```

### 故事 4：没有 TTY 且未使用 --yes

```bash
$ echo "" | vp implode
无法请求确认：stdin 不是 TTY。请使用 --yes 跳过确认。
```

## 技术设计

### 命令接口

```
vp implode [OPTIONS]

Options:
  -y, --yes   跳过确认提示
  -h, --help  显示帮助
```

### 命令名称：`implode`

**决策**：遵循 mise 的惯例，使用 `implode` 作为自毁命令。

**考虑过的替代方案**：

- `self uninstall` / `self remove` —— 被 rustup 使用（`rustup self uninstall`）；需要子命令组
- `uninstall` —— 与包卸载操作含义不明确

**理由**：

- 单词短、易记、无歧义
- 遵循 mise 的先例（`mise implode`）
- 不会与包管理操作混淆

### 实现流程

```
┌───────────────────────────────────────────────┐
│                vp implode                     │
├───────────────────────────────────────────────┤
│  1. 通过 get_vite_plus_home 解析 ~/.vite-plus │
│  2. 扫描 shell 配置文件中的 Vite+ 行          │
│  3. 确认提示（除非使用 --yes）                │
│  4. 清理 shell 配置文件                       │
│  5. 移除 Windows PATH 条目（仅 Windows）      │
│  6. 删除 ~/.vite-plus/ 目录                   │
│  7. 输出成功消息                              │
└───────────────────────────────────────────────┘
```

#### 第 1 步：解析 Home 目录

使用 `vite_shared::get_vite_plus_home()` 确定安装目录。如果目录不存在，打印 "not installed" 并以 0 退出。

#### 第 2 步：扫描 Shell 配置文件

检查以下文件中是否存在 Vite+ 的 source 行：

| Shell | 文件                                         |
| ----- | -------------------------------------------- |
| zsh   | `~/.zshenv`, `~/.zshrc`                      |
| bash  | `~/.bash_profile`, `~/.bashrc`, `~/.profile` |
| fish  | `~/.config/fish/config.fish`                 |

**POSIX 检测模式**：包含 `.vite-plus/env"` 的行（末尾的引号可避免匹配 `env.fish`）。

**Fish 检测模式**：包含 `.vite-plus/env.fish` 的行。

#### 第 3 步：确认

除非传入 `--yes`：

- 如果 stdin 不是 TTY，则返回错误并提示使用 `--yes`
- 显示将被移除的内容（目录路径 + 受影响的 shell 配置文件）
- 要求用户输入 `uninstall` 进行确认（类似 `rustup self uninstall`）

#### 第 4 步：清理 Shell 配置文件

对每个受影响的文件，移除：

1. source 行（`. "$HOME/.vite-plus/env"` 或 `source ... env.fish`）
2. 其上一行的注释（`# Vite+ bin (https://viteplus.dev)`）
3. 注释前面的空行（由安装脚本添加）

shell 配置文件清理不是致命错误——如果某个文件无法写入，会打印警告并继续执行。

#### 第 5 步：清理 Windows PATH

在 Windows 上，运行 PowerShell 从用户 PATH 环境变量中移除 `.vite-plus\bin`：

```powershell
[Environment]::SetEnvironmentVariable('Path',
  ([Environment]::GetEnvironmentVariable('Path', 'User') -split ';' |
  Where-Object { $_ -ne '<bin_path>' }) -join ';', 'User')
```

#### 第 6 步：删除目录

**Unix**：`std::fs::remove_dir_all` 即使在二进制运行时也可正常工作（Unix 不会删除已打开的文件，直到所有文件描述符都关闭）。

**Windows**：正在运行的 `vp.exe` 始终会被 OS 锁定。策略如下：

1. 将 `~/.vite-plus` 重命名为 `~/.vite-plus.removing-<pid>`，这样原路径可立即用于重新安装
2. 启动一个分离的 `cmd.exe` 进程，最多重试 10 次执行 `rmdir /S /Q`，每次之间暂停 1 秒（通过 `timeout /T 1 /NOBREAK`），一旦目录消失就立即退出

### 文件结构

```
crates/vite_global_cli/
├── src/
│   ├── commands/
│   │   ├── implode.rs        # 完整实现
│   │   ├── mod.rs            # 添加 implode 模块
│   │   └── ...
│   └── cli.rs                # 添加 Implode 命令变体
```

### 错误处理

| 错误                        | 行为                         |
| ---------------------------- | ---------------------------- |
| 未找到 Home 目录             | 打印 "not installed"，以 0 退出 |
| Home 目录不存在              | 打印 "not installed"，以 0 退出 |
| 无法确定用户 Home            | 返回错误                    |
| Shell 配置文件写入失败       | 警告并继续                  |
| Windows PATH 清理失败        | 警告并继续                  |
| 目录删除失败                | 返回错误                    |
| 未使用 --yes 且非 TTY        | 返回错误并给出建议          |

## 测试策略

### 单元测试

- `test_remove_vite_plus_lines_posix` — 从模拟的 `.zshrc` 中移除注释 + source 语句
- `test_remove_vite_plus_lines_fish` — 移除 fish 的 `source` 语法
- `test_remove_vite_plus_lines_no_match` — 当不存在 Vite+ 行时不做修改
- `test_remove_vite_plus_lines_absolute_path` — 处理 `/home/user/.vite-plus/env` 变体
- `test_remove_vite_plus_lines_preserves_surrounding` — 保留其他内容不变
- `test_clean_shell_profile_integration` — 基于 tempdir 的集成测试
- `test_execute_not_installed` — 将 `VP_HOME` 指向不存在的路径，验证成功

### CI 测试

在 `.github/workflows/ci.yml` 中，卸载测试会与升级测试一起运行，覆盖所有平台（所有平台使用 bash，Windows 上使用 powershell 和 cmd）：

1. 运行 `vp implode --yes`
2. 验证 `~/.vite-plus/` 已被移除
3. 通过 `pnpm bootstrap-cli:ci` 重新安装
4. 验证重新安装可正常工作（`vp --version`）

### 手动测试

```bash
# 构建并安装
pnpm bootstrap-cli

# 测试交互式确认（取消）
vp implode

# 测试完整卸载
vp implode --yes

# 验证清理
ls ~/.vite-plus      # 应不应存在
grep vite-plus ~/.zshenv ~/.zshrc ~/.bashrc  # 应找不到任何内容

# 验证 vp 已移除
which vp             # 不应找到（在终端重启后）
```

## 参考文献

- [RFC：升级命令](./upgrade-command.md)
- [RFC：全局 CLI（Rust 二进制）](./global-cli-rust-binary.md)
- [安装脚本](../packages/cli/install.sh)
- [安装脚本（Windows）](../packages/cli/install.ps1)
