import "babel-polyfill"; // 解决Ie9
import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import "./element";
import * as filters from "./filtres/index"; // 全局过滤器
import VueParticles from 'vue-particles'
import "./role"; // 权限
// import ElementUI from 'element-ui';
import "./mock"; // 模拟数据
import moment from 'moment'
import {
    getopenid,
    getCode,
    bindopenid
} from "./api/wx/wxApi";
import {
    getIsWxClient,
    getQueryString
} from "./utils/util"
// 引入axios
import "./assets/icons/iconfont";
import "./assets/icons/iconfont.css";
import IconSvg from "./components/common/IconSvg.vue"; // svg组件
Vue.prototype.$moment = moment
// 注册全局组件（register global）
Vue.component("icon-svg", IconSvg);
let state = getQueryString('state')
let openid = getQueryString('openid') || sessionStorage.getItem('zhujianjuOpenid') ;
console.log(getQueryString('connect_redirect'))
if (getQueryString('connect_redirect') && getIsWxClient() ) {
   this.$router.go(-1)
  }
 let locationUrl = encodeURIComponent('http://www.tp1.cn/dist/#/workerView')
  let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbe1948a3f8612f0d&redirect_uri=${locationUrl}&response_type=code&scope=snsapi_userinfo&state=${state}&connect_redirect=1#wechat_redirect`
    let zhujianjuOpenid = sessionStorage.getItem('zhujianjuOpenid2')
    if (!zhujianjuOpenid && getIsWxClient() && !openid) {
        sessionStorage.setItem('zhujianjuOpenid2', true)
        location.href = url
  }

if (getQueryString('code') && getIsWxClient() ) {
    sessionStorage.setItem('zhujianjuCode', getQueryString('code'))
  }
  window.onload = function () {
    if (getIsWxClient()
     &&sessionStorage.getItem('zhujianjuCode')&& !openid) {
        getopenid({
            code:sessionStorage.getItem('zhujianjuCode')
        }).then(res => {
            if(res.openid) {
                // if (!res.is_link) {
                //     let item_id = state.split('#')[0]
                //     let params = {
                //         id: item_id,
                //         openid: res.openid
                //     }
                //     bindopenid(params).then(res=>{
                //         console.log(res)
                //     })
                // }
                sessionStorage.setItem('zhujianjuOpenid', res.openid)
            }  
            console.log(res)
        })
    }
// 注册全局实用程序过滤器（register global utility filters）.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});
Vue.use(VueParticles)
Vue.config.productionTip = false;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
  }