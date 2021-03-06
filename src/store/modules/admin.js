import {
    userInfo,
    loginName,
    logout
} from "../../api/auth/login";
import * as types from "../mutation-types";
import {
    constantRouterMap
} from "../../router";
import {
    getToken,
    setToken,
    removeToken,
    getAdminId,
    setAdminId,
    removeAdminId
} from "../../utils/auth";
// import { $NOT_NETWORK } from '../../utils/errorCode'
import {
    Message
} from "element-ui";

// initial state
const state = {
    adminId: getAdminId(), // id
    userName: "", // 昵称
    avatar: "", // 头像
    token: getToken(), // 登录token
    authRules: [], // 权限列表
    routers: constantRouterMap, // 路由列表
    is_wmadmin: sessionStorage.getItem('is_wmadmin')
};

// getters
const getters = {
    adminId: state => state.adminId,
    userName: state => state.userName,
    avatar: state => state.avatar,
    token: state => state.token,
    authRules: state => state.authRules,
    routers: state => state.routers,
    is_wmadmin: state => state.is_wmadmin ? state.is_wmadmin : sessionStorage.getItem('is_wmadmin')
};

// actions
const actions = {
    // 用户名登录
    loginName ({
        commit, dispatch
    }, userInfo) {
        const userName = userInfo.userName ? userInfo.userName.trim() : "";
        const pwd = userInfo.pwd ? userInfo.pwd : "";
        return new Promise((resolve, reject) => {
            loginName(userName, pwd)
                .then(response => {
                    if (!response && response.id) {
                        Message({
                            message: response.message,
                            type: "error",
                            duration: 5 * 1000
                        });
                    } else {
                        commit(types.RECEIVE_ADMIN_ID, response.id);
                        commit(types.RECEIVE_ADMIN_TOKEN, response.token);
                        commit(types.RECEIVE_ADMIN_AUTH_RULES, []);
                        // dispatch('userInfo')
                        localStorage.setItem('zhujianj-token', response.id)
                        localStorage.setItem('zhujianj-adminId', response.token)
                    }
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    userInfo ({
        commit
    }) {
        return new Promise((resolve, reject) => {
            userInfo()
                .then(response => {
                    if (response.code === 2) {
                        reject("登录失效");
                    }
                    commit(types.RECEIVE_ADMIN_NAME, response.username);
                    commit(types.RECEIVE_ADMIN_AVATAR, response.avatar);
                    commit(types.RECEIVE_ADMIN, response.is_wmadmin);
                    sessionStorage.setItem('is_wmadmin', response.is_wmadmin)
                    if (response.is_wmadmin) {
                        commit(types.RECEIVE_ADMIN_AUTH_RULES, ['worker']);
                    } else {
                        commit(types.RECEIVE_ADMIN_AUTH_RULES, response.authRules);
                    }
                    resolve(response);
                })
                .catch(error => {
                    console.log(error)
                    reject(error);
                });
        });
    },
    // 登出
    loginOut ({
        commit
    }) {
        return new Promise((resolve, reject) => {
            logout()
                .then((res) => {
                    if (res) {
                        commit(types.RECEIVE_ADMIN_ID, "");
                        commit(types.RECEIVE_ADMIN_TOKEN, "");
                        commit(types.RECEIVE_ADMIN_AUTH_RULES, []);
                        commit(types.RECEIVE_ADMIN, '');
                        commit(types.RECEIVE_ADMIN_NAME, '');
                        sessionStorage.clear()
                        localStorage.clear()
                    }
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    // 前端 登出
    fedLogout ({
        commit
    }) {
        return new Promise(resolve => {
            commit(types.RECEIVE_ADMIN_ID, "");
            commit(types.RECEIVE_ADMIN_TOKEN, "");
            commit(types.RECEIVE_ADMIN_AUTH_RULES, []);
            commit(types.RECEIVE_ADMIN_NAME, '');
            sessionStorage.clear()
            resolve();
        });
    },
    /**
     * 过滤路由列表
     * @param commit
     * @param data
     * @returns {Promise}
     */
    filterRouter ({
        commit
    }, data) {
        const {
            accessedRouters
        } = data;
        if (accessedRouters && accessedRouters.length > 0) {
            commit(types.RECEIVE_ROUTERS, accessedRouters);
        }
    }
};

// mutations
const mutations = {
    [types.RECEIVE_ADMIN_ID] (state, adminId) {
        state.adminId = adminId;
        if (adminId === "") {
            removeAdminId();
        } else {
            setAdminId(adminId);
        }
    },
    [types.RECEIVE_ADMIN_TOKEN] (state, token) {
        state.token = token;
        if (token === "") {
            removeToken();
        } else {
            setToken(token);
        }
    },
    [types.RECEIVE_ADMIN_NAME] (state, userName) {
        state.userName = userName;
    },
    [types.RECEIVE_ADMIN_AVATAR] (state, avatar) {
        state.avatar = avatar;
    },
    [types.RECEIVE_ADMIN_AUTH_RULES] (state, authRules) {
        state.authRules = authRules;
    },
    [types.RECEIVE_ROUTERS] (state, routers) {
        const tempRm = constantRouterMap.concat(routers);
        state.routers = JSON.parse(JSON.stringify(tempRm));
    },
    [types.RECEIVE_ADMIN] (state, is_wmadmin) {
        state.is_wmadmin = is_wmadmin
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
