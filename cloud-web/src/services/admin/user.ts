// @ts-ignore
import {request} from 'umi';

/** 用户列表 GET /admin/user/lists */
export async function getUserList(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/user/lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新用户信息 POST /admin/user/update */
export async function updateUserInfo(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新用户信息 POST /admin/user/money */
export async function updateUserMoney(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/user/money', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
