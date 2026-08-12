# 命令行帮助信息。

## `vp -h`

显示帮助信息

```
VITE+ - Web 的统一工具链

用法：vp [COMMAND]

启动：
  create      从模板创建新项目
  migrate     将现有项目迁移到 Vite+
  config      配置钩子和代理集成
  hooks       管理 Git 钩子分发器
  staged      在暂存文件上运行代码检查工具
  install, i  安装所有依赖项，或在提供软件包名称时添加软件包
  env         管理 Node.js 版本

开发：
  dev          运行开发服务器
  check        运行格式化、代码检查和类型检查
  lint         检查代码
  fmt, format  格式化代码
  test         运行测试

执行：
  run    运行任务（也可作为独立的 `vpr` 使用）
  exec   执行本地 node_modules/.bin 中的命令
  node   运行 Node.js 脚本（`env exec node` 的简写）
  dlx    执行软件包二进制文件，而无需将其安装为依赖
  cache  管理任务缓存

构建：
  build    构建生产版本
  pack     构建库
  preview  预览生产构建

管理依赖：
  add                        将软件包添加到依赖项
  remove, rm, un, uninstall  从依赖项中移除软件包
  update, up                 将软件包更新到最新版本
  dedupe                     通过移除较旧版本来去重依赖
  outdated                   检查过时的软件包
  list, ls                   列出已安装的软件包
  why, explain               显示安装软件包的原因
  info, view, show           从注册表查看软件包信息
  link, ln                   链接软件包以进行本地开发
  unlink                     取消链接软件包
  rebuild                    重新构建原生模块
  pm                         将命令转发给软件包管理器

Maintain:
  toolchain  Show active Vite+ tools, versions, and relationships
  upgrade    Update vp itself to the latest version
  implode    Remove vp and all related data

文档：https://viteplus.dev/guide/

选项：
  -V, --version  显示版本
  -C <DIR>       在 <DIR> 中运行，就像 vp 是从该目录而非当前工作目录启动一样
  -h, --help     显示帮助信息
```

## `vp -V`

显示版本

```
VITE+ - Web 统一工具链

vp <版本>

本地 vite-plus：
  vite-plus  <版本>

工具：
  vite             <版本>
  rolldown         <版本>
  vitest           <版本>
  oxfmt            <版本>
  oxlint           <版本>
  oxlint-tsgolint  <版本>
  tsdown           <版本>

环境：
  包管理器         未找到
  Node.js          <版本>
```

## `vp install -h`

显示安装帮助信息

```
VITE+ - Web 的统一工具链

用法：vp install [选项] [软件包]... [-- <传递参数>...]

安装所有依赖项；如果提供了软件包名称，则添加这些软件包

参数：
  [PACKAGES]...           要添加的软件包（如果提供，则行为类似于 `vp add`）
  [PASS_THROUGH_ARGS]...  要传递给软件包管理器的其他参数

选项：
  -P, --prod                   不安装 devDependencies
  -D, --dev                    仅安装 devDependencies（install）/ 保存到 devDependencies（add）
  --no-optional                不安装 optionalDependencies
  --frozen-lockfile            如果锁文件需要更新则失败（CI 模式）
  --no-frozen-lockfile         允许更新锁文件（与 --frozen-lockfile 相反）
  --lockfile-only              仅更新锁文件，不执行安装
  --prefer-offline             可用时使用缓存的软件包
  --offline                    仅使用缓存中已有的软件包
  -f, --force                  强制重新安装所有依赖项
  --ignore-scripts             不运行生命周期脚本
  --no-lockfile                不读取或生成锁文件
  --fix-lockfile               修复损坏的锁文件条目（仅 pnpm 和 yarn@2+）
  --shamefully-hoist           创建扁平的 `node_modules`（仅 pnpm）
  --resolution-only            重新运行解析以分析对等依赖（仅 pnpm）
  --silent                     抑制输出（静默模式）
  --filter <PATTERN>           筛选 monorepo 中的软件包（可多次使用）
  -w, --workspace-root         仅在工作区根目录安装
  -E, --save-exact             保存精确版本（仅在添加软件包时）
  --save-peer                  保存到 peerDependencies（仅在添加软件包时）
  -O, --save-optional          保存到 optionalDependencies（仅在添加软件包时）
  --save-catalog               将新依赖项保存到默认目录（仅在添加软件包时）
  -g, --global                 全局安装（需要提供软件包名称）
  --node <NODE>                用于全局安装的 Node.js 版本（仅与 -g 一起使用）
  --concurrency <CONCURRENCY>  要并行运行的全局软件包安装数量（仅与 -g 一起使用）
  -h, --help                   显示帮助

文档：https://viteplus.dev/guide/install
```

