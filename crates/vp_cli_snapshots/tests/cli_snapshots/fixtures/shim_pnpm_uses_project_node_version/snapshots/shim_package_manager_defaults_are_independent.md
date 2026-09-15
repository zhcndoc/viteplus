# shim_package_manager_defaults_are_independent

包管理器默认版本按系列分别设置，因此更改 Bun 不会静默替换 pnpm shim 配置的版本。

## `vp env default pnpm@10.18.0`


## `vp env default bun@1.2.0`


## `vpt print-file $VP_HOME/config.json`

pnpm 和 Bun 的默认版本会分别持久化

```
{
  "defaultPackageManagerVersions": {
    "bun": "1.2.0",
    "pnpm": "10.18.0"
  },
  "packageManagerShimModes": {
    "bun": "managed",
    "npm": "managed",
    "pnpm": "managed",
    "yarn": "managed"
  }
}
```

## `node -e 'const {execFileSync}=require('\''node:child_process'\'');const pnpm=execFileSync('\''pnpm'\'',['\''--version'\''],{encoding:'\''utf8'\''}).trim();const bun=execFileSync('\''bun'\'',['\''--version'\''],{encoding:'\''utf8'\''}).trim();if(pnpm'\!'=='\''10.18.0'\''||bun'\!'=='\''1.2.0'\'')throw new Error(`expected pnpm 10.18.0 and bun 1.2.0, got pnpm ${pnpm} and bun ${bun}`);console.log('\''direct shims use independent defaults'\'')'`

直接的包管理器 shim 使用各自配置的版本

```
direct shims use independent defaults
```
