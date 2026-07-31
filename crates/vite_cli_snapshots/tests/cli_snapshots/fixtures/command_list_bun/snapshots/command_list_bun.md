# command_list_bun

## `vp install`

应首先安装软件包

```
VITE+ - Web 的统一工具链

bun install <version> (af24e281)

 test-vite-plus-package@1.0.0
 test-vite-plus-package-optional@1.0.0
 testnpm2@1.0.1

已安装 3 个软件包 [<duration>]
```

## `vp pm list --help`

应显示帮助

```
VITE+ - Web 的统一工具链

用法：vp pm list [选项] [模式] [-- <透传参数>...]

列出已安装的软件包

参数：
  [PATTERN]               用于筛选的软件包模式
  [PASS_THROUGH_ARGS]...  其他参数

选项：
  --depth <DEPTH>          依赖树的最大深度
  --json                   以 JSON 格式输出
  --long                   显示扩展信息
  --parseable              可解析的输出格式
  -P, --prod               仅显示生产依赖
  -D, --dev                仅显示开发依赖
  --no-optional            排除可选依赖
  --exclude-peers          排除对等依赖
  --only-projects          仅显示项目软件包
  --find-by <FINDER_NAME>  使用查找器函数
  -r, --recursive          列出所有工作区中的软件包
  --filter <PATTERN>       筛选 monorepo 中的软件包
  -g, --global             列出全局软件包
  -h, --help               显示帮助

文档：https://viteplus.dev/guide/install
```

## `vp pm list`

应列出已安装的软件包

```
<workspace> node_modules (3)
├── test-vite-plus-package@1.0.0
├── test-vite-plus-package-optional@1.0.0
└── testnpm2@1.0.1
```
