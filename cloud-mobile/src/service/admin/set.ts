import {API} from "../../../typings";
import {get, post} from "@/utils/request";

/** 获取信息 GET /admin/config/getWeb */
export async function getWeb(params: API.RequestParams = {}) {
    return get("/admin/config/getWeb", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 更新信息 POST /admin/config/setWeb */
export async function setWeb(params: API.RequestParams = {}) {
    return post("/admin/config/setWeb", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 获取信息 GET /admin/config/getContact */
export async function getContact(params: API.RequestParams = {}) {
    return get("/admin/config/getContact", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 更新信息 POST /admin/config/setContact */
export async function setContact(params: API.RequestParams = {}) {
    return post("/admin/config/setContact", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 获取信息 GET /admin/config/getNotice */
export async function getNotice(params: API.RequestParams = {}) {
    return get("/admin/config/getNotice", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 更新信息 POST /admin/config/setNotice */
export async function setNotice(params: API.RequestParams = {}) {
    return post("/admin/config/setNotice", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 获取信息 GET /admin/config/getUi */
export async function getUi(params: API.RequestParams = {}) {
    return get("/admin/config/getUi", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 更新信息 POST /admin/config/setUi */
export async function setUi(params: API.RequestParams = {}) {
    return post("/admin/config/setUi", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}