## `vp add -h`

显示添加帮助信息

```
VITE+ - Web 的统一工具链

用法：vp add [选项] <软件包>... [-- <透传参数>...]

将软件包添加到依赖项

参数：
  <PACKAGES>...           要添加的软件包
  [PASS_THROUGH_ARGS]...  要传递给软件包管理器的其他参数

选项：
  -P, --save-prod                     保存到 `dependencies`（默认）
  -D, --save-dev                      保存到 `devDependencies`
  --save-peer                         保存到 `peerDependencies` 和 `devDependencies`
  -O, --save-optional                 保存到 `optionalDependencies`
  -E, --save-exact                     保存确切版本，而不是 semver 范围
  --save-catalog-name <CATALOG_NAME>  将新依赖项保存到指定的 catalog 名称
  --save-catalog                      将新依赖项保存到默认 catalog
  --allow-build <NAMES>               允许运行 postinstall 的软件包名称列表
  --filter <PATTERN>                  过滤 monorepo 中的软件包（可多次使用）
  -w, --workspace-root                添加到工作区根目录
  --workspace                         仅当软件包存在于工作区中时添加（pnpm 专用）
  -g, --global                        全局安装
  --node <NODE>                       用于全局安装的 Node.js 版本（仅与 -g 一起使用）
  --concurrency <CONCURRENCY>         并行执行的全局软件包安装数量（仅与 -g 一起使用）
  -h, --help                          打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp remove -h`

显示 remove 帮助信息

```
VITE+ - Web 的统一工具链

用法：vp remove [选项] <软件包>... [-- <透传参数>...]

从依赖项中移除软件包

参数：
  <软件包>...             要移除的软件包
  [透传参数]...           要传递给软件包管理器的其他参数

选项：
  -D, --save-dev        仅从 `devDependencies` 中移除（仅限 pnpm）
  -O, --save-optional   仅从 `optionalDependencies` 中移除（仅限 pnpm）
  -P, --save-prod       仅从 `dependencies` 中移除（仅限 pnpm）
  --filter <模式>       筛选 monorepo 中的软件包（可多次使用）
  -w, --workspace-root  从工作区根目录中移除
  -r, --recursive       从所有工作区软件包中递归移除
  -g, --global          移除全局软件包
  --dry-run             预览将要移除的内容，但不实际移除（仅与 -g 一起使用）
  -h, --help            打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp update -h`

显示更新帮助信息

```
VITE+ - Web 统一工具链

用法: vp update [OPTIONS] [PACKAGES]... [-- <PASS_THROUGH_ARGS>...]

将软件包更新到最新版本

参数:
  [PACKAGES]...           要更新的软件包（可选——省略时更新全部软件包）
  [PASS_THROUGH_ARGS]...  传递给软件包管理器的其他参数

选项:
  -L, --latest                 更新到最新版本（忽略 semver 范围）
  -g, --global                 更新全局软件包
  --concurrency <CONCURRENCY>  并行执行的全局软件包更新数量（仅与 -g 一起使用）
  --reinstall-node-mismatch    重新安装使用不同 Node.js 版本安装的最新全局软件包
  --ignore-node-mismatch       跳过使用不同 Node.js 版本安装的最新全局软件包
  -r, --recursive              在所有工作区软件包中递归更新
  --filter <PATTERN>           筛选 monorepo 中的软件包（可多次使用）
  -w, --workspace-root         包含工作区根目录
  -D, --dev                    仅更新 devDependencies
  -P, --prod                   仅更新 dependencies（生产依赖）
  -i, --interactive            交互模式
  --no-optional                不更新 optionalDependencies
  --no-save                    仅更新锁文件，不修改 package.json
  --workspace                  仅在工作区中存在软件包时更新（pnpm 特有）
  -h, --help                   打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp link -h`

显示链接帮助信息

