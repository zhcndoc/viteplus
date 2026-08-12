# migration_workspace_member_explicit_path

## `vp migrate . --no-interactive --no-agent --no-editor --no-hooks`

vp migrate 在修改文件之前拒绝显式指定工作区成员目标

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

Vite+ cannot migrate a workspace member. Run `vp migrate` from the workspace root at <workspace>.
```

## `vpt print-file ../../package.json`

工作区根目录的 package.json 未发生变化

```
{
  "name": "workspace-root",
  "private": true,
  "workspaces": [
    "vendor/*"
  ]
}
```

## `vpt print-file package.json`

工作区成员的 package.json 未发生变化

```
{
  "name": "workspace-member",
  "private": true,
  "devDependencies": {
    "vitest": "<version>"
  }
}
```

## `vpt stat-file ../../pnpm-workspace.yaml --assert missing`

迁移未在工作区根目录创建任何包管理器文件

```
../../pnpm-workspace.yaml: missing
```
