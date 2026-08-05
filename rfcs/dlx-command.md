# RFC：Vite+ dlx 命令

## 摘要

添加 `vp dlx` 命令，从注册表获取软件包，而无需将其作为依赖项安装，动态加载该软件包，并运行其提供的默认命令二进制文件。这为 pnpm、npm、yarn 和 bun 提供了一个统一的接口，用于临时执行远程软件包。

## 动机

目前，开发者必须使用特定于包管理器的命令来执行远程包：

```bash
# pnpm
pnpm dlx create-react-app my-app
pnpm dlx typescript tsc --version

# npm
npx create-react-app my-app
npm exec -- create-react-app my-app

# yarn（仅限 v2+）
yarn dlx create-react-app my-app
```

这带来了以下几个问题：

1. **认知负担**：开发者必须记住每个包管理器对应的不同命令
2. **上下文切换**：在使用不同包管理器的项目之间工作时，开发者需要切换思维模式
3. **脚本可移植性**：使用类似 dlx 命令的脚本与特定包管理器绑定
4. **Yarn 1.x 不兼容**：Yarn Classic 完全没有 `dlx` 命令，因此必须退回使用 `npx`

### 当前痛点

```bash
# 开发者需要知道使用的是哪个包管理器
pnpm dlx create-vue my-app          # pnpm 项目
npx create-vue my-app               # npm 项目
yarn dlx create-vue my-app          # yarn@2+ 项目（在 yarn@1 中无法运行）

# 指定包时使用不同的语法
pnpm --package=typescript dlx tsc --version
npm exec --package=typescript -- tsc --version
yarn dlx -p typescript tsc --version

# Shell 模式使用不同的选项
pnpm dlx -c 'echo "hello" | cowsay'
npm exec -c 'echo "hello" | cowsay'
yarn dlx -c 'echo "hello" | cowsay'  # Yarn 不支持
```

### 提议的解决方案

```bash
# 适用于所有包管理器
vp dlx create-vue my-app
vp dlx typescript tsc --version
vp dlx --package yo --package generator-webapp yo webapp
vp dlx -c 'echo "hello" | cowsay'
```

## 提议的解决方案

### 命令语法

```bash
vp dlx [OPTIONS] <package[@version]> [args...]
```

**选项：**

- `--package, -p <name>`：指定在运行命令前要安装的软件包。可以多次指定。
- `--shell-mode, -c`：在 shell 环境中执行命令（UNIX 上为 `/bin/sh`，Windows 上为 `cmd.exe`）。
- `--silent, -s`：除所执行命令的输出外，抑制所有输出。

### 使用示例

```bash
# 基本用法 - 运行软件包的默认二进制文件
vp dlx create-vue my-app

# 指定版本
vp dlx create-vue@3.10.0 my-app
vp dlx typescript@5.5.4 tsc --version

# 分离软件包和命令（当二进制文件名称与软件包名称不同时）
vp dlx --package @pnpm/meta-updater meta-updater --help

# 多个软件包
vp dlx --package yo --package generator-webapp yo webapp --skip-install

# Shell 模式（管道命令）
vp dlx --package cowsay --package lolcatjs -c 'echo "hi vite" | cowsay | lolcatjs'

# 静默模式
vp dlx -s create-vue my-app

# 组合选项
vp dlx -p typescript -p @types/node -c 'tsc --init && node -e "console.log(123)"'
```

### 命令映射

**参考：**

- pnpm: https://pnpm.io/cli/dlx
- npm: https://docs.npmjs.com/cli/v10/commands/npm-exec
- yarn: https://yarnpkg.com/cli/dlx
- bun: https://bun.sh/docs/pm/bunx

