// @ts-ignore
import {request} from 'umi';

/** 列表 GET /admin/web/lists */
export async function getWebList(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/web/lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新信息 POST /admin/web/update */
export async function updateWebInfo(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/web/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 配置 GET /admin/config/getDomain */
export async function getDomainConfig(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/config/getDomain', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 列表 GET /admin/domain/lists */
export async function getDomainList(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/domain/lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除域名 POST /admin/domain/delete */
export async function deleteDomain(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/domain/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 添加域名 POST /admin/domain/create */
export async function createDomain(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/domain/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新信息 POST /admin/domain/update */
export async function updateDomain(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/domain/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function buySite(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/shop/buySite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
