# command_publish_yarn1

## `vp pm publish --help`

应显示帮助信息

```
VITE+ - Web 统一工具链

用法：vp pm publish [OPTIONS] [TARBALL|FOLDER] [-- <PASS_THROUGH_ARGS>...]

将软件包发布到注册表

参数：
  [TARBALL|FOLDER]        要发布的压缩包或文件夹
  [PASS_THROUGH_ARGS]...  其他参数

选项：
  --dry-run                  预览但不发布
  --tag <TAG>                发布标签
  --access <ACCESS>          访问级别（public/restricted）
  --otp <OTP>                用于身份验证的一次性密码
  --no-git-checks            跳过 Git 检查
  --publish-branch <BRANCH>  设置要发布的分支名称
  --report-summary           保存发布摘要
  --provenance               使用来源证明发布
  --force                    强制发布
  --json                     以 JSON 格式输出
  -r, --recursive            发布所有工作区软件包
  --filter <PATTERN>         筛选 monorepo 中的软件包
  -h, --help                 显示帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp pm publish --dry-run -- --loglevel error`

应预览发布而不实际发布（使用 npm publish --dry-run）

```
 command-publish-yarn1@1.0.0
```
