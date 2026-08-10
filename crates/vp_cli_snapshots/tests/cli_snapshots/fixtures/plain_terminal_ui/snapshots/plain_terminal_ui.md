# plain_terminal_ui

## `FOO=1 vp run hello`

```
$ node hello.mjs
input_content 1
```

## `FOO=1 vp run hello`

命中缓存

```
$ node hello.mjs ◉ 命中缓存，正在重放
input_content 1

---
vp run: 命中缓存，已节省 <duration>。
```

## `FOO=2 vp run hello`

环境已更改

```
$ node hello.mjs ○ cache miss: env 'FOO' changed, executing
input_content 2
```

## `FOO=2 BAR=1 vp run hello`

已添加环境变量

```
$ node hello.mjs ○ cache miss: env 'BAR' changed, executing
input_content 2
```

## `vp run hello`

环境变量已移除

```
$ node hello.mjs ○ cache miss: envs 'BAR', 'FOO' changed, executing
input_content undefined
```

## `vpt write-file input.txt 'bar
'`

```
```

## `vp run hello`

输入已更改

```
$ node hello.mjs ○ cache miss: 'input.txt' modified, executing
bar undefined
```

## `VITE_TASK_PASS_THROUGH_ENVS=PTE vp run hello`

未跟踪的环境变量已更改

```
$ node hello.mjs ○ 缓存未命中：未跟踪的环境变量配置已更改，正在执行
bar undefined
```

## `VITE_TASK_PASS_THROUGH_ENVS=PTE VITE_TASK_CWD=subfolder vp run hello`

工作目录已更改

```
~/subfolder$ node hello.mjs ○ cache miss: working directory changed, executing
hello from subfolder
```
