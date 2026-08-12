# run_yarn_corepack_hash

## `vpt rm -rf $VP_HOME/package_manager/yarn/4.17.1 $VP_HOME/package_manager/yarn/4.17.1.lock`

确保 Corepack 固定的 Yarn 版本未被缓存


## `vpt stat-file $VP_HOME/package_manager/yarn/4.17.1 --assert missing`

Yarn 4.17.1 不在缓存中

```
<home>/.vite-plus/package_manager/yarn/<version>: missing
```

## `vp run smoke`

首次 vp run 接受哈希并运行任务

```
VITE+ - The Unified Toolchain for the Web

$ vpt print yarn hash accepted ⊘ cache disabled
yarn hash accepted
```

## `vpt stat-file $VP_HOME/package_manager/yarn/4.17.1/yarn/bin/yarn.js --assert file`

vp run 将经过验证的 Yarn CLI 写入缓存

```
<home>/.vite-plus/package_manager/yarn/<version>/yarn/bin/yarn.js: file
```

## `vp run smoke`

第二次 vp run 使用缓存中的 Yarn CLI

```
VITE+ - The Unified Toolchain for the Web

$ vpt print yarn hash accepted ⊘ cache disabled
yarn hash accepted
```
