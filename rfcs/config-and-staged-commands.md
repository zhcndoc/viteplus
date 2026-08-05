# RFC：通过 `vp config` + `vp staged` 内置提交前钩子

## 摘要

添加 `vp config` 和 `vp staged` 作为内置命令。`vp config` 是一个生命周期命令（`prepare` 或 `postinstall`），用于安装 Git 钩子垫片（兼容 Husky 的重新实现，而非捆绑的依赖）。`vp staged` 捆绑 lint-staged，并从 `vite.config.ts` 中的 `staged` 键读取配置。项目将获得一个零配置的 pre-commit 钩子，用于对暂存文件运行 `vp check --fix`——无需额外的 devDependencies。

## 动机

目前，在 Vite+ 项目中设置 pre-commit 钩子需要：

1. 安装 husky 和 lint-staged 作为开发依赖
2. 配置 husky 钩子
3. 配置 lint-staged

痛点：

- 每个项目都需要的**额外开发依赖**
- 在 `vp create` 或 `vp migrate` 之后需要**手动设置步骤**
- Vite+ 项目之间**没有标准化的 pre-commit 工作流**
- husky 和 lint-staged 的通用性足够高，适合内置

通过将这些功能构建到 vite-plus 中，项目无需额外的开发依赖即可获得 pre-commit 钩子。`vp create` 和 `vp migrate` 都会自动完成设置。

## 用户工作流程

有三个不同的入口点，每个入口点承担不同的职责：

### 新建项目：`vp create`

`vp create` 会搭建一个新项目，并可选择设置完整的 hooks 流程：

1. 提示“设置 pre-commit hooks？”（默认：是）
2. 如果接受，则调用 `installGitHooks()`，该函数会：
   - 将 `"prepare": "vp config"` 添加到 `package.json`
   - 将 `staged` 配置添加到 `vite.config.ts`
   - 创建包含 `vp staged` 的 `.vite-hooks/pre-commit`
   - 运行 `vp config --hooks-only` 以安装 hook shim 并设置 `core.hooksPath`

标志：`--hooks`（强制启用）、`--no-hooks`（跳过）

### 现有项目：`vp migrate`

`vp migrate` 会从 husky/lint-staged 迁移，并设置完整的 hooks 流程：

1. 运行迁移前检查（husky 版本、其他工具、子目录检测）
2. 提示“设置 pre-commit hooks？”（默认：是）
3. 如果接受，则在迁移重写后调用 `installGitHooks()`，该函数会：
   - 从 `scripts.prepare` 检测旧的 husky 目录
   - 通过 `rewritePrepareScript()` 将 `"prepare": "husky"` → `"prepare": "vp config"`
   - 将 `lint-staged` 配置从 `package.json` 迁移到 `vite.config.ts` 中的 `staged`
   - 将 `.husky/` hooks 复制到 `.vite-hooks/`（或保留自定义目录）
   - 创建包含 `vp staged` 的 `.vite-hooks/pre-commit`
   - 运行 `vp config --hooks-only` 以安装 hook shim 并设置 `core.hooksPath`
   - 从 `devDependencies` 中移除 husky 和 lint-staged

标志：`--hooks`（强制启用）、`--no-hooks`（跳过）

### 持续使用：`vp config`（生命周期脚本）

`vp config` 是一个会通过 `prepare` 或 `postinstall` 脚本在每次 `npm install` 时运行的命令。它会重新安装 hook shim——**不会**创建 `staged` 配置或 pre-commit hook 文件。这些文件由 `vp create`/`vp migrate` 创建。

```json
{ "scripts": { "prepare": "vp config" } }
// or
{ "scripts": { "postinstall": "vp config" } }
```

从生命周期脚本运行时（`npm_lifecycle_event` 为 `prepare` 或 `postinstall`），hooks 会自动安装，无需提示。

### 手动设置（不使用 `vp create`/`vp migrate`）

对于希望手动设置 hooks 的用户，需要完成以下四个步骤：

1. **添加生命周期脚本**到 `package.json`：
   ```json
   { "scripts": { "prepare": "vp config" } }
   ```
   如果 `prepare` 不适用于你的项目，也可以使用 `postinstall`。
2. **将 staged 配置添加到** `vite.config.ts`：
   ```typescript
   export default defineConfig({
     staged: { '*': 'vp check --fix' },
   });
   ```
3. **在 `.vite-hooks/pre-commit` 创建 pre-commit hook**：
   ```sh
   vp staged
   ```
4. **运行 `vp config`** 以安装 hook shim 并设置 `core.hooksPath`

## 命令

### `vp config`

```bash
vp config                           # 配置项目（钩子 + 代理集成）
vp config -h                        # 显示帮助
vp config --hooks-dir .husky        # 自定义钩子目录（默认为：.vite-hooks）
```

行为：

