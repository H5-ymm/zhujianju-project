/**
 * Created by lk on 17/6/4.
 */
// import axios from "../../utils/axios";
import {
    post
} from "../../utils/axios";
// 获取列表

export function authAdminList(query) {
    return post('/Authadmin/index', query)
}

// 获取角色列表
export function authAdminRoleList(query) {
    return post('/AuthRole/index', query)
}
export function authAdminSave(query, formName) {
    let url =
        formName === "add" ?
        "/Authadmin/save" :
        "/Authadmin/edit";
    return post(url, query)
}
export function authAdminDelete(query) {
    return post('/Authadmin/delete', query)
}
