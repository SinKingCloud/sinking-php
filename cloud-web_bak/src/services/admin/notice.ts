// @ts-ignore
import {request} from 'umi';

/** 获取通知列表 GET /admin/notice/lists */
export async function getNoticeList(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/notice/lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取通知列表 GET /admin/notice/info */
export async function getNoticeInfo(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/notice/info', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新通知 POST /admin/notice/update */
export async function updateNotice(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/notice/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新通知 POST /admin/notice/delete */
export async function deleteNotice(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/notice/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新通知 POST /admin/notice/create */
export async function createNotice(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/admin/notice/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
