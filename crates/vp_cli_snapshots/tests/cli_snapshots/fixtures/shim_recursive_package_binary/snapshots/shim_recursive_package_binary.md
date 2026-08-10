# shim_recursive_package_binary

## `vp install -g ./recursive-cli-pkg`

安装测试包

```
VITE+ - Web 的统一工具链

信息：正在使用 Node.js <version> 安装 1 个全局包
✓ 已安装 recursive-cli-pkg 1.0.0
  可执行文件：recursive-cli
```

## `recursive-cli`

外部调用通过 shim 触发递归内部调用

```
outer call
inner call succeeded
```

## `vp remove -g recursive-cli-pkg`

清理

```
Uninstalled recursive-cli-pkg
```
