/* jshint esversion: 6 */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
// 导入字体图标
import './assets/fonts/iconfont.css';
// 导入全局样式表
import './assets/css/global.css';
import axios from 'axios';
import TreeTable from 'vue-table-with-tree-grid';
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor';
// 导入对应的样式

// 导入NProgress
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 在request 拦截器中 展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
});
// 在response 拦截器中隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done();
  return config;
});

Vue.config.productionTip = false;

Vue.prototype.$http = axios;

Vue.component('tree-table', TreeTable);
// 注册为全局可用
Vue.use(VueQuillEditor);

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal);
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + '').padStart(2, '0');

  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
