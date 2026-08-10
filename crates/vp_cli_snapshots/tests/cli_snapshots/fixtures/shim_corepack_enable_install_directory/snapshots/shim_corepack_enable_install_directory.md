# shim_corepack_enable_install_directory

## `vpt mkdir -p home/js_runtime/node/22.18.0/bin`

包含虚假托管 Node 运行时布局的隔离 VP_HOME


## `vpt write-file .node-version '22.18.0
'`

项目 Node.js 版本


## `vpt write-file home/js_runtime/node/22.18.0/bin/node '#'\!'/bin/sh
echo fake-node
'`

伪造的 Node 二进制文件


## `vpt chmod +x home/js_runtime/node/22.18.0/bin/node`


## `vpt cp fake-corepack.sh home/js_runtime/node/22.18.0/bin/corepack`

会回显其参数的伪造捆绑 Corepack


## `vpt chmod +x home/js_runtime/node/22.18.0/bin/corepack`


## `VP_HOME=${workspace}/home vp env setup`

在隔离的主目录中创建垫片


## `VP_HOME=${workspace}/home PATH=${workspace}/home/bin:${PATH} corepack use pnpm@10`

非链接命令保持不变

```
corepack use pnpm@10
```

## `VP_HOME=${workspace}/home PATH=${workspace}/home/bin:${PATH} corepack enable --install-directory /tmp/custom-dir`

显式指定的 --install-directory 会被遵循，被覆盖的 npm shim 会被恢复

```
corepack enable --install-directory /tmp/custom-dir
warn: 'npm' is managed by Vite+ and was restored. Vite+ already resolves 'npm' per project, so corepack does not need to manage it.
```

## `VP_HOME=${workspace}/home PATH=${workspace}/home/bin:${PATH} corepack enable`

--install-directory 默认为 VP_HOME/bin

```
corepack enable --install-directory <root>/home/bin
warn: 'npm' is managed by Vite+ and was restored. Vite+ already resolves 'npm' per project, so corepack does not need to manage it.
```

## `vpt stat-file home/bin/npm --assert symlink`

Vite+ 拥有 npm shim

```
home/bin/npm: symlink
```
