# default_package_missing

defaultPackage 指向不存在的目录时，会在进行任何工作区查找之前报错。

## `cd missing && vp build`

**退出代码：** 1

```
error: defaultPackage points to a missing directory: ./packages/nope
```
