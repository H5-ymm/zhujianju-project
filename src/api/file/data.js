import {
    post
} from "../../utils/axios";
// 列表
export function geTypeAll (query) {
    return post("/project/typeAll", query);
}
export function addTypeData (query) {
    return post("/com/addType", query);
}
export function editType (query) {
    return post("/com/editType", query);
}
export function typeList (query) {
    return post("/com/typeList", query);
}
