// @ts-ignore
import {request} from 'umi';

/** 获取提现列表 GET /master/cash/lists */
export async function getCashList(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/master/cash/lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 编辑提现 POST /master/cash/update */
export async function updateCash(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/master/cash/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
