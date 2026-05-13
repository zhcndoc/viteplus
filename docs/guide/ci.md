# 持续集成

你可以使用 `voidzero-dev/setup-vp` 在 CI 环境中使用 Vite+。

## 概述

对于 GitHub Actions，推荐使用 [`voidzero-dev/setup-vp`](https://github.com/voidzero-dev/setup-vp)。它会安装 Vite+，设置所需的 Node.js 版本和包管理器，并自动缓存依赖安装。

这意味着你通常不需要在工作流中单独配置 `setup-node`、包管理器设置和手动依赖缓存步骤。

## GitHub Actions

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
