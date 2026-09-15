# pnpm11 工作区命令包

## `vp pm pack`

应打包当前工作区根目录

```
package: command-pack-pnpm11-with-workspace@1.0.0
Tarball Contents
package.json
packages/app/package.json
packages/utils/package.json
pnpm-workspace.yaml
Tarball Details
command-pack-pnpm11-with-workspace-1.0.0.tgz
```

## `vpt rm -f command-pack-pnpm11-with-workspace-1.0.0.tgz app-1.0.0.tgz vite-plus-test-utils-1.0.0.tgz`


## `node -e 'const {execFileSync}=require('\''node:child_process'\'');const out=JSON.parse(execFileSync('\''vp'\'',['\''pm'\'','\''pack'\'','\''--recursive'\'','\''--json'\''],{encoding:'\''utf8'\''}));out.sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0);console.log(JSON.stringify(out,null,2));'`

应打包工作区中的所有软件包（按名称排序以确保确定性）

```
[
  {
    "name": "@vite-plus-test/utils",
    "version": "1.0.0",
    "filename": "<workspace>/vite-plus-test-utils-1.0.0.tgz",
    "files": [
      {
        "path": "package.json"
      }
    ]
  },
  {
    "name": "app",
    "version": "1.0.0",
    "filename": "<workspace>/app-1.0.0.tgz",
    "files": [
      {
        "path": "package.json"
      }
    ]
  },
  {
    "name": "command-pack-pnpm11-with-workspace",
    "version": "1.0.0",
    "filename": "command-pack-pnpm11-with-workspace-1.0.0.tgz",
    "files": [
      {
        "path": "package.json"
      },
      {
        "path": "packages/app/package.json"
      },
      {
        "path": "packages/utils/package.json"
      },
      {
        "path": "pnpm-workspace.yaml"
      }
    ]
  }
]
```

## `vpt rm -f command-pack-pnpm11-with-workspace-1.0.0.tgz app-1.0.0.tgz vite-plus-test-utils-1.0.0.tgz`


## `vp pm pack --filter app`

应打包指定的软件包（使用 --filter app pack）

```
package: app@1.0.0
Tarball Contents
package.json
Tarball Details
<workspace>/app-1.0.0.tgz
```

## `vpt rm -f command-pack-pnpm11-with-workspace-1.0.0.tgz app-1.0.0.tgz vite-plus-test-utils-1.0.0.tgz`


## `node -e 'const {execFileSync}=require('\''node:child_process'\'');const out=JSON.parse(execFileSync('\''vp'\'',['\''pm'\'','\''pack'\'','\''--filter'\'','\''app'\'','\''--filter'\'','\''@vite-plus-test/utils'\'','\''--json'\''],{encoding:'\''utf8'\''}));out.sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0);console.log(JSON.stringify(out,null,2));'`

应打包多个软件包（按名称排序以确保确定性）

```
[
  {
    "name": "@vite-plus-test/utils",
    "version": "1.0.0",
    "filename": "<workspace>/vite-plus-test-utils-1.0.0.tgz",
    "files": [
      {
        "path": "package.json"
      }
    ]
  },
  {
    "name": "app",
    "version": "1.0.0",
    "filename": "<workspace>/app-1.0.0.tgz",
    "files": [
      {
        "path": "package.json"
      }
    ]
  }
]
```

## `vpt rm -f command-pack-pnpm11-with-workspace-1.0.0.tgz app-1.0.0.tgz vite-plus-test-utils-1.0.0.tgz`


## `vp pm pack --out ./dist/package.tgz`

应使用输出文件进行打包

```
package: command-pack-pnpm11-with-workspace@1.0.0
Tarball Contents
package.json
packages/app/package.json
packages/utils/package.json
pnpm-workspace.yaml
Tarball Details
<workspace>/dist/package.tgz
```

## `vpt rm -rf ./dist`

```
```

## `vp pm pack --pack-destination ./dist`

应使用目标目录进行打包

```
package: command-pack-pnpm11-with-workspace@1.0.0
Tarball Contents
package.json
packages/app/package.json
packages/utils/package.json
pnpm-workspace.yaml
Tarball Details
<workspace>/dist/command-pack-pnpm11-with-workspace-1.0.0.tgz
```

## `vpt rm -rf ./dist`

```
```

## `vp pm pack --pack-gzip-level 9`

应使用 gzip 压缩级别进行打包

```
package: command-pack-pnpm11-with-workspace@1.0.0
Tarball Contents
package.json
packages/app/package.json
packages/utils/package.json
pnpm-workspace.yaml
Tarball Details
command-pack-pnpm11-with-workspace-1.0.0.tgz
```

## `vpt rm -f command-pack-pnpm11-with-workspace-1.0.0.tgz app-1.0.0.tgz vite-plus-test-utils-1.0.0.tgz`


## `vp pm pack --json --out foo-%s-%v.tgz`

应使用 JSON 输出进行打包

```
{
  "name": "command-pack-pnpm11-with-workspace",
  "version": "1.0.0",
  "filename": "foo-command-pack-pnpm11-with-workspace-1.0.0.tgz",
  "files": [
    {
      "path": "package.json"
    },
    {
      "path": "packages/app/package.json"
    },
    {
      "path": "packages/utils/package.json"
    },
    {
      "path": "pnpm-workspace.yaml"
    }
  ]
}
```

## `vpt rm -f command-pack-pnpm11-with-workspace-1.0.0.tgz app-1.0.0.tgz vite-plus-test-utils-1.0.0.tgz`