1. 内置与 husky 兼容的安装逻辑（重新实现 husky v9，而非捆绑依赖）
2. 将 `core.hooksPath` 设置为 `<hooks-dir>/_`（默认为：`.vite-hooks/_`）
3. 在 `<hooks-dir>/_/` 中创建钩子脚本，这些脚本会加载用户在 `<hooks-dir>/` 中定义的钩子
4. 代理指令：当现有文件包含 Vite+ 标记（`<!--VITE PLUS START-->`）且内容已过时时，静默更新这些文件。绝不会创建新的代理文件。使用 `--hooks-only` 时跳过
5. 可安全地多次运行（幂等）
6. 如果设置了 `VP_GIT_HOOKS=0`、`VITE_GIT_HOOKS=0`（已弃用的别名）或 `HUSKY=0` 环境变量，则退出码为 0 并跳过钩子（向后兼容）
7. 如果不存在 `.git` 目录，则退出码为 0 并跳过钩子（在消费者项目中执行 `npm install` 期间安全）
8. 发生真实错误时退出码为 1（找不到 git 命令、`git config` 失败）
9. 代理更新在所有模式下统一运行（生命周期脚本、交互式、非交互式）。新代理文件的创建由 `vp create`/`vp migrate` 负责
10. 生命周期脚本模式（`prepare`/`postinstall`）：自动设置钩子，不进行提示
11. 交互式模式：首次运行时进行提示——除非项目已在 `vite.config.ts` 中配置了 `staged`，这表示用户之前已选择启用
12. 非交互式模式：默认设置钩子

### `vp staged`

```bash
vp staged                           # 在已暂存文件上运行暂存代码检查器
```

行为：

1. 通过 `resolveConfig()` 从 `vite.config.ts` 中的 `staged` 键读取配置
2. 如果未找到 `staged` 键，则发出警告并退出，同时提供设置说明
3. 通过其程序化 API 将配置传递给捆绑的 lint-staged
4. 仅在 Git 已暂存的文件上运行已配置的命令
5. 如果任何命令失败，则以非零退出码退出
6. 不支持自定义配置文件路径——配置必须位于 `vite.config.ts` 中

这两个命令都列在 `vp -h`（全局和本地 CLI）的“核心命令”下。

## 配置

### `vite.config.ts`

```typescript
export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
});
```

`vp staged` 通过 Vite 的 `resolveConfig()` 从 `staged` 键读取配置。如果未找到 `staged` 键，它会显示警告以及添加配置的说明后退出。迁移不支持独立配置文件（`.lintstagedrc.*`、`lint-staged.config.*`）——使用这些格式的项目会收到手动迁移的警告。

### `package.json`

```json
// 新项目
{
  "scripts": {
    "prepare": "vp config"
  }
}
```

```json
// 从使用自定义目录的 husky 迁移 — 目录会被保留
{
  "scripts": {
    "prepare": "vp config --hooks-dir .config/husky"
  }
}
```

如果项目已经存在 prepare 脚本，`vp config` 会被添加到开头：

```json
{
  "scripts": {
    "prepare": "vp config && npm run build"
  }
}
```

### `.vite-hooks/pre-commit`

```
vp staged
```

### 为什么使用 `*` 通配符

`vp check --fix` 已经能够妥善处理不支持的文件类型（它只处理与已知扩展名匹配的文件）。使用 `*` 可以简化配置——无需维护扩展名列表。

## 自动设置

`vp create` 和 `vp migrate` 都会在设置 pre-commit hooks 之前提示用户：

- **交互模式**：显示 `prompts.confirm()` 提示："设置 pre-commit hooks，以通过自动修复运行格式化、代码检查和类型检查？"（默认：是）
- **非交互模式**：默认为是（自动设置 hooks）
- **`--hooks` 标志**：强制设置 hooks（不提示）
- **`--no-hooks` 标志**：完全跳过 hooks 设置（不提示）

```bash
vp create --hooks           # 强制设置 hooks
vp create --no-hooks        # 跳过 hooks 设置
vp migrate --hooks          # 强制设置 hooks
vp migrate --no-hooks       # 跳过 hooks 设置
```

### `vp create`

- 在项目创建和迁移重写之后，提示设置 hooks
- 如果接受，则调用 `rewritePrepareScript()`，然后调用 `setupGitHooks()` —— 与 `vp migrate` 相同
- `rewritePrepareScript()` 会在 `setupGitHooks()` 运行前，将模板提供的 `"prepare": "husky"` 重写为 `"prepare": "vp config"`
- 创建包含 `vp staged` 的 `.vite-hooks/pre-commit`

### `vp migrate`

