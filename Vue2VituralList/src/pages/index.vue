<!-- <template>
  <div class="news-box">
    <div
      class="scroll-container"
      ref="scrollContainer"
      @scroll.passive="handleScroll"
    >
      注释：<div
        :style="{
          paddingTop: topBlankFill + 'px',
          paddingBottom: bottomBlankFill + 'px',
        }"
      > 
      <div class="blank-fill" :style="blankFillStyle">
         注释：根据待显示新闻列表数组，显示新闻列表
        <div v-for="(item, index) in showDataList" :key="index">
          <router-link class="one-new" to="/article">
            <div class="new-left">
              <h3 class="left-title">{{ item.title }}</h3>
              <div class="left-info">
                <p>
                  <img src="../assets/icons/logo.png" alt="" />
                  <span>{{ item.reads }}</span>
                  <span>{{ item.from }}</span>
                </p>
                <h4>{{ item.date }}</h4>
              </div>
            </div>
            <div class="new-right">
              <img :src="imgsList[item.image]" alt="" />
            </div>
          </router-link>
        </div>
        <div v-if="requestStaus" class="loading-msg">
          <h5>{{ msg }}</h5>
        </div>
      </div>
      注释：请求状态下显示的加载内容
    </div>
  </div>
</template>

<script>
//
import imgsList from "../components/newsImgs.js";
export default {
  data() {
    return {
      //图片数组
      imgsList,
      //用来保存所有列数据
      allDataList: [],
      requestStaus: true,
      msg: "加载中......",
      oneHeight: 100,
      //容器的最大容积
      containSize: 0,
      startIndex: 0, //记录当前滚动的第一个元素的索引
      scrollStatus: true, //记录当前滚动有效的状态
      currentScrollTop: 0, //记录当前滚动的距离顶部的位移
    };
  },
  computed: {
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
    //定义上空白的高度
    topBlankFill() {
      return this.startIndex * this.oneHeight;
    },
    //定义下空白的高度
    bottomBlankFill() {
      return (this.allDataList.length - this.endIndex) * this.oneHeight;
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
  },
  async created() {
    let newList = await this.getNewsList(20);
    if (!newList) return;
    this.allDataList = newList;
  },
  mounted() {
    this.getcontainSize();
    window.onresize = this.getcontainSize;
    window.orientationchange = this.getcontainSize;
  },
  //路由记使用到 keep alive 的时候，可以调用 actived这个生命周期钩子方法
  activated() {
    this.$nextTick(() => {
      this.$refs.scrollContainer.scrollTop = this.currentScrollTop;
    });
  },
  methods: {
    getNewsList(num) {
      this.requestStaus = true;
      this.msg = "加载中......";
      return this.$axios
        .get("http://localhost:4000/data?num=" + num)
        .then((res) => {
          // console.log(res.data.list);
          // this.allDataList = res.data.list;
          this.requestStaus = false;
          return res.data.list;
        })
        .catch((err) => {
          console.log(err);
          this.msg = "网络出问题啦...";
          return false;
        });
    },
    //计算 容器的最大容积
    getcontainSize() {
      this.containSize =
        ~~(this.$refs.scrollContainer.offsetHeight / this.oneHeight) + 2;
      console.log(this.containSize);
    },
    //定义滚动行为事件
    handleScroll() {
      /* if (this.scrollStatus) {
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
      } */
      //使用 requestAnimationFrame 动画帧来实现节流的效果
      //兼容低版本浏览器
      let requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;
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
    },
    //执行数据设置的相关任务，滚动事件的具体行为
    async setDataStartIndex() {
      this.currentScrollTop = this.$refs.scrollContainer.scrollTop;
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
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
.news-box {
  width: 100%;
  max-width: 800px;
  height: 100%;
}
.scroll-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.one-new {
  text-decoration: none;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding-bottom: 2px;
  justify-content: space-between;
  /* border-bottom: 1px solid #ddd; */
  padding: 15px 10px 5px 10px;
}
.new-left {
  height: 80px;
  position: relative;
}
.new-left h3 {
  padding: 0;
  margin: 0;
  font-size: 16px;
  text-align: justify;
  color: #555;
}
.new-left img {
  width: 10px;
  height: 10px;
}
.left-title {
  text-align: left;
}
.left-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}
.new-right img {
  width: 76px;
  height: 76px;
}
</style> -->

<template>
  <div class="news-box">
    <virtual-scroll
      :msg="msg"
      :oneHeight="oneHeight"
      :requestUrl="requestUrl"
      :oneRequestDataLength="oneRequestDataLength"
      v-slot:default="oneItem"
    >
      <router-link class="one-new" to="/article">
        <div class="new-left">
          <h3 class="left-title">{{ oneItem.thisItem.title }}</h3>
          <div class="left-info">
            <p>
              <img src="../assets/icons/logo.png" alt="" />
              <span>{{ oneItem.thisItem.reads }}</span>
              <span>{{ oneItem.thisItem.from }}</span>
            </p>
            <h4>{{ oneItem.thisItem.date }}</h4>
          </div>
        </div>
        <div class="new-right">
          <img :src="imgsList[oneItem.thisItem.image]" alt="" />
        </div>
      </router-link>
    </virtual-scroll>
  </div>
</template>

<script>
import imgsList from "../components/newsImgs.js";

export default {
  data() {
    return {
      imgsList,
      //请求数据提示信息
      msg: "请耐心等待...",
      //记录单条数据的高度
      oneHeight: 100,
      //数据请求的Url
      requestUrl: "http://localhost:4000/data?num=1000",
      //单次请求数据的条数
      oneRequestDataLength: 20,
    };
  },
};
</script>

<style scoped>
.news-box {
  width: 100%;
  max-width: 800px;
  height: 100%;
}
.one-new {
  text-decoration: none;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding-bottom: 2px;
  justify-content: space-between;
  /* border-bottom: 1px solid #ddd; */
  padding: 15px 10px 5px 10px;
}
.scroll-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.new-left {
  height: 80px;
  position: relative;
}
.new-left h3 {
  padding: 0;
  margin: 0;
  font-size: 16px;
  text-align: justify;
  color: #555;
}
.new-left img {
  width: 10px;
  height: 10px;
}
.left-title {
  text-align: left;
}
.left-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}
.new-right img {
  width: 76px;
  height: 76px;
}
</style>
