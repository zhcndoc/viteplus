# 创建组织打包逃逸检查

## `vp create @your-org --no-interactive`

`../outside` 路径在 schema-validation 时被拒绝，发生在任何 tarball 获取之前

**退出代码：** 1

```
@your-org/create: createConfig.templates[0].template escapes the package root: ../outside
```
