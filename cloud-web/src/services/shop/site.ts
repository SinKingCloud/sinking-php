// @ts-ignore
import {request} from 'umi';

/** 获取商品站点信息 GET /user/shop/getSite */
export async function getSite(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/user/shop/getSite', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 开通网站 POST /admin/shop/buySite */
export async function buySite(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/user/shop/buySite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
