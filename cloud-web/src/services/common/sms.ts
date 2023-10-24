import {request} from "@@/plugin-request/request";

/** 发送短信验证码 POST /auth/verify/sms */
export async function sendSms(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/auth/verify/sms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
