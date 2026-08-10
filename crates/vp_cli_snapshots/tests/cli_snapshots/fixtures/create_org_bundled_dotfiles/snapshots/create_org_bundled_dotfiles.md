# 创建_org_捆绑的点文件

## `vp create @your-org:demo --no-interactive --directory my-demo-app`

捆绑模板，包含 _gitignore/_npmrc

```
◇ 已搭建 my-demo-app
• Node <version>  pnpm <version>
→ 下一步：cd my-demo-app && vp run
```

## `vpt list-dir my-demo-app --all`

验证 `_gitignore`/_npmrc 已重命名，且不再保留以下划线开头的变体

```
.gitignore
.npmrc
.vite-hooks
AGENTS.md
package.json
pnpm-workspace.yaml
src
vite.config.ts
```

## `vpt print-file my-demo-app/.gitignore`

验证 _gitignore_ 内容已被保留

```
node_modules
dist
```

## `vpt print-file my-demo-app/.npmrc`

验证 _npmrc_ 内容已被保留

```
auto-install-peers=true
```
