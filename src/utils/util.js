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

export const getImg = img => {
  return 'http://b.jcjzfwzx.com/' + img
}
export const locationUrl = state => {
  let urlHome = encodeURIComponent('http://jc.jcjzfwzx.com/#/workerView')
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbe1948a3f8612f0d&redirect_uri=${urlHome}&response_type=code&scope=snsapi_userinfo&state=${state}&connect_redirect=1#wechat_redirect`
}

export const checkNum = num => {
  let reg = /^([0]|[1-9][0-9]*)$/
  return reg.test(num)
}
export const checkChinese = str => {
  let reg = /^[\u4e00-\u9fa5]+$/
  return reg.test(str)
}
export const IsPC = () => {
  let flag = true;
  if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) { //移动端
    flag = false;
  }
  return flag
}
