# file_roundtrip

vpt 设置/断言辅助函数在不同平台上的行为完全一致。

## `vpt write-file notes/hello.txt '来自 vpt 的问候'`

```

## `vpt print-file notes/hello.txt`

```
来自 vpt 的问候
```

## `vpt stat-file notes/hello.txt missing.txt`

```
notes/hello.txt: 文件
missing.txt: 缺失
```

## `vpt list-dir notes`

```
hello.txt
```

## `vpt json-edit package.json scripts.build 'vp build'`

```
```

## `vpt 打印文件 package.json`

```
{
  "name": "vpt-selftest",
  "private": true,
  "scripts": {
    "build": "vp build"
  }
}
```

## `vpt touch-file created-by-touch.txt`

touch-file 创建缺失的文件

```
```

## `vpt stat-file created-by-touch.txt notes`

stat-file 报告条目类型：file、dir 或 missing

```
created-by-touch.txt: file
notes: dir
```

## `vpt rm -f never-existed.txt`

rm -f 会忽略不存在的目标

```
```

## `vpt cp created-by-touch.txt notes`

像真实的 cp 一样，复制到一个已存在的目录中

```
```

## `vpt list-dir 备注`

```
created-by-touch.txt
hello.txt
```

## `vpt list-dir notes/hello.txt`

对文件执行 list-dir 会打印路径，类似于 ls

```
notes/hello.txt
```

## `vpt chmod +x created-by-touch.txt`

符号 `+x` 可被接受（在 Windows 上无操作）

```
```

## `vpt pipe-stdin -- vpt read-stdin`

空的 pipe-stdin 数据表示空的 stdin，而不是一个单独的换行符

```
```

## `vpt pipe-stdin hello -- vpt read-stdin`

```
hello
```

## `vpt touch-file multi-a.txt multi-b.txt`

touch-file 会创建每个操作数

```
```

## `vpt stat-file multi-b.txt`

```
multi-b.txt: 文件
```

## `vpt mkdir 已存在的目录`

```
```

## `vpt cp -r notes existing-dir`

使用 `cp -r` 复制到现有目录时，会像真正的 `cp` 一样嵌套

```
```

## `vpt list-dir existing-dir/notes`

```
created-by-touch.txt
hello.txt
```

## `vpt grep-file notes/hello.txt 'from vpt'`

grep-file 在匹配时成功

```
notes/hello.txt: 找到 "from vpt"
```

## `vpt grep-file notes/hello.txt '缺失的文本'`

grep-file 在模式不存在时的行为与 grep 一样

**退出代码：** 1

```
notes/hello.txt: 缺失 "缺失的文本"
未找到匹配模式
```

## `vpt print-file no-such-file.txt`

print-file 在缺少操作数时会像 cat 一样失败

**退出码：** 1

```
no-such-file.txt: 未找到
缺少文件
```

## `vpt exit 3`

非零退出码会记录在快照中。

**退出码：** 3

```
```
