// @ts-ignore
import {request} from 'umi';

/** 获取通知列表 GET /user/notice/lists */
export async function getNoticeList(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/user/notice/lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取通知列表 GET /user/notice/info */
export async function getNoticeInfo(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/user/notice/info', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