| Vite+ 标志                   | pnpm               | npm                 | yarn@1      | yarn@2+          | bun                | 描述                   |
| ---------------------------- | ------------------ | ------------------- | ----------- | ---------------- | ------------------ | ---------------------- |
| `vp dlx <pkg>`                | `pnpm dlx <pkg>`   | `npm exec <pkg>`    | `npx <pkg>` | `yarn dlx <pkg>` | `bun x <pkg>`      | 执行软件包二进制文件   |
| `--package <name>`、`-p <name>` | `--package <name>` | `--package=<name>`  | 不适用      | `-p <name>`      | `--package <name>` | 指定要安装的软件包     |
| `--shell-mode`、`-c`          | `-c`               | `-c`                | 不适用      | 不适用           | 不适用             | 在 shell 中执行         |
| `--silent`、`-s`              | `--silent`         | `--loglevel silent` | `--quiet`   | `--quiet`        | 不适用             | 抑制输出               |

**注意：**

- **yarn@1（Classic）**：没有原生的 `dlx` 命令。会回退到使用随 npm 一起提供的 `npx`。
- **npm exec 与 npx**：`npx` 本质上是带有一些便利功能的 `npm exec --` 别名。为保持一致性，我们使用 `npm exec`。
- **Shell 模式**：Yarn 2+ 不支持 shell 模式（`-c`），命令会打印警告并尝试继续执行。
- **`--package` 标志的位置**：对于 pnpm，`--package` 位于 `dlx` 之前。对于 npm，`--package` 可以位于任意位置。对于 yarn，`-p` 位于 `dlx` 之后。
- **自动确认提示**：对于 npm 和 npx（yarn@1 回退方案），会自动添加 `--yes`，以与无需确认的 pnpm 行为保持一致。
- **bun**：使用 `bun x` 子命令（相比独立的 `bunx` 二进制文件，它具有更好的跨平台兼容性）。它支持 `--package`，但不支持 `--shell-mode` 或 `--silent` 标志。`--package` 标志必须位于软件包说明符之前。

### 参数处理

`dlx` 命令具有特定的参数解析要求：

```bash
# 软件包说明符之后的所有内容都会传递给所执行的命令
vp dlx typescript tsc --version --help

# 这将运行：tsc --version --help
# 而不是：使用 vp dlx 选项 --version --help 运行 typescript
```

**实现方式：**

1. 解析已知的 vp dlx 选项（`--package`、`-c`、`-s`）
2. 第一个非选项参数是软件包说明符（可选带有 @version）
3. 所有剩余参数都会原样传递给所执行的命令

## 实现架构

### 1. 命令结构

**文件**：`crates/vite_command/src/lib.rs`

添加新命令：

```rust
#[derive(Subcommand, Debug)]
pub enum Commands {
    // ... 现有命令

    /// 在不将其安装为依赖项的情况下执行包二进制文件
    #[command(disable_help_flag = true)]
    Dlx {
        /// 在运行命令前要安装的包
        /// 可以多次指定
        #[arg(long, short = 'p', value_name = "NAME")]
        package: Vec<String>,

        /// 在 shell 环境中执行命令
        #[arg(long = "shell-mode", short = 'c')]
        shell_mode: bool,

        /// 除被执行命令的输出外，抑制所有输出
        #[arg(long, short = 's')]
        silent: bool,

        /// 要执行的包（可选带有 @version）及其参数
        #[arg(trailing_var_arg = true, allow_hyphen_values = true)]
        args: Vec<String>,
    },
}
```

### 2. 包管理器适配器

**文件**：`crates/vite_install/src/commands/dlx.rs`（新文件）

