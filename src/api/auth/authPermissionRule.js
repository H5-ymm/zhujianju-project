/**
 * Created by lk on 17/6/4.
 */
import {
    post
} from "../../utils/axios";

// 权限管理

// 获取列表
export function authPermissionRuleList(query) {
    return post('/AuthPermissionRule/index', query)
}
// 保存
export function authPermissionRuleSave(query, formName) {
    let url =
        formName !== "edit" ?
        "/admin/auth/permission_rule/save" :
        "/admin/auth/permission_rule/edit";
    return post(url, query)
}


// 删除
export function authPermissionRuleDelete(query) {
    return post('/admin/auth/permission_rule/delete', query)
}
