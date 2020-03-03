
import {
  post
} from "../../utils/axios";
// 列表
export function getopenid (query) {
  return post("/wx/getopenid", query)
}
export function bindopenid (query) {
  return post("/wx/bindopenid", query)
}
export function getWxworkmanbytel (query) {
  return post("/wx/getworkmanbytel", query)
}
export function getCode (query) {
  return post("/wx/getCode", query)
}
