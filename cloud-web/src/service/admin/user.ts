import {API} from "../../../typings";
import {get, post} from "@/utils/request";

/** 用户列表 GET /admin/user/lists */
export async function getUserList(params: API.RequestParams = {}) {
    return get("/admin/user/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 更新用户信息 POST /admin/user/update */
export async function updateUserInfo(params: API.RequestParams = {}) {
    return post("/admin/user/update", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 更新用户信息 POST /admin/user/money */
export async function updateUserMoney(params: API.RequestParams = {}) {
    return post("/admin/user/money", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}