```rust
use std::{collections::HashMap, process::ExitStatus};

use vite_error::Error;
use vite_path::AbsolutePath;

use crate::package_manager::{
    PackageManager, PackageManagerType, ResolveCommandResult, format_path_env, run_command,
};

/// dlx 命令的选项
pub struct DlxCommandOptions<'a> {
    /// 要安装的附加包
    pub packages: &'a [String],
    /// 要执行的包（第一个位置参数）
    pub package_spec: &'a str,
    /// 传递给被执行命令的参数
    pub args: &'a [String],
    /// 在 shell 模式下执行
    pub shell_mode: bool,
    /// 抑制输出
    pub silent: bool,
}

impl PackageManager {
    /// 为检测到的包管理器解析 dlx 命令
    #[must_use]
    pub fn resolve_dlx_command(&self, options: &DlxCommandOptions) -> ResolveCommandResult {
        let envs = HashMap::from([("PATH".to_string(), format_path_env(self.get_bin_prefix()))]);

        match self.client {
            PackageManagerType::Pnpm => self.resolve_pnpm_dlx(options, envs),
            PackageManagerType::Npm => self.resolve_npm_dlx(options, envs),
            PackageManagerType::Yarn => {
                if self.version.starts_with("1.") {
                    // Yarn 1.x 没有 dlx，因此回退到 npx
                    self.resolve_npx_fallback(options, envs)
                } else {
                    self.resolve_yarn_dlx(options, envs)
                }
            }
        }
    }

    fn resolve_pnpm_dlx(
        &self,
        options: &DlxCommandOptions,
        envs: HashMap<String, String>,
    ) -> ResolveCommandResult {
        let mut args = Vec::new();

        // 在 dlx 前添加 --package 标志
        for pkg in options.packages {
            args.push("--package".into());
            args.push(pkg.clone());
        }

        args.push("dlx".into());

        // 添加 shell 模式标志
        if options.shell_mode {
            args.push("-c".into());
        }

        // 添加静默标志
        if options.silent {
            args.push("--silent".into());
        }

        // 添加包规格
        args.push(options.package_spec.into());

        // 添加命令参数
        args.extend(options.args.iter().cloned());

        ResolveCommandResult {
            bin_path: "pnpm".into(),
            args,
            envs,
        }
    }

    fn resolve_npm_dlx(
        &self,
        options: &DlxCommandOptions,
        envs: HashMap<String, String>,
    ) -> ResolveCommandResult {
        let mut args = vec!["exec".into()];

        // 添加包标志
        for pkg in options.packages {
            args.push(format!("--package={}", pkg));
        }

        // 同时添加主包
        if !options.packages.is_empty() || options.package_spec.contains('@') {
            args.push(format!("--package={}", options.package_spec));
        }

        // 添加 shell 模式标志
        if options.shell_mode {
            args.push("-c".into());
        }

        // 始终添加 --yes 以自动确认提示（与 pnpm 的行为保持一致）
        args.push("--yes".into());

        // 添加静默标志
        if options.silent {
            args.push("--loglevel".into());
            args.push("silent".into());
        }

        // 添加分隔符和命令
        args.push("--".into());

        // 对于 npm exec，需要从包规格中提取命令名称
        let command = if options.packages.is_empty() {
            extract_command_from_spec(options.package_spec)
        } else {
            options.package_spec.to_string()
        };
        args.push(command);

        // 添加命令参数
        args.extend(options.args.iter().cloned());

        ResolveCommandResult {
            bin_path: "npm".into(),
            args,
            envs,
        }
    }

    fn resolve_yarn_dlx(
        &self,
        options: &DlxCommandOptions,
        envs: HashMap<String, String>,
    ) -> ResolveCommandResult {
        let mut args = vec!["dlx".into()];

        // 添加包标志
        for pkg in options.packages {
            args.push("-p".into());
            args.push(pkg.clone());
        }

        // 为静默模式添加 quiet 标志
        if options.silent {
            args.push("--quiet".into());
        }

        // 警告不支持 shell 模式
        if options.shell_mode {
            eprintln!("Warning: yarn dlx does not support shell mode (-c)");
        }

        // 添加包规格
        args.push(options.package_spec.into());

        // 添加命令参数
        args.extend(options.args.iter().cloned());

        ResolveCommandResult {
            bin_path: "yarn".into(),
            args,
            envs,
        }
    }

    fn resolve_npx_fallback(
        &self,
        options: &DlxCommandOptions,
        envs: HashMap<String, String>,
    ) -> ResolveCommandResult {
        eprintln!("Note: yarn@1 does not have dlx command, falling back to npx");

        let mut args = Vec::new();

        // 添加包标志
        for pkg in options.packages {
            args.push("--package".into());
            args.push(pkg.clone());
        }

        // 添加 shell 模式标志
        if options.shell_mode {
            args.push("-c".into());
        }

        // 为静默模式添加 quiet 标志
        if options.silent {
            args.push("--quiet".into());
        }

        // 始终添加 --yes 以自动确认提示（与 pnpm 的行为保持一致）
        args.push("--yes".into());

        // 添加包规格
        args.push(options.package_spec.into());

        // 添加命令参数
        args.extend(options.args.iter().cloned());

        ResolveCommandResult {
            bin_path: "npx".into(),
            args,
            envs,
        }
    }

    /// 运行 dlx 命令
    pub async fn run_dlx_command(
        &self,
        options: &DlxCommandOptions<'_>,
        cwd: impl AsRef<AbsolutePath>,
    ) -> Result<ExitStatus, Error> {
        let resolve_command = self.resolve_dlx_command(options);
        run_command(
            &resolve_command.bin_path,
            &resolve_command.args,
            &resolve_command.envs,
            cwd,
        )
        .await
    }
}

/// 从包规格中提取命令名称
/// 例如："create-vue@3.10.0" -> "create-vue"
fn extract_command_from_spec(spec: &str) -> String {
    // 处理作用域包：@scope/pkg@version -> pkg
    if spec.starts_with('@') {
        // 查找第二个 @（版本分隔符），或使用整个字符串
        if let Some(slash_pos) = spec.find('/') {
            let after_slash = &spec[slash_pos + 1..];
            if let Some(at_pos) = after_slash.find('@') {
                return after_slash[..at_pos].to_string();
            }
            return after_slash.to_string();
        }
    }

    // 非作用域包：pkg@version -> pkg
    if let Some(at_pos) = spec.find('@') {
        return spec[..at_pos].to_string();
    }

    spec.to_string()
}
```

