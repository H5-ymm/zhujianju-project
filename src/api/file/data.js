import {
  post,
  uploadFile
} from "../../utils/axios";

// 列表
export function geTypeAll(query) {
  return post("/project/typeAll", query);
}
export function addTypeData(query) {
  return post("/project/addType", query);
}
export function editType(query) {
  return post("/project/editType", query);
}
export function typeList(query) {
  return post("/project/typeList", query);
}
export function uploadF(file) {
  return uploadFile(file);
}
