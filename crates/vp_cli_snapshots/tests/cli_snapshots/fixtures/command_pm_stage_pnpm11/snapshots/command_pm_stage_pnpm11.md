# command_pm_stage_pnpm11

## `vp pm stage --help`

应列出分阶段发布子命令

```
VITE+ - Web 的统一工具链

用法：vp pm stage <COMMAND>

为发布暂存软件包（npm 分阶段发布工作流）

命令：
  publish   将软件包暂存以供发布（无需双重身份验证）
  list      列出暂存版本 [别名：ls]
  view      显示暂存版本的详细信息
  download  下载暂存的 tarball 以供检查
  approve   将暂存版本提升至正式注册表（需要双重身份验证）
  reject    丢弃暂存版本（需要双重身份验证）

选项：
  -h, --help  打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp pm stage publish --help`

应显示 stage publish 选项

```
VITE+ - Web 的统一工具链

用法：vp pm stage publish [OPTIONS] [TARBALL|FOLDER] [-- <PASS_THROUGH_ARGS>...]

暂存要发布的软件包（无需双重身份验证）

参数：
  [TARBALL|FOLDER]        要暂存的压缩包或文件夹
  [PASS_THROUGH_ARGS]...  其他参数

选项：
  --tag <TAG>         发布标签
  --access <ACCESS>   访问级别（public/restricted）
  --otp <OTP>         用于身份验证的一次性密码
  --dry-run           预览但不执行暂存
  --json              以 JSON 格式输出
  -r, --recursive     暂存所有可发布的工作区软件包
  --filter <PATTERN>  筛选 monorepo 中的软件包
  --provenance        暂存时附带来源证明
  --registry <URL>    注册表 URL
  -h, --help          显示帮助

文档：https://viteplus.dev/guide/install
```

## `vp pm stage approve --help`

应显示 stage approve 选项

```
VITE+ - Web 的统一工具链

用法: vp pm stage approve [选项] <STAGE_ID> [-- <PASS_THROUGH_ARGS>...]

将暂存版本提升至线上注册表（需要双因素身份验证）

参数:
  <STAGE_ID>              暂存 ID
  [PASS_THROUGH_ARGS]...  其他参数

选项:
  --otp <OTP>       用于身份验证的一次性密码
  --registry <URL>  注册表 URL
  -h, --help        打印帮助信息

文档：https://viteplus.dev/guide/install
```