### 3. 命令处理器

**文件**：`crates/vite_task/src/dlx.rs`（新文件）

```rust
use vite_error::Error;
use vite_path::AbsolutePathBuf;
use vite_install::commands::dlx::DlxCommandOptions;
use vite_install::PackageManager;

pub struct DlxCommand {
    cwd: AbsolutePathBuf,
}

impl DlxCommand {
    pub fn new(cwd: AbsolutePathBuf) -> Self {
        Self { cwd }
    }

    pub async fn execute(
        self,
        packages: Vec<String>,
        shell_mode: bool,
        silent: bool,
        args: Vec<String>,
    ) -> Result<i32, Error> {
        if args.is_empty() {
            return Err(Error::InvalidArgument(
                "dlx requires a package name".to_string(),
            ));
        }

        // 第一个参数是包规格，其余参数是命令参数
        let package_spec = &args[0];
        let command_args = &args[1..];

        let package_manager = PackageManager::builder(&self.cwd).build().await?;

        let options = DlxCommandOptions {
            packages: &packages,
            package_spec,
            args: command_args,
            shell_mode,
            silent,
        };

        let exit_status = package_manager.run_dlx_command(&options, &self.cwd).await?;

        Ok(vite_shared::exit_code_from_status(exit_status))
    }
}
```

## 设计决策

### 1. Yarn 1.x 回退到 npx

**决策**：使用 yarn@1 时，回退到 `npx`，而不是直接失败。

**理由**：

- Yarn Classic 没有 `dlx` 命令
- `npx` 随 npm 一起提供，几乎总是可用
- 提供可行的解决方案，而不是直接报错
- 通过提示告知用户正在使用回退方案

### 2. Package 标志的位置

**决策**：接受位于 package spec 之前任意位置的 `--package` 标志。

**理由**：

- pnpm 要求 `--package` 位于 `dlx` 之前
- npm 允许 `--package` 位于任意位置
- yarn 要求 `-p` 位于 `dlx` 之后
- 我们的统一接口接受任意位置的参数，并根据实际情况进行映射

### 3. Yarn 的 Shell 模式警告

**决策**：当 yarn 使用 shell 模式时发出警告，但继续执行。

**理由**：

