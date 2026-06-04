# 升级 Vite+

使用 `vp upgrade` 来更新全局的 `vp` 二进制文件，并使用 Vite+ 的包管理命令来更新项目中的本地 `vite-plus` 包。

## 概述

升级 Vite+ 包含两个部分：

- 全局的 `vp` 命令（安装在你的机器上）
- 单个项目使用的本地 `vite-plus` 包

你可以独立升级这两者。

## 全局 `vp`

```bash
vp upgrade              # 升级到最新版本
vp upgrade --check      # 检查更新但不安装
```

### 回滚

Vite+ 会保留最近的 **3 个**已安装版本，因此你可以快速回退：

```bash
vp upgrade --rollback
```

每次升级后，较旧的版本会自动清理。当前使用的版本和上一个版本始终会被保留，因此回滚目标不会被删除。

## 本地 `vite-plus`

使用 Vite+ 的包管理命令更新项目依赖：

```bash
vp update vite-plus
```

如果你想将依赖显式地移动到最新版本，也可以使用 `vp add vite-plus@latest`。

### 更新别名包

Vite+ 在安装时会为其核心包设置 npm 别名：

- `vite` 别名指向 `npm:@voidzero-dev/vite-plus-core@latest`
- `vitest` 别名指向 `npm:@voidzero-dev/vite-plus-test@latest`

`vp update vite-plus` 不会在锁文件中重新解析这些别名。若要完全升级，请单独更新它们：

```bash
vp update @voidzero-dev/vite-plus-core @voidzero-dev/vite-plus-test
```

或者一次性更新所有包：

```bash
vp update vite-plus @voidzero-dev/vite-plus-core @voidzero-dev/vite-plus-test
```

你可以使用 `vp outdated` 验证是否没有过时的 Vite+ 包。
