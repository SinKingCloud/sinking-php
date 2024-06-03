import {API} from "../../../typings";
import {get, post} from "@/utils/request";

/** 获取提现列表 GET /admin/cash/lists */
export async function getCashList(params: API.RequestParams = {}) {
    return get("/admin/cash/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 申请提现 POST /admin/cash/create */
export async function createCash(params: API.RequestParams = {}) {
    return post("/admin/cash/create", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 编辑提现 POST /admin/cash/update */
export async function updateCash(params: API.RequestParams = {}) {
    return post("/admin/cash/update", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 获取提现配置 GET /admin/cash/lists */
export async function getCashConfig(params: API.RequestParams = {}) {
    return get("/user/config/getCash", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}