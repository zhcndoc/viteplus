# 更改透传环境配置

## `MY_ENV=1 vp run hello`

```
$ node -p process.env.MY_ENV
1
```

## `MY_ENV=2 vp run hello`

MY_ENV 是透传变量。应该命中第 1 步创建的缓存

```
$ node -p process.env.MY_ENV ◉ cache hit, replaying
1

---
vp run: cache hit, <duration> saved.
```

## `VITE_TASK_PASS_THROUGH_ENVS=MY_ENV,MY_ENV2 MY_ENV=2 vp run hello`

由于未跟踪的环境变量配置发生变化，缓存应失效

```
$ node -p process.env.MY_ENV ○ cache miss: untracked env config changed, executing
2
```
