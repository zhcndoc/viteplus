# cwd_flag_pwd_env_exec

`vp -C <dir> env exec <tool>` 必须让生成的工具获得与
`cd <dir> && vp env exec <tool>` 相同的 PWD。布尔值使断言路径和
脱敏无关。

## `vp -C packages/hello env exec node -e 'console.log('\''PWD matches cwd: '\'' + (process.env.PWD === process.cwd()))'`

-C 形式：直接执行的子进程应看到已同步到目标路径的 PWD

```
PWD matches cwd: true
```

## `cd packages/hello && vp env exec node -e 'console.log('\''PWD matches cwd: '\'' + (process.env.PWD === process.cwd()))'`

等效的 cd 形式（基线：true）

```
PWD matches cwd: true
```
