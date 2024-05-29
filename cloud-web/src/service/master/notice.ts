import {API} from "../../../typings";
import {get, post} from "@/utils/request";

/** 获取通知列表 GET /master/notice/lists */
export async function getNoticeList(params: API.RequestParams = {}) {
    return get("/master/notice/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 获取通知列表 GET /master/notice/info */
export async function getNoticeInfo(params: API.RequestParams = {}) {
    return get("/master/notice/info", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 更新通知 POST /master/notice/update */
export async function updateNotice(params: API.RequestParams = {}) {
    return post("/master/notice/update", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 更新通知 POST /master/notice/delete */
export async function deleteNotice(params: API.RequestParams = {}) {
    return post("/master/notice/delete", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 更新通知 POST /master/notice/create */
export async function createNotice(params: API.RequestParams = {}) {
    return post("/master/notice/create", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}