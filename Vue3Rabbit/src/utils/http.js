// axios基础封装
import axios from "axios";
import { ElMessage } from "element-plus";
const baseUrl = "http://pcapi-xiaotuxian-front-devtest.itheima.net";
import { useUserStore } from "@/stores/user";

const httpInstance = axios.create({
  timeout: 5000,
});

// 请求拦截器
httpInstance.interceptors.request.use(
  // 获取token数据
  (config) => {
    config.url = baseUrl + config.url;
    const userStore = useUserStore();
    const token = userStore.userInfo.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (e) => Promise.reject(e)
);

// 响应拦截器
httpInstance.interceptors.response.use(
  (res) => {
    return Promise.resolve(res.data);
  },
  (e) => {
    ElMessage.warning(e.response.data.message);
    Promise.reject(e);
  }
);

export default httpInstance;
