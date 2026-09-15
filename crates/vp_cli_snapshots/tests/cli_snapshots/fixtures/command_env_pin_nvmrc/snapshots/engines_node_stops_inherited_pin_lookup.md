# engines_node_stops_inherited_pin_lookup

## `vpt mkdir -p middle/leaf`


## `vpt write-file middle/package.json '{"engines":{"node":"22.13.0"}}
'`


## `cd middle/leaf && vp env pin`

更近的 engines.node 会阻止继承根目录的 .nvmrc

```
VITE+ - The Unified Toolchain for the Web

No version pinned.
  Node.js constraint: 22.13.0 from <workspace>/middle/package.json (engines.node)

No package manager pinned.
```

## `cd middle/leaf && vp env current node --json`

```
{
  "node": {
    "version": "22.13.0",
    "source": "engines.node",
    "source_path": "<workspace>/middle/package.json",
    "project_root": "<workspace>/middle",
    "bin_path": "<home>/.vite-plus/js_runtime/node/<version>/bin/node",
    "installed": false,
    "mode": "managed"
  }
}
```

## `cd middle && vp env pin`

当前工作目录中的约束也会阻止报告祖先目录中的固定版本

```
VITE+ - The Unified Toolchain for the Web

No version pinned.
  Node.js constraint: 22.13.0 from <workspace>/middle/package.json (engines.node)

No package manager pinned.
```

## `cd middle && vp env current node --json`

```
{
  "node": {
    "version": "22.13.0",
    "source": "engines.node",
    "source_path": "<workspace>/middle/package.json",
    "project_root": "<workspace>/middle",
    "bin_path": "<home>/.vite-plus/js_runtime/node/<version>/bin/node",
    "installed": false,
    "mode": "managed"
  }
}
```

## `vpt print-file .nvmrc middle/package.json`

```
# Node for local tools and CI
<version> # keep this comment
{"engines":{"node":"22.13.0"}}
```
