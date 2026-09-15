# nested_package_manager_resolves_project_version

## `vp env on pnpm`


## `npx --offline --call 'pnpm --version'`

嵌套 shim 会在首次使用时解析并安装固定版本的 pnpm


## `npx --offline --call 'pnpm --version'`

npx 可以在没有系统 pnpm 的情况下调用项目 pnpm

```
10.19.0
```

## `npm run --silent probe`

npm 生命周期脚本可以调用项目 pnpm

```
10.19.0
```

## `npx --offline --call 'pnpm exec node assert-injected-tools.cjs pnpm 10.19.0 20.18.0'`

注入的工具会累积，显式的 shim 调用会复用它们

```
Injected pnpm resolves to 10.19.0 on Node <version>
```

## `pnpm exec pnpm --version`

同系列的子调用仍会到达真实二进制文件

```
10.19.0
```

## `npx --offline --call 'pnpm exec node -e "require('\''node:assert/strict'\'').equal(process.version,'\''v20.18.0'\'');console.log('\''project Node version preserved'\'')"'`

嵌套包管理器会保留选定的 Node.js 运行时

```
project Node version preserved
```

## `npx --offline --call 'pnpm exec npx --offline --call "pnpm --version"'`

重复的跨系列调用可以在没有 shim 循环的情况下完成

```
10.19.0
```
