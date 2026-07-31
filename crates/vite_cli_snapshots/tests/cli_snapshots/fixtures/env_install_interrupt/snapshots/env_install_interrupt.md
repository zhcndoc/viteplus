# 环境安装中断

## `vp install -g ./long-time-install-package`

```
VITE+ - Web 统一工具链

信息：正在使用 Node.js <version> 安装 1 个全局包
✓ 已安装 @scope/long-time-install-package 0.0.0
  命令：long-time-install-package
```

## `long-time-install-package`

```
long-time-install-package
```

## `node test-reinstall-interrupt.js`

重新安装但中断


## `long-time-install-package`

原始软件包仍应可运行

```
long-time-install-package
```

## `node check-stale-packages.js --expect-stale`

中断的重新安装应留下过期软件包

```
中断的过期软件包存在
```

## `vp install -g ./long-time-install-package`

成功重新安装后应清理过期的软件包

```
VITE+ - Web 统一工具链

信息：正在使用 Node.js <version> 安装 1 个全局软件包
✓ 已安装 @scope/long-time-install-package 0.0.0
  命令：long-time-install-package
```

## `node check-stale-packages.js`

```
已移除中断的过期包
```