- Yarn 2+ 不支持 shell 模式
- 发出警告并尝试执行，比完全失败更好
- 用户可以看到警告，并在需要时进行调整
- 某些命令即使不使用 shell 模式也可能正常工作

### 4. 静默模式映射

**决策**：将 `--silent` 映射为各包管理器对应的标志。

**理由**：

- pnpm 使用 `--silent`
- npm 使用 `--loglevel silent`
- yarn 使用 `--quiet`
- 为不同包管理器提供一致的用户体验

### 5. 从 Package Spec 中提取命令

**决策**：针对 npm，自动从 package spec 中提取命令名称。

**理由**：

- `npm exec` 要求在 `--` 后显式指定命令名称
- `pnpm dlx` 和 `yarn dlx` 会从 package 中推断命令
- 自动处理可提供一致的用户体验
- 能够正确处理作用域包

### 6. 没有 package.json 时回退到 npx

**决策**：当沿目录树向上查找也找不到 `package.json` 时，直接回退到 `npx`，而不是报错。

**理由**：

- `npx` 不要求存在 `package.json` —— `vp dlx` 也不应该要求
- 用户可能会在任何项目之外的目录中运行 `vp dlx` 或 `vpx`（例如 `/tmp`、主目录）
- 没有 `package.json` 时，就没有可供检测的包管理器，因此 `npx` 是通用的回退方案
- `prepend_js_runtime_to_path_env()` 已经处理了没有 package.json 的情况（使用 CLI runtime），因此 `npx` 位于 PATH 中

### 7. 自动确认 npm/npx 的提示

**决策**：始终为 npm 和 npx（yarn@1 回退方案）添加 `--yes` 标志。

**理由**：

- pnpm 默认不需要确认提示
- yarn dlx 不需要确认提示
- npm 和 npx 在运行缓存中不存在的包时会提示确认
- 自动添加 `--yes` 可确保所有包管理器的行为一致
- 从 CLI 中移除 npm 专用的 `--yes/-y` 和 `--no/-n` 选项
- 用户希望无论底层使用哪种包管理器，`vp dlx` 的行为都保持一致

## 错误处理

### 缺少软件包规范

```bash
$ vp dlx
错误：dlx 需要一个软件包名称

用法：vp dlx [选项] <软件包[@版本]> [参数...]

示例：
  vp dlx create-vue my-app
  vp dlx typescript tsc --version
```

### 没有 package.json

```bash
$ cd /tmp
$ vp dlx cowsay hello
# 未找到 package.json — 直接回退到 npx
 _______
< hello >
 -------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

### 找不到软件包

```bash
$ vp dlx non-existent-package-xyz
检测到的软件包管理器：pnpm@10.15.0
正在运行：pnpm dlx non-existent-package-xyz
 ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND  未找到 "non-existent-package-xyz" 的 package.json
退出代码：1
```

### 网络错误

```bash
$ vp dlx create-vue my-app
检测到的软件包管理器：npm@11.0.0
正在运行：npm exec create-vue -- my-app
npm 错误代码 ENOTFOUND
npm 错误：向 https://registry.npmjs.org/create-vue 发起的网络请求失败
退出代码：1
```

## 用户体验

### 基本执行

```bash
$ vp dlx create-vue my-app
Detected package manager: pnpm@10.15.0
Running: pnpm dlx create-vue my-app

Vue.js - The Progressive JavaScript Framework

✔ Project name: my-app
✔ Add TypeScript? Yes
...
```

### 指定版本

```bash
$ vp dlx typescript@5.5.4 tsc --version
Detected package manager: pnpm@10.15.0
Running: pnpm dlx typescript@5.5.4 tsc --version
Version 5.5.4
```

### 多个软件包

```bash
$ vp dlx --package yo --package generator-webapp yo webapp
Detected package manager: npm@11.0.0
Running: npm exec --package=yo --package=generator-webapp -- yo webapp
? What would you like to do? Create a new webapp
...
```

### Shell 模式

```bash
$ vp dlx --package cowsay --package lolcatjs -c 'echo "Hello Vite+" | cowsay | lolcatjs'
Detected package manager: pnpm@10.15.0
Running: pnpm --package cowsay --package lolcatjs dlx -c 'echo "Hello Vite+" | cowsay | lolcatjs'
 _______________
