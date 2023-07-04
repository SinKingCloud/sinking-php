// @ts-ignore
import {request} from 'umi';

/** 获取通知列表 GET /master/notice/lists */
export async function getNoticeList(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/master/notice/lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取通知列表 GET /master/notice/info */
export async function getNoticeInfo(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/master/notice/info', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新通知 POST /master/notice/update */
export async function updateNotice(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/master/notice/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新通知 POST /master/notice/delete */
export async function deleteNotice(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/master/notice/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新通知 POST /master/notice/create */
export async function createNotice(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/master/notice/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
