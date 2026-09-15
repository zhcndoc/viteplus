# 持续集成

你可以使用 `voidzero-dev/setup-vp` 在 CI 环境中使用 Vite+。

## 概述

[`voidzero-dev/setup-vp`](https://github.com/voidzero-dev/setup-vp) 为 GitHub Actions、GitLab CI/CD 和 Azure Pipelines 提供集成。三者都会安装 Vite+，并可以安装项目依赖。GitHub Action 和 Azure Pipelines 模板还可以自动设置 Node.js 和缓存包管理器数据，而 GitLab CI/CD 模板使用作业提供的 Node.js 运行时和缓存配置。

## setup-vp 版本管理

在每个示例中，将 `<setup-vp-version>` 设置为 [`setup-vp` 发布页面](https://github.com/voidzero-dev/setup-vp/releases)中的确切版本。也可以改用 commit SHA。不要使用 `v1` 标签。`v1` 标签不再接收更新。

运行 `vp migrate`，即可将 GitHub Actions 工作流和 `.github` 下的复合操作中确切的 `voidzero-dev/setup-vp@v1` 引用替换为与你的 Vite+ 版本对应的最新已知确切发布版本。现有的确切版本和 commit SHA 将保持不变。

## GitHub Actions

GitHub Action 会设置 Vite+、所需的 Node.js 版本和包管理器。这意味着通常无需在工作流中单独执行 `setup-node`、包管理器设置或手动依赖缓存步骤。

```yaml [.github/workflows/ci.yml]
- uses: voidzero-dev/setup-vp@<setup-vp-version>
  with:
    node-version: '24'
    cache: true
- run: vp install
- run: vp check
- run: vp test
- run: vp build
```

当 `cache: true` 时，`setup-vp` 会自动为你处理依赖缓存。

::: tip
`setup-vp` 会缓存包管理器数据。要在 CI 运行之间复用 Vite Task 结果，请添加单独的 [Vite Task 的 GitHub Actions 缓存](/guide/github-actions-cache)。
:::

## GitLab CI/CD

在 GitLab CI/CD 配置中使用可复用的 `setup-vp` 远程模板。将远程 URL 和 `setup-ref` 设置为相同的发布标签或提交 SHA：

```yaml [.gitlab-ci.yml]
include:
  - remote: 'https://raw.githubusercontent.com/voidzero-dev/setup-vp/<setup-vp-version>/gitlab/setup-vp.yml'
    inputs:
      setup-ref: '<setup-vp-version>'

test:
  extends: .setup-vp
  image: node:24
  script:
    - vp check
    - vp test
    - vp build
```

GitLab CI/CD 集成与 GitHub Action 在以下几方面有所不同：

- 该模板不会安装 Node.js。请使用如上所示的 Node.js 镜像，或以其他方式在作业中提供 Node.js。
- 使用作业的 GitLab [`cache`](https://docs.gitlab.com/ci/yaml/#cache) 关键字配置依赖缓存。
- 使用带有 Bash 以及 `curl` 或 `wget` 的类 Unix 运行器环境。

如需高级配置和完整的输入参考，请参阅 [`setup-vp` GitLab CI/CD 文档](https://github.com/voidzero-dev/setup-vp#gitlab-cicd)。

## Azure Pipelines

在 Azure Pipelines 配置中使用可复用的 `setup-vp` 步骤模板。创建名为 `github` 的 GitHub 服务连接，然后从 `setup-vp` 仓库引用该模板：

```yaml [azure-pipelines.yml]
resources:
  repositories:
    - repository: setupVp
      type: github
      endpoint: github
      name: voidzero-dev/setup-vp
      ref: refs/tags/<setup-vp-version>

pool:
  vmImage: ubuntu-latest

steps:
  - checkout: self
  - template: azure/setup-vp.yml@setupVp
    parameters:
      setupRef: '<setup-vp-version>'
      nodeVersion: 24.x
      cache: true
      runInstall: true
  - script: vp check
  - script: vp test
  - script: vp build
```

将 `ref` 和 `setupRef` 固定为相同的标签或 commit SHA，以实现严格的可复现性。

Azure Pipelines 模板支持 Microsoft 托管的 Linux、macOS 和 Windows 代理。它使用 Azure 原生的 `UseNode@1` 和 `Cache@2` 任务来设置 Node.js 并缓存包管理器数据。

如需高级配置和完整的参数参考，请参阅 [`setup-vp` Azure Pipelines 文档](https://github.com/voidzero-dev/setup-vp#azure-pipelines)。

## 自动更新版本

Dependabot 和 Renovate 可以更新 GitHub Actions 工作流中的确切版本。

要使用 [Dependabot 版本更新](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuring-dependabot-version-updates)，请将 `github-actions` 条目添加到 `.github/dependabot.yml`：

```yaml [.github/dependabot.yml]
version: 2
updates:
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
```

Dependabot 每周检查 `.github/workflows` 中的 `uses:` 条目。

[Renovate 的 GitHub Actions 管理器](https://docs.renovatebot.com/modules/manager/github-actions/)默认检测 `uses:` 条目。你无需为 `setup-vp` 添加软件包规则。

使用 commit SHA 时，请在注释中添加确切的发布标签。Renovate 会使用该注释查找更新：

```yaml
- uses: voidzero-dev/setup-vp@<commit-sha> # <setup-vp-version>
```

这些设置仅适用于 GitHub Actions 工作流。对于 GitLab CI/CD 和 Azure Pipelines，请同时更新两个版本值。

## 简化现有工作流

如果你正在迁移现有的 GitHub Actions 工作流，可以用单个 `setup-vp` 步骤替换大量的 Node、包管理器和缓存设置。

#### 之前：

```yaml [.github/workflows/ci.yml]
- uses: pnpm/action-setup@v6
  with:
    version: 11

- uses: actions/setup-node@v6
  with:
    node-version: '24'
    cache: pnpm

- run: pnpm ci && pnpm dev:setup
- run: pnpm check
- run: pnpm test
```

#### 之后：

```yaml [.github/workflows/ci.yml]
- uses: voidzero-dev/setup-vp@<setup-vp-version>
  with:
    node-version: '24'
    cache: true

- run: vp install && vp run dev:setup
- run: vp check
- run: vp test
```
