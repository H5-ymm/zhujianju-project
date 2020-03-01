import {
    post
} from "../../utils/axios";
// 列表
export function getProvincesList() {
    return post("/com/provinceList", {});
}

export function getCitysList(query) {
    return post("/com/cityList", query);
}
