# command_env_fish_setup

## `VP_HOME=${workspace}/vp "$project\with spaces" vp env setup --refresh`


## `vpt cp assert_setup.fish 'vp "$project\with spaces"/assert_setup.fish'`


## `cd 'vp "$project\with spaces"' && EXPECTED_VP_HOME=${workspace} PATH=${workspace}/bin:${workspace}/bin:${PATH} fish --no-config assert_setup.fish`

加载生成的 env.fish，并验证 Fish 路径设置和命令透传

```
Fish environment setup checks passed
```