< Hello Vite+  >
 ---------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

### Yarn 1.x 回退

```bash
$ vp dlx create-vue my-app
Detected package manager: yarn@1.22.19
Note: yarn@1 does not have dlx command, falling back to npx
Running: npx create-vue my-app
...
```

## 已考虑的替代设计

### 替代方案 1：始终使用 npx

```bash
# 为所有包管理器简单封装 npx
vp dlx → npx
```

**不予采用的原因**：

- 失去与 pnpm 存储和缓存的集成
- 不遵循 yarn 2+ 项目设置
- 与其他使用检测到的包管理器的 vite 命令不一致
- npx 可能不可用（尽管这种情况很少见）

### 替代方案 2：顶层别名

```bash
vp create-vue my-app    # 隐式使用 dlx
```

**不予采用的原因**：

- 可能与未来的命令冲突
- 对实际发生的操作说明不够明确
- 更难发现和编写文档
- 偏离 pnpm/npm/yarn 的约定

注意：最初曾考虑使用简短别名 `x`，但由于相同原因而放弃——它没有明确说明实际发生的操作，并且可能与未来的命令冲突。

### 替代方案 3：不为 Yarn 1.x 提供回退方案

```bash
$ vp dlx create-vue
Error: yarn@1.22.19 does not support dlx command
```

**不予采用的原因**：

- 用户体验令人沮丧
- npx 回退方案运行良好且可用
- 其他工具（如 `bun x`）也提供回退方案
- 用户不应该为了使用 dlx 而切换包管理器

## 实施计划

### 阶段 1：核心基础设施

1. 在 `vite_command` 中向 `Commands` 枚举添加 `Dlx` 变体
2. 创建 `DlxCommandOptions` 结构体
3. 为每个包管理器实现 `resolve_dlx_command`
4. 添加 `run_dlx_command` 执行方法

### 阶段 2：包管理器支持

1. 实现 pnpm dlx 解析
2. 实现 npm exec 解析
3. 实现 yarn dlx 解析（v2+）
4. 为 yarn v1 实现 npx 回退

### 阶段 3：测试

1. 为命令解析编写单元测试
2. 测试包规范解析
3. 测试每个包管理器的选项映射
4. 使用模拟包管理器进行集成测试
5. 测试 yarn v1 的回退行为

### 阶段 4：文档

1. 更新 CLI 帮助文本
2. 添加使用示例
3. 记录包管理器兼容性
4. 添加故障排除指南

## 测试策略

### 单元测试

