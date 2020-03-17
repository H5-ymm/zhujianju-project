import {
    post
} from "../../utils/axios";
// 列表
export function getProvincesList () {
    return post("/project/provinceList", {});
}

export function getCitysList (query) {
    return post("/project/cityList", query);
}
