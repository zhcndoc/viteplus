# command_upgrade_background_notice

前台命令会启动一个分离的更新检查，而不会等待它完成；之后的命令会在每个提示间隔内最多显示一次缓存的通知。

## `vp env list`

前台命令会启动分离的检查器，并在等待 registry I/O 之前返回


## `node -e '(async()=>{const fs=require('\''node:fs'\'');const path=require('\''node:path'\'');const file=path.join(process.env.VP_HOME,'\''cache'\'','\''upgrade-check.json'\'');const deadline=Date.now()+5000;for(;;){try{if(JSON.parse(fs.readFileSync(file,'\''utf8'\'')).status==='\''available'\'')return}catch{}if(Date.now()>=deadline)process.exit(1);await new Promise(resolve=>setTimeout(resolve,25))}})()'`


## `vpt grep-file $VP_HOME/cache/upgrade-check.json '"status":"available"'`


## `vp env list --json`

机器可读输出不会消耗待处理的通知。

## `vp env off`

下一个交互式命令会显示缓存的更新通知。

```
VITE+ - The Unified Toolchain for the Web

✓ Node.js and package-manager management set to system-first.

Selected commands and shims will now prefer system tools, falling back to managed tools.

Run `vp env on` to always use Vite+ managed tools.

vp update available: <version> → 999.0.0, run vp upgrade
```

## `vp env off`

记录通知时间戳后，后续命令将保持静默。

```
VITE+ - The Unified Toolchain for the Web

✓ Node.js and package-manager management set to system-first.

Selected commands and shims will now prefer system tools, falling back to managed tools.

Run `vp env on` to always use Vite+ managed tools.
```
