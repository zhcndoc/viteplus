# 测试受管理的包管理器路径

旧版案例通过 `sh -c` 构建了一个经过清理的 PATH（一个仅包含 `node` 的 mktemp 目录，加上
/bin:/usr/bin），以证明即使无法访问主机上的 pnpm，`vp test` 仍会将受管理的包管理器暴露给
测试进程（src/managed-pm-path.test.ts 运行 `pnpm --version` 并断言固定的
版本）。运行器的案例环境本身已经是隔离的：其 PATH 仅包含案例自有的 Vite+ 二进制目录以及系统
尾部路径，因此主机上的 pnpm 无法满足查找要求，该断言会端到端地验证受管理的路径。步骤级别的 PATH
覆盖会破坏 `vp` 自身的解析，因为 `vp` 遵循步骤的 PATH。

## `vp test --slowTestThreshold 10000`

无法访问宿主机上的 pnpm；vp test 仍会暴露受管理的 pnpm

```
VITE+ - The Unified Toolchain for the Web

 RUN  <version> <workspace>

 ✓ src/managed-pm-path.test.ts (1 test) <duration>
   ✓ direct test command exposes the configured package manager on PATH <duration>

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  <time>
   Duration  <duration> (transform <duration>, setup <duration>, import <duration>, tests <duration>, environment <duration>)
```
