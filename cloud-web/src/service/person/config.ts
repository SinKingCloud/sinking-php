import {API} from "../../../typings";
import {get} from "@/utils/request";

/** 获取滚动通知 GET /user/config/getNotice */
export async function getNotice(params: API.RequestParams = {}) {
    return get("/user/config/getNotice", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 获取滚动通知 GET /user/config/getContact */
export async function getContact(params: API.RequestParams = {}) {
    return get("/user/config/getContact", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}