```
VITE+ - Web 的统一工具链

用法：vp link [PACKAGE|DIR] [ARGS]...

链接用于本地开发的软件包

参数：
  [PACKAGE|DIR]  要链接的软件包名称或目录
  [ARGS]...      要传递给包管理器的参数

选项：
  -h, --help  打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp unlink -h`

显示解除链接帮助信息

```
VITE+ - 面向 Web 的统一工具链

用法：vp unlink [选项] [软件包|目录] [参数]...

解除软件包链接

参数：
  [软件包|目录]  要解除链接的软件包名称
  [参数]...      要传递给软件包管理器的参数

选项：
  -r, --recursive  在每个工作区软件包中解除链接
  -h, --help       显示帮助

文档：https://viteplus.dev/guide/install
```

## `vp dedupe -h`

显示 dedupe 帮助信息

```
VITE+ - Web 的统一工具链

用法：vp dedupe [选项] [-- <PASS_THROUGH_ARGS>...]

去重依赖项

参数：
  [PASS_THROUGH_ARGS]...  要传递给包管理器的其他参数

选项：
  --check     检查去重是否会产生更改
  -h, --help  打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp outdated -h`

显示过时依赖帮助信息

```
VITE+ - 面向 Web 的统一工具链

用法：vp outdated [OPTIONS] [PACKAGES]... [-- <PASS_THROUGH_ARGS>...]

检查过时的软件包

参数：
  [PACKAGES]...           要检查的软件包名称
  [PASS_THROUGH_ARGS]...  要传递给软件包管理器的其他参数

选项：
  --long                       显示扩展信息
  --format <FORMAT>            输出格式：table（默认）、list 或 json
  -r, --recursive              递归检查所有工作区
  --filter <PATTERN>           筛选 monorepo 中的软件包
  -w, --workspace-root         包含工作区根目录
  -P, --prod                   仅检查生产依赖和可选依赖
  -D, --dev                    仅检查开发依赖
  --no-optional                排除可选依赖
  --compatible                 仅显示兼容版本
  --sort-by <FIELD>            按字段对结果排序
  -g, --global                 检查全局安装的软件包
  --concurrency <CONCURRENCY>  并行执行的全局软件包检查数量（仅与 -g 一起使用）
  -h, --help                   显示帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp why -h`

显示 why 的帮助信息

```
VITE+ - 面向 Web 的统一工具链

用法：vp why [选项] <软件包>... [-- <透传参数>...]

显示安装某个软件包的原因

参数：
  <软件包>...             要检查的软件包
  [透传参数]...            要传递给软件包管理器的其他参数

选项：
  --json                   以 JSON 格式输出
  --long                   显示扩展信息
  --parseable              显示可解析的输出
  -r, --recursive          递归检查所有工作区
  --filter <模式>          筛选 monorepo 中的软件包
  -w, --workspace-root     在工作区根目录中检查
  -P, --prod               仅检查生产依赖
  -D, --dev                仅检查开发依赖
  --depth <深度>           限制树的深度
  --no-optional            排除可选依赖
  --exclude-peers          排除对等依赖
  --find-by <查找器名称>   使用 .pnpmfile.cjs 中定义的查找器函数
  -h, --help               显示帮助

文档：https://viteplus.dev/guide/install
```

## `vp info -h`

显示信息帮助消息

```
VITE+ - 面向 Web 的统一工具链

用法：vp info [选项] <软件包> [字段] [-- <透传参数>...]

查看注册表中的软件包信息

参数：
  <软件包>                带可选版本的软件包名称
  [字段]                  要查看的特定字段
  [透传参数]...           要传递给软件包管理器的其他参数

选项：
  --json      以 JSON 格式输出
  -h, --help  打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp pm -h`

显示 pm 帮助信息

