# local_registry_smoke

`local-registry = true` 的冒烟测试：一个仅存在于此 fixture 的 mock-manifest/tarballs 中的包，会通过注入的 registry 环境解析，证明运行器会打包检出内容、启动每个用例的 registry，并将其环境合并到每一步中。

## `npm install @vp-smoke/hello --no-save --no-audit --no-fund`

安装一个仅由本地注册表提供的包


## `vpt print-file node_modules/@vp-smoke/hello/package.json`

本地注册表提供了 packument 及其 tarball（由 npm 验证完整性）

```
{
  "name": "@vp-smoke/hello",
  "version": "1.0.0",
  "description": "由本地注册表 smoke test 提供的无依赖包。",
  "main": "index.js",
  "license": "MIT"
}
```
