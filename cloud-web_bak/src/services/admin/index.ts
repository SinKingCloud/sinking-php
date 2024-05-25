// @ts-ignore
import {request} from 'umi';

/** 获取数据 GET /admin/count/all */
export async function getCount(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/count/all', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取数据 GET /master/count/topWeb */
export async function getTopWeb(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/count/topWeb', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取数据 GET /admin/count/chart */
export async function getChart(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/count/chart', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取数据 GET /admin/count/toDo */
export async function getToDo(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/count/toDo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

