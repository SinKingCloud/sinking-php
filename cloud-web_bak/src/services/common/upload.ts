import defaultSettings from "../../../config/defaultSettings";
import {request} from "@@/plugin-request/request";

/**
 * 获取上传地址
 */
export function getUploadUrl(): string {
  return defaultSettings.api + "/auth/upload/file"
}

/** 发送邮箱验证码 POST /auth/verify/email */
export async function uploadFile(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/auth/upload/file', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
