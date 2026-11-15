# 包管理

Vite+ 为 npm、pnpm、Yarn 和 Bun 提供统一的命令接口。`vp` 会检测 workspace 使用的包管理器，必要时下载所选版本，并将命令及其支持的选项转换为对应格式。

```bash
vp install
vp add react
vp add -D typescript
vp remove react
vp update
```

## 入门

- [包管理器选择](./package-manager-selection)介绍检测、版本范围和包管理器 shim。
- [全局软件包](./global-packages)介绍独立的 Vite+ 全局软件包存储区。

## 命令

`vp add` 等核心命令可直接通过 `vp` 运行。转发命令使用 `vp pm` 将操作交给检测到的包管理器，并像核心命令一样转换命令和受支持的选项。`vp pm` 前缀可将 `pack` 等名称留给 Vite+ 命令使用。例如，`vp pm pack` 会创建软件包 tarball，而 [`vp pack`](/guide/pack) 会构建库。

## 原生命令参数

将原生参数放在 `--` 之后即可直接传递，不进行转换：

```bash
vp install -- --registry=https://registry.npmjs.org
```

## 核心命令

- [install](./install)
- [add](./add)
- [remove](./remove)
- [update](./update)
- [dedupe](./dedupe)
- [outdated](./outdated)
- [list](./list)
- [why](./why)
- [info](./info)
- [link](./link)
- [unlink](./unlink)
- [rebuild](./rebuild)
- [dlx](./dlx)

## 转发命令

- **安装与清理**
  - [pm ci](./ci)
  - [pm prune](./prune)
- **查看与诊断**
  - [pm licenses](./licenses)
  - [pm search](./search)
  - [pm audit](./audit)
  - [pm fund](./fund)
  - [pm ping](./ping)
- **本地开发**
  - [pm approve-builds](./approve-builds)
  - [pm patch](./patch)
  - [pm patch-commit](./patch-commit)
- **发布**
  - [pm pack](./pack)
  - [pm version](./version)
  - [pm publish](./publish)
  - [pm stage](./stage)
  - [pm dist-tag](./dist-tag)
  - [pm deprecate](./deprecate)
- **Registry 与账户**
  - [pm login](./login)
  - [pm logout](./logout)
  - [pm whoami](./whoami)
  - [pm token](./token)
  - [pm owner](./owner)
  - [pm team](./team)
- **配置与维护**
  - [pm config](./config)
  - [pm pkg](./pkg)
  - [pm cache](./cache)
