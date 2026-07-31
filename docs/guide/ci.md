# 持续集成

你可以使用 `voidzero-dev/setup-vp` 在 CI 环境中使用 Vite+。

## 概述

[`voidzero-dev/setup-vp`](https://github.com/voidzero-dev/setup-vp) 为 GitHub Actions 和 GitLab CI/CD 提供集成。两者都会安装 Vite+，并且可以安装项目依赖。GitHub Action 还可以自动设置 Node.js 并缓存包管理器数据，而 GitLab CI/CD 模板则使用作业提供的 Node.js 运行时和缓存配置。

## GitHub Actions

GitHub Action 会设置 Vite+、所需的 Node.js 版本和包管理器。这意味着通常无需在工作流中单独执行 `setup-node`、包管理器设置或手动依赖缓存步骤。

```yaml [.github/workflows/ci.yml]
- uses: voidzero-dev/setup-vp@v1
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

在 GitLab CI/CD 配置中使用可复用的 `setup-vp` 远程模板：

```yaml [.gitlab-ci.yml]
include:
  - remote: 'https://raw.githubusercontent.com/voidzero-dev/setup-vp/v1/gitlab/setup-vp.yml'

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
- uses: voidzero-dev/setup-vp@v1
  with:
    node-version: '24'
    cache: true

- run: vp install && vp run dev:setup
- run: vp check
- run: vp test
```
