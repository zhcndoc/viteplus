# 命令_环境_安装_失败

## `vp install -g voidzero-nonexistent-pkg-xyz-12345`

安装不存在的软件包

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

info: Installing 1 global package with Node.js <version>
⠿ Installing global packages (<n>/1)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  npm error code E404
npm error 404 Not Found - GET http://127.0.0.1:<port>/voidzero-nonexistent-pkg-xyz-12345 - <message>
npm error 404
npm error 404  The requested resource 'voidzero-nonexistent-pkg-xyz-12345@*' could not be found or you do not have permission to access it.
npm error 404
npm error 404 Note that you can also install from a
npm error 404 tarball, folder, http url, or git url.
npm error A complete log of this run can be found in: <home>/.npm/_logs/<timestamp>-debug-0.log
error: Failed to install voidzero-nonexistent-pkg-xyz-12345: npm install failed with exit status: 1
```
