import {request} from "@@/plugin-request/request";

/** 修改资料 POST /admin/person/update */
export async function updateInfo(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/user/person/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改密码 POST /admin/person/change_password */
export async function updatePassword(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/user/person/change_password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改邮箱 POST /admin/person/change_email */
export async function updateEmail(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/user/person/change_email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改手机 POST /admin/person/change_phone */
export async function updatePhone(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/user/person/change_phone', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
