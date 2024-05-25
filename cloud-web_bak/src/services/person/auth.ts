// @ts-ignore
import {request} from 'umi';

/** 获取实名信息 GET /user/person/auth/info */
export async function getAuthInfo(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/user/person/auth/info', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 提交实名请求 POST /user/person/auth/init */
export async function authInit(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/user/person/auth/init', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 判断实名状态 GET /user/person/auth/check */
export async function checkAuth(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/user/person/auth/check', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
