# command_config_custom_dir_hook_path

## `git init`


## `vp config --no-agent --hooks-dir .config/husky`


## `vpt mkdir -p node_modules/.bin`


## `vpt write-file node_modules/.bin/test-hook-cmd '#'\!'/usr/bin/env sh
echo hook-path-ok > hook-output.txt'`

钩子命令会记录一个标记文件（标准输出中的 echo 内容会与包含 git 提交哈希的输出交错显示）


## `vpt chmod +x node_modules/.bin/test-hook-cmd`


## `vpt mkdir -p .config/husky`


## `vpt write-file .config/husky/pre-commit 'test-hook-cmd
'`


## `vpt write-file file.txt 'test
'`


## `git add file.txt`


## `git commit -m test`

提交输出包含一个非确定性的哈希值；下面的钩子标记就是断言


## `vpt print-file hook-output.txt`

hook 通过 PATH 找到了 test-hook-cmd

```
hook-path-ok
```