迁移重写（`rewritePackageJson`）使用 `vite-tools.yml` 规则，在所有脚本中重写工具命令（vite、oxlint、vitest 等）。关键点是，husky 规则**不在** `vite-tools.yml` 中——它位于单独的 `vite-prepare.yml` 中，并且只通过 `rewritePrepareScript()` 应用于 `scripts.prepare`。这样可以确保 husky 永远不会在非 prepare 脚本中被意外重写。

- 在迁移重写**之前**提示设置 hooks
- 如果使用 `--no-hooks`：永远不会调用 `rewritePrepareScript()`，因此 prepare 脚本保持原样（例如，`"husky"` 仍然是 `"husky"`）。不需要撤销逻辑。
- 如果启用了 hooks 但检测到 Husky v8：会发出警告，在迁移重写**之前**设置 `shouldSetupHooks = false` 和 `skipStagedMigration = true`，因此会保留 lint-staged 配置
- 如果启用了 hooks：迁移重写之后，调用 `rewritePrepareScript()`，然后调用 `setupGitHooks()`

Hook 设置行为：

- **未配置 hooks** — 添加完整设置（prepare 脚本 + `vite.config.ts` 中的 staged 配置 + `.vite-hooks/pre-commit`）
- **使用 husky（默认目录）** — `rewritePrepareScript()` 将 `"prepare": "husky"` 重写为 `"prepare": "vp config"`，`setupGitHooks()` 将 `.husky/` hooks 复制到 `.vite-hooks/`，并从 devDeps 中移除 husky
- **使用 husky（自定义目录）** — `rewritePrepareScript()` 将自定义目录保留为 `"vp config --hooks-dir .config/husky"`，`setupGitHooks()` 将 hooks 保留在自定义目录中（不复制）
- **使用 `husky install`** — `rewritePrepareScript()` 会在应用 ast-grep 规则之前，将 `"husky install"` 折叠为 `"husky"`，因此 `"husky install .hooks"` 会变成 `"vp config --hooks-dir .hooks"`（保留自定义目录）
- **已有 prepare 脚本**（例如 `"npm run build"`）— 组合为 `"vp config && npm run build"`（前置添加，以便 hooks 在其他 prepare 任务之前生效；如果已经包含 `vp config`，则保持幂等）
- **使用 lint-staged** — 将 `vite.config.ts` 中的 `"lint-staged"` 键迁移为 `staged`，保留现有配置（已由迁移规则重写），并从 devDeps 中移除 lint-staged

## 迁移边界情况

- **使用低于 9.0.0 版本的 husky** — 在迁移重写**之前**检测。警告“请先升级到 husky v9+”，跳过 hooks 设置，同时跳过 lint-staged 迁移（`skipStagedMigration` 标志）。这样可以保留 package.json 和独立配置文件中的 `lint-staged` 配置，因为 `.husky/pre-commit` 仍然引用 `npx lint-staged`。
- **使用其他工具（simple-git-hooks、lefthook、yorkie）** — 发出警告并跳过
- **子目录项目**（例如 `vp migrate foo`）— 如果项目路径与 git 根目录不同，则警告“检测到子目录项目”并完全跳过 hooks 设置。这样可以避免 `vp config` 将 `core.hooksPath` 设置为子目录路径，从而接管整个仓库范围的 hooks。
- **没有 `.git` 目录** — 添加 package.json 配置并创建 hook pre-commit 文件，但跳过 `vp config` hook 安装（没有可设置的 `core.hooksPath`）
- **独立的 lint-staged 配置**（`.lintstagedrc.*`、`lint-staged.config.*`）— 自动迁移不支持这些配置。使用这些格式的项目会收到警告，需要手动迁移。
- 创建 pre-commit hook 后，直接运行 `vp config` 安装 hook shim（不依赖 npm install 生命周期，因为在 CI 或 snap 测试环境中可能不会运行）

## 实现架构

### Rust 全局 CLI

两个命令都遵循类别 B（JS 脚本命令）模式，与 `vp create` 和 `vp migrate` 相同：

```rust
// crates/vite_global_cli/src/commands/config.rs
pub async fn execute(cwd: AbsolutePathBuf, args: &[String]) -> Result<ExitStatus, Error> {
    super::delegate::execute(cwd, "config", args).await
}

// crates/vite_global_cli/src/commands/staged.rs
pub async fn execute(cwd: AbsolutePathBuf, args: &[String]) -> Result<ExitStatus, Error> {
    super::delegate::execute(cwd, "staged", args).await
}
```

### JavaScript 侧

由 rolldown 打包到 `dist/global/` 的入口点：

- `src/config/bin.ts` — 统一配置：钩子设置（兼容 husky）+ agent 集成
- `src/staged/bin.ts` — 导入 lint-staged 的编程式 API，从 vite.config.ts 中读取 `staged` 配置
- `src/migration/bin.ts` — 迁移流程，调用 `rewritePrepareScript()` + `setupGitHooks()`

### AST-grep 规则

