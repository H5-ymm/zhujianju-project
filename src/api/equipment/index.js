import {
  post
} from "../../utils/axios";
// 列表
export function getEquipment(query) {
  return post("/jackup/list", query)
}
export function getEquipmentDetail(query) {
  return post("/jackup/getDetail", query)
}
export function addEquipment(query) {
  return post("/jackup/add", query)
}
export function updateEquipment(query) {
  return post("/jackup/edit", query)
}
