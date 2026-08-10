# command_env_nushell

## `VP_HOME=${workspace}/vp "home\with spaces" vp env setup --refresh`


## `vpt cp assert.nu 'vp "home\with spaces"/assert.nu'`


## `cd 'vp "home\with spaces"' && EXPECTED_VP_HOME=${workspace} PATH=${workspace}/bin:${workspace}/bin:${PATH} nu assert.nu`

加载生成的 env.nu 并验证 Nushell 包装器

```
正在使用 Node.js <version>（根据 20.18.0 解析）
已恢复基于文件的 Node.js 版本解析
Nushell 环境检查通过
```
