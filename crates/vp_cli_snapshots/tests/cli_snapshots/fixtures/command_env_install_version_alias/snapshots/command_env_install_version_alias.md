# 命令_环境_安装_版本_别名

## `vp install -g --node lts ./command-env-install-version-alias-pkg`

使用 LTS 别名安装

```
VITE+ - Web 统一工具链

信息：正在使用 Node.js <version> 安装 1 个全局软件包
✓ 已安装 command-env-install-version-alias-pkg 1.0.0
  二进制文件：command-env-install-version-alias-pkg-cli
```

## `node -e 'const d=JSON.parse(require('\''fs'\'').readFileSync(process.env.VP_HOME+'\''/bins/command-env-install-version-alias-pkg-cli.json'\'','\''utf8'\'')); const v=parseInt(d.nodeVersion.split('\''.'\'')[0]); console.log('\''LTS major >= 20:'\'', v >= 20)'`

验证 LTS 版本

```
LTS major >= 20: true
```

## `vp remove -g command-env-install-version-alias-pkg`

清理

```
已卸载 command-env-install-version-alias-pkg
```

## `vp install -g --node latest ./command-env-install-version-alias-pkg`

使用 latest 别名安装

```
VITE+ - Web 统一工具链

info: 正在使用 Node.js <version> 安装 1 个全局软件包
✓ 已安装 command-env-install-version-alias-pkg 1.0.0
  二进制文件：command-env-install-version-alias-pkg-cli
```

## `node -e 'const d=JSON.parse(require('\''fs'\'').readFileSync(process.env.VP_HOME+'\''/bins/command-env-install-version-alias-pkg-cli.json'\'','\''utf8'\'')); const v=parseInt(d.nodeVersion.split('\''.'\'')[0]); console.log('\''Latest major >= 20:'\'', v >= 20)'`

验证最新版本

```
Latest major >= 20: true
```

## `vp remove -g command-env-install-version-alias-pkg`

清理

```
已卸载 command-env-install-version-alias-pkg
```
