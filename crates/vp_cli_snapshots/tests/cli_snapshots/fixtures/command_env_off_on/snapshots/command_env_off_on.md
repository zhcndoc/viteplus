# command_env_off_on

## `vp run assert-managed`

托管模式：应使用项目的 engines.node 22.18.0

```
VITE+ - The Unified Toolchain for the Web

$ node src/assert-managed.mjs ⊘ cache disabled
OK: <version>
```

## `vp env off`

切换到系统优先模式

```
VITE+ - Web 统一工具链

✓ Node.js 管理已设置为系统优先。

所有 vp 命令和垫片现在将优先使用系统 Node.js，找不到时才回退到托管版本。

运行 `vp env on` 以始终使用 Vite+ 托管的 Node.js。
```

## `vp run assert-not-managed`

系统优先模式：不得使用 22.18.0

**退出代码：** 1

```
VITE+ - Web 统一工具链

$ node src/assert-not-managed.mjs ⊘ 缓存已禁用
应使用系统 Node.js，但获取到的是托管版本 <version>
```

## `vp env on`

切换回托管模式

```
VITE+ - Web 的统一工具链

✓ Node.js 管理已设置为托管模式。

所有 vp 命令和 shim 现在都将始终使用 Vite+ 托管的 Node.js。

运行 `vp env off` 以优先使用系统 Node.js。
```

## `vp run assert-managed`

托管模式已恢复：应该再次使用 22.18.0

```
VITE+ - The Unified Toolchain for the Web

$ node src/assert-managed.mjs ⊘ cache disabled
OK: <version>
```
