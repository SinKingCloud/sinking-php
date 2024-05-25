/**
 * 获取随机字符
 * @param length 长度
 */
export function getRandStr(length = 16) {
  let str = 'abcdefghijklmnopqrstuvwxyz';
  str += str.toUpperCase();
  str += '0123456789'
  let _str = '';
  for (let i = 0; i < length; i++) {
    const rand = Math.floor(Math.random() * str.length);
    _str += str[rand];
  }
  return _str
}

/**
 * 获取字符串get参数
 * @param url
 */
export function getUrlQuery(url: string) {
  const noMatchData = {};
  if (!url || false) return noMatchData;
  const reg = /(?:\?|&)(?:(?:([^=&]+?)=([^&#]+))|([^&#]+))/gi;
  const obj = {};
  // @ts-ignore
  const fun = (match, $1, $2 = '', $3) => {
    if ($3) {
      obj[$3] = '';
    } else {
      obj[$1] = encodeURIComponent($2);
    }
  }
  // @ts-ignore
  url.replace(reg, fun);
  return obj
}

/**
 * 获取访问字符
 * @param url
 */
export function getQueryString(url: string = ""): string {
  if (url == "") {
    // eslint-disable-next-line no-param-reassign
    url = window.location.href;
  }
  const firstIndex = decodeURI(url).indexOf("?");
  if (firstIndex < 0) {
    return ""
  }
  return url.substring(firstIndex + 1);
}

/**
 * 跳转QQ网址
 * @param qrurl 网址
 */
export function qqJumpUrl(qrurl: string) {
  const ua = window.navigator.userAgent.toLowerCase();
  const is_ios = ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1;
  let schemacallback = '';
  if (is_ios) {
    schemacallback = 'weixin://';
  } else if (ua.indexOf('ucbrowser') > -1) {
    schemacallback = 'ucweb://';
  } else if (ua.indexOf('meizu') > -1) {
    schemacallback = 'mzbrowser://';
  } else if (ua.indexOf('liebaofast') > -1) {
    schemacallback = 'lb://';
  } else if (ua.indexOf('baidubrowser') > -1) {
    schemacallback = 'bdbrowser://';
  } else if (ua.indexOf('baiduboxapp') > -1) {
    schemacallback = 'bdapp://';
  } else if (ua.indexOf('mqqbrowser') > -1) {
    schemacallback = 'mqqbrowser://';
  } else if (ua.indexOf('qihoobrowser') > -1) {
    schemacallback = 'qihoobrowser://';
  } else if (ua.indexOf('chrome') > -1) {
    schemacallback = 'googlechrome://';
  } else if (ua.indexOf('sogoumobilebrowser') > -1) {
    schemacallback = 'SogouMSE://';
  } else if (ua.indexOf('xiaomi') > -1) {
    schemacallback = 'miuibrowser://';
  } else {
    schemacallback = 'googlechrome://';
  }
  if (is_ios) {
    window.location.href = 'wtloginmqq3://ptlogin/qlogin?qrcode=' + encodeURIComponent(qrurl) + '&schemacallback=' + encodeURIComponent(schemacallback);
  } else {
    window.location.href = 'wtloginmqq://ptlogin/qlogin?qrcode=' + encodeURIComponent(qrurl) + '&schemacallback=' + encodeURIComponent(schemacallback);
  }
}
