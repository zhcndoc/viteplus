# command_env_install_global_local

## `vp install -g .`

```
VITE+ - Web 的统一工具链

信息：正在使用 Node.js <version> 安装 1 个全局包
✓ 已安装 just-a-normal-package 0.0.0
  可执行文件：just-a-normal-package
```

## `vp install -g ./another-package.tgz`

```
VITE+ - The Unified Toolchain for the Web

info: Installing 1 global package with Node.js <version>
✓ Installed another-normal-package 0.0.1
  Bins: another-normal-package
```

## `vp list -g just-a-normal-package`

```
Package                       Node version   Binaries
---                           ---            ---
just-a-normal-package@0.0.0   <version>        just-a-normal-package
```

## `vp list -g another-normal-package`

```
Package                        Node version   Binaries
---                            ---            ---
another-normal-package@0.0.1   <version>        another-normal-package
```
