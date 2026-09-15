# shim_pnpm_使用项目的 Node 版本

## `pnpm --version`

未固定版本的 pnpm shim 解析最新版本


## `NPM_CONFIG_REGISTRY=http://127.0.0.1:9 pnpm --version`

未固定版本的 shim 复用其新鲜的最新版本缓存，而无需访问 registry


## `node -e 'const {execFileSync}=require('\''node:child_process'\'');const {delimiter}=require('\''node:path'\'');const env={...process.env,PATH:[process.env.VP_HOME+'\''/bin'\'','\''/usr/bin'\'','\''/bin'\''].join(delimiter)};const version=execFileSync('\''pnpm'\'',['\''--version'\''],{encoding:'\''utf8'\'',env}).trim();if('\!'version)process.exit(1);console.log('\''node child reached pnpm shim'\'')'`

通过其 shim 启动的 Node 进程可以调用 pnpm shim

```
node child reached pnpm shim
```

## `node -e 'const {execFileSync}=require('\''node:child_process'\'');execFileSync('\''pnpm'\'',['\''--silent'\'','\''exec'\'','\''node'\'','\''-e'\'','\''if(process.version'\!'==process.env.EXPECTED_NODE_VERSION)process.exit(1)'\''],{stdio:'\''inherit'\'',env:{...process.env,EXPECTED_NODE_VERSION:process.version}});console.log('\''pnpm child uses project Node version'\'')'`

pnpm 使用项目的 Node 版本

```
pnpm child uses project Node version
```

## `vp env exec --node 22.13 pnpm exec node -e 'if('\!'process.version.startsWith('\''v22.13.'\''))process.exit(1);console.log('\''explicit Node reaches pnpm child'\'')'`

显式的 env exec 版本通过 pnpm shim 覆盖项目版本

```
explicit Node reaches pnpm child
```

## `vpt write-file .node-version '>=999.0.0
'`


## `VP_NODE_DIST_MIRROR=http://127.0.0.1:9 pnpm --version`

JS 包管理器 shim 报告项目 Node 解析失败

**退出代码：** 1

```
vp: Failed to resolve Node version: Failed to download Node.js runtime: No version matching '>=999.0.0' found
vp: Run 'vp env doctor' for diagnostics
```
