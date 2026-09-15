# command_env_unified

## `vp env pin 22.0.0 --no-install --force`

传统的未限定版本仍然只固定 Node.js

```
VITE+ - The Unified Toolchain for the Web

✓ Pinned Node.js version to 22.0.0
  Updated devEngines.runtime in <workspace>/package.json
note: Version will be downloaded on first use.
```

## `vpt print-file package.json`

Node.js 固定会保留包清单结构

```
{
  "name": "command-env-unified",
  "private": true,
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "<version>",
      "onFail": "download"
    }
  }
}
```

## `vp env pin pnpm@10.18.0 --no-install`

限定的规范只固定包管理器

```
VITE+ - The Unified Toolchain for the Web

✓ Pinned package manager to pnpm@10.18.0
note: Package manager will be downloaded on first use.
```

## `vpt print-file package.json`

PM 固定会写入运行时声明旁边

```
{
  "name": "command-env-unified",
  "private": true,
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "<version>",
      "onFail": "download"
    },
    "packageManager": {
      "name": "pnpm",
      "version": "<version>",
      "onFail": "download"
    }
  }
}
```

## `vp env current --json`

当前 JSON 会公开并列的 Node.js 和包管理器对象

```
{
  "node": {
    "version": "22.0.0",
    "source": "devEngines.runtime",
    "source_path": "<workspace>/package.json",
    "project_root": "<workspace>",
    "bin_path": "<home>/.vite-plus/js_runtime/node/<version>/bin/node",
    "installed": false,
    "mode": "managed"
  },
  "package_manager": {
    "name": "pnpm",
    "version": "<version>",
    "source": "devEngines.packageManager",
    "source_path": "<workspace>/package.json",
    "project_root": "<workspace>",
    "bin_paths": {
      "pnpm": "<home>/.vite-plus/package_manager/pnpm/<version>/pnpm/bin/pnpm",
      "pnpx": "<home>/.vite-plus/package_manager/pnpm/<version>/pnpm/bin/pnpx"
    },
    "installed": false,
    "mode": "managed"
  }
}
```

## `vp env list --json`

不带参数的列表 JSON 包含 Node.js 和每个 PM 系列

```
{
  "node": [],
  "package_managers": {
    "bun": [],
    "npm": [],
    "pnpm": [],
    "yarn": []
  }
}
```

## `vp env list node --json`

node 选择器会省略包管理器

```
{
  "node": []
}
```

## `vp env list pm --json`

pm 选择器会省略 Node.js

```
{
  "package_managers": {
    "bun": [],
    "npm": [],
    "pnpm": [],
    "yarn": []
  }
}
```

## `vp env unpin`

不带参数的取消固定会移除两个生效的项目固定

```
VITE+ - The Unified Toolchain for the Web

✓ Removed devEngines.runtime node entry from <workspace>/package.json
✓ Removed package-manager pin
```

## `vpt print-file package.json`

两个 devEngines 声明均已移除

```
{
  "name": "command-env-unified",
  "private": true,
  "devEngines": {}
}
```
