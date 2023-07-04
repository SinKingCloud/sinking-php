// @ts-ignore
import {request} from 'umi';

/** 获取数据 GET /master/count/all */
export async function getCount(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/master/count/all', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取数据 GET /master/count/topWeb */
export async function getTopWeb(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/master/count/topWeb', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取数据 GET /master/count/chart */
export async function getChart(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/master/count/chart', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取数据 GET /master/count/toDo */
export async function getToDo(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/master/count/toDo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
