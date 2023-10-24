// @ts-ignore
import {request} from 'umi';

/** 密码登录 POST /auth/login/pwd */
export async function loginByPwd(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/auth/login/pwd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 邮箱登录 POST /auth/login/email */
export async function loginByEmail(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/auth/login/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 邮箱登录 POST /auth/login/sms */
export async function loginBySms(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/auth/login/sms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 退出登录 GET /auth/login/out */
export async function outLogin(options?: { [key: string]: any }) {
  return request<API.Response>('/auth/login/out', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 二维码登陆 GET /auth/login/qrlogin */
export async function qrLogin(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/auth/login/qrlogin', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 生成二维码 GET /auth/verify/qrcode */
export async function genQrCode(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/auth/verify/qrcode', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
