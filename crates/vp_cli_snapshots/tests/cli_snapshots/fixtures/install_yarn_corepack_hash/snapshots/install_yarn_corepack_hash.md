# install_yarn_corepack_hash

## `vpt rm -rf $VP_HOME/package_manager/yarn/4.17.1 $VP_HOME/package_manager/yarn/4.17.1.lock`

确保 Corepack 固定的 Yarn 版本未被缓存

## `vpt stat-file $VP_HOME/package_manager/yarn/4.17.1 --assert missing`

Yarn 4.17.1 不在缓存中

```
<home>/.vite-plus/package_manager/yarn/<version>: missing
```

## `vp install`

首次安装接受 Corepack 写入的哈希值

```
VITE+ - The Unified Toolchain for the Web

➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in <duration> <duration>
```

## `vpt stat-file $VP_HOME/package_manager/yarn/4.17.1/yarn/bin/yarn.js --assert file`

缓存中保存的是经过 vp 验证的 Yarn CLI

```
<home>/.vite-plus/package_manager/yarn/<version>/yarn/bin/yarn.js: file
```
