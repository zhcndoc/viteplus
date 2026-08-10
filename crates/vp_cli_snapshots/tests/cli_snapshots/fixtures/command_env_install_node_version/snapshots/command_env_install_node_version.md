# 安装 Node 版本的命令。

## `vp install -g --node 22 ./command-env-install-node-version-pkg`

使用 Node.js 22 安装

```
VITE+ - Web 的统一工具链

信息：正在使用 Node.js <version> 安装 1 个全局软件包
✓ 已安装 command-env-install-node-version-pkg 1.0.0
  可执行文件：command-env-install-node-version-pkg-cli
```

## `node -e 'const d=JSON.parse(require('\''fs'\'').readFileSync(process.env.VP_HOME+'\''/bins/command-env-install-node-version-pkg-cli.json'\'','\''utf8'\'')); console.log('\''Node major:'\'', d.nodeVersion.split('\''.'\'')[0])'`

验证 Node 22

```
Node major: 22
```

## `vp remove -g command-env-install-node-version-pkg`

清理

```
已卸载 command-env-install-node-version-pkg
```

## `vp install -g --node 20 ./command-env-install-node-version-pkg`

使用 Node.js 20 安装

```
VITE+ - Web 统一工具链

信息：正在使用 Node.js <version> 安装 1 个全局软件包
✓ 已安装 command-env-install-node-version-pkg 1.0.0
  二进制文件：command-env-install-node-version-pkg-cli
```

## `node -e 'const d=JSON.parse(require('\''fs'\'').readFileSync(process.env.VP_HOME+'\''/bins/command-env-install-node-version-pkg-cli.json'\'','\''utf8'\'')); console.log('\''Node major:'\'', d.nodeVersion.split('\''.'\'')[0])'`

验证 Node 20

```
Node major: 20
```

## `vp remove -g command-env-install-node-version-pkg`

清理

```
已卸载 command-env-install-node-version-pkg
```
