import "babel-polyfill"; // 解决Ie9
import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import "./element";
import * as filters from "./filtres/index"; // 全局过滤器
import VueParticles from 'vue-particles'
import "./role"; // 权限
import "./mock"; // 模拟数据
import Print from 'vue-print-nb'
import moment from 'moment'
import {
    getopenid
} from "./api/wx/wxApi";
import {
    getIsWxClient,
    getQueryString,
    locationUrl,
    IsPC
} from "./utils/util"
// 引入axios
import "./assets/icons/iconfont";
import "./assets/icons/iconfont.css";
import IconSvg from "./components/common/IconSvg.vue"; // svg组件
Vue.prototype.$moment = moment
Vue.prototype.IsPC = IsPC
// 注册全局组件（register global）
Vue.component("icon-svg", IconSvg);
let state = getQueryString('state')
let openid = getQueryString('openid') || sessionStorage.getItem('zhujianjuOpenid');
// 重定向
if (getQueryString('connect_redirect') && getIsWxClient()) {
    this.$router.go(-1)
}
let zhujianjuOpenid = sessionStorage.getItem('zhujianjuOpenid2')
if (!zhujianjuOpenid && getIsWxClient() && !openid) {
    sessionStorage.setItem('zhujianjuOpenid2', true)
    location.href = locationUrl(state) // 获取跳转url
}
// 获取code
if (getQueryString('code') && getIsWxClient()) {
    sessionStorage.setItem('zhujianjuCode', getQueryString('code'))
}
window.onload = function () {
    if (getIsWxClient() &&
        sessionStorage.getItem('zhujianjuCode') && !openid) {
        getopenid({
            code: sessionStorage.getItem('zhujianjuCode')
        }).then(res => {
            if (res.openid) {
                sessionStorage.setItem('zhujianjuOpenid', res.openid)
            }
        })
    }
    // 注册全局实用程序过滤器（register global utility filters）.
    Object.keys(filters).forEach(key => {
        Vue.filter(key, filters[key]);
    });
    Vue.use(VueParticles)
    Vue.use(Print);
    // Vue.use(printJS);
    Vue.config.productionTip = false;
    new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount("#app");
}
