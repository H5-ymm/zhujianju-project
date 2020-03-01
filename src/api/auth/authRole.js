/**
 * Created by lk on 17/6/4.
 */
import {
    post
} from "../../utils/axios";

// 获取列表
export function authRoleList(query) {
    return post('/AuthRole/index', query)
}

// 编辑
export function authRoleAuthList(query) {
    return post('/AuthRole/edit', query)
}


// 添加
export function authRoleAuth(query) {
    return post('/AuthRole/save', query)
}

// 保存

export function authRoleSave(query, formName) {
    let url =
        formName === "add" ? "/AuthRole/save" : "/AuthRole/edit";
    return post(url, query)
}

// 删除
export function authRoleDelete(query) {
    return post('/AuthRole/delete', query)
}
