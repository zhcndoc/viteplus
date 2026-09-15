# install_yarn_corepack_hash_mismatch

每个环境入口点都必须保留并验证相同的 Corepack 完整性后缀，同时避免在不同情况下重复执行开销高昂的缓存设置

## `vpt rm -rf $VP_HOME/package_manager/yarn/4.17.1 $VP_HOME/package_manager/yarn/4.17.1.lock`

确保 Corepack 固定的 Yarn 版本未被缓存


## `vp install`

缓存经过验证的 Yarn CLI


## `vp env install pm`

显式环境安装接受经过验证的项目哈希

```
VITE+ - The Unified Toolchain for the Web

Installing yarn <version>...
Installed yarn <version>
```

## `vpt replace-file-content package.json b7ad4697 b7ad4698`

将固定值更改为与缓存的 CLI 不匹配的哈希


## `vp install`

错误信息会指出哈希所覆盖的构件。vp 不会再次下载 CLI

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: Install error: Hash mismatch for yarn@4.17.1: expected sha512.ccbfabf7d7b6b32075088be9386fb9a2e00bb6887ef07fa56effabc890a56d53da1ccc4128d62db245fcbd3961b236d75335bdf7d5320ed6eafb7588b7ad4698, got sha512.ccbfabf7d7b6b32075088be9386fb9a2e00bb6887ef07fa56effabc890a56d53da1ccc4128d62db245fcbd3961b236d75335bdf7d5320ed6eafb7588b7ad4697
The `packageManager` hash covers the extracted Yarn CLI (bin/yarn.js). Corepack hashes the same artifact.
```

## `vp env install pm`

显式环境安装拒绝不匹配的项目哈希

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

Installing yarn <version>...
error: Install error: Hash mismatch for yarn@4.17.1: expected sha512.ccbfabf7d7b6b32075088be9386fb9a2e00bb6887ef07fa56effabc890a56d53da1ccc4128d62db245fcbd3961b236d75335bdf7d5320ed6eafb7588b7ad4698, got sha512.ccbfabf7d7b6b32075088be9386fb9a2e00bb6887ef07fa56effabc890a56d53da1ccc4128d62db245fcbd3961b236d75335bdf7d5320ed6eafb7588b7ad4697
The `packageManager` hash covers the extracted Yarn CLI (bin/yarn.js). Corepack hashes the same artifact.
```

## `CI=true vp env use pm --no-install`

会话覆盖会保留项目哈希以供首次使用

```
Using yarn <version> (resolved from packageManager)
```

## `yarn --version`

包管理器 shim 会强制使用 env use 保留的哈希

**退出代码：** 1

```
vp: Failed to resolve package manager for 'yarn': Install error: Hash mismatch for yarn@4.17.1: expected sha512.ccbfabf7d7b6b32075088be9386fb9a2e00bb6887ef07fa56effabc890a56d53da1ccc4128d62db245fcbd3961b236d75335bdf7d5320ed6eafb7588b7ad4698, got sha512.ccbfabf7d7b6b32075088be9386fb9a2e00bb6887ef07fa56effabc890a56d53da1ccc4128d62db245fcbd3961b236d75335bdf7d5320ed6eafb7588b7ad4697
The `packageManager` hash covers the extracted Yarn CLI (bin/yarn.js). Corepack hashes the same artifact.
```
