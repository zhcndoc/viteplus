# command_pm_approve_builds_yarn4

## `vp pm approve-builds`

yarn Berry 警告 — 指向 dependenciesMeta["<pkg>"].built

```
warn: yarn does not run third-party build scripts by default. To allow a package, set `dependenciesMeta["<package>"].built: true` in package.json.
```

## `vp pm approve-builds esbuild`

相同警告（yarn 没有原生命令）

```
warn: yarn 默认不会运行第三方构建脚本。若要允许某个包，请在 package.json 中设置 `dependenciesMeta["<package>"].built: true`。
```

## `vp pm approve-builds esbuild -- --silent`

额外参数触发了被丢弃的透传警告

```
warn: yarn does not run third-party build scripts by default. To allow a package, set `dependenciesMeta["<package>"].built: true` in package.json.
warn: Ignoring pass-through args (--silent): this package manager has no native approve-builds command to forward them to.
```
