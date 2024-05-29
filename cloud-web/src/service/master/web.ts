import {API} from "../../../typings";
import {get, post} from "@/utils/request";

/** 列表 GET /master/web/lists */
export async function getWebList(params: API.RequestParams = {}) {
    return get("/master/web/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 更新信息 POST /master/web/update */
export async function updateWebInfo(params: API.RequestParams = {}) {
    return post("/master/web/update", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 更新信息 POST /master/web/create */
export async function createWeb(params: API.RequestParams = {}) {
    return post("/master/web/create", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 列表 GET /master/domain/lists */
export async function getDomainList(params: API.RequestParams = {}) {
    return get("/master/domain/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 删除域名 POST /master/domain/delete */
export async function deleteDomain(params: API.RequestParams = {}) {
    return post("/master/domain/delete", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 添加域名 POST /master/domain/create */
export async function createDomain(params: API.RequestParams = {}) {
    return post("/master/domain/create", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 更新信息 POST /master/domain/update */
export async function updateDomain(params: API.RequestParams = {}) {
    return post("/master/domain/update", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}