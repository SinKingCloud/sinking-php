// @ts-ignore
import {request} from 'umi';

/** 获取滚动通知 GET /user/config/getNotice */
export async function getNotice(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/user/config/getNotice', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取滚动通知 GET /user/config/getContact */
export async function getContact(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/user/config/getContact', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
