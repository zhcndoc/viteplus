# create_git_command_application_with_special_directories

## `vp create vite:application --no-interactive --git --directory 'examples with spaces/my-app'`

引用包含空格的嵌套目标目录

```
◇ Scaffolded examples with spaces/my-app with Vite application
• Node <version>  pnpm <version>
→ Git (optional): git -C "examples with spaces/my-app" add -A && git -C "examples with spaces/my-app" commit -m "chore: initial commit"
→ Next: cd "examples with spaces/my-app" && vp run
```

## `vpt stat-file 'examples with spaces/my-app/.git' --assert dir`

已在包含空格的目标目录中初始化 Git 仓库

```
examples with spaces/my-app/.git: dir
```

## `vp create vite:application --no-interactive --git --directory examples;tools/my-app`

引用包含 shell 元字符的嵌套目标目录

```
◇ Scaffolded examples;tools/my-app with Vite application
• Node <version>  pnpm <version>
→ Git (optional): git -C "examples;tools/my-app" add -A && git -C "examples;tools/my-app" commit -m "chore: initial commit"
→ Next: cd "examples;tools/my-app" && vp run
```

## `vpt stat-file examples;tools/my-app/.git --assert dir`

已在包含 shell 元字符的目标目录中初始化 Git 仓库

```
examples;tools/my-app/.git: dir
```

## `vp create vite:application --no-interactive --git --directory 示例/my-app`

引用包含中文字符的嵌套目标目录

```
◇ Scaffolded 示例/my-app with Vite application
• Node <version>  pnpm <version>
→ Git (optional): git -C "示例/my-app" add -A && git -C "示例/my-app" commit -m "chore: initial commit"
→ Next: cd "示例/my-app" && vp run
```

## `vpt stat-file 示例/my-app/.git --assert dir`

已在包含中文字符的目标目录中初始化 Git 仓库

```
示例/my-app/.git: dir
```

## `vp create vite:application --no-interactive --git --directory サンプル/my-app`

引用包含日文字符的嵌套目标目录

```
◇ Scaffolded サンプル/my-app with Vite application
• Node <version>  pnpm <version>
→ Git (optional): git -C "サンプル/my-app" add -A && git -C "サンプル/my-app" commit -m "chore: initial commit"
→ Next: cd "サンプル/my-app" && vp run
```

## `vpt stat-file サンプル/my-app/.git --assert dir`

已在包含日文字符的目标目录中初始化 Git 仓库

```
サンプル/my-app/.git: dir
```
