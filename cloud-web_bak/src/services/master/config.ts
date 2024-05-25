// @ts-ignore
import {request} from 'umi';

/** 获取配置列表 GET /master/config/lists */
export async function getConfigList(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/master/config/lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取系统更新 GET /master/upgrade/check */
export async function getUpgradeList(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/master/upgrade/check', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 升级系统 GET /master/upgrade/update */
export async function systemUpgrade(params?: {}, options?: { [key: string]: any }) {
  return request<API.Response>('/master/upgrade/update', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 批量更新配置 POST /master/config/updates */
export async function updateConfigs(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/master/config/updates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 测试邮箱 POST /master/config/test_email */
export async function testEmail(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/master/config/test_email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 测试云端 POST /master/config/test_cloud */
export async function testCloud(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/master/config/test_cloud', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 测试短信 POST /master/config/test_sms */
export async function testSms(body: any, options?: { [key: string]: any }) {
  return request<API.Response>('/master/config/test_sms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
