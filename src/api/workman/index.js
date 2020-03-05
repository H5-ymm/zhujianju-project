import {
  post
} from "../../utils/axios";
// 列表
export function getWorkmanList (query) {
  return post("/workman/list", query)
}
export function getWorkmanDetail (query) {
  return post("/workman/getDetail", query)
}
export function addWorkman (query) {
  return post("/workman/add", query)
}
export function deleteWorkman (query) {
  return post("/workman/delete", query)
}
export function updateWorkman (query) {
  return post("/workman/edit", query)
}

export function listCount (query) {
  return post("/project/list_count", query)
}
export function getworkmanbytel (query) {
  return post("/workman/getworkmanbytel", query)
}
export function saveStatus (query) {
  return post("/workman/save_status", query)
}
export function bindWorkman (query) {
  return post("/workman/bind", query)
}
export function addtemperature (query) {
  return post("/wx/addtemperature", query)
}
export function todaytemperature (query) {
  return post("/wx/todaytemperature", query)
}
// 工人与项目绑定
export function binditem (query) {
  return post("/wx/binditem", query)
}
// 新增工人并绑定到项目
export function addWork (query) {
  return post("/wx/add", query)
}
export function getqrcode () {
  return post("/workman/getqrcod_byadminid", {})
}
export function getitemname (query) {
  return post("/wx/getitemname", query)
}
export function sureAttendance (query) {
  return post("/workman/sure_attendance", query)
}
export function getIteminfo () {
  return post("/workman/getIteminfo", {})
}
