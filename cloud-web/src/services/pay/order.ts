// @ts-ignore
import {request} from 'umi';

/** 订单记录 GET /user/order/lists */
export async function getPayOrder(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/user/order/lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