```rust
#[test]
fn test_pnpm_dlx_basic() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm, "10.0.0");
    let options = DlxCommandOptions {
        packages: &[],
        package_spec: "create-vue",
        args: &["my-app".into()],
        shell_mode: false,
        silent: false,
    };
    let result = pm.resolve_dlx_command(&options);
    assert_eq!(result.bin_path, "pnpm");
    assert_eq!(result.args, vec!["dlx", "create-vue", "my-app"]);
}

#[test]
fn test_pnpm_dlx_with_packages() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm, "10.0.0");
    let options = DlxCommandOptions {
        packages: &["yo".into(), "generator-webapp".into()],
        package_spec: "yo",
        args: &["webapp".into()],
        shell_mode: false,
        silent: false,
    };
    let result = pm.resolve_dlx_command(&options);
    assert_eq!(
        result.args,
        vec!["--package", "yo", "--package", "generator-webapp", "dlx", "yo", "webapp"]
    );
}

#[test]
fn test_npm_exec_basic() {
    let pm = PackageManager::mock(PackageManagerType::Npm, "11.0.0");
    let options = DlxCommandOptions {
        packages: &[],
        package_spec: "create-vue",
        args: &["my-app".into()],
        shell_mode: false,
        silent: false,
    };
    let result = pm.resolve_dlx_command(&options);
    assert_eq!(result.bin_path, "npm");
    // 始终添加 --yes 以自动确认提示
    assert_eq!(result.args, vec!["exec", "--yes", "--", "create-vue", "my-app"]);
}

#[test]
fn test_yarn_v1_fallback_to_npx() {
    let pm = PackageManager::mock(PackageManagerType::Yarn, "1.22.19");
    let options = DlxCommandOptions {
        packages: &[],
        package_spec: "create-vue",
        args: &["my-app".into()],
        shell_mode: false,
        silent: false,
    };
    let result = pm.resolve_dlx_command(&options);
    assert_eq!(result.bin_path, "npx");
    // 始终添加 --yes 以自动确认提示
    assert_eq!(result.args, vec!["--yes", "create-vue", "my-app"]);
}

#[test]
fn test_yarn_v2_dlx() {
    let pm = PackageManager::mock(PackageManagerType::Yarn, "4.0.0");
    let options = DlxCommandOptions {
        packages: &[],
        package_spec: "create-vue",
        args: &["my-app".into()],
        shell_mode: false,
        silent: false,
    };
    let result = pm.resolve_dlx_command(&options);
    assert_eq!(result.bin_path, "yarn");
    assert_eq!(result.args, vec!["dlx", "create-vue", "my-app"]);
}

#[test]
fn test_extract_command_from_spec() {
    assert_eq!(extract_command_from_spec("create-vue"), "create-vue");
    assert_eq!(extract_command_from_spec("create-vue@3.10.0"), "create-vue");
    assert_eq!(extract_command_from_spec("@vue/cli"), "cli");
    assert_eq!(extract_command_from_spec("@vue/cli@5.0.0"), "cli");
}

#[test]
fn test_shell_mode() {
    let pm = PackageManager::mock(PackageManagerType::Pnpm, "10.0.0");
    let options = DlxCommandOptions {
        packages: &["cowsay".into()],
        package_spec: "echo hello | cowsay",
        args: &[],
        shell_mode: true,
        silent: false,
    };
    let result = pm.resolve_dlx_command(&options);
    assert!(result.args.contains(&"-c".to_string()));
}
```

## CLI 帮助输出

```bash
$ vp dlx --help
执行软件包二进制文件，而无需将其作为依赖项安装

用法：vp dlx [选项] <package[@version]> [args...]

参数：
  <package[@version]>  要执行的软件包（可选版本）
  [args...]            要传递给所执行命令的参数

选项：
  -p, --package <NAME>  运行前要安装的软件包（可多次使用）
  -c, --shell-mode      在 shell 环境中执行命令
  -s, --silent          除所执行命令的输出外，禁止所有输出
  -h, --help            显示帮助

示例：
  vp dlx create-vue my-app                              # 创建新的 Vue 项目
  vp dlx typescript@5.5.4 tsc --version                 # 运行指定版本
  vp dlx -p yo -p generator-webapp yo webapp            # 多个软件包
  vp dlx -c 'echo "hello" | cowsay'                     # Shell 模式
  vp dlx -s create-vue my-app                           # 静默模式
```

## 包管理器兼容性

| 功能             | pnpm    | npm     | yarn@1  | yarn@2+ | bun        | 备注                       |
| ---------------- | ------- | ------- | ------- | ------- | ---------- | -------------------------- |
| 基本执行         | ✅ 完整 | ✅ 完整 | ⚠️ npx  | ✅ 完整 | ✅ `bun x` | yarn@1 使用 npx 回退       |
| 版本指定符       | ✅ 完整 | ✅ 完整 | ⚠️ npx  | ✅ 完整 | ✅ 完整    |                            |
| `--package` 标志 | ✅ 完整 | ✅ 完整 | ⚠️ npx  | ✅ 完整 | ✅ 完整    |                            |
| Shell 模式（-c） | ✅ 完整 | ✅ 完整 | ⚠️ npx  | ❌ 不适用 | ❌ 不适用 | yarn@2+/bun 不支持         |
| 静默模式         | ✅ 完整 | ✅ 完整 | ⚠️ npx  | ✅ 完整 | ❌ 不适用 | `bun x` 不支持             |
| 自动确认         | ✅ 不适用 | ✅ 自动 | ⚠️ 自动 | ✅ 不适用 | ✅ 不适用 | 已为 npm/npx 添加 --yes    |

