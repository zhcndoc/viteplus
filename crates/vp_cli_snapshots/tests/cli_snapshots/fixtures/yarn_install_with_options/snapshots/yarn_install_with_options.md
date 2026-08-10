# 使用选项安装 yarn

## `vp install --help`

打印帮助信息

```
安装所有依赖项；如果提供了包名称，则添加这些包

用法：vp install [OPTIONS] [PACKAGES]... [-- <PASS_THROUGH_ARGS>...]

参数：
  [PACKAGES]...           要添加的包（如果提供，则行为类似于 `vp add`）
  [PASS_THROUGH_ARGS]...  要传递给包管理器的其他参数

选项：
  -P, --prod                       不安装 devDependencies
  -D, --dev                        仅安装 devDependencies（install）/ 保存到 devDependencies（add）
      --no-optional                不安装 optionalDependencies
      --frozen-lockfile            如果锁文件需要更新则失败（CI 模式）
      --no-frozen-lockfile         允许更新锁文件（与 --frozen-lockfile 相反）
      --lockfile-only              仅更新锁文件，不安装
      --prefer-offline             可用时使用缓存中的包
      --offline                    仅使用缓存中已有的包
  -f, --force                      强制重新安装所有依赖项
      --ignore-scripts             不运行生命周期脚本
      --no-lockfile                不读取或生成锁文件
      --fix-lockfile               修复损坏的锁文件条目（仅适用于 pnpm 和 yarn@2+）
      --shamefully-hoist           创建扁平的 `node_modules`（仅适用于 pnpm）
      --resolution-only            重新运行解析以分析对等依赖（仅适用于 pnpm）
      --silent                     抑制输出（静默模式）
      --filter <PATTERN>           过滤 monorepo 中的包（可多次使用）
  -w, --workspace-root             仅在工作区根目录中安装
  -E, --save-exact                 保存精确版本（仅在添加包时）
      --save-peer                  保存到 peerDependencies（仅在添加包时）
  -O, --save-optional              保存到 optionalDependencies（仅在添加包时）
      --save-catalog               将新依赖项保存到默认目录（仅在添加包时）
  -g, --global                     全局安装（需要提供包名称）
      --node <NODE>                用于全局安装的 Node.js 版本（仅与 -g 一起使用）
      --concurrency <CONCURRENCY>  要并行运行的全局包安装数量（仅与 -g 一起使用）
  -h, --help                       打印帮助信息
```

## `vp run install`

```
$ vp install --prod ⊘ 缓存已禁用
yarn install <version>
信息 未找到锁定文件。
[1/4] 正在解析软件包...
[2/4] 正在获取软件包...
[3/4] 正在链接依赖项...
[4/4] 正在构建新软件包...

成功保存锁定文件。

耗时 <duration>。
```

## `vpt list-dir node_modules`

```
tslib
```

## `vp run install`

再次安装命中缓存

```
$ vp install --prod ⊘ cache disabled
yarn install <version>
[1/4] Resolving packages...
success Already up-to-date.

Done in <duration>.
```
