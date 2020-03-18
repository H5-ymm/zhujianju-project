import axios from "axios";
import QS from 'qs';
import {
  Message
} from "element-ui";
import store from "../store/index";
import {
  BASE_URL
} from "../config/app";
import router from "../router/index";
// 创建axios实例
const service = axios.create({
  baseURL: BASE_URL, // api的base_url
  timeout: 5000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => {
    console.log(config)
    // if (config.url.indexOf('typeAll') == -1 &&
    //   config.url.indexOf('typeList') == -1) {

    // }
    if (store.getters.adminId && store.getters.token) {
      config.headers = {
        'X-Adminid': store.getters.adminId,
        'X-Token': store.getters.token
      };
    }
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
    return config;
  },
  error => {
    // Do something with request error
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    const data = response.data;
    console.log(response)
    if (data && data.code) {
      if (data.code === 2 || data.code == 20006) {
        store.dispatch("fedLogout").then(() => {
          if (data.code === 2) {
            Message.error("验证失败,请重新登录");
          } else {
            Message.error("登录过期,请重新登录");
          }
          router.push({
            path: "/login",
            query: {
              redirect: router.currentRoute.fullPath
            } // 从哪个页面跳转过来
          });
        });
      }
    }
    return data;
  },
  error => {
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);
export function post(url, data) {
  return new Promise((resolve, reject) => {
    service.post(`${BASE_URL}${url}`, QS.stringify(data || {}))
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
export function uploadFile(params) {
  let file = new FormData()
  file.append('image', params)
  return new Promise((resolve, reject) => {
    console.log(`${BASE_URL}/Uploadimg/moreupload`)
    service.post(`${BASE_URL}/Uploadimg/moreupload`, file)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  });
}
export default service;
