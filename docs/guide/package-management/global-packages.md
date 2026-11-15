# 全局软件包

全局软件包操作需要[全局 CLI](/guide/global-cli)。使用 `-g` 可独立于项目依赖管理工具：

```bash
vp install -g typescript
vp install -g --node 22 typescript
vp uninstall -g typescript
vp update -g
vp list -g
vp outdated -g
```

## 存储与 Node.js

Vite+ 将全局软件包存储在解析后的数据目录下的 `packages/` 中，而不是底层包管理器的全局安装目录。

未指定 `--node` 时，全局安装会使用当前目录解析出的 Node.js 版本。因此，项目固定版本优先于 `vp env default`。参见 [Node.js 选择](/guide/env#node-js-selection)。

`vp link` 使用包管理器的原生链接，不会修改 Vite+ 的全局软件包存储区，这些链接也不会显示在 `vp list -g` 中。

## 更新软件包

更新会保留安装时记录的版本规格。使用 `some-pkg@nightly` 安装的软件包会更新到该标签的最新版本；版本范围则会继续限制更新范围。

```bash
vp update -g some-pkg
vp update -g some-pkg@latest
vp update -g --latest
```

使用 `--latest` 后，后续更新会跟随 latest 标签，而不是原标签或版本范围。
