// @ts-ignore
import {request} from 'umi';

/** 获取信息 GET /admin/price/my */
export async function getMy(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/price/my', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取信息 GET /admin/price/getWeb */
export async function getWeb(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/price/getWeb', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新信息 POST /admin/price/setWeb */
export async function setWeb(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/price/setWeb', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

