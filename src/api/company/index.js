import {
    post
} from "../../utils/axios";
// 列表
export function getCompanyList(query) {
    return post("/Company/list", query)
}
export function getDetail(query) {
    return post("/company/getDetail", query)
}
export function addCompany(query) {
    return post("/company/add", query)
}
export function deleteCompany(query) {
    return post("/company/delete", query)
}
export function updateCompany(query) {
    return post("/company/edit", query)
}
export function getCorporationCompany(query) {
    return post("/company/getCorporationCompany", query)
}
