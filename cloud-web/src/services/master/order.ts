// @ts-ignore
import {request} from 'umi';

/** 获取订单列表 GET /master/order/lists */
export async function getOrderList(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/master/order/lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除订单 POST /master/order/delete */
export async function deleteOrder(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/master/order/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
