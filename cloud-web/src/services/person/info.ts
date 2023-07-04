// @ts-ignore
import {request} from "umi";

/** 获取当前用户信息 GET /user/person/info */
export async function queryCurrentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.UserInfo;
  }>('/user/person/info', {
    method: 'GET',
    ...(options || {}),
  });
}
