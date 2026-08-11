# RFC：在发布时部署文档

- 动机示例：[＃2346](https://github.com/voidzero-dev/vite-plus/pull/2346)（XDG 目录布局，重写 `install.sh` / `install.ps1`）

## 总结

停止在每次推送到 `main` 时部署 viteplus.dev。改为在 npm 包和 GitHub release 发布后，通过 release
工作流进行部署，并保留 `workflow_dispatch` 以支持手动部署。这样，网站和安装脚本始终描述最新发布的
`vp`。

推送到 `main` 时仍会自动部署，但会部署到专用的预览项目
`https://main.viteplus.dev`（指向 `viteplus-main.void.app` 的 CNAME），这样开发者就能在下一次发布前阅读 `main` 上的最新文档。

## 当前行为

`deploy-docs.yml` 会在每次推送到 `main`，且变更涉及 `docs/**`、
`packages/cli/install.sh`、`packages/cli/install.ps1` 或工作流文件时运行。它会
构建 VitePress 站点，并将其部署到 `viteplus` void.app 项目。

文档构建会将安装脚本复制到站点中
（`docs/package.json` 的 `build` 脚本会将它们复制到 `docs/public/`）。
`https://vite.plus` 会重定向到 `https://viteplus.dev/install.sh`，
`https://vite.plus/ps1` 会重定向到 `install.ps1`。因此，文档部署同时也是
安装程序的生产发布渠道。

发布流水线是独立的。合并发布 PR 会更新
`packages/cli/package.json`；`release.yml` 会验证版本是否发生变化、执行构建，
等待 `release` 环境中的手动批准，然后发布 npm 包、GitHub release 和 Docker 镜像。

这会产生两种故障模式：

1. **功能文档会在发布版本存在之前上线。** 添加代码并编写相应文档的 PR 会在合并时部署文档。用户看到的命令和标志，已发布的 `vp` 却并不支持。合并与发布之间可能相隔数天，因为发布需要更新版本号并经过手动批准。
2. **安装脚本的变更会在匹配这些变更的二进制文件之前上线。**
   [#2346](https://github.com/voidzero-dev/vite-plus/pull/2346) 就是一个具体案例：合并后会提供一个将内容安装到拆分后的 XDG 布局中的 `install.sh`，而最新发布版本中的 `vp` 仍会解析旧版的 `~/.vite-plus` 布局。在下一个版本发布之前，全新安装都会失败。

## 提案

分为四个部分：

1. 将文档构建和部署步骤提取到
   `.github/actions/deploy-docs` 复合操作中，这是仓库中共享步骤序列的约定（参见 `.github/actions/clone`、`build-windows-cli`）。
2. 将 `deploy-docs.yml` 精简为仅手动（`workflow_dispatch`）执行的生产环境部署，并运行该复合操作。
3. 在 `release.yml` 中添加一个 `deploy-docs` 任务，在发布完成后运行该复合操作。
4. 添加 `deploy-docs-main.yml`，接管 push 触发器，并将 `main` 部署到 `viteplus-main` 预览项目。
5. 将 `deploy-docs-preview.yml` 切换为使用该复合操作；其触发器、staging 目标和 PR 评论步骤保持不变。

### `.github/actions/deploy-docs`

该复合操作包含所有文档部署共享的步骤：`setup-vp`、Vite Task 缓存的恢复/保存、`vp run build` 和 `vpx void deploy`。其输入包括：

- `void-project`：部署目标。
- `void-token`：复合操作无法读取 secrets，因此由调用方传入 `secrets.VOID_TOKEN`。
- `cache-ref` / `cache-sha`（可选，默认值为 `main` / `github.sha`）：用于限定 Vite Task 缓存键的作用域。PR 预览传入 `pr-<number>` 和 head sha，这样可以复现其当前按 PR 区分的缓存键，并在没有对应缓存时回退到 `main` 缓存。

调用方先检出仓库，然后运行该操作。

### `deploy-docs.yml`

移除 `push` 触发器；仅保留 `workflow_dispatch`。构建和部署步骤移动到复合操作中：

```yaml
on:
  workflow_dispatch:

concurrency:
  group: deploy-docs
  cancel-in-progress: false

jobs:
  deploy:
    if: github.repository == 'voidzero-dev/vite-plus'
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: taiki-e/checkout-action@... # v1.4.2

      - uses: ./.github/actions/deploy-docs
        with:
          void-project: viteplus
          void-token: ${{ secrets.VOID_TOKEN }}
```

### `release.yml`

添加一个任务：

```yaml
deploy-docs:
  name: Deploy docs
  runs-on: ubuntu-latest
  needs: [check, Release]
  if: >-
    needs.check.outputs.version_changed == 'true' &&
    !contains(needs.check.outputs.version, '-')
  concurrency:
    group: deploy-docs
    cancel-in-progress: false
  permissions:
    contents: read
  steps:
    - uses: taiki-e/checkout-action@... # v1.4.2

    - uses: ./.github/actions/deploy-docs
      with:
        void-project: viteplus
        void-token: ${{ secrets.VOID_TOKEN }}
```

- 该任务检出 `github.sha`，在发布运行中它就是发布提交。部署的网站与已发布版本一致。
- 任务级别的 `deploy-docs` 并发组与 `deploy-docs.yml` 共享，因此生产环境部署会在两条入口路径之间串行执行。
- GitHub 会为每个并发组保留一个待处理运行：较新的排队部署会替换待处理部署，而正在运行的部署始终会完成。因此，生产环境最终会收敛到最新的排队部署。如果某个发布的待处理部署被替换，被取消的任务会显示在发布运行中，并阻塞 `discord-notify`；如果替代部署包含较旧内容，请重新运行该任务。
- `needs: [check, Release]` 会在 npm 和 GitHub release 均完成后运行部署，并与 `publish-docker` 并行。文档不依赖镜像。
- `!contains(version, '-')` 条件会跳过预发布版本。Alpha 发布不能用尚未发布功能对应的文档覆盖生产网站。
- `discord-notify` 将 `deploy-docs` 添加到其 `needs` 中，并以 `result == 'success' || result == 'skipped'` 作为条件，因此稳定版本发布只会在网站更新后发送通知，而预发布版本（其中 `deploy-docs` 会被跳过）仍然会发送通知。
- 文档部署失败不会撤销发布，但会阻塞 Discord 通知。请重新运行该任务，或手动调度工作流。

### `deploy-docs-main.yml`：`main` 的持续预览

新的工作流接管 `deploy-docs.yml` 移除的 push 触发器。它运行相同的复合操作，并将内容部署到专用的 `viteplus-main` void.app 项目，而不是生产环境：

```yaml
name: Deploy Docs Main Preview

permissions: {}

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - 'packages/cli/install.sh'
      - 'packages/cli/install.ps1'
      - '.github/workflows/deploy-docs-main.yml'
      - '.github/actions/deploy-docs/**'

concurrency:
  group: deploy-docs-main
  cancel-in-progress: true

jobs:
  deploy:
    if: github.repository == 'voidzero-dev/vite-plus'
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: taiki-e/checkout-action@... # v1.4.2

      - uses: ./.github/actions/deploy-docs
        with:
          void-project: viteplus-main
          void-token: ${{ secrets.VOID_TOKEN }}
```

- `https://main.viteplus.dev` 始终显示 `main` 最新提交中的文档，包括尚未发布的功能。开发者可以获得一个稳定的分享链接，无需等待发布或手动调度。
- 使用专用项目，而不是共享的 `viteplus-staging` 项目：PR 预览会部署到那里，并会在每次 PR push 时覆盖 `main` 预览。
- `cancel-in-progress: true`：对于预览而言，只有最新的 `main` 部署重要。生产环境仍保持 `false`。
- 该工作流可以继续使用 `deploy-docs.yml` 当前使用的 `vite-task-docs-*-main-*` 缓存键，因为两者都构建 `main`；发布运行中的部署也会从同一组键中恢复缓存。
- 工作流上线前的准备：在 void 平台上创建 `viteplus-main` 项目（部署使用同一个 `VOID_TOKEN` secret），添加 DNS CNAME `main.viteplus.dev` -> `viteplus-main.void.app`，并将自定义域名绑定到该项目。

`deploy-docs-preview.yml` 保留其触发器、`viteplus-staging.void.app` 目标和 PR 评论步骤，现在改为运行相同的复合操作。按 PR 区分的 staging 部署仍然是合并前审查文档变更的场所。

### 文档中的基于来源的安装 URL

文档在 Markdown 代码块和首页 Vue 组件中硬编码了生产环境安装器快捷 URL（`https://vite.plus`、`https://vite.plus/ps1`）。预览部署必须将它们指向自身的安装脚本（例如 `https://main.viteplus.dev/install.sh`），否则阅读尚未发布的安装文档时会运行生产环境安装器。

复合操作将其 `site-origin` 输入作为 `DOCS_SITE_ORIGIN` 传递给文档构建。当设置该变量时：

- `.vitepress/config.mts` 中的 markdown-it 规则会重写围栏代码、行内代码、文本和链接 href 中的安装 URL。其他 `viteplus.dev` 子域名（`setup.`、`registry-bridge.`）保持不变。
- Vue 组件（首页安装命令、AI 文案提示）会读取根据同一来源计算出的 `__DOCS_*__` define 常量。AI 提示还会指向部署自身的 `llms-full.txt`。
- `build:site` 运行任务会在 `env` 中列出 `DOCS_SITE_ORIGIN`，因此每个部署目标都会保留自己的 Vite Task 缓存条目。

生产环境构建不会改变内容：该变量在生产环境中未设置。已知缺口：llms 转储文件（`llms.txt`、`llms-full.txt`、每页的 `.md`）会复制原始 Markdown，因此在预览环境中仍会保留生产环境安装 URL。

### 手动部署

`workflow_dispatch` 用于处理发布周期之外的紧急更新：

- `main` 自上次发布提交以来没有携带未发布文档：将修复合并到 `main`，在 `main` 上调度 Deploy Docs。
- `main` 已经携带未发布文档：从发布 tag 创建分支，挑选该修复提交，然后在该分支上调度 Deploy Docs。`workflow_dispatch` 接受任何分支或 tag 作为 ref。

在 `main` 上进行调度会发布 `main` 中的全部内容，包括其中可能存在的未发布文档。操作人员必须检查这一点；发布 tag 分支是更安全的路径。

### 安装器不存在循环依赖

发布运行中的文档构建会通过 `setup-vp` 安装 `vp`，而 `setup-vp` 获取的是当前部署在 viteplus.dev 上的安装脚本。该运行会使用旧脚本构建网站，然后部署会替换该脚本。部署完成后，新安装会同时获得新脚本和新的二进制文件。

## 为什么在 release run 中运行作业，而不是使用其他触发器

- `on: release: types: [published]` 不会触发。`release.yml` 使用默认的 `GITHUB_TOKEN` 发布 release（`gh release edit --draft=false`），而使用 `GITHUB_TOKEN` 创建的事件不会启动工作流运行。使用 PAT 或 GitHub App 令牌可以解决这一问题，但需要额外的凭据。
- Release 完成时的 `workflow_run` 会在默认分支的最新提交上运行，而不是在 release 提交上运行。release 提交之后合并的文档也会随之部署，从而再次引入问题 1。
- 在 Release 作业末尾使用 `gh workflow run` 可以正常工作（`workflow_dispatch` 不受 `GITHUB_TOKEN` 限制），但需要 `actions: write` 权限，并且会使部署从 Actions UI 中的 release 运行中脱离出来。在 release 运行中添加一个作业，可以让部署在其中保持可见并受其控制。

## 行为变更

| 事件                                               | 之前                       | 之后                                      |
| -------------------------------------------------- | -------------------------- | ----------------------------------------- |
| 文档变更合并到 `main`                              | 生产部署                   | 部署预览到 `main.viteplus.dev`             |
| `install.sh` / `install.ps1` 变更合并到 `main`     | 生产部署                   | 部署预览到 `main.viteplus.dev`             |
| 发布稳定版本                                       | 不部署文档                 | 从发布提交进行生产部署                    |
| 发布预发布版本                                     | 不部署文档                 | 不部署文档（`main` 预览已是最新）          |
| 手动触发                                           | 与推送部署重复             | 紧急生产更新的应急方式                    |

## 缺点

- 仅文档修复（拼写错误、更正说明）要等到下一次发布才能进入生产环境，除非有人手动触发部署。如今它们在合并后的几分钟内就会上线。但它们确实会在几分钟内进入 `viteplus-main`。
- 生产站点有意落后于 `main`。期望合并后的文档出现在 viteplus.dev 上的贡献者，必须在下次发布前链接到 `main.viteplus.dev`。
- `release.yml` 中会多出一个任务，并且发布流程会增加文档构建所需的时间（几分钟，与 Docker 发布并行执行）。
- 两个站点都可能被搜索引擎收录。预览项目应发送 `noindex`（或者当站点 URL 不是 viteplus.dev 时由主题生成该指令），这样 `main.viteplus.dev` 就不会与生产站点竞争。

## 已考虑的替代方案

- **仅限制安装脚本的部署，继续为 `docs/**` 保留推送部署。** 解决了
  问题 2，但没有解决问题 1，并且会让 `docs/guide/install.md` 与其所描述的
  脚本逐渐不一致。同一站点上存在两条新鲜度渠道。
- **版本化文档。** 发布 `main`，但在相应版本发布前隐藏未发布的章节。
  这需要编写约定以及主题/工具支持，不在本次范围内。
- **使用从 `release.yml` 调用的可复用工作流（`workflow_call`），
  而不是复合操作。** `reusable-release-build.yml` 已经先例，但它复用的是
  整个作业矩阵；文档部署复用的是不同触发器、门控条件和并发设置的作业中的
  步骤序列，这正是 `.github/actions` 复合操作的用途。`workflow_call` 还带来
  一些细节问题：被调用的工作流会继承调用方的 `github` 上下文和事件，其工作流级
  并发设置不会生效，并且必须声明和传递机密。复合操作避免了这三个问题，同时还可供
  `deploy-docs-preview.yml` 使用。
- **使用一个工作流文件处理生产环境和 `main` 预览环境，根据触发器选择项目。**
  从 `github.event_name` 选择 `VOID_PROJECT` 是隐式且脆弱的，而 `release.yml`
  仍然需要自己的发布门控作业。使用明确指定项目的精简包装器更易读。
- **将 `main` 预览部署到现有的 `viteplus-staging` 项目。** PR 预览也会部署到
  该项目，并在每次 PR 推送时覆盖 `main` 预览。

## 未解决的问题

- 部署是否也应等待 `publish-docker`，以确保 Docker 安装文档
  永远不会早于镜像发布？等待会使部署增加几分钟。
