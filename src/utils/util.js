export const validateIdCard = idCard => {
    var idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
    var flag = false;
    // 如果通过该验证，说明身份证格式正确，但准确性还需计算
    if (idcardReg.test(idCard)) {
        flag = true;
    } else {
        flag = false;
    }
    return flag;
};

export const checkMobile = mobile => {
    let reg = /^1[3456789]\d{9}$/;
    let flag = false;
    if (!reg.test(mobile)) {
        flag = false;
    } else {
        flag = true;
    }
    return flag;
};
export const getIsWxClient = () => {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    }
    return false;
};
export const getQueryString = name => {
    let href = window.location.href
    let query = href.substring(href.indexOf('?') + 1);
    let vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == name) {
            return pair[1];
        }
    }
    return (false);
}
