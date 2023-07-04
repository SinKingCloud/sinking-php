// @ts-ignore
import {request} from 'umi';

/** 获取信息 GET /admin/person/log */
export async function getLogList(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/log/lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
