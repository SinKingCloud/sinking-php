import {API} from "../../../typings";
import {get} from "@/utils/request";
/** 获取通知列表 GET /user/notice/lists */
export async function getNoticeList(params: API.RequestParams = {}) {
    return get("/user/notice/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
export async function getNoticeInfo(params: API.RequestParams = {}) {
    return get("/user/notice/info", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}