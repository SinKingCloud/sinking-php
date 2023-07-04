// @ts-ignore
import {request} from 'umi';

/** 获取提现列表 GET /admin/cash/lists */
export async function getCashList(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/cash/lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 申请提现 POST /admin/cash/create */
export async function createCash(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/cash/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 编辑提现 POST /admin/cash/update */
export async function updateCash(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/cash/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取提现配置 GET /admin/cash/lists */
export async function getCashConfig(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/user/config/getCash', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
