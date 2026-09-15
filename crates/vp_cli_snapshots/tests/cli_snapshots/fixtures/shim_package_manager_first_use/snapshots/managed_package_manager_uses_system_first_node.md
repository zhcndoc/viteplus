# managed_package_manager_uses_system_first_node

托管包管理器仍必须接收由 Node 模式选择的系统 Node.js

## `vpt write-file package.json '{"name":"managed-package-manager","private":true,"packageManager":"pnpm@10.18.0"}
'`


## `vpt write-file $VP_HOME/package_manager/pnpm/10.18.0/pnpm/bin/pnpm '#'\!'/bin/sh
node --version
'`


## `vpt write-file $VP_HOME/package_manager/pnpm/10.18.0/pnpm/bin/pnpx '#'\!'/bin/sh
node --version
'`


## `vpt chmod +x $VP_HOME/package_manager/pnpm/10.18.0/pnpm/bin/pnpm`


## `vpt chmod +x $VP_HOME/package_manager/pnpm/10.18.0/pnpm/bin/pnpx`


## `vpt chmod +x system-dispatch-bin/node`


## `vp env off node`


## `vp env on pnpm`


## `PATH=${VP_HOME}/bin${PATH_SEPARATOR}${workspace}/system-dispatch-bin${PATH_SEPARATOR}${PATH} VP_NODE_DIST_MIRROR=http://127.0.0.1:9 pnpm --version`

托管包管理器接收系统优先的 Node.js，而无需解析托管运行时

```
system-node
```

## `PATH=${VP_HOME}/bin${PATH_SEPARATOR}${workspace}/system-dispatch-bin${PATH_SEPARATOR}${PATH} VP_NODE_DIST_MIRROR=http://127.0.0.1:9 vp env print node`

Node 环境打印使用系统运行时，而无需解析托管运行时

```
VITE+ - Web 的统一工具链

# Add to your shell to use this environment for this session:
export PATH="<workspace>/system-dispatch-bin:$PATH"
```
