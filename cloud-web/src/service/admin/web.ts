import {API} from "../../../typings";
import {get, post} from "@/utils/request";

/** 列表 GET /admin/web/lists */
export async function getWebList(params: API.RequestParams = {}) {
    return get("/admin/web/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 更新信息 POST /admin/web/update */
export async function updateWebInfo(params: API.RequestParams = {}) {
    return post("/admin/web/update", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 配置 GET /admin/config/getDomain */
export async function getDomainConfig(params: API.RequestParams = {}) {
    return get("/admin/config/getDomain", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 列表 GET /admin/domain/lists */
export async function getDomainList(params: API.RequestParams = {}) {
    return get("/admin/domain/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 删除域名 POST /admin/domain/delete */
export async function deleteDomain(params: API.RequestParams = {}) {
    return post("/admin/domain/delete", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 添加域名 POST /admin/domain/create */
export async function createDomain(params: API.RequestParams = {}) {
    return post("/admin/domain/create", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 更新信息 POST /admin/domain/update */
export async function updateDomain(params: API.RequestParams = {}) {
    return post("/admin/domain/update", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}

export async function buySite(params: API.RequestParams = {}) {
    return post("/admin/shop/buySite", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}