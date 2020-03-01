/**
 * Created by lk on 17/6/4.
 */
// import axios from "../../utils/axios";
import {
    post
} from "../../utils/axios";
// 获取信息
export function userInfo() {
    return post('/login/userInfo', {})
}
export function loginName(userName, pwd) {
    let data = {
        userName,
        pwd
    }
    return post('/login/index', data)
}
export function logout(uid, token) {
    let data = {
        uid,
        token
    }
    return post('/admin/auth/login/out', data)
}
export function password(data) {
    return post('/login/password', data)
}
