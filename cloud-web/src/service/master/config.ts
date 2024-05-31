import {get, post} from "@/utils/request";
import {API} from "../../../typings";

/** 获取配置列表 GET /master/config/lists */
export async function getConfigList(params: API.RequestParams = {}) {
    return get("/master/config/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 获取系统更新 GET /master/upgrade/check */
export async function getUpgradeList(params: API.RequestParams = {}) {
    return get("/master/upgrade/check", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 升级系统 GET /master/upgrade/update */
export async function systemUpgrade(params: API.RequestParams = {}) {
    return get("/master/upgrade/update", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 批量更新配置 POST /master/config/updates */
export async function updateConfigs(params: API.RequestParams = {}) {
    return post("/master/config/updates", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 测试邮箱 POST /master/config/test_email */
export async function testEmail(params: API.RequestParams = {}) {
    return post("/master/config/test_email", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 测试云端 POST /master/config/test_cloud */
export async function testCloud(params: API.RequestParams = {}) {
    return post("/master/config/test_cloud", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 测试短信 POST /master/config/test_sms */
export async function testSms(params: API.RequestParams = {}) {
    return post("/master/config/test_sms", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}