- `rules/vite-tools.yml` — 重写**所有**脚本中的工具命令（vite、oxlint、vitest、lint-staged、tsdown）
- `rules/vite-prepare.yml` — 将 `husky` 重写为 `vp config`，仅通过 `rewritePrepareScript()` 应用于 `scripts.prepare`

这种分离确保 husky 规则永远不会应用于非 prepare 脚本（例如假设存在的 `"postinstall": "husky something"` 不会被修改）。由于 ast-grep 无法匹配 bash 中的多单词命令，因此 `husky install` → `husky` 的合并操作（这是应用规则所必需的）会在应用规则前由 TypeScript 完成。在 AST-grep 重写之后，后处理会处理目录参数：自定义目录会添加 `--hooks-dir` 标志，而默认的 `.husky` 目录则会被移除（钩子会被复制到 `.vite-hooks/`）。

### 构建

lint-staged 是 `vite-plus` 包的开发依赖项，在构建时由 rolldown 打包到 `dist/global/` 中。husky 不是依赖项——`vp config` 是对 husky v9 安装逻辑的独立重新实现。

### 为什么无法打包 husky

husky v9 的 `install()` 函数使用 `new URL('husky', import.meta.url)` 进行解析，并根据其自身的源代码位置，通过 `copyFileSync` 复制其 shell 脚本（钩子分发器）。由 rolldown 打包后，`import.meta.url` 指向打包后的输出目录，而不是原始的 `node_modules/husky/` 目录，因此运行时无法找到该 shell 脚本文件。`vp config` 没有采用通过复制资源解决这一问题的变通方案，而是将等效的 shell 脚本以内联字符串常量的形式写入，并直接通过 `writeFileSync` 写出。

自动迁移不支持 Husky <9.0.0——`vp migrate` 会检测不受支持的版本，并在发出警告后跳过钩子设置。

## 与现有命令的关系

| 命令             | 用途                               | 使用时机                         |
| ---------------- | ---------------------------------- | -------------------------------- |
| `vp check`       | 格式化 + 代码检查 + 类型检查       | 手动或 CI                         |
| `vp check --fix` | 自动修复格式化 + 代码检查问题      | 手动或提交前                       |
| **`vp config`**  | **重新安装钩子垫片 + 设置代理**     | **npm 生命周期（`prepare`/`postinstall`）** |
| **`vp staged`**  | **对暂存文件运行暂存代码检查器**   | **提交前钩子**                    |

## `vp config` Hooks 设置流程

```
vp config
│
├─ VP_GIT_HOOKS=0 / VITE_GIT_HOOKS=0 / HUSKY=0? ──→ 跳过 hooks（退出码 0）
│
├─ 不在 git 仓库中？ ──→ 跳过 hooks（退出码 0）
│
├─ 是否应提示用户？
│   仅当以下所有条件都满足时才提示：
│   • 交互式终端（非 CI、非管道）
│   • 首次运行（hook shim 尚不存在）
│   • 没有 --hooks-dir 标志
│   • 不是从生命周期脚本（prepare/postinstall）运行
│   • vite.config.ts 中没有 staged 配置
│
│   是 → 提示“设置 pre-commit hooks？”
│          用户拒绝 → 跳过 hooks
│   否 → 自动安装 hooks
│
├─ core.hooksPath 是否已设置为自定义路径？
│   （不是 .vite-hooks/_，也不是 .husky）
│   └─ 是 → 跳过 hooks，保留自定义配置
│
├─ 将 core.hooksPath 设置为 → .vite-hooks/_
├─ 在 .vite-hooks/_/ 中创建 hook shim
├─ 确保 vite.config.ts 中存在 staged 配置
└─ 确保 .vite-hooks/pre-commit 包含“vp staged”
```

### 何时会出现提示？

| 调用方                                | 是否提示？ | 原因                                |
| ------------------------------------- | --------- | ---------------------------------- |
| `npm install` → prepare/postinstall   | 否        | 生命周期脚本 = 自动安装             |
| 手动运行，项目已有 `staged` 配置       | 否        | staged 配置 = 已选择启用             |
| 手动运行，没有 `staged` 配置，首次运行 | **是**    | 没有表明项目需要 hooks 的信号        |
| 手动运行，之前已经运行过              | 否        | Hook shim 已存在 = 不是首次运行      |
| CI / 非交互式环境                     | 否        | 非交互式 = 自动安装                  |
| `--hooks-dir` 标志                    | 否        | 显式标志 = 表明有意安装               |

## 与其他工具的比较

| 工具                      | 方案                                     |
| ------------------------- | ---------------------------------------- |
| husky + lint-staged       | 独立的 devDependencies，手动设置          |
| simple-git-hooks          | husky 的轻量级替代方案                    |
| lefthook                  | Go 二进制文件，基于配置文件               |
| **vp config + vp staged** | **内置、零配置、自动设置**                |
