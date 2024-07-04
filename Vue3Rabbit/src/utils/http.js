// axios基础封装
import axios from "axios";

const baseUrl = "http://pcapi-xiaotuxian-front-devtest.itheima.net";
const httpInstance = axios.create({
  timeout: 5000,
});

// 请求拦截器
httpInstance.interceptors.request.use(
  (config) => {
    config.url = baseUrl + config.url;
    return config;
  },
  (e) => Promise.reject(e)
);

// 响应拦截器
httpInstance.interceptors.response.use(
  (res) => {
    return Promise.resolve(res.data);
  },
  (e) => Promise.reject(e)
);

export default httpInstance;
