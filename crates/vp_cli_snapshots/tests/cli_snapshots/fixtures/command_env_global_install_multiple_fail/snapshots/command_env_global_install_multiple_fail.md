# 全局安装多个命令失败

## `vp install -g . voidzero-nonexistent-pkg-xyz-23456`

**退出代码：** 1

```
VITE+ - 面向 Web 的统一工具链

信息：正在使用 Node.js <version> 安装 2 个全局软件包
⠿ 正在安装全局软件包 (<n>/2)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  npm 错误代码 E404
npm 错误 404 未找到 - GET http://127.0.0.1:<port>/voidzero-nonexistent-pkg-xyz-23456 - <message>
npm 错误 404
npm 错误 404  找不到请求的资源 'voidzero-nonexistent-pkg-xyz-23456@*'，或者你没有访问权限。
npm 错误 404
npm 错误 404 请注意，你还可以从以下来源安装：
npm 错误 404 tarball、文件夹、HTTP URL 或 Git URL。
完整的日志可在此处找到：<home>/.npm/_logs/<timestamp>-debug-0.log
✓ 已安装 install-fail-local-package 0.0.0
  二进制文件：install-fail-local-package

错误：安装 voidzero-nonexistent-pkg-xyz-23456 失败：npm install 以退出状态 1 失败
```

## `install-fail-local-package`

```
软件包安装成功
```
