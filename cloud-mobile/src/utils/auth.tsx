
/**
 * 设置登录token
 * @param type
 * @param token
 */
export function setLoginToken(type:string,token: string) {
    localStorage.setItem('cloud-token', token);
    localStorage.setItem('cloud-device', type);
}

/**
 * 获取登录token
 * @returns {string}
 */
export function getLoginToken() {
    return localStorage.getItem('cloud-token');
}

/**
 * 获取登录方式
 * @returns {string}
 */
export function getLoginType() {
    return localStorage.getItem('cloud-device');
}

/**
 * 删除token
 */
export function deleteHeader() {
    localStorage.removeItem('cloud-token');
    localStorage.removeItem('cloud-device');
}

/**
 * 返回请求header
 * @returns {{}}
 */
export function getHeaders() {
    return {
        'cloud-token': getLoginToken(),
        'cloud-device': getLoginType()
    };
}
