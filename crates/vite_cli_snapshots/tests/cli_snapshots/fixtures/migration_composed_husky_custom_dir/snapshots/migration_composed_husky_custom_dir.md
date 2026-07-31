# 迁移_组合式_Husky_自定义目录

## `git init`


## `vp migrate --no-interactive`

迁移应在组合的 prepare 中保留自定义 husky 目录

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
• 已配置 Git hooks
```

## `vpt print-file package.json`

prepare 应为 'vp config --hooks-dir .config/husky && npm run build'

```
{
  "name": "migration-composed-husky-custom-dir",
  "scripts": {
    "prepare": "npm run build && vp config --hooks-dir .config/husky"
  },
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

## `vpt print-file .config/husky/pre-commit`

pre-commit 钩子应该位于自定义目录中

```
vp staged
```

## `vpt print-file .config/husky/_/h`

钩子调度器应正确解析嵌套目录中的仓库根目录

```
#!/usr/bin/env sh
{ [ "$HUSKY" = "2" ] || [ "$VITE_GIT_HOOKS" = "2" ]; } && set -x
n=$(basename "$0")
s=$(dirname "$(dirname "$0")")/$n

[ ! -f "$s" ] && exit 0

i="${XDG_CONFIG_HOME:-$HOME/.config}/vite-plus/hooks-init.sh"
[ ! -f "$i" ] && i="${XDG_CONFIG_HOME:-$HOME/.config}/husky/init.sh"
[ -f "$i" ] && . "$i"

{ [ "${HUSKY-}" = "0" ] || [ "${VITE_GIT_HOOKS-}" = "0" ]; } && exit 0

d="$(dirname "$(dirname "$(dirname "$(dirname "$0")")")")"
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
