# my-form

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

## 低代码（Low Code）概述

低代码（Low Code）是一种可视化的应用开发方法，用较少的代码、以较快的速度来交付应用程序，将程序员不想开发的代码做到自动化，称之为低代码。

低代码是一组数字技术工具平台，基于图形化拖拽、参数化配置等更为高效的方式，实现快速构建、数据编排、连接生态、中台服务。通过少量代码或不用代码实现数字化转型中的场景应用创新。


## 可视化拖拽表格概述

通过拖拽生成可视化表格是低代码的一个简单表现与实践。可以通过拖拽的方式快速创建表单，提高开发者对表单的开发效率，节省开发者的时间。

### 实现思路

- 组件的划分：主要划分为`组件列表`、`可视化列表`、`数组配置列表`。
- 数据结构的定义：对于后续组件的配置与修改可以灵活`应对`
- 拖拽的实现：基于`HTML5的拖拽事件`。
- 可维护性、扩展性：对于后续其它功能做到`易拓展`、`可定制`。

### 组件的划分

![impicture_20221125_181128.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/050766d19002499882090cba901648d3~tplv-k3u1fbpfcp-watermark.image?)

### 数据结构的定义

数据结构的定义主要是考虑到不同组件特有属性以及样式，要尽可能多化的覆盖，以上述图中的几个简单组件举例。
```json
targetObj = {id: Date.now(),type: "input",value: "",placeholder: "",title: "输入框",info: "",};
targetObj = {id: Date.now(),type: "select",value: "",placeholder: "",};
targetObj = { id: Date.now(), type: "switch", value: true };
targetObj = { id: Date.now(), type: "radio", value: "1" };
targetObj = { id: Date.now(), type: "date", value: "" };
```
后续开发考虑到更多样化的配置还可以继续添加。

### 拖拽的实现

组件的拖拽实现主要是基于**HTML5的拖拽事件**
1. dragstart：开始拖元素触发，作用于拖拽元素
2. dragenter：元素拖进可drop元素（绑定drop事件的元素）时触发，作用于目标元素
3. dragover：当元素拖动到drop元素上时触发，作用于目标元素
4. drop：当元素放下到drop元素触发，作用于目标元素
5. dragleave ：当元素离开drop元素时触发，作用于目标元素
6. drag：每次元素被拖动时会触发，作用于目标元素
7. dragend：放开拖动元素时触发，作用于目标元素

**完成一次拖放的事件过程是： dragstart –> dragenter –> dragover –> drop –> dragend**

#### 开始拖拽
开始拖拽主要完成的工作是确定拖拽目标组件的类型。

```js
//开始拖拽
dragStart(e) {
      this.type = e.target.dataset.type;
      console.log(this.type);
    },
 ```
 
#### 结束拖拽
结束拖拽主要完成的工作是完成拖拽的初始化。
 ```js
 // 结束拖拽
    dragEnd() {
      console.log("结束拖拽");
      this.type = "";
      this.hoverId = "";
      this.enterFlag = false;
    },
 ```
#### 拖拽下放
拖拽下放主要完成的工作是根据开始拖拽选中的组件在页面上生成对应的组件。
```js
    // 已放置到指定位置
    drog(e) {
      console.log("drop：当元素放下到drop元素触发，作用于目标元素");
      if (!this.type) {
        // 内容拖拽
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      let targetObj = "";

      switch (this.type) {
        case "input":
          targetObj = {
            id: Date.now(),
            type: "input",
            value: "",
            placeholder: "",
            title: "输入框",
            info: "",
          };
          break;
        case "select":
          targetObj = {
            id: Date.now(),
            type: "select",
            value: "",
            placeholder: "",
          };
          break;
        case "switch":
          targetObj = { id: Date.now(), type: "switch", value: true };
          break;
        case "radio":
          targetObj = { id: Date.now(), type: "radio", value: "1" };
          break;
        case "date":
          targetObj = { id: Date.now(), type: "date", value: "" };
          break;
        default:
          break;
      }
      if (this.viewList.length) {
        let targetIndex = 0;
        this.viewList.map((el, index) => {
          if (this.hoverId === parseInt(el.id)) {
            targetIndex = index;
          }
        });
        this.viewList.splice(targetIndex, 0, targetObj);
      } else {
        this.viewList.push(targetObj);
      }
      // this.dragEnd();
    },
    ```
    ```js
    // 移动中
    dragOver(e) {
      // console.log(this.viewList.length, e.target.className);
      if (!this.type) {
        // 内容拖拽
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (this.viewList.length && e.target.className === "item-mask") {
        this.hoverId = parseInt(e.target.id);
        // console.log(e, e.target.id, this.hoverId);
      } else {
        this.hoverId = "";
      }
    },
```
#### 拖拽进入与移除
设立拖拽的标志，辅助拖拽事件。

```js
    dragenter() {
      this.enterFlag = true;
    },
    dragleave() {
      this.enterFlag = false;
    },
```

![GIF.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b55d39bf44334af3b792ca714731a69c~tplv-k3u1fbpfcp-watermark.image?)

对于试图列表中拖拽，我们可以借助`vuedrabbable组件`实现。

## 生成表格组件配置


![GIF1.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a27e5146ee494383bbd8dbaec30909ea~tplv-k3u1fbpfcp-watermark.image?)

以简单的配置标签位置为例，可以配置整个表格的信息与基础属性。

![GIF2.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e66690f3ab5419fac631d95aa9408d2~tplv-k3u1fbpfcp-watermark.image?)

除此之外还可以配置对应组件的内容与信息，完成各个信息、字段的设置。

**总结**

由于时间及设计的限制，部分功能还未全部实现。后续可参考http://form-create.com/designer/?fr=jj 完成其它功能的实现。