// @ts-ignore
import {request} from 'umi';

/** 消费记录 GET /admin/pay/lists */
export async function getPayLog(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/pay/lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

