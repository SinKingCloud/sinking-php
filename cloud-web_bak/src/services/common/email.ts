import {request} from "@@/plugin-request/request";

/** 发送邮箱验证码 POST /auth/verify/email */
export async function sendEmail(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/auth/verify/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
