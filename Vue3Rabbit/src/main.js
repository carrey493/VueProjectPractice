import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// 引入初始化的样式文件
import "./styles/common.scss";
import { useIntersectionObserver } from "@vueuse/core";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

app.directive("img-lazy", {
  mounted(el, binding) {
    // el：指令绑定的元素，binding：指令对象
    useIntersectionObserver(el, ([{ isIntersecting }]) => {
      // 进入视口区域
      if (isIntersecting) el.src = binding.value;
    });
  },
});
