# command_env_install_parallel

## `vp install -g --concurrency 1 ./parallel-pkg-a ./parallel-pkg-b`

安装多个全局软件包

```
VITE+ - Web 统一工具链

信息：正在使用 Node.js <version> 安装 2 个全局软件包
✓ 已安装 parallel-pkg-a 1.0.0
  可执行文件：parallel-a

✓ 已安装 parallel-pkg-b 2.0.0
  可执行文件：parallel-b
```

## `parallel-a`

两个二进制文件都应该可以调用

```
parallel-a ok
```

## `parallel-b`

```
parallel-b ok
```

## `vp remove -g parallel-pkg-a parallel-pkg-b`

清理

```
已卸载 parallel-pkg-a
已卸载 parallel-pkg-b
```
