// @ts-ignore
import {request} from 'umi';

/** 消费记录 GET /user/pay/lists */
export async function getPayLog(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/user/pay/lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 账户充值 POST /user/pay/recharge */
export async function recharge(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/user/pay/recharge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取支付配置 GET /user/config/getPay */
export async function getPayConfig(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/user/config/getPay', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}


