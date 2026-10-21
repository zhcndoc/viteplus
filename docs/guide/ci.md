# 持续集成

你可以使用 `voidzero-dev/setup-vp` 在 CI 环境中使用 Vite+。

## 概述

[`voidzero-dev/setup-vp`](https://github.com/voidzero-dev/setup-vp) 为 GitHub Actions、GitLab CI/CD 和 Azure Pipelines 提供集成。三者都会安装 Vite+，可以选择项目的 Node.js 版本，也可以安装项目依赖。GitHub Action 和 Azure Pipelines 模板还可以自动缓存包管理器数据。GitLab CI/CD 使用作业自身的缓存配置，并要求先提供 Node.js 才能启动设置运行时。

## setup-vp 版本管理

在每个示例中，将 `<setup-vp-version>` 设置为 [`setup-vp` 发布页面](https://github.com/voidzero-dev/setup-vp/releases)中的确切版本。也可以改用 commit SHA。不要使用 `v1` 标签。`v1` 标签不再接收更新。

运行 `vp migrate`，即可将 GitHub Actions 工作流和 `.github` 下的复合操作中确切的 `voidzero-dev/setup-vp@v1` 引用替换为与你的 Vite+ 版本对应的最新已知确切发布版本。现有的确切版本和 commit SHA 将保持不变。

## 安装期间使用的 Node.js

Vite+ 安装器默认使用最新的 Node.js LTS 版本。对于支持 [`VP_SETUP_NODE_VERSION`](/guide/global-cli#vp-setup-node-version) 的版本，`setup-vp` 也可以在安装期间使用项目声明的版本。如果该版本同时满足全局 CLI 和固定版本 `pnpm` 的要求，就无需再次下载 Node.js。

`setup-vp` 会在启动安装器前选择版本。显式指定的 Node.js 版本优先于版本文件输入。如果两者都未指定，它会依据[项目声明的优先顺序](/guide/env#node-js-selection)检查当前工作目录及其父目录。集成会通过 `VP_SETUP_NODE_VERSION` 传递所选版本；安装器本身不会读取项目声明。

未指定版本、禁用了 Node.js 管理，或所选版本不兼容时，安装过程会使用 LTS。旧版安装器会保留原有行为。自动发现项目版本不会创建会话覆盖，因此后续命令仍会按目录正常选择版本。

集成会自动处理这些安装器变量。在 GitHub Actions 和 GitLab CI/CD 中配置 `node-version` 或 `node-version-file`；在 Azure Pipelines 中配置 `nodeVersion` 或 `nodeVersionFile`。完整输入列表请参阅 [`setup-vp` 文档](https://github.com/voidzero-dev/setup-vp#inputs)。

## GitHub Actions

GitHub Action 会设置 Vite+、所需的 Node.js 版本和包管理器。这意味着通常无需在工作流中单独执行 `setup-node`、包管理器设置、依赖安装或手动依赖缓存步骤。

```yaml [.github/workflows/ci.yml]
- uses: voidzero-dev/setup-vp@<setup-vp-version>
  with:
    node-version: '24'
    cache: true
- run: vp check
- run: vp test
- run: vp build
```

`setup-vp` 默认运行 `vp install`。如果将 `run-install: false`，请确保在运行其他命令前添加 `vp install` 步骤。设置 `cache: true` 后，`setup-vp` 会自动为你处理依赖缓存。

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

- 启动设置运行时需要 Node.js。请使用如上所示的 Node.js 镜像，或以其他方式在作业中提供 Node.js。使用 `node-version` 或 `node-version-file` 可通过 `vp env use` 选择受管理的项目运行时。
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

Azure Pipelines 模板支持 Microsoft 托管的 Linux、macOS 和 Windows 代理。`UseNode@1` 通过 `bootstrapNodeVersion` 提供启动设置运行时所需的 Node.js。`nodeVersion` 和 `nodeVersionFile` 参数会通过 `vp env use` 选择受管理的项目运行时。`Cache@2` 用于缓存包管理器数据。

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

- run: vp run dev:setup
- run: vp check
- run: vp test
```
