// @ts-ignore
import {request} from 'umi';

/** 消费记录 GET /master/pay/lists */
export async function getPayLog(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/master/pay/lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

