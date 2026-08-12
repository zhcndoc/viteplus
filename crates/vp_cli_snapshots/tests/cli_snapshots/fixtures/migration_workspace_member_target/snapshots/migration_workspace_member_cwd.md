# migration_workspace_member_cwd

## `vp migrate --no-interactive --no-agent --no-editor --no-hooks`

vp migrate 在更改文件之前拒绝 workspace 成员

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

Vite+ cannot migrate a workspace member. Run `vp migrate` from the workspace root at <workspace>.
```

## `vpt print-file ../../package.json`

workspace 根目录的 package.json 未更改

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

workspace 成员的 package.json 未更改

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

迁移未在 workspace 根目录创建任何包管理器文件

```
../../pnpm-workspace.yaml: missing
```
