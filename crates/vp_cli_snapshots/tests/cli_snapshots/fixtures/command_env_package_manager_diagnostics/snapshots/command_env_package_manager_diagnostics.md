# 命令环境包管理器诊断

## `node prepare-npm.cjs`


## `vp env current pm --json`

当前报告了 npm packageManager 固定版本

```
{
  "package_manager": {
    "name": "npm",
    "version": "<version>",
    "source": "packageManager",
    "source_path": "<workspace>/package.json",
    "project_root": "<workspace>",
    "bin_paths": {
      "npm": "<home>/.vite-plus/package_manager/npm/<version>/npm/bin/npm",
      "npx": "<home>/.vite-plus/package_manager/npm/<version>/npm/bin/npx"
    },
    "installed": true,
    "mode": "managed"
  }
}
```

## `vp env current pm`

当前会列出所选包管理器系列公开的每个二进制文件

```
VITE+ - The Unified Toolchain for the Web

Package Manager:
  Name       npm
  Version    10.9.4
  Source     packageManager
  Bin Paths
    npm      <home>/.vite-plus/package_manager/npm/<version>/npm/bin/npm
    npx      <home>/.vite-plus/package_manager/npm/<version>/npm/bin/npx
  Installed  true
  Mode       managed
```

## `vp env which npm`

which 报告 npm packageManager 固定版本

```
VITE+ - The Unified Toolchain for the Web

<home>/.vite-plus/package_manager/npm/<version>/npm/bin/npm
  Package:    npm@10.9.4
  Source:     <workspace>/package.json
```

## `vp env which npx`

npx 别名报告相同的 npm packageManager 固定版本

```
VITE+ - The Unified Toolchain for the Web

<home>/.vite-plus/package_manager/npm/<version>/npm/bin/npx
  Package:    npm@10.9.4
  Source:     <workspace>/package.json
```
