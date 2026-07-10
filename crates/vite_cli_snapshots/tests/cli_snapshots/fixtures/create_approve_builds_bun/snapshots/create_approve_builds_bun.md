# create_approve_builds_bun

## `vp create @your-org:with-build-dep --no-interactive --approve-builds --package-manager bun --directory approved-app`

--approve-builds 会为受限的构建脚本（core-js）运行 `bun pm trust`

```
◇ 已生成 approved-app
• Node <version>  bun <version>
✓ 依赖已安装，耗时 <duration>
→ 下一步：cd approved-app && vp run
```

## `vpt print-file approved-app/package.json`

core-js 已记录在 trustedDependencies 中

```
{
  "name": "approved-app",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "prepare": "vp config"
  },
  "dependencies": {
    "core-js": "3.39.0"
  },
  "devDependencies": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>",
    "vite-plus": "<version>"
  },
  "overrides": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>"
  },
  "devEngines": {
    "packageManager": {
      "name": "bun",
      "version": "<version>",
      "onFail": "download"
    }
  },
  "trustedDependencies": [
    "core-js"
  ]
}
```

## `vp create @your-org:with-build-dep --no-interactive --package-manager bun --directory default-app`

默认运行会显示带有引导信息的受限构建，并保持其不受信任

```

未为以下包运行构建脚本：core-js。

这些依赖在构建完成前可能无法正常工作。请在项目中运行 vp pm approve-builds core-js 以批准它们，或者使用 --approve-builds 重新创建。
◇ 已搭建 default-app
• Node <version>  bun <version>
✓ 依赖已安装，用时 <duration>
→ 下一步：cd default-app && vp run
```

## `vpt print-file default-app/package.json`

没有 trustedDependencies，未运行构建

```
{
  "name": "default-app",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "prepare": "vp config"
  },
  "dependencies": {
    "core-js": "3.39.0"
  },
  "devDependencies": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>",
    "vite-plus": "<version>"
  },
  "overrides": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>"
  },
  "devEngines": {
    "packageManager": {
      "name": "bun",
      "version": "<version>",
      "onFail": "download"
    }
  }
}
```

## `cd default-app && vp pm approve-builds core-js`

指导中的 `vp pm approve-builds` 命令会批准受限构建

```
bun pm trust <version> (0d9b296a)

./node_modules/core-js @3.39.0
 ✓ [postinstall]: node -e "try{require('./postinstall')}catch(e){}"

 1 script ran across 1 package [<duration>]
```

## `vpt print-file default-app/package.json`

core-js 现在已记录在 trustedDependencies 中

```
{
  "name": "default-app",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "prepare": "vp config"
  },
  "dependencies": {
    "core-js": "3.39.0"
  },
  "devDependencies": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>",
    "vite-plus": "<version>"
  },
  "overrides": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>"
  },
  "devEngines": {
    "packageManager": {
      "name": "bun",
      "version": "<version>",
      "onFail": "download"
    }
  },
  "trustedDependencies": [
    "core-js"
  ]
}
```
