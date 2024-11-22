# virtual-list

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# Vue长列表虚拟滚动插件封装

## 虚拟滚动概述

### 场景引入

> 思考：类似于移动端加载新闻列表，需要怎样设计
> 
**根据用户行为，滑动下拉置底，使用Axios，按需请求分页数据，追加显示页面**

> 思考：如果，我们不断下拉访问，页面中有大量的数据时，用户会不会有不好的体验。
> 

> 案例：使用Vue构建一个页面，直接将10000条数据显示到页面上，体验效果。
>

![](https://img2022.cnblogs.com/blog/2332774/202211/2332774-20221123105720213-743275914.png)

![](https://img2022.cnblogs.com/blog/2332774/202211/2332774-20221123105802507-884261964.png)


**`ps:`通过Chrome浏览器性能分析工具Performance,监测分析页面前端性能数据**
- `FPS:`每秒帧数图表上的红色快表示长时间帧，很可能会出现卡顿；
- `CPU:`CPU消耗占用，实体图越多消耗越高；
- `NET:`网络请求效率
- 通过chrome浏览器内置的分析工具`Memory`,监测分析内存消耗情况。

>一个长列表Web页面，如果需要展示成千上万条数据，那么页面中就会有数万甚至数十万的HTML节点，会巨大的消耗浏览器性能，进而给用户造成非常不友好的体验。
>
- 页面等待时间极长，用户体验差。
- cpu计算能力不够，滑动会卡顿。
- GPU渲染能力不够，页面会跳屏。
- RAM内存容量不够，浏览器崩溃。

>
思考：前端如何优化这种`长列表`显示场景，才能符合比较好的实践标准呢？
>
1. 不把长列表数据一次性全部展示在页面上；
2. 截取长列表一部分数据用来填充屏幕容器区；
3. 长列表数据不可视部分使用空白占位符；
4. 监听滚动事件根据滚动位置动态改变可视列表；
5. 监听滚动事件根据滚动位置动态改变空白填充。

我们也把上述的优化行为简称为**虚拟滚动**

> 案例：同样使用Vue构建一个页面，使用虚拟滚动显示10000条数据，监听分析前端性能数据。
>

![](https://img2022.cnblogs.com/blog/2332774/202211/2332774-20221123105839307-1206398400.png)

![](https://img2022.cnblogs.com/blog/2332774/202211/2332774-20221123105906103-409062752.png)


**`ps:`通过Chrome浏览器性=元素查阅Elements，查看空白填充区域的动态变化效果。**

### 概念介绍

虚拟滚动，就是根据**容器可视区域**的**列表容积数量**，监听用户滑动或者滚动事件，动态截取**长列表数据**中的**部分数据**渲染到页面上，动态使用空白占位填充容器**上下滚动区域内容**，模拟实现**原生滚动效果**。

![](https://img2022.cnblogs.com/blog/2332774/202211/2332774-20221123104937720-1702928592.png)

### 过程安排

![](https://img2022.cnblogs.com/blog/2332774/202211/2332774-20221123110156929-1570473629.png)

## 基础案例准备

### 模拟获取数据接口

**使用 Express + Mockjs 模拟新闻类列表API接口**

[Express文档]('https://www.expressjs.com.cn/')

[Mockjs文档]('http://mockjs.com/')

新建mock文件夹，并执行`npm init -y`指令初始化项目后，安装`Express` + `Mockjs`。
```
npm install mockjs
npm i express
```

```js
//使用 Mock 构建本地服务器输出数据结果
const Mock = require('mockjs')
const express = require('express')
const app = express()
//根据传入的参数num,生成num条模拟的数据列表
function generatorList(num) {
    return Mock.mock({
        [`list|${num}`]: [{
            //模拟ID, 自增方式追加
            'id|+1': 1,
            //模拟标题,中文字符串15-25位
            title: '@ctitle(15,25)',
            //模拟图片索引, 自然数0-11
            image: '@natural(0,11)',
            //模拟访问人数, 自然数0-9999
            reads: '@natural(0,9999)',
            //模拟来源,中文字符串3-10位
            from: '@ctitle(3,10)',
            //模拟时间, 时间格式
            date: '@date(yyyy-MM-dd)'
        }]
    })
}

//允许跨域请求返回数据
app.all('*', function (req, res, next) {
    res.header('Access-control-Allow-Origin', '*')
    res.header('Access-control-Allow-Methods', 'PUT,GET,POST,DELETE,OPTIONS')
    res.header('Access-control-Allow-Headers', 'X-Requested-With')
    res.header('Access-control-Allow-Headers', 'Content-Type')
    next()
})

//截取路由并反馈数据
app.get('/data', function (req, res) {
    //获取get请求数据条数参数 num
    const { num } = req.query
    return res.send(generatorList(num))
})

const server = app.listen(4000, function () {
    console.log('本地MOCK服务器已启动：http://localhost:4000/data?num=请求列表数量');
})
console.log(server);
```
在mock文件夹路径下运行`node index.js`指令启动项目。

控制台输出`本地MOCK服务器已启动：http://localhost:4000/data?num=请求列表数量`即为项目运行成功。

浏览器输入http://localhost:4000/data?num=100即可看到返回的100条数据

![](https://img2022.cnblogs.com/blog/2332774/202211/2332774-20221123113214339-139259011.png)

可以在`https://www.json.cn/`中查看格式化数据后的内容。

### 基于Vue-Cli脚手架准备基础案例

![](https://img2022.cnblogs.com/blog/2332774/202211/2332774-20221123114112999-1505884557.png)

## 基础功能实现

### 使用Axios引入模拟数据

1. 安装axios
``` npm i axios```
2. 引入axios并挂载在Vue的原型上
```js
import axios from 'axios'
Vue.prototype.$axios = axios
```
3. 封装请求方法
```js
getMockData(num) {
      this.requestStaus = true
      this.msg = '加载中......'
      this.$axios
        .get("http://localhost:4000/data?num=" + num)
        .then((res) => {
          console.log(res.data.list);
          this.allDataList = res.data.list;
          this.requestStaus = false
        })
        .catch((err) => {
          console.log(err);
          this.msg = '网络出问题啦...'
        });
    },
```

### 计算滚动容器最大列表容积

根据滚动容器DOM元素`this.$refs.scrollContainer.innerHeight`和单条数据高度`oneHeight`,计算当前滚动容器最大列表容积数量`containSize`
>注意：当屏幕`resize`改变窗口，或或者`orientationchange`手机横竖屏切换时，滚动容器最大容积需要动态计算.

```js
<div class="scroll-container" ref="scrollContainer"></div>
data() {
    return {
      requestStaus: true,
      msg: "加载中......",
      oneHeight: 100,
      //容器的最大容积
      containSize: 0,
    };
mounted() {
    this.getConSize()
    window.onresize = this.getConSize
    window.orientationchange = this.getConSize
},
methods:{
    //计算 容器的最大容积
    getConSize() {
    this.conSize =
    ~~(this.$refs.scrollContainer.offsetHeight / this.oneHeight) + 2;
    console.log(this.conSize);
},
}

```

### 监听滚动事件动态截取数据

监听用户滚动、滑动事件，根据滚动位置，动态计算当前可视区域起始数据的索引位置`startIndex`，再根据`containSize`，计算结束数据的索引位置`endIndex`，最后根据`startIndex`与`endIndex`截取长列表所有数据`allDataList`中需显示的数据列表 `showDataList`.

```js
<div class="scroll-container" ref="scrollContainer" @scroll.passive="handleScroll"></div>
computed: {
    //容器最后一个元素的索引
    endIndex() {
      let endIndex = this.startIndex + this.containSize;
      if (!this.allDataList[endIndex]) {
        endIndex = this.allDataList.length - 1;
      }
      return endIndex;
    },
    //定义一个 待显示的数组列表元素
    showDataList(){
      return this.allDataList.slice(this.startIndex,this.endIndex)
    }
  },
```

### 使用计算属性动态设置上下空白占位
>思考:
>我们设置了根据容器滚动位移动态截取 ShowDataList 数据，现在我们滚动一下发现滚动2条列表数据后，就无法滚动了，这个原因是什么呢?
>
>在容器滚动过程中，因为动态移除、添加数据节点丢失，进而强制清除了顶部列表元素DOM节点，导致滚动条定位向上移位一个列表元素高度,进而出现了死循环
>
根据 `startIndex`和`endIndex` 的位置，使用计算属性，动态的计算并设置，上下空白填充的高度样式`blankFil1Style`，使用`padding` 或者`margin`进行空白占位都是可以的

```js
<div class="blank-fill" :style="blankFillStyle"></div>
//定义空白填充的样式
blankFillStyle() {
    return {
    paddingTop: this.startIndex * this.oneHeight + "px",
    paddingBottom:
        (this.allDataList.length - this.endIndex) * this.oneHeight + "px",
    };
},
```

>注意:
>
1. 填充样式必须以盒子包裹的方式包裹所有节点;
>
2. 使用计算属性来自动依赖输出blankFi1lstyle对象;
>
3. 在Vue中可以使用对象直接操作Stvle样式．但是要注意「驼峰式」的命名规则
>

## 完整功能实现

### 下拉置底自动请求加载数据

```js
async created() {
    let newList = await this.getNewsList(20);
    if (!newList) return;
    this.allDataList = newList;
},
methods: {
//定义滚动行为事件
async handleScroll() {
    console.log(
    this.$refs.scrollContainer.scrollTop,
    ~~(this.$refs.scrollContainer.scrollTop / this.oneHeight)
    );
    let currentIndex = ~~(this.$refs.scrollContainer.scrollTop / this.oneHeight);
    if(this.startIndex === currentIndex) return
    this.startIndex = currentIndex
    /* this.startIndex = ~~(
    this.$refs.scrollContainer.scrollTop / this.oneHeight
    ); */
    if (
    this.startIndex + this.containSize > this.allDataList.length - 1 &&
    !this.requestStaus
    ) {
    console.log("滚动到了屏幕底部");
    //追加请求新的数据
    let newList = await this.getNewsList(20);
    if (!newList) return;
    this.allDataList = [...this.allDataList, ...newList];
    }
},
},
};
```

### 滚动事件节流定时器优化

>思考:
监听滚动事件触发对应函数方法的频率是极高的，该如何做好页面节流优化呢?
>
```js
//定义滚动行为事件
    handleScroll() {
      if (this.scrollStatus) {
        this.scrollStatus = false;
        // 设置一个定时器，1秒钟以后，才允许进行下一次的scroll滚动事件行为
        let myTimer = setTimeout(() => {
          this.scrollStatus = true;
          clearTimeout(myTimer);
        }, 30);
        console.log(
          this.$refs.scrollContainer.scrollTop,
          ~~(this.$refs.scrollContainer.scrollTop / this.oneHeight)
        );
        this.setDataStartIndex();
      }
    },
    //执行数据设置的相关任务，滚动事件的具体行为
    async setDataStartIndex() {
      let currentIndex = ~~(
        this.$refs.scrollContainer.scrollTop / this.oneHeight
      );
      if (this.startIndex === currentIndex) return;
      this.startIndex = currentIndex;
      /* this.startIndex = ~~(
        this.$refs.scrollContainer.scrollTop / this.oneHeight
      ); */
      if (
        this.startIndex + this.containSize > this.allDataList.length - 1 &&
        !this.requestStaus
      ) {
        console.log("滚动到了屏幕底部");
        //追加请求新的数据
        let newList = await this.getNewsList(20);
        if (!newList) return;
        this.allDataList = [...this.allDataList, ...newList];
      }
    },
```

### 滚动事件节流请求动画帧优化

**[requestAnimationFrame介绍]('https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame')**

```js
      //兼容低版本浏览器

let requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
//浏览器防抖优化︰根据浏览器FPS采用递归方法，队列调用requestAnimationFrame方法实现优化
let fps = 30;
  let interval = 1000 / fps;
  let then = Date.now();
  requestAnimationFrame(() => {
    let now = Date.now;
    this.setDataStartIndex();
    then = now;
    if (now - then >= interval) {
      //递归
      requestAnimationFrame(arguments.callee);
    }
  });
```

### 设置上下滚动缓冲消除快速滚动白屏

```js
//容器最后一个元素的索引
endIndex() {
  let endIndex = this.startIndex + this.containSize * 2;
  if (!this.allDataList[endIndex]) {
    endIndex = this.allDataList.length - 1;
  }
  return endIndex;
},
//定义一个 待显示的数组列表元素
showDataList() {
  let startIndex = 0;
  if (this.startIndex <= this.containSize) {
    startIndex = 0;
  } else {
    startIndex = this.startIndex - this.containSize;
  }
  return this.allDataList.slice(startIndex, this.endIndex);
},
//定义空白填充的样式
blankFillStyle() {
  let startIndex = 0;
  if (this.startIndex <= this.containSize) {
    startIndex = 0;
  } else {
    startIndex = this.startIndex - this.containSize;
  }
  return {
    paddingTop: startIndex * this.oneHeight + "px",
    paddingBottom:
      (this.allDataList.length - this.endIndex) * this.oneHeight + "px",
  };
},
```

### 路由切换定位列表滚动位置

>思考:
当我们滚动了一段列表后，点击一条新闻查看新闻详情，然后再返回列表页面，发现列表回到顶部了，这个体验很不好，该如何解决?
>

```js
//在app.vue 文件的路由由出口添加 keepAlive
<keep-alive>
  <router-view/>
</keep-alive>
```

```js
//在index .vue又件中记录相关信息
data(){
  return {
  //在data中声明一个属性，用来保存路由切换后的偏移定位
  scrol1Top: 0
}
},
methods:{
  async setDatastartIndex(){
    //根据滚动事件,获取当前容器在scoll事件中距离顶部的位移
    this.scrollTop = this.$refs.scrol1container.scrollTop;
    //根据scrol1Top计算可视元素开始索引
    let currentStartIndex = ~~( this.scrollTop / this.oneHeight );
  }
}
,
activated(){
//在keep-alive路由模式下，切换路由时确保能够返回用户之前所在位置
  this.$nextTick(()) =>{
    this.$refs.scrol1Container.scro11Top = this.scrollTop;
  }
}
```

## 插件封装调用

### 剥离代码构建插件文件并直接调用

>在src 文件夹下，创建plugins文件夹，用来保存我们的自定义插件，并创建插件VirtualScroll.vue文件
>

```js
//plugin-index.js
import VirtualScroll from './VScroll.vue'

const plugin = {
    install(Vue) {
        Vue.component('VirtualScroll', VirtualScroll)
    }
}
export default plugin

//plugins-VirtualScroll.vuw：复制之前的pages->index.vue

//main.js
import VirtualScroll from './plugins/index'
//全局注册插件 VirtualScroll
Vue.use(VirtualScroll)

//pages-index.vue
<template>
  <div class="news-box">
    <virtual-scroll />
  </div>
</template>
```

### 调用插件并传递 Props参数

调用插件的时候，需要抽离关键定制化的参数信息，向子组件进行通信使用

```js
<template>
  <div class="news-box">
    <virtual-scroll
    :msg="msg"
    :oneHeight ="oneHeight"
    :requestUr1 ="requestUrl"
    :oneRequestDataLength ="oneRequestDataLength"
    />
  </div>
</template>
<script>
  export default {
    data() {
    return {
      //请求数据提示信息
      msg:"请耐心等待...",
      //记录单条数据的高度
      oneHeight: 100,
      //数据请求的Url
      requestUrl: "http://localhost :4888/data?num=",
      //单次请求数据的条数
      oneRequestDataLength: 20,
    };
  }
};
</script>

```
在组件中使用props接收父组件传递过来的参数

### 使用作用域插槽传递单条元素结构

将VirtualScroll.vue组件内部的单条元素的html结构、css样式、data 数据，使用作用域插槽传递出去

```html
<div v-for=" (item,index) in showDataList" :key="index"><slot :thisItem="item"></slot>
</div>
```

```js
<virtual-scroll
    :msg="msg"
    :oneHeight="oneHeight"
    :requestUrl="requestUrl"
    :oneRequestDataLength="oneRequestDataLength"
    v-slot:default="oneItem"
  >
```

在index.vue接收子组件中传递过来的单条元素内容，结构、数据、样式

### 技术场景拓展简介

- 使用上下空白占位的方式实现虚拟滚动
- 横屏滑动实现虚拟滚动
- 浮动模型实现虚拟滚动
