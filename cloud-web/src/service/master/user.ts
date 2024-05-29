import {API} from "../../../typings";
import {get,post} from "@/utils/request";
export async function getUserList(params: API.RequestParams = {}) {
    return get("/master/user/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
export async function updateUserInfo(params: API.RequestParams = {}) {
    return post("/master/user/update", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
export async function updateUserMoney(params: API.RequestParams = {}) {
    return post("/master/user/money", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}