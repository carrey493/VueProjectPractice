# Vue3 + TS 组件库搭建

## 一、搭建`monorepo`环境

搭建组件库的环境我们使用`monorepo`，使用`monorepo`可以在一个项目下管理多个仓库。

比如在编写组件时，可能有组件的文档、组件的测试等，这些都是独立的仓库，使用`monorepo`可以达到仓库的资源共享。我们也可以在一个仓库下管理多个仓库，完成发布与部署，包括我们每个组件也是可以单独发布与部署的。

>使用`pnpm`安装包速度快，磁盘空间利用率高，使用`pnpm`可以快速建立`monorepo`，SO~这里我们使用`pnpm workspace`来实现`monorepo`。

```shell
npm install pnpm -g # 全局安装pnpm
pnpm init # 初始化package.json 配置文件 私有库
pnpm install vue typescript -D # 全局下添加依赖
```

使用`pnpm` 必须要建立`.npmrc`文件，配置`shamefully-hoist = true`，否则安装的模块无法放置到`node_modules`目录下。

使用`npx tsc --init`或者`pnpm tsc --init`初始化`ts-config`文件。

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "dcclaration": false,
    "noImplicitAny": false,
    "removcComments": true,
    "moduleResolution": "node",
    "esHoduleInterop": true,
    "jsx": "preserve",
    "noLib": false,
    "target": "es6",
    "sourceNap": true,
    "lib": ["ESNext", "DOM"],
    "allowSyntheticDofaultImpoxts": true,
    "experimontalDecorators": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "strict": true,
    "skipLibcheck": true
  },
  "exclude": ["node_modules", "**/__tests__", "dist/**"]
}

```

![](https://img2024.cnblogs.com/blog/2332774/202402/2332774-20240225145859100-115275742.png)
