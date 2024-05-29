import {API} from "../../../typings";
import {get, post} from "@/utils/request";
/** 获取提现列表 GET /master/cash/lists */
export async function getCashList(params: API.RequestParams = {}) {
    return get("/master/cash/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 编辑提现 POST /master/cash/update */
export async function updateCash(params: API.RequestParams = {}) {
    return post("/master/cash/update", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}