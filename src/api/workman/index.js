import {
    post
} from "../../utils/axios";
// 列表
export function getWorkmanList(query) {
    return post("/workman/list", query)
}
export function getWorkmanDetail(query) {
    return post("/workman/getDetail", query)
}
export function updateWorkman(query) {
    return post("/workman/add", query)
}
export function deleteWorkman(query) {
    return post("/workman/delete", query)
}
export function updateProject(query) {
    return post("/workman/edit", query)
}

export function listCount(query) {
    return post("/project/list_count", query)
}
export function getworkmanbytel(query) {
    return post("/workman/getworkmanbytel", query)
}
export function saveStatus(query) {
    return post("/workman/save_status", query)
}
export function bindWorkman(query) {
    return post("/workman/bind", query)
}
