# command_publish_pnpm11

## `vp pm publish --help`

应显示帮助信息

```
VITE+ - Web 的统一工具链

用法: vp pm publish [选项] [压缩包|文件夹] [-- <传递参数>...]

将软件包发布到注册表

参数:
  [压缩包|文件夹]        要发布的压缩包或文件夹
  [传递参数]...           其他参数

选项:
  --dry-run                  预览但不发布
  --tag <标签>               发布标签
  --access <访问权限>       访问级别（公开/受限）
  --otp <一次性密码>         用于身份验证的一次性密码
  --no-git-checks            跳过 Git 检查
  --publish-branch <分支>    设置要从中发布的分支名称
  --report-summary           保存发布摘要
  --provenance               使用来源证明发布
  --force                    强制发布
  --json                     以 JSON 格式输出
  -r, --recursive            发布所有工作区软件包
  --filter <模式>            筛选单仓库中的软件包
  -h, --help                 显示帮助

文档：https://viteplus.dev/guide/install
```

## `vp pm publish --dry-run -- --loglevel error`

应预览发布过程而不实际发布（使用 pnpm publish --dry-run）

```
```
