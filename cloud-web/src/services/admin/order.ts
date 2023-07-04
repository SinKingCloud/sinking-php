// @ts-ignore
import {request} from 'umi';

/** 获取订单列表 GET /admin/order/lists */
export async function getOrderList(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/order/lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