```
VITE+ - Web 的统一工具链

用法：vp pm <COMMAND>

转发命令到包管理器

命令：
  ci                为 CI 环境干净安装依赖
  approve-builds    批准运行依赖项生命周期脚本（install/postinstall）
  prune             移除不必要的软件包
  patch             准备用于本地修补的软件包
  patch-commit      提交已准备好的软件包补丁
  pack              创建软件包的 tarball
  list              列出已安装的软件包 [别名：ls]
  view, info, show  从注册表查看软件包信息
  version           转发原生软件包版本命令
  publish           将软件包发布到注册表
  stage             暂存软件包以供发布（npm 暂存发布工作流）
  owner             管理软件包所有者 [别名：author]
  cache             管理软件包缓存
  config            管理软件包管理器配置 [别名：c]
  login             登录注册表 [别名：adduser]
  logout            从注册表退出登录
  whoami            显示当前登录用户
  token             管理身份验证令牌
  audit             执行安全审计
  dist-tag          管理分发标签
  deprecate         弃用软件包版本
  search            在注册表中搜索软件包
  rebuild           重建原生模块 [别名：rb]
  fund              显示已安装软件包的赞助信息
  ping              Ping 注册表

选项：
  -h, --help  打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp pm ci -h`

显示 pm ci 帮助信息

```
VITE+ - Web 的统一工具链

用法：vp pm ci [-- <PASS_THROUGH_ARGS>...]

为 CI 环境干净地安装依赖

参数：
  [PASS_THROUGH_ARGS]...  传递给包管理器的其他参数

选项：
  -h, --help  打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp env`

显示 env 帮助信息

```
VITE+ - Web 的统一工具链

用法：vp env [COMMAND]

管理 Node.js 版本

设置：
  setup  在 VP_HOME/bin 中创建或更新 shim
  on     启用托管模式 - shim 始终使用 vite-plus 托管的 Node.js
  off    启用系统优先模式 - shim 优先使用系统 Node.js，回退到托管版本
  print  输出用于为当前会话设置环境的 shell 片段

管理：
  default         设置或显示全局默认 Node.js 版本
  pin             在当前目录中固定 Node.js 版本
  unpin           移除当前目录中的 Node.js 版本固定（`pin --unpin` 的别名）
  use             为当前 shell 会话使用指定的 Node.js 版本
  install, i      安装 Node.js 版本
  uninstall, uni  卸载 Node.js 版本
  clean           移除未使用的托管运行时和包管理器缓存
  exec, run       使用指定的 Node.js 版本执行命令

检查：
  current                 显示当前环境信息
  doctor                  运行诊断并显示环境状态
  which                   显示将要执行的工具路径
  list, ls                列出本地已安装的 Node.js 版本
  list-remote, ls-remote  从注册表列出可用的 Node.js 版本

示例：
  设置：
    vp env setup                  # 为 node、npm、npx、corepack 创建 shim
    vp env on                     # 使用 vite-plus 托管的 Node.js
    vp env print                  # 输出当前会话的 shell 片段

  管理：
    vp env pin lts                # 固定到最新的 LTS 版本
    vp env install                # 从 .node-version / package.json / .nvmrc 安装版本
    vp env use 20                 # 为当前 shell 会话使用 Node.js 20
    vp env use --unset            # 移除会话覆盖设置
    vp env clean                  # 移除未使用的托管缓存

  检查：
    vp env current                # 显示当前解析出的环境
    vp env current --json         # 用于自动化的 JSON 输出
    vp env doctor                 # 检查环境配置
    vp env which node             # 显示将要使用的 node 二进制文件
    vp env list-remote --lts      # 仅列出 LTS 版本

  执行：
    vp env exec --node lts npm i  # 使用最新的 LTS 版本执行“npm i”
    vp env exec node -v           # shim 模式（自动解析版本）

相关命令：
  vp install -g <package>       # 全局安装包
  vp uninstall -g <package>     # 全局卸载包
  vp update -g [package]        # 更新全局包
  vp outdated -g [package]      # 列出过时的包
  vp list -g [package]          # 列出全局包

文档：https://viteplus.dev/guide/env
```

## `vp upgrade -h`

显示升级帮助信息

```
VITE+ - 面向 Web 的统一工具链

用法：vp upgrade [选项] [版本]

将 vp 自身更新到最新版本

参数：
  [VERSION]  目标版本（例如："0.2.0"）。默认为最新版本

选项：
  --tag <TAG>            要安装的 npm dist-tag（默认为："latest"，也可以是 "alpha"）[默认：latest]
  --check                检查更新但不安装
  --rollback             恢复到之前激活的版本
  --force                即使已经是目标版本也强制重新安装
  --silent               不显示输出
  --registry <REGISTRY>  自定义 npm registry URL
  -h, --help             显示帮助信息

文档：https://viteplus.dev/guide/upgrade
```
