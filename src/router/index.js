import Vue from "vue";
import VueRouter from "vue-router";

if (process.env.NODE_ENV === "development") {
    Vue.use(VueRouter);
}

import {
    ROUTER_MODE
} from "../config/app";

import Home from "../views/home/index.vue";
import companyManange from "../views/home/companyManange.vue";
import staffManage from "../views/home/staffManage.vue";
import workerView from "../views/workerView.vue";
import dataDictionary from "../views/home/dataDictionary.vue";
import project from "../views/home/project.vue";
import projectDetail from "../views/home/projectDetail.vue";
// 管理组相关
import adminRouter from "../views/userManage/admin/router.vue";
import authAdmin from "../views/userManage/admin/authAdmin.vue";
// import authRole from "../views/userManage/admin/authRole.vue";
// import authPermissionRule from "../views/userManage/admin/authPermissionRule.vue";

// const routerPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//     console.log(location)
//     return routerPush.call(this, location).catch(error => error)
// }
// Vue.use(VueRouter);

const err401 = r =>
    require.ensure([], () => r(require("../views/error/err401.vue")), "home");
const err404 = r =>
    require.ensure([], () => r(require("../views/error/err404.vue")), "home");
const login = r =>
    require.ensure([], () => r(require("../views/login/index.vue")), "home");
const main = r =>
    require.ensure([], () => r(require("../views/home/main.vue")), "home");

// 注意 权限字段 authRule （严格区分大小写）
export const constantRouterMap = [{
        path: "*",
        component: err404,
        hidden: true
    },
    {
        path: "/401",
        component: err401,
        name: "401",
        hidden: true
    },
    {
        path: "/404",
        component: err404,
        name: "404",
        hidden: true
    },
    {
        path: "/500",
        component: err404,
        name: "500",
        hidden: true
    },
    {
        path: "/login",
        component: login,
        name: "登录",
        hidden: true
    },
    {
        path: '/workerView',
        component: workerView,
        name: "登录",
        hidden: true
    },
    {
        path: "/",
        component: Home,
        redirect: "/readme",
        name: "首页",
        hidden: true
    }

];

export const manageRouter = [{
        path: "/readme",
        component: Home,
        redirect: "/readme/main",
        icon: "xiangmu",
        name: "项目管理",
        noDropdown: true,
        children: [{
            path: 'main',
            component: main
        }, {
            path: 'projectDetail',
            component: projectDetail
        }]
    },
    {
        path: "/companyManange",
        component: Home,
        redirect: "/readme/main",
        icon: "qiyeguanli",
        name: "企业管理",
        noDropdown: true,
        children: [{
            path: 'companyManange',
            component: companyManange
        }]
    },
    {
        path: "/staffManage",
        component: Home,
        redirect: "/readme/main",
        icon: "gongren",
        name: "工人管理",
        noDropdown: true,
        children: [{
            path: 'staffManage',
            component: staffManage
        }]
    },
    {
        path: "/project",
        component: Home,
        redirect: "/readme/main",
        icon: "xiangmu1",
        name: "在建项目",
        noDropdown: true,
        children: [{
            path: 'project',
            component: project
        }]
    },

    {
        path: "/dataDictionary",
        component: Home,
        redirect: "/readme/main",
        icon: "shujuzidian",
        name: "分类管理",
        noDropdown: true,
        children: [{
            path: 'dataDictionary',
            component: dataDictionary
        }]
    },
]
export const workerRouter = [{
    path: "/readme",
    component: Home,
    redirect: "/readme/staffManage",
    icon: "gongren",
    name: "工人管理",
    noDropdown: true,
    children: [{
        path: 'staffManage',
        component: staffManage
    }]
}, ]
export default new VueRouter({
    // mode: 'history', //后端支持可开
    mode: ROUTER_MODE,
    routes: constantRouterMap,
    strict: process.env.NODE_ENV !== "production"
});

export const asyncRouterMap = [{
    path: "/userManage",
    redirect: "/userManage/adminManage/index",
    component: Home,
    icon: "yonghuquanxian",
    name: "用户管理",
    meta: {
        authRule: ["user_manage"]
    },
    children: [{
        path: "/userManage/adminManage",
        component: adminRouter,
        redirect: "/userManage/authAdmin/index",
        name: "管理组",
        icon: "",
        meta: {
            authRule: ["user_manage/admin_manage"]
        },
        children: [{
                path: "authAdmin",
                component: authAdmin,
                name: "管理员管理",
                icon: "",
                meta: {
                    authRule: ["admin/auth.admin/index"]
                }
            },
            // {
            //     path: "authRole",
            //     component: authRole,
            //     name: "角色管理",
            //     icon: "",
            //     meta: {
            //         authRule: ["admin/auth.role/index"]
            //     }
            // },
            // {
            //     path: "authPermissionRule",
            //     component: authPermissionRule,
            //     name: "权限管理",
            //     icon: "",
            //     meta: {
            //         authRule: ["admin/auth.permission_rule/index"]
            //     }
            // }
        ]
    }]
}];
