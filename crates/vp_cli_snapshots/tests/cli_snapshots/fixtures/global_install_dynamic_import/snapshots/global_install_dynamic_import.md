# global_install_dynamic_import

针对 #2220 的回归测试：全局安装的软件包可以动态导入其安装目录中的绝对路径。

## `vp install -g .`

```
VITE+ - The Unified Toolchain for the Web

info: Installing 1 global package with Node.js <version>
✓ Installed global-install-dynamic-import 0.0.0
  Bins: global-install-dynamic-import
```

## `global-install-dynamic-import`

```
global dynamic import loaded
```
