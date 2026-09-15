# command_env_install_no_node_with_package_manager

Node.js 和包管理器的安装是彼此独立的组件：缺少 Node.js 版本固定不得跳过已声明的包管理器

## `vpt write-file $VP_HOME/package_manager/pnpm/10.18.0/pnpm/bin/pnpm '#'\!'/bin/sh
'`


## `vpt write-file $VP_HOME/package_manager/pnpm/10.18.0/pnpm/bin/pnpx '#'\!'/bin/sh
'`


## `node assert-package-manager-installed.cjs`

即使未固定 Node.js 版本，直接安装仍会安装已声明的包管理器

```
installed the declared package manager after reporting the missing Node.js pin
```
