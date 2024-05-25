// @ts-ignore
import {request} from 'umi';

/** 获取信息 GET /master/person/log */
export async function getLogList(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/master/log/lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
