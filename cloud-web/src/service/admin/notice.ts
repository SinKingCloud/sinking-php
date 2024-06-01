import {API} from "../../../typings";
import {get, post} from "@/utils/request";

/** 获取通知列表 GET /admin/notice/lists */
export async function getNoticeList(params: API.RequestParams = {}) {
    return get("/admin/notice/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 获取通知列表 GET /admin/notice/info */
export async function getNoticeInfo(params: API.RequestParams = {}) {
    return get("/admin/notice/info", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 更新通知 POST /admin/notice/update */
export async function updateNotice(params: API.RequestParams = {}) {
    return post("/admin/notice/update", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 更新通知 POST /admin/notice/delete */
export async function deleteNotice(params: API.RequestParams = {}) {
    return post("/admin/notice/delete", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 更新通知 POST /admin/notice/create */
export async function createNotice(params: API.RequestParams = {}) {
    return post("/admin/notice/create", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}