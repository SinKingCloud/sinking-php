// @ts-ignore
import {request} from 'umi';

/** 列表 GET /master/web/lists */
export async function getWebList(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/master/web/lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新信息 POST /master/web/update */
export async function updateWebInfo(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/master/web/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新信息 POST /master/web/create */
export async function createWeb(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/master/web/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 列表 GET /master/domain/lists */
export async function getDomainList(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/master/domain/lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除域名 POST /master/domain/delete */
export async function deleteDomain(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/master/domain/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 添加域名 POST /master/domain/create */
export async function createDomain(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/master/domain/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新信息 POST /master/domain/update */
export async function updateDomain(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/master/domain/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
