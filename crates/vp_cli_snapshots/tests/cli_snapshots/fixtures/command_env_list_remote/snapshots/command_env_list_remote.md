# command_env_list_remote

## `vp env default node`

未配置的 Node.js 默认版本说明了实际生效的回退版本，但不会声称该版本是在配置中设置的

```
VITE+ - The Unified Toolchain for the Web

No default Node.js version configured. Using latest LTS (<version>).
  Run 'vp env default <version>' to set a default.
```

## `vp env install lts`

在本地安装 LTS Node.js 版本

```
VITE+ - Web 统一工具链

正在安装 Node.js <version>...
已安装 Node.js <version>
```

## `vp env default lts`

将其设置为全局默认版本（存储为 `lts` 别名）

```
VITE+ - Web 的统一工具链

✓ 默认 Node.js 版本已设置为 lts（当前为 <version>）
```

## `vp env default node`

已配置的 Node.js 别名显示其当前解析结果和配置来源

```
VITE+ - The Unified Toolchain for the Web

Default Node.js version: lts
  Currently resolves to: <version>
  Set via: <home>/.vite-plus/config.json
```

## `vp env default pnpm@10.18.0`

Package-manager 默认版本更新会标识所选的系列和版本

```
VITE+ - The Unified Toolchain for the Web

✓ Default pnpm version set to 10.18.0
```

## `node -e 'const {execFileSync}=require('\''node:child_process'\''); const {node}=JSON.parse(execFileSync('\''vp'\'',['\''env'\'','\''list-remote'\'','\''--lts'\'','\''--json'\''],{encoding:'\''utf8'\''})); console.log('\''installed marked:'\'', node.some(v=>v.installed)); console.log('\''current marked:'\'', node.some(v=>v.current)); console.log('\''default marked:'\'', node.some(v=>v.default));'`

统一的 JSON Node.js 条目会解析 installed、current、default 标志，包括 `lts` 默认别名

```
installed marked: true
current marked: true
default marked: true
```

## `vp env list-remote node 22.11.0`

人类可读的 Node.js 结果保留 v 前缀、LTS 代号和交互式格式

```
VITE+ - The Unified Toolchain for the Web

Node.js
  <version>\x1b[94m (Jod)

\x1b[2mnote: Run `vp env clean` to free disk space from unused managed runtimes and package manager caches.
```

## `vp env list-remote pnpm 10.18.0`

人类可读的包管理器结果保留当前版本格式

```
VITE+ - The Unified Toolchain for the Web

pnpm
  \x1b[94m10.18.0\x1b[39;2m current default

\x1b[2mnote: Run `vp env clean` to free disk space from unused managed runtimes and package manager caches.
```

## `vp env list-remote node 999`

空的 Node.js 结果包含可操作的反馈

```
VITE+ - The Unified Toolchain for the Web

Node.js
  No versions were found!

note: Run `vp env clean` to free disk space from unused managed runtimes and package manager caches.
```
