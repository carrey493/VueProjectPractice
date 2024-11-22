import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import VirtualScroll from './plugins/index'

Vue.config.productionTip = false

//导入axios
import axios from 'axios'
Vue.prototype.$axios = axios

//全局注册插件 VirtualScroll
Vue.use(VirtualScroll)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
