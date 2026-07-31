# env_install_stale_bin

## `vp install -g ./env-install-stale-bin-pkg-v1`

安装包含两个二进制文件的软件包

```
VITE+ - Web 统一工具链

info: 正在使用 Node.js <version> 安装 1 个全局软件包
✓ 已安装 env-install-stale-bin-pkg 1.0.0
  二进制文件：env-install-stale-drop、env-install-stale-keep
```

## `env-install-stale-keep`

两个二进制文件都应该可以调用

```
env-install-stale-keep ok
```

## `env-install-stale-drop`

```
env-install-stale-drop ok
```

## `vp install -g ./env-install-stale-bin-pkg-v2`

重新安装移除了一个二进制文件的软件包版本

```
VITE+ - 面向 Web 的统一工具链

信息：正在使用 Node.js <version> 安装 1 个全局软件包
✓ 已安装 env-install-stale-bin-pkg 2.0.0
  二进制文件：env-install-stale-keep
```

## `env-install-stale-keep`

剩余的二进制文件仍应可调用

```
env-install-stale-keep ok
```

## `node check-stale-binary.js`

```
stale shim removed
stale config removed
```
