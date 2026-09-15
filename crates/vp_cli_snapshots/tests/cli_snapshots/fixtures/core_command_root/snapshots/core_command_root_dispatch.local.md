# core_command_root_dispatch

工作区声明了上游 Vite。只有目标应用声明了匹配的 core 别名。检查位置参数根目录、-C、defaultPackage 和任务调度。

## `vp install --ignore-scripts`


## `node check-layout.mjs`

```
Root Vite: vite
App Vite: @voidzero-dev/vite-plus-core
CLI Vite: @voidzero-dev/vite-plus-core
```

## `vp build packages/app`

```
✓ 2 modules transformed.
computing gzip size...
packages/app/dist/index.html  <size> kB │ gzip: <size> kB

✓ built in <duration>
```

## `vp build --mode production --emptyOutDir packages/app`

```
✓ 2 modules transformed.
computing gzip size...
packages/app/dist/index.html  <size> kB │ gzip: <size> kB

✓ built in <duration>
```

## `vp dev packages/app`

```

  VITE+ <version>

  ➜  Local:   http://127.0.0.1:<port>/
  ➜  press h + enter to show help
The target app served HTTP 200
```

## `vp preview --strictPort packages/app`

```
  ➜  Local:   http://127.0.0.1:<port>/
  ➜  press h + enter to show help
The target app served HTTP 200
```

## `vp -C packages/app build`

```
note: You are running `vp build` as a Vite+ built-in command. If you meant to run the build npm script, use `vpr build` instead.
✓ 2 modules transformed.
computing gzip size...
dist/index.html  <size> kB │ gzip: <size> kB

✓ built in <duration>
```

## `vp build`

```
note: vp build: using packages/app (defaultPackage in vite.config.ts)
✓ 2 modules transformed.
computing gzip size...
dist/index.html  <size> kB │ gzip: <size> kB

✓ built in <duration>
```

## `vp pack`

```
note: vp pack: using packages/app (defaultPackage in vite.config.ts)
ℹ entry: src/index.ts
ℹ Build start
ℹ Cleaning <n> files
ℹ dist/index.mjs  <size> kB │ gzip: <size> kB
ℹ 1 files, total: <size> kB
✔ Build complete in <duration>
```

## `vp run --filter app build`

```
~/packages/app$ vp build ⊘ cache disabled
✓ 2 modules transformed.
computing gzip size...
dist/index.html  <size> kB │ gzip: <size> kB

✓ built in <duration>
```

## `vp run --filter app pack`

```
~/packages/app$ vp pack ⊘ cache disabled
ℹ entry: src/index.ts
ℹ Build start
ℹ Cleaning <n> files
ℹ dist/index.mjs  <size> kB │ gzip: <size> kB
ℹ 1 files, total: <size> kB
✔ Build complete in <duration>
```

## `vp build .`

**退出代码：** 1

```
error: Failed to resolve vite command: GenericFailure, Expected @voidzero-dev/vite-plus-core@<version>, but found vite@8.2.2 at <workspace>/node_modules/.pnpm/vite@8.2.2/node_modules/vite/package.json. Run `vp migrate` to align the Vite alias, then run `vp install`.
```

## `vp -C . pack packages/app/src/index.ts`

**退出代码：** 1

```
error: Failed to resolve pack command: GenericFailure, Expected @voidzero-dev/vite-plus-core@<version>, but found vite@8.2.2 at <workspace>/node_modules/.pnpm/vite@8.2.2/node_modules/vite/package.json. Run `vp migrate` to align the Vite alias, then run `vp install`.
```
