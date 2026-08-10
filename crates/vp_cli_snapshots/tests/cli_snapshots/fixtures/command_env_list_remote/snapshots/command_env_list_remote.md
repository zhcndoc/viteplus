# command_env_list_remote

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

## `node -e 'const {execFileSync}=require('\''node:child_process'\''); const {versions}=JSON.parse(execFileSync('\''vp'\'',['\''env'\'','\''list-remote'\'','\''--lts'\'','\''--json'\''],{encoding:'\''utf8'\''})); console.log('\''installed marked:'\'', versions.some(v=>v.installed)); console.log('\''current marked:'\'', versions.some(v=>v.current)); console.log('\''default marked:'\'', versions.some(v=>v.default));'`

installed/current/default 标记都应成功解析，包括 `lts` 默认别名

```
installed marked: true
current marked: true
default marked: true
```
