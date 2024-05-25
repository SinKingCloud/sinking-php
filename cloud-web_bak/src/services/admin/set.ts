// @ts-ignore
import {request} from 'umi';

/** 获取信息 GET /admin/config/getWeb */
export async function getWeb(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/config/getWeb', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新信息 POST /admin/config/setWeb */
export async function setWeb(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/config/setWeb', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取信息 GET /admin/config/getContact */
export async function getContact(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/config/getContact', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新信息 POST /admin/config/setContact */
export async function setContact(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/config/setContact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取信息 GET /admin/config/getNotice */
export async function getNotice(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/config/getNotice', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新信息 POST /admin/config/setNotice */
export async function setNotice(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/config/setNotice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取信息 GET /admin/config/getUi */
export async function getUi(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/config/getUi', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新信息 POST /admin/config/setUi */
export async function setUi(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/config/setUi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
