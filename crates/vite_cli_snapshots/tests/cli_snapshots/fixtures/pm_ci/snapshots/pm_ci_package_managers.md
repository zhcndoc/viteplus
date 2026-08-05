# pm_ci_package_managers

涵盖对每个受支持包管理器的 `vp pm ci` 命令委托。
模拟的受管理包管理器安装位于 VP_HOME 下，因此该测试用例会记录 Vite+ 委托的确切 argv，而不会访问网络或真实的安装程序。

## `node scripts/setup-fake-pms.cjs`


## `vpt json-edit package.json packageManager pnpm@11.0.0`


## `vp pm ci`

pnpm 使用冻结锁文件安装

```
pnpm install --frozen-lockfile
```

## `vpt json-edit package.json packageManager npm@10.5.0`


## `vp pm ci`

由于 npm 没有冻结锁文件安装标志，npm 保留了原生的 ci 委托功能

```
npm ci
```

## `vpt json-edit package.json packageManager yarn@1.22.22`


## `vp pm ci`

Yarn Classic 使用冻结锁定文件安装

```
yarn install --frozen-lockfile
```

## `vpt json-edit package.json packageManager yarn@4.0.0`


## `vp pm ci`

Yarn Berry 使用不可变安装

```
yarn install --immutable
```

## `vpt json-edit package.json packageManager bun@1.2.0`


## `vp pm ci`

Bun 使用冻结锁文件安装

```
bun install --frozen-lockfile
```
