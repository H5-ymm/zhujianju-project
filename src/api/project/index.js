import {
  post
} from "../../utils/axios";
// 列表
export function getProjectList(query) {
  return post("/project/list", query)
}
export function getDetail(query) {
  return post("/project/getDetail", query)
}
export function addProject(query) {
  return post("/project/add", query)
}
export function deleteProject(query) {
  return post("/project/delete", query)
}
export function updateProject(query) {
  return post("/project/edit", query)
}
export function getNamelist(query) {
  return post("/project/getitem_namelist", query)
}
