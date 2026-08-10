# 从 bun monorepo 子目录创建

## `cd apps/website && vp create --no-interactive vite:generator`

从工作区子目录中使用对象形式的 workspaces


## `vpt stat-file tools/vite-plus-generator/package.json --assert file`

创建于 tools/vite-plus-generator

```
tools/vite-plus-generator/package.json: file
```

## `vpt stat-file apps/website/tools/vite-plus-generator/package.json --assert-not file`

未在 apps/website/ 内创建

```
apps/website/tools/vite-plus-generator/package.json: 缺失
```

## `cd apps && vp create --no-interactive vite:application`

来自工作区父目录


## `vpt stat-file apps/vite-plus-application/package.json --assert file`

创建于 apps/vite-plus-application

```
apps/vite-plus-application/package.json: file
```

## `cd scripts/helper && vp create --no-interactive vite:library`

从非工作区目录


## `vpt stat-file packages/vite-plus-library/package.json --assert file`

创建于 packages/vite-plus-library

```
packages/vite-plus-library/package.json: 文件
```

## `vpt print-file package.json`

验证工作区更新后 `workspaces` 对象形式保持不变

```
{
  "name": "test-bun-monorepo",
  "version": "0.0.0",
  "private": true,
  "workspaces": {
    "packages": [
      "apps/*",
      "packages/*",
      "tools/*"
    ],
    "catalog": {
      "vite": "npm:@voidzero-dev/vite-plus-core@latest",
      "vitest": "^4.0.0",
      "vite-plus": "latest"
    }
  },
  "packageManager": "bun@1.3.11"
}
```
