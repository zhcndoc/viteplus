# command_pack_pnpm10_with_workspace

## `vp pm pack`

应打包当前工作区根目录

```
📦  command-pack-pnpm10-with-workspace@1.0.0
Tarball Contents
package.json
packages/app/package.json
packages/utils/package.json
pnpm-workspace.yaml
Tarball Details
command-pack-pnpm10-with-workspace-1.0.0.tgz
```

## `vpt rm -f command-pack-pnpm10-with-workspace-1.0.0.tgz app-1.0.0.tgz vite-plus-test-utils-1.0.0.tgz`


## `node -e 'const {execFileSync}=require('\''node:child_process'\'');const out=JSON.parse(execFileSync('\''vp'\'',['\''pm'\'','\''pack'\'','\''--recursive'\'','\''--json'\''],{encoding:'\''utf8'\''}));out.sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0);console.log(JSON.stringify(out,null,2));'`

应打包工作区中的所有包（按名称排序以确保确定性）

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
    "name": "command-pack-pnpm10-with-workspace",
    "version": "1.0.0",
    "filename": "command-pack-pnpm10-with-workspace-1.0.0.tgz",
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

## `vpt print-file out.json`

**退出代码：** 1

```
out.json: not found
missing file
```

*（跳过 1 个步骤至下一个行边界：步骤失败）*

## `vp pm pack --filter app`

应打包指定的软件包（使用 --filter app pack）

```
📦  app@1.0.0
Tarball Contents
package.json
Tarball Details
<workspace>/app-1.0.0.tgz
```

## `vpt rm -f command-pack-pnpm10-with-workspace-1.0.0.tgz app-1.0.0.tgz vite-plus-test-utils-1.0.0.tgz`


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

## `vpt print-file out.json`

**退出代码：** 1

```
out.json：未找到
缺少文件
```

*(跳过 1 个步骤到下一个行边界：步骤失败)*

## `vp pm pack --out ./dist/package.tgz`

应使用输出文件进行打包

```
📦  command-pack-pnpm10-with-workspace@1.0.0
Tarball Contents
app-1.0.0.tgz
package.json
packages/app/package.json
packages/utils/package.json
pnpm-workspace.yaml
vite-plus-test-utils-1.0.0.tgz
Tarball Details
<workspace>/dist/package.tgz
```

## `vpt rm -rf ./dist`

```
```

## `vp pm pack --pack-destination ./dist`

应使用目标路径进行打包

```
📦  command-pack-pnpm10-with-workspace@1.0.0
压缩包内容
app-1.0.0.tgz
package.json
packages/app/package.json
packages/utils/package.json
pnpm-workspace.yaml
vite-plus-test-utils-1.0.0.tgz
压缩包详情
<workspace>/dist/command-pack-pnpm10-with-workspace-1.0.0.tgz
```

## `vpt rm -rf ./dist`

```
```

## `vp pm pack --pack-gzip-level 9`

应使用 gzip 压缩级别进行打包

```
📦  command-pack-pnpm10-with-workspace@1.0.0
Tarball Contents
app-1.0.0.tgz
package.json
packages/app/package.json
packages/utils/package.json
pnpm-workspace.yaml
vite-plus-test-utils-1.0.0.tgz
Tarball Details
command-pack-pnpm10-with-workspace-1.0.0.tgz
```

## `vpt rm -f command-pack-pnpm10-with-workspace-1.0.0.tgz app-1.0.0.tgz vite-plus-test-utils-1.0.0.tgz`


## `vp pm pack --json --out foo-%s-%v.tgz`

应输出 JSON 格式进行打包

```
{
  "name": "command-pack-pnpm10-with-workspace",
  "version": "1.0.0",
  "filename": "foo-command-pack-pnpm10-with-workspace-1.0.0.tgz",
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

## `vpt rm -f command-pack-pnpm10-with-workspace-1.0.0.tgz app-1.0.0.tgz vite-plus-test-utils-1.0.0.tgz`

