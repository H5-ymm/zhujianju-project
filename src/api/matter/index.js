import {
  post
} from "../../utils/axios";
// 列表
export function getItemmanage(query) {
  return post("/itemmanage/list", query)
}
export function getItemmanageDetail(query) {
  return post("/itemmanage/getDetail", query)
}
export function addItemmanage(query) {
  return post("/itemmanage/add", query)
}
export function updateItemmanage(query) {
  return post("/itemmanage/edit", query)
}
