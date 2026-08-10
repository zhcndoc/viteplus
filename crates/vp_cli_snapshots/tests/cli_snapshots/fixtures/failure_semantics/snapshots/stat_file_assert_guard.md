# stat_file_assert_guard

`test -f x && cmd` 迁移为一个 stat-file --assert guard：在不匹配时，guard 失败，受保护的命令会跳过到行边界，完全符合 shell 的短路行为。

## `vpt 写入文件 marker-present.txt here`

```
```

## `vpt stat-file marker-absent.txt --assert file`

对缺失标记的保护失败

**退出码：** 1

```
marker-absent.txt: 缺失
stat-file 断言失败
```

*(跳过 1 个步骤到下一个行边界：步骤失败)*

## `vpt stat-file marker-present.txt --assert file`

对现有标记的检查通过

```
marker-present.txt: file
```

## `vpt print '受保护的，运行'`

```
guarded, runs
```
