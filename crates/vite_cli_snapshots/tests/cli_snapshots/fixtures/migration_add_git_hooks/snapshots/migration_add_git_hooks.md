# 迁移_添加_git_钩子

## `git init`


## `vp migrate --no-interactive`

迁移应添加 Git hooks 配置

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
• 已配置 Git hooks
```

## `vpt print-file package.json`

检查 package.json 是否包含 prepare 脚本和 lint-staged 配置

```
{
  "name": "migration-add-git-hooks",
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "<version>",
      "onFail": "download"
    }
  },
  "scripts": {
    "prepare": "vp config"
  }
}
```

## `vpt print-file pnpm-workspace.yaml`

检查 pnpm-workspace.yaml 是否包含 overrides 和 catalog

```
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
overrides:
  vite: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```

## `vpt print-file .vite-hooks/pre-commit`

检查 pre-commit 钩子

```
vp staged
```

## `vpt stat-file .vite-hooks/_ --assert dir`

hook shim 已存在（vp config 已运行）

```
.vite-hooks/_: dir
```

## `git config --local core.hooksPath`

应设置为 .vite-hooks/_

```
.vite-hooks/_
```

## `vpt print-file .vite-hooks/_/.gitignore`

内部 gitignore 应排除所有文件

```
*
```

## `vpt print-file .vite-hooks/_/h`

钩子分发脚本内容

```
#!/usr/bin/env sh
{ [ "$HUSKY" = "2" ] || [ "$VP_GIT_HOOKS" = "2" ] || [ "$VITE_GIT_HOOKS" = "2" ]; } && set -x
n=$(basename "$0")
s=$(dirname "$(dirname "$0")")/$n

[ ! -f "$s" ] && exit 0

i="${XDG_CONFIG_HOME:-$HOME/.config}/vite-plus/hooks-init.sh"
[ ! -f "$i" ] && i="${XDG_CONFIG_HOME:-$HOME/.config}/husky/init.sh"
[ -f "$i" ] && . "$i"

{ [ "${HUSKY-}" = "0" ] || [ "${VP_GIT_HOOKS-}" = "0" ] || [ "${VITE_GIT_HOOKS-}" = "0" ]; } && exit 0

d="$(dirname "$(dirname "$(dirname "$0")")")"
__vp_shell=/bin/sh
[ -x "$__vp_shell" ] || __vp_shell=$(command -v sh)

if [ -n "${VP_HOME-}" ]; then
  __vp_bin="$VP_HOME/bin"
elif [ -n "${HOME-}" ]; then
  __vp_bin="$HOME/.vite-plus/bin"
else
  __vp_bin=""
fi
[ -n "$__vp_bin" ] && [ -d "$__vp_bin" ] && export PATH="$PATH:$__vp_bin"

export PATH="$d/node_modules/.bin:$PATH"
"$__vp_shell" -e "$s" "$@"
c=$?

[ $c != 0 ] && echo "VITE+ - $n script failed (code $c)"
[ $c = 127 ] && echo "VITE+ - command not found in PATH=$PATH"
exit $c
```

## `vpt print-file .vite-hooks/_/pre-commit`

钩子脚本应加载分发器

```
#!/usr/bin/env sh
. "$(dirname "$0")/h"
```

## `vpt list-dir .vite-hooks/_`

列出所有生成的钩子垫片

```
applypatch-msg
commit-msg
h
post-applypatch
post-checkout
post-commit
post-merge
post-rewrite
pre-applypatch
pre-auto-gc
pre-commit
pre-merge-commit
pre-push
pre-rebase
prepare-commit-msg
```
