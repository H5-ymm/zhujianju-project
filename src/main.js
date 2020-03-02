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
    getopenid
} from "./api/wx/wxApi";
import { getIsWxClient, getQueryString } from "./utils/util"
// 引入axios

import "./assets/icons/iconfont";
import "./assets/icons/iconfont.css";
import IconSvg from "./components/common/IconSvg.vue"; // svg组件
Vue.prototype.$moment = moment
// 注册全局组件（register global）
Vue.component("icon-svg", IconSvg);
console.log(getIsWxClient())

let team_id = getQueryString('team_id')
let openid = getQueryString('openid');
console.log(openid)
if (getIsWxClient()) {
    if (openid == null) {
        getopenid({ team_id }).then(res => {
            sessionStorage.setItem('zhujianjuOpenid', res)
            console.log(res)
        })
    } else {
        sessionStorage.setItem('zhujianjuOpenid', openid)
    }
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
