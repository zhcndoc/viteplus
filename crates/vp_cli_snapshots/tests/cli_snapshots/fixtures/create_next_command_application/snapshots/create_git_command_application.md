# create_git_command_application

## `vp create vite:application --no-interactive --git`

独立的 create：Git 命令不得更改当前目录

```

Using default package name: vite-plus-application
◇ Scaffolded vite-plus-application with Vite application
• Node <version>  pnpm <version>
→ Git (optional): git -C vite-plus-application add -A && git -C vite-plus-application commit -m "chore: initial commit"
→ Next: cd vite-plus-application && vp run
```

## `vpt stat-file vite-plus-application/.git --assert dir`

Git 仓库已初始化

```
vite-plus-application/.git: dir
```