## 安全注意事项

1. **远程代码执行**：`dlx` 本质上会执行远程代码。用户应：
   - 在执行前验证包名称
   - 使用版本限定符以确保可复现性
   - 不确定时检查包内容

2. **不会永久安装**：包会安装到临时缓存中，而不是项目依赖中。
   - 减少供应链攻击面
   - 不会修改 package.json 或锁文件

3. **Shell 模式风险**：Shell 模式（`-c`）允许执行任意 Shell 命令。
   - 在脚本中谨慎使用
   - 避免插入不受信任的输入

4. **构建脚本**：pnpm 的 `--allow-build` 控制 postinstall 脚本。
   - 默认情况下，dlx 包可以运行构建脚本
   - 对不受信任的包，应考虑相关安全影响

## 向后兼容性

这是一个不会引入破坏性变更的新功能：

- 不影响现有命令
- 新命令仅为新增功能
- 不改变配置格式
- 不改变缓存行为

## 未来增强功能

### 1. 缓存管理

```bash
vp dlx --clear-cache                # 清除 dlx 缓存
vp dlx --cache-dir                  # 显示缓存位置
```

### 2. 离线模式

```bash
vp dlx --offline create-vue my-app  # 仅使用缓存版本
```

### 3. 注册表覆盖

```bash
vp dlx --registry https://custom.registry.com create-vue my-app
```

### 4. 信任配置

```bash
# 在 vite-task.json 中
{
  "dlx": {
    "trustedPackages": ["create-vue", "typescript"],
    "allowBuild": false
  }
}
```

### 5. 执行历史

```bash
vp dlx --history                    # 显示最近的 dlx 执行记录
vp dlx --replay 3                   # 重新运行最近第 3 次执行的命令
```

## 实际使用示例

### 项目脚手架

```bash
# 使用各种框架创建新项目
vp dlx create-vue my-vue-app
vp dlx create-react-app my-react-app
vp dlx create-next-app my-next-app
vp dlx create-svelte my-svelte-app
vp dlx @angular/cli ng new my-angular-app
```

### 一次性工具

```bash
# 格式化 JSON
vp dlx prettier --write package.json

# 检查 TypeScript
vp dlx typescript tsc --noEmit

# 运行 ESLint
vp dlx eslint src/

# 生成许可证信息
vp dlx license-checker --json
```

### CI/CD 流水线

```yaml
# GitHub Actions
- name: Create release notes
  run: vp dlx -s conventional-changelog-cli -p angular > CHANGELOG.md

- name: Check for vulnerabilities
  run: vp dlx snyk test

- name: Publish to npm
  run: vp dlx np --no-tests
```

### 开发实用工具

```bash
# 快速 HTTP 服务器
vp dlx serve dist/

# 用于模拟的 JSON 服务器
vp dlx json-server db.json

# 打包分析器
vp dlx source-map-explorer dist/*.js

# 依赖可视化
vp dlx madge --image deps.svg src/
```

## 结论

本 RFC 提议添加 `vp dlx` 命令，以在 pnpm/npm/yarn/bun 之间提供统一的远程包执行功能。该设计：

- ✅ 为所有包管理器提供统一接口
- ✅ 针对 yarn@1 进行智能回退
- ✅ 透传高级选项
- ✅ 为复杂命令提供 Shell 模式
- ✅ 为 CI/脚本提供静默模式
- ✅ 支持版本说明符，确保可复现性
- ✅ 支持多个包
- ✅ 遵循现有的 pnpm dlx 约定
- ✅ 利用现有基础设施实现，简单易行

该命令通过自动检测包管理器，提供 `npx`/`pnpm dlx`/`yarn dlx` 的便利性，无论项目选择哪种包管理器，都能确保一致的开发者体验。
