# 命令升级检查

## `vp upgrade --check --tag alpha`

alpha 标签可避免发布日的波动（发布后，开发版本会立即等于 npm 最新版本，从而隐藏“有可用更新”分支）

```
信息：正在检查更新...
信息：发现 vite-plus@0.1.21-alpha.7（当前版本：<version>）
有可用更新：<version> → 0.1.21-alpha.7
运行 `vp upgrade` 进行更新。
```
