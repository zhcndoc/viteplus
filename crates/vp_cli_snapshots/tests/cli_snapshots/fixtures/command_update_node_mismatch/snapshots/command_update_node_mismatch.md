# command_update_node_mismatch

## `vp install -g --node 20 testnpm2`

```
[1m[94minfo:[39m[0m 正在使用 Node.js <version> 安装 1 个全局软件包
[32m✓[39m 已安装 [1mtestnpm2[0m [1m1.0.1[0m
```

## `vp update -g testnpm2`

应发出警告并在 CI 中跳过 Node 版本不匹配的软件包重新安装

```
All global packages are up to date.
[1m[33mwarn:[39m[0m Skipping reinstall for global packages installed with a different Node.js version: testnpm2. Use --reinstall-node-mismatch to reinstall them.
```

## `vp update -g testnpm2 --ignore-node-mismatch`

应明确跳过 Node 不匹配重装

```
All global packages are up to date.
```

## `vp update -g testnpm2 --reinstall-node-mismatch`

```
[1m[94minfo:[39m[0m 正在使用 Node.js <version> 更新 1 个全局软件包
[32m✓[39m 已将 [1mtestnpm2[0m 更新至 [1m1.0.1[0m
```
